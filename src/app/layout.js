import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const outfit = Outfit({ subsets: ["latin"], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: "Karakopo | Smart Foodstore & Assistant",
  description: "Shop ingredients and plan meals with Karakopo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
