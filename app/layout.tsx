export const metadata = { title: "BAI Mini App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: 16 }}>{children}</div>
      </body>
    </html>
  );
}
