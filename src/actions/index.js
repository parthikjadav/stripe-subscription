"use server"

import { prisma } from "@/utils/prisma.util";
import stripe from "@/utils/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const registeredInDB = async () => {
    try {
        const { getUser } = getKindeServerSession();

        const user = await getUser()
        if (!user) {
            return false;
        }

        const isExistingUser = await prisma.user.findUnique({ where: { id: user.id } });
        
        if (isExistingUser) {
            return true;
        } else {
            await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.given_name + " " + user.family_name,
                }
            });
            
            return true;
        }
    } catch (error) {
        console.log("error occurred in registering auth callback");
        return false
    }
}

export const currentUser = async () => {
    try {
        const { getUser } = getKindeServerSession();
        const authUser = await getUser();
        if (!authUser) {
            return false;
        }
        
        const user = await prisma.user.findUnique({ where: { id: authUser.id } });
        
        return user;
    } catch (error) {
        console.log(error.message);
        console.log("error occurred in getting current user");
        return false;
    }
}

export const getCustomerPortalLink = async (customerId)=>{
    try {
        if(!customerId) {
            console.log("No customer ID provided");
            return false;
        }
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: process.env.NEXT_PUBLIC_BASE_URL,
        })
        return session.url;
    } catch (error) {
        console.log(error.message);
        console.log("error occurred in getting customer portal link");
        return false;
    }
}