'use client'
import PermanentDrawer from '@/components/sidebar/PermanentDrawer';
import Link from 'next/link';


export default function Home() {


  return (
    <div className='w-full h-full'>
      <div className='text-white'> <Link href={'/chat'}>chat</Link></div>
      <PermanentDrawer>
        <div className='text-white'> <Link href={'/chat'}>chat</Link></div>
        <div className='text-white'> <Link href={'/video'}>video</Link></div>
        <div className='text-white'> <Link href={'/voice'}>voice</Link></div>
        <div className='text-white'> <Link href={'/chat'}>call</Link></div>
      </PermanentDrawer>
    </div>
  )
}
