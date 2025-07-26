import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: "Search Demo",
  description: "Facets Demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`text-base antialiased`}>
        <Providers>
          {children}
          <Toaster/>
        </Providers>
      </body>
    </html>
  );
}
