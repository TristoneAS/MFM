//import "./globals.css";
import LayoutComponent from "../components/LayoutComponent";

export default function DashboardLayout({ children }) {
  return (
    <>
      <LayoutComponent />
      {children}
    </>
  );
}
