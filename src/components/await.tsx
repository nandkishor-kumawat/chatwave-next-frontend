import React from 'react'

type AwaitProps<T> = {
    children: (data: T) => React.ReactElement,
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
