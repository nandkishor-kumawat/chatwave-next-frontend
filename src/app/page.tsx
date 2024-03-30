import PermanentDrawer from '@/components/sidebar/PermanentDrawer';
import Link from 'next/link';
import { getAuthSession } from './api/auth/[...nextauth]/options';


export default async function Home() {
  const auth = await getAuthSession();
  console.log(auth)

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
