import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavigationWrapper } from '@/components/layout/NavigationWrapper'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'INTIA Assurance - Gestion des clients et assurances',
  description: 'Système de gestion des clients et polices d\'assurance pour INTIA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ProtectedRoute>
          <NavigationWrapper />
          <main>{children}</main>
        </ProtectedRoute>
      </body>
    </html>
  )
}
