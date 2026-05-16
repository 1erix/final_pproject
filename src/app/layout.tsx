'use client'

import { SessionProvider } from 'next-auth/react'
import localFont from 'next/font/local'
import { Layout } from "@/wigets/layouts"
import './globals.css'
import { CartProvider } from '@/shared/ui/context/CartContext'

const AdventPro = localFont({
  src: [
    {
      path: '../../public/fonts/AdventPro/AdventPro-VariableFont_wdth,wght.ttf',
      weight: '100',
      style: 'normal'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-VariableFont_wdth,wght.ttf',
      weight: '200',
      style: 'normal'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-VariableFont_wdth,wght.ttf',
      weight: '300',
      style: 'normal'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-VariableFont_wdth,wght.ttf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-VariableFont_wdth,wght.ttf',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-VariableFont_wdth,wght.ttf',
      weight: '600',
      style: 'normal'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-VariableFont_wdth,wght.ttf',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-VariableFont_wdth,wght.ttf',
      weight: '800',
      style: 'normal'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-VariableFont_wdth,wght.ttf',
      weight: '900',
      style: 'normal'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-Italic-VariableFont_wdth,wght.ttf',
      weight: '100',
      style: 'italic'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-Italic-VariableFont_wdth,wght.ttf',
      weight: '200',
      style: 'italic'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-Italic-VariableFont_wdth,wght.ttf',
      weight: '300',
      style: 'italic'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-Italic-VariableFont_wdth,wght.ttf',
      weight: '400',
      style: 'italic'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-Italic-VariableFont_wdth,wght.ttf',
      weight: '500',
      style: 'italic'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-Italic-VariableFont_wdth,wght.ttf',
      weight: '600',
      style: 'italic'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-Italic-VariableFont_wdth,wght.ttf',
      weight: '700',
      style: 'italic'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-Italic-VariableFont_wdth,wght.ttf',
      weight: '800',
      style: 'italic'
    },
    {
      path: '../../public/fonts/AdventPro/AdventPro-Italic-VariableFont_wdth,wght.ttf',
      weight: '900',
      style: 'italic'
    },
  ],
  variable: '--font-advent-pro',
  display: 'swap',
})

function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={AdventPro.variable}>
      <body className={`${AdventPro.className} antialiased`}>
        <SessionProvider>
          <CartProvider>
            <Layout>
              <AuthLayout>
                {children}
              </AuthLayout>
            </Layout>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}