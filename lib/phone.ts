/** Маска российского телефона +7 (___) ___-__-__. 10 значащих цифр после кода страны = 11 цифр всего. */

const TEMPLATE = "+7 (___) ___-__-__";

/** Достаёт до 10 значащих цифр (без кода страны) из произвольного ввода. */
export function extractLocalDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** Собирает маску из значащих цифр: +7 (999) 123-45-67, остальное — подчёркивания. */
export function maskPhone(localDigits: string): string {
  let i = 0;
  let out = "";
  for (const ch of TEMPLATE) {
    if (ch === "_") {
      out += localDigits[i] ?? "_";
      i++;
    } else {
      out += ch;
    }
  }
  return out;
}

/** Полный номер в формате +7XXXXXXXXXX для отправки. */
export function fullPhone(localDigits: string): string {
  return "+7" + localDigits;
}

/** 11 цифр целиком (код страны + 10 цифр) — критерий готовности номера. */
export function isPhoneComplete(localDigits: string): boolean {
  return localDigits.length === 10;
}
