import SubNav from "@/components/SubNav";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><SubNav section="elektrika" />{children}</>);
}
