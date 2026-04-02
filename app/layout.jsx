import "./globals.css";

export const metadata = {
  title: "FinFlow — Finance Dashboard",
  description: "Personal finance tracking dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}