import { registeredInDB } from '@/actions';
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const isSaved = await registeredInDB();
  if(isSaved === true){
    redirect("/");
  }
  return (
    <div>
        <div className="flex flex-col items-center justify-center h-screen gap-5">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500"></div>
            <h1 className="text-2xl font-bold">Redirecting...</h1>
            <p>Your request is being processed...</p>
        </div>
    </div>
  )
}

export default page