# Build Failure and Runtime Error Alerting Guide

This document provides instructions for configuring alerting systems to notify the team about build failures and runtime errors in the Valkyrie Finance platform.

## Overview

Timely notification of build failures and runtime errors is critical for maintaining a reliable platform. This guide covers:

1. Vercel build and deployment failure alerts
2. GitHub Actions workflow failure alerts
3. Runtime error alerts via Sentry
4. Custom alerting integrations with Slack, email, and PagerDuty

## Vercel Build and Deployment Alerts

### 1. Configure Vercel Team Notifications

1. Log in to your [Vercel dashboard](https://vercel.com/)
2. Navigate to "Team Settings" > "Notifications"
3. Click "Add Notification"
4. Configure notifications for:
   - Production Deployments
   - Failed Deployments
   - Build Errors
   - Domain Expiration
5. Set up delivery methods:
   - Email notifications
   - Slack integration
   - Discord integration (optional)
   - Webhook for custom integrations

### 2. Configure Project-Specific Alerts

1. Navigate to your project in Vercel
2. Go to "Settings" > "Notifications"
3. Click "Add Notification"
4. Configure project-specific alerts for:
   - Failed Production Deployments
   - Failed Preview Deployments
   - Increased Error Rate
   - Performance Regression

### 3. Set Up Vercel Slack Integration

1. In Slack, create a dedicated #vercel-alerts channel
2. Create a new Slack app or use an existing one
3. Enable incoming webhooks
4. Copy the webhook URL
5. In Vercel, add a Slack notification with the webhook URL
6. Customize the notification template:

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚨 {project} {eventType}"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Project:* {project}"
        },
        {
          "type": "mrkdwn",
          "text": "*Status:* {status}"
        },
        {
          "type": "mrkdwn",
          "text": "*Environment:* {environment}"
        },
        {
          "type": "mrkdwn",
          "text": "*Deployment URL:* {deploymentUrl}"
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Error Message:* {errorMessage}"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "View Deployment"
          },
          "url": "{deploymentUrl}"
        }
      ]
    }
  ]
}
```

## GitHub Actions Workflow Failure Alerts

### 1. Configure GitHub Notifications

1. In your GitHub repository, go to "Settings" > "Notifications"
2. Enable notifications for workflow failures
3. Configure notification delivery preferences

### 2. Set Up GitHub Actions Status Check Slack Integration

1. Create a new GitHub Actions workflow file:

```yaml
# .github/workflows/notify-failures.yml
name: Notify on Failures

on:
  workflow_run:
    workflows:
      - "Build and Test"
      - "Deploy to Production"
    types:
      - completed

