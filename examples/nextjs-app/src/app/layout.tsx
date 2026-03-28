import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Code Policy Example',
  description: 'eslint-plugin-code-policy Next.js example',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
