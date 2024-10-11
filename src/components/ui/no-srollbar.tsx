"use client"

import React from 'react'

const NoScrollbar = ({
    tag = 'body'
}: {
    tag?: string
}) => {

    React.useEffect(() => {
        const selector = document.querySelector(tag);
        selector?.classList.add('scrollbar-none');

        return () => {
            selector?.classList.remove('scrollbar-none');
        }
    })

    return null;
}

export default NoScrollbar
