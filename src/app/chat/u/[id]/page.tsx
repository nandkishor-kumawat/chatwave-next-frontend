import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import UpdateSecondUser from './_update-second-user';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ChatContainer from '@/components/chat/ChatContainer';

interface InboxProps {
  params: {
    id: string
  }
}

const Inbox = async ({ params: { id } }: InboxProps) => {
  if (!id) redirect('/chat');

  const secondUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!secondUser) {
    return <div className="text-white h-full w-full flex justify-center items-center flex-col">
      <NoAccountsIcon sx={{ fontSize: 150 }} />
      <h1 className="text-3xl">No user found</h1>
    </div>
  }


  return (
    <>
      <UpdateSecondUser user={secondUser} />
      <ChatContainer secondUserId={secondUser.id} />
    </>
  )
}

export default Inbox;