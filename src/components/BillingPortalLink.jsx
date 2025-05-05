"use client"

import { currentUser, getCustomerPortalLink } from '@/actions'
import Link from 'next/link'
import React, { useEffect } from 'react'

const BillingPortalLink = () => {
    const [user, setUser] = React.useState(null)
    const [billingPortalUrl, setBillingPortalUrl] = React.useState('')
    const [loading, setLoading] = React.useState(true)

    const fetchUser = async () => {
        setLoading(true)
        const user = await currentUser()
        setUser(user)
        setLoading(false)
        if (!user) {
            return false
        }
    }

    const fetchBillingPortalUrl = async () => {
        if (user) {
            const url = await getCustomerPortalLink(user.customerId)
            if (!url) {
                return false
            }
            setBillingPortalUrl(url)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    useEffect(() => {
        fetchBillingPortalUrl()
    }, [user])

    if (!user || user.plan === "FREE") {
        return null
    }
    // const customerId = "cus_SFm81Co3hDOpUO"

    return (
        <Link href={billingPortalUrl} className="text-sm/6 font-semibold text-gray-900">Billing Portal</Link>
    )
}

export default BillingPortalLink