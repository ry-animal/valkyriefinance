'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@valkyrie/ui';

export function StakingMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Staking Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Global staking metrics are temporarily unavailable. Please check back soon!
        </p>
      </CardContent>
    </Card>
  );
}
