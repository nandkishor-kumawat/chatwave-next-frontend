'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import useChat from "@/custom hooks/useChat";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, FormEvent } from "react";



interface PropsType {
    roomid: string;
}

export default function ChatRoom() {


    const [name, setName] = useState('')

const router = useRouter();


    return (
        <div>
            <input type="text" className="text-input" onChange={(e) => setName(e.target.value)} value={name} />
            <button onClick={() => {
                router.push('/?name=' + name)

            }}>click</button>
        </div>
    );

}    