import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import Navbar from '@/components/Navbar/Navbar'
import BackToTop from '@/components/BackToTop/BackToTop'
import Footer from '@/components/Footer/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Personal Portfolio',
  description: 'Full-stack developer portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          {/* <BackToTop /> */}
        </Providers>
      </body>
    </html>
  )
}
