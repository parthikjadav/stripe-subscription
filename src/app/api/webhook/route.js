import { prisma } from "@/utils/prisma.util";
import stripe from "@/utils/stripe";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.text();
        const priceIng = {
            [process.env.NEXT_PUBLIC_STRIPE_PLUS_PRICE_ID]: "PLUS",
            [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID]: "PRO",
            [process.env.NEXT_PUBLIC_STRIPE_PROMAX_PRICE_ID]: "PROMAX",
        }

        const sig = request.headers.get("stripe-signature");

        let event;

        try {
            event = stripe.webhooks.constructEvent(body, sig, process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.log("Error verifying webhook signature: ", err.message);
            return new NextResponse("Webhook Error", { status: 400 });
        }

        switch (event.type) {
            case "checkout.session.completed":
                const sessionId = event.data.object.id;
                const session = await stripe.checkout.sessions.retrieve(sessionId, {
                    expand: ["line_items"]
                });
                const customerId = session.customer;
                const customerEmail = session.customer_details.email;

                if (customerEmail) {
                    const user = await prisma.user.findUnique({ where: { email: customerEmail } });

                    if (!user) {
                        console.log("User not found in database");
                        return new NextResponse("User not found", { status: 404 });
                    }

                    const line_items = session.line_items.data;

                    for (const item of line_items) {
                        const priceId = item.price.id;
                        const plan = priceIng[priceId];
                        let endDate = new Date()
                        endDate.setMonth(endDate.getMonth() + 1);

                        if (plan) {
                            const updatedUser = await prisma.user.update({
                                where: { id: user.id },
                                data: {
                                    plan,
                                    customerId
                                }
                            });
                            console.log(updatedUser, "updatedUser");

                            await prisma.subscription.upsert({
                                where: { userId: user.id },
                                create: {
                                    userId: user.id,
                                    plan,
                                    endDate,
                                },
                                update: {
                                    plan,
                                    endDate,
                                }
                            });
                        }
                    }
                }
                break;
            case "customer.subscription.deleted":
                
                const getSessionId = event.data.object.id;
                const subscription = await stripe.subscriptions.retrieve(getSessionId)
                
                const user = await prisma.user.findUnique({ where: { customerId: subscription.customer } });
                if (!user) {
                    console.log("User not found in database");
                    return new NextResponse("User not found", { status: 404 });
                }
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        plan: "FREE",
                        customerId: null
                    }
                });
                await prisma.subscription.delete({
                    where: { userId: user.id }
                });
                break;
        }

        return new NextResponse("Webhook received", { status: 200 });
    } catch (error) {
        console.log("Error occurred in webhook route: ", error.message);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}