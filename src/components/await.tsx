import React from 'react'

type AwaitProps<T> = {
    children: (data: T) => JSX.Element,
    promise: Promise<T>
};

const Await = async <T,>({
    children,
    promise
}: AwaitProps<T>) => {
    const data = await promise;

    return children(data);
}

export default Await
