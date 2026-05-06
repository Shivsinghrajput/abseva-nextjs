import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AB Seva Foundation',
  description: 'Donate to AB Seva Foundation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
