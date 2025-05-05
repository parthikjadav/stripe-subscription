"use client"
import Link from 'next/link'
import React from 'react'
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink,LoginLink } from '@kinde-oss/kinde-auth-nextjs';
import BillingPortalLink from './BillingPortalLink';

const Header = () => {
    const { isAuthenticated } = useKindeBrowserClient();


    return (
        <div>
            <header className="bg-white">
                <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img className="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                        </a>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        <Link href="/" className="text-sm/6 font-semibold text-gray-900">Home</Link>
                        <Link href="/premium" className="text-sm/6 font-semibold text-gray-900">Premium</Link>
                        <BillingPortalLink/>
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        {
                            isAuthenticated ? (
                                <LogoutLink className='text-sm/6 font-semibold text-gray-900'>Logout</LogoutLink>
                            ) : (
                                <LoginLink className="text-sm/6 font-semibold text-gray-900">Login</LoginLink>
                            )
                        }
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Header