<?php
/**
 * v44: приём заявок с сайта на хостинге Бегет (замена app/api/lead/route.ts с Vercel).
 * Форма отправляет POST /api/lead → .htaccess направляет сюда.
 *
 * Куда уходит заявка (каналы независимы, сбой одного не мешает другим):
 *  - Telegram: telegram_token + telegram_chat (несколько чатов через запятую).
 *    С российских серверов api.telegram.org бывает недоступен — тогда можно указать
 *    telegram_api (адрес ретранслятора вместо https://api.telegram.org).
 *  - amoCRM: amo_subdomain + amo_token.
 *  - Почта: lead_email (несколько адресов через запятую), отправка через почту хостинга.
 *  - Всегда: журнал leads.log рядом с папкой public_html (из интернета не виден).
 *
 * Ключи лежат в api/lead-config.php — его создаёт GitHub Action из секретов репозитория при каждой выкладке.
 * В репозитории этого файла нет и быть не должно.
 */

date_default_timezone_set('Asia/Irkutsk');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

function reply(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function lead_log(string $line): void {
    $file = dirname(__DIR__, 2) . '/leads.log';
    @file_put_contents($file, date('Y-m-d H:i:s') . ' ' . $line . "\n", FILE_APPEND | LOCK_EX);
    error_log('[LEAD] ' . $line);
}

function http_json(string $url, array $payload, array $headers = [], int $timeout = 8): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => array_merge(['Content-Type: application/json'], $headers),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => $timeout,
    ]);
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    return ['code' => $code, 'body' => is_string($body) ? $body : '', 'error' => $err];
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') reply(['ok' => false, 'error' => 'method'], 405);

$cfgFile = __DIR__ . '/lead-config.php';
$cfg = is_file($cfgFile) ? (include $cfgFile) : [];
if (!is_array($cfg)) $cfg = [];
$get = fn(string $k): string => trim((string) ($cfg[$k] ?? ''));

$body = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($body)) reply(['ok' => false, 'error' => 'bad json'], 400);
$f = fn(string $k, int $max = 1000): string => mb_substr(trim((string) ($body[$k] ?? '')), 0, $max);

$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '—';

// honeypot: скрытое поле website заполняют только боты — отвечаем «успехом», ничего не отправляя
if ($f('website') !== '') {
    lead_log('отклонено honeypot, ip ' . $ip);
    reply(['ok' => true]);
}

$phone = $f('phone', 40);
if (strlen(preg_replace('/\D/', '', $phone)) !== 11) reply(['ok' => false, 'error' => 'phone'], 400);

$name = $f('name', 200);
$message = $f('message', 3000);
$source = $f('source', 200);
$page = $f('page', 500);

$text = implode("\n", array_filter([
    '🟥 Заявка с сайта',
    'Источник: ' . ($source ?: '—'),
    'Имя: ' . ($name ?: '—'),
    'Телефон: ' . $phone,
    $message !== '' ? 'Сообщение: ' . $message : '',
    $page !== '' ? 'Страница: ' . $page : '',
]));
$oneLine = str_replace("\n", ' | ', $text);
$delivered = [];

// Telegram
$tgToken = $get('telegram_token');
$tgChats = array_filter(array_map('trim', explode(',', $get('telegram_chat'))));
if ($tgToken !== '' && $tgChats) {
    $api = rtrim($get('telegram_api') ?: 'https://api.telegram.org', '/');
    foreach ($tgChats as $chat) {
        $r = http_json("$api/bot$tgToken/sendMessage", ['chat_id' => $chat, 'text' => $text]);
        if ($r['code'] === 200) $delivered['telegram'] = true;
        else lead_log("ошибка Telegram ($chat): {$r['code']} {$r['error']} " . mb_substr($r['body'], 0, 300));
    }
}

// amoCRM
$amoSub = $get('amo_subdomain');
$amoToken = $get('amo_token');
if ($amoSub !== '' && $amoToken !== '') {
    $auth = ["Authorization: Bearer $amoToken"];
    $r = http_json("https://$amoSub.amocrm.ru/api/v4/leads/complex", [[
        'name' => 'Заявка с сайта: ' . ($page ?: $source ?: 'неизвестная страница'),
        '_embedded' => [
            'tags' => $source !== '' ? [['name' => $source]] : [],
            'contacts' => [[
                'name' => $name ?: $phone,
                'custom_fields_values' => [[
                    'field_code' => 'PHONE',
                    'values' => [['value' => $phone, 'enum_code' => 'WORK']],
                ]],
            ]],
        ],
    ]], $auth, 10);
    if ($r['code'] >= 200 && $r['code'] < 300) {
        $delivered['amo'] = true;
        $data = json_decode($r['body'], true);
        $leadId = $data['_embedded']['leads'][0]['id'] ?? null;
        $note = implode("\n", array_filter([
            $source !== '' ? "Источник: $source" : '',
            $message !== '' ? "Сообщение: $message" : '',
        ]));
        if ($leadId && $note !== '') {
            http_json("https://$amoSub.amocrm.ru/api/v4/leads/$leadId/notes", [[
                'note_type' => 'common', 'params' => ['text' => $note],
            ]], $auth);
        }
    } else {
        lead_log("ошибка amoCRM: {$r['code']} {$r['error']} " . mb_substr($r['body'], 0, 300));
    }
}

// Почта
$emails = array_filter(array_map('trim', explode(',', $get('lead_email'))));
if ($emails) {
    $host = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'site');
    $host = preg_replace('/^www\./i', '', $host);
    $subject = '=?UTF-8?B?' . base64_encode('Заявка с сайта ' . $host) . '?=';
    $headers = "From: no-reply@$host\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit";
    $ok = false;
    foreach ($emails as $to) {
        if (filter_var($to, FILTER_VALIDATE_EMAIL) && @mail($to, $subject, $text, $headers)) $ok = true;
    }
    if ($ok) $delivered['email'] = true;
    else lead_log('ошибка отправки почты');
}

lead_log(($delivered ? 'доставлено: ' . implode(', ', array_keys($delivered)) : 'НЕ ДОСТАВЛЕНО никуда') . ' | ' . $oneLine);

// Как на Vercel: ok — заявка ушла; fallback — форма покажет телефон и мессенджер
reply($delivered ? ['ok' => true] : ['ok' => false, 'fallback' => true]);
