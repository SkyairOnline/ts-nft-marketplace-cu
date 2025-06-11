"use client"

import { useAccount } from "wagmi"
import RecentlyListedNFTs from "@/components/RecentlyListed"
import { useEffect, useState } from "react"

export default function Home() {
    const { address } = useAccount()
    const [isCompliant, setIsCompliant] = useState(true)
    useEffect(() => {
        if (address) { checkCompliance() }
    }, [address])

    async function checkCompliance() {
        if (!address) return

        const response = await fetch("/api/compliance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ address }),
        })
        const result = await response.json()
        setIsCompliant(result.success && result.isApproved)
    }

    return (
        <main>
            {!address ? (
                <div className="flex items-center justify-center p-4 md:p-6 xl:p-8">
                    Please connect a wallet
                </div>
            ) : (
                isCompliant ? (
                    <div className="flex items-center justify-center p-4 md:p-6 xl:p-8">
                        <RecentlyListedNFTs />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <h1 className="text-2xl font-bold text-red-600">Compliance Check Failed</h1>
                        <p className="mt-4 text-gray-600">Your address is not compliant with the marketplace requirements.</p>
                    </div>
                )
            )}
        </main>
    )
}
