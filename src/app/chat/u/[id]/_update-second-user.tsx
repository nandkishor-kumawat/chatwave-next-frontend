"use client"

import { userActions } from '@/redux/features'
import { useAppDispatch } from '@/redux/store'
import React from 'react'

const UpdateSecondUser = ({ user }: any) => {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(userActions.switchUser(user));
    }, [dispatch, user])

    return null;
}

export default UpdateSecondUser
