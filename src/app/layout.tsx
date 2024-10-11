import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { StoreProvider } from '@/redux/store-provider'
import Splash from '@/components/Splash'
import { SocketProvider } from '@/components/providers/socket-provider'
import { getAuth } from '@/lib/auth'
import { SessionProvider, ThemeProvider } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'


export const metadata: Metadata = {
  title: 'ChatWave',
  description: 'ChatWave - Connect, converse, and create waves of conversation with ease. Experience seamless messaging, innovative features, and a vibrant community on the ChatWave app. Join the next generation of chatting and ride the wave of interactive communication.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider value={session}>
          <Toaster position="top-right" duration={2000} />
          <ThemeProvider
            attribute="class"
            defaultTheme="lignt"
          >
            <StoreProvider>
              <SocketProvider>
                {/* <Navbar /> */}
                <Splash />
                {children}
              </SocketProvider>
            </StoreProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>

  )
}
