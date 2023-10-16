export const metadata = {
  title: 'Transaction Handler',
  description: 'A simple transaction app',
};

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