jobs:
  notify:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    steps:
      - name: Send Slack notification
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "blocks": [
                {
                  "type": "header",
                  "text": {
                    "type": "plain_text",
                    "text": "🚨 GitHub Actions Workflow Failed"
                  }
                },
                {
                  "type": "section",
                  "fields": [
                    {
                      "type": "mrkdwn",
                      "text": "*Repository:* ${{ github.repository }}"
                    },
                    {
                      "type": "mrkdwn",
                      "text": "*Workflow:* ${{ github.event.workflow_run.name }}"
                    },
                    {
                      "type": "mrkdwn",
                      "text": "*Branch:* ${{ github.event.workflow_run.head_branch }}"
                    },
                    {
                      "type": "mrkdwn",
                      "text": "*Commit:* ${{ github.event.workflow_run.head_sha }}"
                    }
                  ]
                },
                {
                  "type": "actions",
                  "elements": [
                    {
                      "type": "button",
                      "text": {
                        "type": "plain_text",
                        "text": "View Workflow Run"
                      },
                      "url": "${{ github.event.workflow_run.html_url }}"
                    }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

2. Add the `SLACK_WEBHOOK_URL` secret to your GitHub repository

### 3. Set Up Email Notifications for Critical Workflows

1. Create a dedicated notification job in critical workflows:

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  # ... other jobs ...

  notify:
    needs: [deploy]
    if: ${{ always() && (needs.deploy.result == 'failure') }}
    runs-on: ubuntu-latest
    steps:
      - name: Send email notification
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: ${{ secrets.SMTP_SERVER }}
          server_port: ${{ secrets.SMTP_PORT }}
          username: ${{ secrets.SMTP_USERNAME }}
          password: ${{ secrets.SMTP_PASSWORD }}
          subject: "❌ Production Deployment Failed - Valkyrie Finance"
          body: |
            Production deployment has failed.

            Repository: ${{ github.repository }}
            Workflow: ${{ github.workflow }}
            Commit: ${{ github.sha }}

            View the workflow run: https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}
          to: ${{ secrets.ALERT_EMAIL_RECIPIENTS }}
          from: GitHub Actions <no-reply@valkyriefinance.com>
```

## Runtime Error Alerts via Sentry

### 1. Configure Sentry Alert Rules

1. Log in to your [Sentry dashboard](https://sentry.io/)
2. Navigate to "Alerts" > "Rules"
3. Click "New Alert Rule"
4. Configure alert conditions:
   - When: `The number of errors in a project`
   - Exceeds: `10 events in 5 minutes`
   - Filter by: `Environment = production`
5. Configure alert actions:
   - Send email to team members
   - Send Slack notification
   - Create PagerDuty incident
   - Trigger webhook

### 2. Set Up Sentry Slack Integration

1. In Sentry, navigate to "Settings" > "Integrations"
2. Find and enable the Slack integration
3. Configure the Slack workspace and channel
4. Customize the notification format

### 3. Configure PagerDuty Integration for Critical Errors

1. In Sentry, navigate to "Settings" > "Integrations"
2. Find and enable the PagerDuty integration
3. Configure the PagerDuty service
4. Set up escalation policies in PagerDuty
5. Configure alert severity mapping:
   - Fatal errors → P1 (Critical)
   - Error level → P2 (High)
   - Warning level → P3 (Medium)

## Custom Alerting Integrations

### 1. Create a Custom Alert Aggregation Service

For a unified alerting experience, create a custom alert aggregation service:

```typescript
// apps/server/src/app/api/alerts/route.ts
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { source, severity, message, details } = await request.json();

    // Log alert to database
    await db.insert(alerts).values({
      source,
      severity,
      message,
      details: JSON.stringify(details),
      createdAt: new Date(),
    });

    // Send email for high severity alerts
    if (severity === 'high' || severity === 'critical') {
      await resend.emails.send({
        from: 'alerts@valkyriefinance.com',
        to: process.env.ALERT_EMAIL_RECIPIENTS.split(','),
        subject: `[${severity.toUpperCase()}] ${source} Alert - Valkyrie Finance`,
        html: `
          <h1>${message}</h1>
          <p><strong>Source:</strong> ${source}</p>
          <p><strong>Severity:</strong> ${severity}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <h2>Details:</h2>
          <pre>${JSON.stringify(details, null, 2)}</pre>
        `,
      });
    }

    // Send Slack notification for all alerts
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${getSeverityEmoji(severity)} ${source} Alert`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Message:* ${message}`,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Source:* ${source}`,
              },
              {
                type: 'mrkdwn',
                text: `*Severity:* ${severity}`,
              },
              {
                type: 'mrkdwn',
                text: `*Time:* ${new Date().toISOString()}`,
              },
            ],
          },
        ],
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Alert processing failed:', error);
    return NextResponse.json(
      { error: 'Failed to process alert' },
      { status: 500 }
    );
  }
}

function getSeverityEmoji(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return '🚨';
    case 'high':
      return '⚠️';
    case 'medium':
      return '⚠️';
    case 'low':
      return '📝';
    default:
      return '🔔';
  }
}
```

### 2. Implement Custom Client-Side Error Tracking

```typescript
// apps/web/src/lib/error-tracking.ts
import * as Sentry from '@sentry/nextjs';

export async function reportError(error: Error, context?: Record<string, any>) {
  // Report to Sentry
  Sentry.captureException(error, { extra: context });

  // Report to custom alert service
  try {
    await fetch('/api/alerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'client',
        severity: context?.critical ? 'critical' : 'high',
        message: error.message,
        details: {
          stack: error.stack,
          ...context,
          url: window.location.href,
          userAgent: navigator.userAgent,
        },
      }),
    });
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError);
  }
}
```

### 3. Set Up Daily Error Digest

Create a scheduled function to send daily error summaries:

```typescript
// apps/server/src/app/api/cron/daily-error-digest/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/db';
import { alerts } from '@/db/schema';
import { sql } from 'drizzle-orm';

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get yesterday's date range
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Query alerts from yesterday
    const dailyAlerts = await db.query.alerts.findMany({
      where: sql`created_at >= ${yesterday} AND created_at < ${today}`,
      orderBy: (alerts, { desc }) => [desc(alerts.severity), desc(alerts.createdAt)],
    });

    if (dailyAlerts.length === 0) {
      return NextResponse.json({ message: 'No alerts for yesterday' });
    }

    // Group alerts by source and severity
    const groupedAlerts = dailyAlerts.reduce((acc, alert) => {
      const key = `${alert.source}-${alert.severity}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(alert);
      return acc;
    }, {} as Record<string, typeof dailyAlerts>);

    // Generate HTML report
    let htmlContent = `
      <h1>Daily Error Digest - ${yesterday.toLocaleDateString()}</h1>
      <p>Total alerts: ${dailyAlerts.length}</p>
      <hr />
    `;

    Object.entries(groupedAlerts).forEach(([key, alerts]) => {
      const [source, severity] = key.split('-');
      htmlContent += `
        <h2>${source} - ${severity} (${alerts.length})</h2>
        <table border="1" cellpadding="5" style="border-collapse: collapse;">
          <tr>
            <th>Time</th>
            <th>Message</th>
          </tr>
          ${alerts.map(alert => `
            <tr>
              <td>${new Date(alert.createdAt).toLocaleTimeString()}</td>
              <td>${alert.message}</td>
            </tr>
          `).join('')}
        </table>
        <hr />
      `;
    });

    // Send email digest
    await resend.emails.send({
      from: 'alerts@valkyriefinance.com',
      to: process.env.ALERT_EMAIL_RECIPIENTS.split(','),
      subject: `Daily Error Digest - Valkyrie Finance - ${yesterday.toLocaleDateString()}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, alertCount: dailyAlerts.length });
  } catch (error) {
    console.error('Error generating daily digest:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily digest' },
      { status: 500 }
    );
  }
}
```

## Alert Management and Escalation

### 1. Define Alert Severity Levels

| Severity | Description | Response Time | Escalation |
|----------|-------------|---------------|------------|
| P1 (Critical) | Production system down or unusable | Immediate (24/7) | Primary on-call → Team lead → CTO |
| P2 (High) | Major feature broken, significant user impact | < 1 hour (business hours) | Primary on-call → Team lead |
| P3 (Medium) | Minor feature issues, limited user impact | Same business day | Developer team |
| P4 (Low) | Cosmetic issues, minimal impact | Next business day | Developer team |

### 2. Create On-Call Schedule

1. Set up a rotating on-call schedule using PagerDuty
2. Define primary and secondary on-call responsibilities
3. Document escalation procedures
4. Ensure team members have PagerDuty mobile app installed

### 3. Implement Alert Deduplication

Configure Sentry and custom alerting to deduplicate similar errors:

```typescript
// Example Sentry configuration
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  beforeSend(event) {
    // Custom fingerprinting for specific errors
    if (event.exception && event.exception.values) {
      const error = event.exception.values[0];
      if (error.type === 'ChunkLoadError') {
        // Group all chunk load errors together
        event.fingerprint = ['chunk-load-error'];
      }
    }
    return event;
  },
});
```

## Additional Resources

- [Vercel Notification Documentation](https://vercel.com/docs/concepts/notifications/overview)
- [GitHub Actions Notifications](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge)
- [Sentry Alerts Documentation](https://docs.sentry.io/product/alerts/)
- [PagerDuty Integration Guide](https://support.pagerduty.com/docs/sentry-integration-guide)
- [Slack API Documentation](https://api.slack.com/messaging/webhooks)
