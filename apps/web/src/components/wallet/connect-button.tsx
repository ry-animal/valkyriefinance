'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'

export function ConnectButton() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="default" className="flex items-center gap-2 font-brutal font-black uppercase tracking-widest">
                <Wallet className="w-5 h-5" />
                CONNECT
            </Button>
        )
    }

    // Use Reown AppKit's built-in button with custom styling
    return (
        <div className="brutal-wallet-wrapper">
            <style jsx global>{`
                w3m-button {
                    --w3m-color-mix: #000000;
                    --w3m-color-mix-strength: 100%;
                    --w3m-font-family: Impact, Arial Black, sans-serif;
                    --w3m-border-radius-master: 0px;
                    --w3m-font-size-master: 16px;
                }
                w3m-button::part(w3m-button) {
                    background: #000000 !important;
                    color: #ffffff !important;
                    border: 4px solid #000000 !important;
                    box-shadow: 8px 8px 0px 0px #000000 !important;
                    font-family: Impact, Arial Black, sans-serif !important;
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em !important;
                    padding: 12px 24px !important;
                    transition: all 0.1s ease-out !important;
                }
                w3m-button::part(w3m-button):hover {
                    background: #ffffff !important;
                    color: #000000 !important;
                    transform: translate(1px, 1px) !important;
                    box-shadow: 4px 4px 0px 0px #000000 !important;
                }
            `}</style>
            <w3m-button />
        </div>
    )
} 