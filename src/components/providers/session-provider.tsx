"use client";

import { getAuth } from "@/lib/auth";
import { Session, User } from "lucia";
import { createContext, PropsWithChildren, useMemo } from "react";

type ISession = Session & {
    user: User;
}

export type SessionContextValue =
    | { session: ISession; status: "authenticated" }
    | { session: null; status: "loading" | "unauthenticated" };



export const SessionContext = createContext<SessionContextValue | undefined>(undefined);

interface Props extends PropsWithChildren<{
    value: Awaited<ReturnType<typeof getAuth>>;
}> { }

export const SessionProvider = ({ children, value }: Props) => {

    const sessionValue: SessionContextValue = useMemo(() => {
        if (value?.user && value?.session) {
            const session = { ...value.session, user: value.user };
            return { session, status: "authenticated" };
        }
        return { session: null, status: "unauthenticated" };
    }, [value]);

    return (
        <SessionContext.Provider value={sessionValue}>
            {children}
        </SessionContext.Provider>
    );
}