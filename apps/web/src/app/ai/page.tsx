'use client';

import { Brain, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { BrutalHeadline, BrutalSection, BrutalText } from '@/components/brutalist/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AIPage() {
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <BrutalSection fullWidth className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto text-center">
          <BrutalHeadline size="mega" className="mb-8">
            AI CHAT
            <br />
            DEMO
          </BrutalHeadline>
          <BrutalText variant="mono" size="xl" className="mb-8 max-w-3xl mx-auto">
            AI-POWERED DEFI INSIGHTS. ENHANCED VERSION COMING SOON. MAXIMUM INTELLIGENCE. ZERO
            COMPROMISE.
          </BrutalText>
        </div>
      </BrutalSection>

      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>DeFi Assistant</CardTitle>
            <CardDescription>Ask questions about DeFi strategies and analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-48 p-4 border rounded-lg bg-muted/50">
              <div className="text-center text-muted-foreground py-8">
                <Brain className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <BrutalText variant="mono" className="mb-4">
                  ENHANCED AI FEATURES WITH VAULT INTEGRATION COMING SOON!
                </BrutalText>
                <Badge variant="outline" className="mt-2 font-brutal font-black uppercase">
                  PHASE C: IN DEVELOPMENT
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Ask about DeFi strategies..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="font-mono"
              />
              <Button disabled className="font-brutal font-black uppercase">
                DEMO
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
