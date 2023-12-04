'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  router.push('/chat')
  return (
    <>
      <div className='text-white'> <Link href={'/chat'}>chat</Link></div>

    </>
  )
}
