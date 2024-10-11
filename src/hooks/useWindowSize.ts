"use client";

import * as React from 'react';

type Size = {
    width: number,
    height: number
}

export default function useWindowSize() {
    const [windowSize, setWindowSize] = React.useState<Size>({
        width: window.innerWidth,
        height: window.innerHeight
    });

    React.useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSize;
}
