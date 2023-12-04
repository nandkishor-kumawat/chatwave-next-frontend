import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Providers } from '@/redux/Provider'
import Splash from '@/components/Splash'


export const metadata: Metadata = {
  title: 'ChatWave',
  description: 'ChatWave - Connect, converse, and create waves of conversation with ease. Experience seamless messaging, innovative features, and a vibrant community on the ChatWave app. Join the next generation of chatting and ride the wave of interactive communication.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <html lang="en">
      <body>

        <Providers>

          {/* <div className="h-full">
            <Navbar />
            <div style={{ height: 'calc(100% - 56px)' }}>
              {children}
            </div>
          </div> */}
          <Splash>
            {children}
          </Splash>

        </Providers>
      </body>
    </html>

  )
}
