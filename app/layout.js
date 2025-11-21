import { Geist, Geist_Mono } from "next/font/google";
// Zmieniamy Merriweather na Source Sans 3
import { Source_Sans_3 } from "next/font/google"; 
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Konfiguracja czcionki Source Sans 3
const sourceSans3 = Source_Sans_3({
  weight: ['400', '700'], // Ładujemy standardową i pogrubioną wersję
  subsets: ["latin", "latin-ext"], // Wymagane dla polskich znaków
  variable: "--font-source-sans-3", // Nowa zmienna CSS
  display: 'swap', 
});

export const metadata = {
  title: "Aplikacja Secret Santa",
  description: "Aplikacja do losowania Secret Santa, oparta na Next.js.",
};

export default function RootLayout({ children }) {
  return (
    // Dodajemy nową klasę czcionki sourceSans3 do elementu <body>
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} ${sourceSans3.className}`}>
        {children}
      </body>
    </html>
  );
}