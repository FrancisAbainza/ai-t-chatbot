import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "AI-T Chatbot",
  description: "A school project for Data Structures and Algorithms",
  icons: {
    icon: '/favicon.png',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <p className="footer">©2025 Abainza Barruga Buenaflor Ebero Librada Manalo. All rights reserved</p>
      </body>
    </html>
  );
}
