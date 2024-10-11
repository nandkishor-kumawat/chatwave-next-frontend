"use client"
import { SessionContext } from '@/components/providers';
import { useContext } from 'react';

const useSession = () => {
    const ctx = useContext(SessionContext);
    if (!ctx) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return ctx;
}
export default useSession;