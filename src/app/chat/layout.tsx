import { getPlainHeaders } from "@/actions/call.actions";
import ChatContainer from "@/components/chat/ChatContainer"
import SideBar from "@/components/sidebar/SideBar"


export default async function chatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const res = await fetch('https://ipapi.co/json', {
        headers: (await getPlainHeaders())
    }).then(res => res.json());
    console.log(res)
    return (
        <div className="h-full">
            <div className='relative z-0 flex h-full w-full overflow-hidden'>
                <SideBar />
                {children}
            </div>
        </div>
    )
}
