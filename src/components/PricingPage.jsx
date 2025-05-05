"use client"

import { ArrowRight, CircleCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { currentUser } from "@/actions"
import { useEffect, useState } from "react"

const Pricing = ({
  heading = "Pricing",
  description = "Check out our affordable pricing plans",
  plans = [
    {
      id: "PLUS",
      name: "Plus",
      description: "For personal use",
      price: "$19",
      features: [
        { text: "Up to 5 team members" },
        { text: "Basic components library" },
        { text: "Community support" },
        { text: "1GB storage space" },
      ],
      button: {
        text: "Purchase",
        url: process.env.NEXT_PUBLIC_STRIPE_PLUS_PLAN_PAYMENT_LINK,
      },
    },
    {
      id: "PRO",
      name: "Pro",
      description: "For professionals",
      price: "$49",
      features: [
        { text: "Unlimited team members" },
        { text: "Advanced components" },
        { text: "Priority support" },
        { text: "Unlimited storage" },
      ],
      button: {
        text: "Purchase",
        url: process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_PAYMENT_LINK,
      },
    },
    {
      id: "PROMAX",
      name: "Pro Max",
      description: "For enterprise teams",
      price: "$99",
      features: [
        { text: "Everything in Pro, plus:" },
        { text: "Dedicated account manager" },
        { text: "Custom component development" },
        { text: "24/7 phone support" },
        { text: "Advanced analytics dashboard" },
        { text: "White-label options" },
        { text: "SLA guarantees" },
      ],
      button: {
        text: "Purchase",
        url: process.env.NEXT_PUBLIC_STRIPE_PROMAX_PLAN_PAYMENT_LINK,
      },
    },
  ],
}) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const fetchUser = async () => {
    setLoading(true)
    const user = await currentUser()
    setLoading(false)
    if (!user) {
      return
    }
    setUser(user)
  }
  useEffect(() => {
    fetchUser()
  }, [])
  return (
    <section className="py-10">
      <div className="container">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-bold text-pretty lg:text-6xl">{heading}</h2>
          <p className="text-muted-foreground lg:text-xl">{description}</p>
          <div className="flex flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan) => (
              <Card key={plan.id} className="flex w-80 flex-col justify-between text-left">
                <CardHeader>
                  <CardTitle>
                    <p>{plan.name}</p>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <p className="text-muted-foreground">per month</p>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CircleCheck className="size-4" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  { loading === false ? (
                    user && user.plan === plan.id ? (
                      <Button variant={"outline"} asChild className="w-full text-white ">
                        <div>
                          Current
                        </div>
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <a href={plan.button.url} target="_blank" rel="noreferrer">
                          {plan.button.text}
                          <ArrowRight className="ml-2 size-4" />
                        </a>
                      </Button>
                    ) ) : <span className="h-10"></span>
                  }
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
