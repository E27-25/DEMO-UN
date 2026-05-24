import './globals.css';

export const metadata = {
  title: 'RegMap AI — RDTII Intelligence Platform',
  description: 'Automated regulatory intelligence for ESCAP digital trade mapping, powered by Typhoon OCR and Qwen3-32b.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
