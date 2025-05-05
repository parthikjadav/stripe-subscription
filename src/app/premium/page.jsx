import { currentUser } from '@/actions'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
    const user = await currentUser()

    if (!user || user.plan === "FREE") {
        redirect("/")
    }else{
        return (
            <div className='text-3xl px-10 '>because you are a premium user only you can see this page</div>
        )
    }
}

export default page