'use client'
import Link from 'next/link';


export default function Home() {


  return (
    <>
      <div className='text-white'> <Link href={'/chat'}>chat</Link></div>

    </>
  )
}
