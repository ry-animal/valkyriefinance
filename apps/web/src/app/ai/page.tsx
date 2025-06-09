'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Brain, Sparkles } from 'lucide-react'

export default function AIPage() {
    const [message, setMessage] = useState('')

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <Brain className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold tracking-tight">AI Chat Demo</h1>
                    <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground">
                    AI-powered DeFi insights (Enhanced version coming soon)
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>DeFi Assistant</CardTitle>
                    <CardDescription>
                        Ask questions about DeFi strategies and analytics
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="min-h-48 p-4 border rounded-lg bg-muted/50">
                        <div className="text-center text-muted-foreground py-8">
                            <Brain className="mx-auto h-8 w-8 mb-2 opacity-50" />
                            <p>Enhanced AI features with vault integration coming soon!</p>
                            <Badge variant="outline" className="mt-2">Phase C: In Development</Badge>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Ask about DeFi strategies..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button disabled>
                            Demo
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 