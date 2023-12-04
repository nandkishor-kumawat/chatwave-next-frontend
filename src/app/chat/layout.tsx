import SideBar from "@/components/sidebar/SideBar"


export default function chatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full">
            <div className='relative z-0 flex h-full w-full overflow-hidden'>
                <SideBar />

                {children}
            </div>


        </div>
    )
}
