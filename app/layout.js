import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Group ? Chatbot",
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
        <p className="footer">©2025 <a href="https://francis-abainza-portfolio.web.app/" target="_blank">Abainza</a>. All rights reserved</p>
      </body>
    </html>
  );
}
