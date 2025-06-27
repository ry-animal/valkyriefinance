'use client';

import { AlertTriangle, Bell, Brain, CheckCircle, Clock, Info, TrendingUp, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

interface SmartNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'ai-insight' | 'market-update';
  title: string;
  message: string;
  timestamp: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  aiScore?: number;
  context?: string[];
  category?: 'trading' | 'portfolio' | 'system' | 'ai' | 'governance';
  actionRequired?: boolean;
  autoHide?: boolean;
  hideAfter?: number;
}

interface SmartNotificationManagerProps {
  className?: string;
  maxVisible?: number;
  enableAIPrioritization?: boolean;
}

// Mock AI prioritization service
const prioritizeNotifications = async (
  notifications: SmartNotification[],
  userContext: {
    currentPath: string;
    portfolioValue?: number;
    activeStrategies?: string[];
  }
): Promise<SmartNotification[]> => {
  // Simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 100));

  return notifications
    .map((notification) => {
      let aiScore = 0.5; // Base score

      // Context-based scoring
      if (userContext.currentPath.includes('portfolio') && notification.category === 'portfolio') {
        aiScore += 0.3;
      }

      if (userContext.currentPath.includes('ai') && notification.category === 'ai') {
        aiScore += 0.3;
      }

      // Priority-based scoring
      switch (notification.priority) {
        case 'critical':
          aiScore += 0.4;
          break;
        case 'high':
          aiScore += 0.3;
          break;
        case 'medium':
          aiScore += 0.1;
          break;
        case 'low':
          aiScore -= 0.1;
          break;
      }

      // Type-based scoring
      switch (notification.type) {
        case 'error':
          aiScore += 0.2;
          break;
        case 'ai-insight':
          aiScore += 0.15;
          break;
        case 'market-update':
          aiScore += 0.1;
          break;
      }

      // Time decay (newer notifications score higher)
      const ageInMinutes = (Date.now() - notification.timestamp) / (1000 * 60);
      if (ageInMinutes < 5) aiScore += 0.2;
      else if (ageInMinutes < 30) aiScore += 0.1;
      else if (ageInMinutes > 60) aiScore -= 0.1;

      return {
        ...notification,
        aiScore: Math.max(0, Math.min(1, aiScore)), // Clamp between 0 and 1
      };
    })
    .sort((a, b) => {
      // Sort by AI score, then by timestamp
      if (a.aiScore !== b.aiScore) {
        return (b.aiScore || 0) - (a.aiScore || 0);
      }
      return b.timestamp - a.timestamp;
    });
};

function getNotificationIcon(type: SmartNotification['type']) {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'error':
      return AlertTriangle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
    case 'ai-insight':
      return Brain;
    case 'market-update':
      return TrendingUp;
    default:
      return Bell;
  }
}

function getNotificationColor(
  type: SmartNotification['type'],
  priority: SmartNotification['priority']
) {
  if (priority === 'critical') {
    return 'border-red-500 bg-red-50 text-red-900';
  }

  switch (type) {
    case 'success':
      return 'border-green-500 bg-green-50 text-green-900';
    case 'error':
      return 'border-red-500 bg-red-50 text-red-900';
    case 'warning':
      return 'border-yellow-500 bg-yellow-50 text-yellow-900';
    case 'info':
      return 'border-blue-500 bg-blue-50 text-blue-900';
    case 'ai-insight':
      return 'border-purple-500 bg-purple-50 text-purple-900';
    case 'market-update':
      return 'border-orange-500 bg-orange-50 text-orange-900';
    default:
      return 'border-gray-500 bg-gray-50 text-gray-900';
  }
}

function getPriorityIndicator(priority: SmartNotification['priority']) {
  switch (priority) {
    case 'critical':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
}

// Mock notifications for demo
const generateMockNotifications = (): SmartNotification[] => [
  {
    id: '1',
    type: 'ai-insight',
    title: 'Portfolio Optimization Suggestion',
    message:
      'AI detected a potential 12% yield improvement by reallocating 15% of USDC to the yield vault.',
    timestamp: Date.now() - 1000 * 60 * 2, // 2 minutes ago
    priority: 'high',
    category: 'ai',
    actionRequired: true,
    context: ['portfolio', 'yield-optimization'],
  },
  {
    id: '2',
    type: 'market-update',
    title: 'Market Volatility Alert',
    message:
      'ETH volatility increased by 15% in the last hour. Consider enabling stop-loss protection.',
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    priority: 'medium',
    category: 'trading',
    context: ['eth', 'volatility'],
  },
  {
    id: '3',
    type: 'success',
    title: 'Transaction Completed',
    message: 'Successfully staked 100 VLK tokens. Expected annual yield: 8.5%',
    timestamp: Date.now() - 1000 * 60 * 10, // 10 minutes ago
    priority: 'low',
    category: 'portfolio',
    autoHide: true,
    hideAfter: 5000,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Gas Price Alert',
    message:
      'Network gas prices are currently high (45 gwei). Consider delaying non-urgent transactions.',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
    priority: 'medium',
    category: 'system',
  },
];

export function SmartNotificationManager({
  className,
  maxVisible = 5,
  enableAIPrioritization = true,
}: SmartNotificationManagerProps) {
  const pathname = usePathname();
  const [notifications] = useState<SmartNotification[]>(generateMockNotifications());
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // AI-prioritized notifications
  const prioritizedNotifications = useMemo(async () => {
    if (!enableAIPrioritization) {
      return notifications.filter((n) => !dismissed.has(n.id));
    }

    const userContext = {
      currentPath: pathname,
      portfolioValue: 50000, // Mock value
      activeStrategies: ['yield-farming', 'liquidity-provision'],
    };

    const prioritized = await prioritizeNotifications(
      notifications.filter((n) => !dismissed.has(n.id)),
      userContext
    );

    return prioritized.slice(0, maxVisible);
  }, [notifications, dismissed, pathname, enableAIPrioritization, maxVisible]);

  const [visibleNotifications, setVisibleNotifications] = useState<SmartNotification[]>([]);

  // Update visible notifications when prioritization changes
  useEffect(() => {
    const updateNotifications = async () => {
      const prioritized = await prioritizedNotifications;
      setVisibleNotifications(prioritized);
    };

    updateNotifications();
  }, [prioritizedNotifications]);

  // Auto-hide notifications
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    notifications.forEach((notification) => {
      if (notification.autoHide && notification.hideAfter && !dismissed.has(notification.id)) {
        const timeout = setTimeout(() => {
          setDismissed((prev) => new Set([...prev, notification.id]));
        }, notification.hideAfter);
        timeouts.push(timeout);
      }
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [notifications, dismissed]);

  const handleDismiss = (notificationId: string) => {
    setDismissed((prev) => new Set([...prev, notificationId]));
  };

  const handleClearAll = () => {
    const allIds = visibleNotifications.map((n) => n.id);
    setDismissed((prev) => new Set([...prev, ...allIds]));
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Smart Notifications</span>
          {enableAIPrioritization && (
            <div className="flex items-center gap-1 text-xs text-purple-600">
              <Brain className="h-3 w-3" />
              <span>AI Prioritized</span>
            </div>
          )}
        </div>

        {visibleNotifications.length > 1 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="space-y-2">
        {visibleNotifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          const colorClasses = getNotificationColor(notification.type, notification.priority);
          const priorityColor = getPriorityIndicator(notification.priority);

          return (
            <div
              key={notification.id}
              className={cn(
                'relative p-3 rounded-lg border-l-4 transition-all duration-200',
                colorClasses
              )}
            >
              {/* Priority indicator */}
              <div className={cn('absolute top-2 right-2 w-2 h-2 rounded-full', priorityColor)} />

              {/* Content */}
              <div className="flex items-start gap-3 pr-6">
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm leading-tight">{notification.title}</h4>

                    <button
                      type="button"
                      onClick={() => handleDismiss(notification.id)}
                      className="text-current/70 hover:text-current transition-colors"
                      aria-label="Dismiss notification"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-sm mt-1 text-current/80">{notification.message}</p>

                  <div className="flex items-center gap-3 mt-2 text-xs text-current/60">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(notification.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {notification.aiScore && enableAIPrioritization && (
                      <div className="flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        <span>Score: {(notification.aiScore * 100).toFixed(0)}%</span>
                      </div>
                    )}

                    {notification.actionRequired && (
                      <span className="px-2 py-0.5 bg-current/20 rounded-full text-xs font-medium">
                        Action Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Floating notification overlay for urgent notifications
export function FloatingNotifications() {
  const [notifications] = useState<SmartNotification[]>(
    generateMockNotifications().filter((n) => n.priority === 'critical')
  );
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visibleNotifications = notifications.filter((n) => !dismissed.has(n.id));

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification) => {
        const Icon = getNotificationIcon(notification.type);

        return (
          <div
            key={notification.id}
            className="bg-white dark:bg-gray-900 border border-red-500 rounded-lg shadow-lg p-4 animate-in slide-in-from-right-2"
          >
            <div className="flex items-start gap-3">
              <Icon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-red-900 dark:text-red-100">
                  {notification.title}
                </h4>
                <p className="text-sm mt-1 text-red-700 dark:text-red-200">
                  {notification.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDismissed((prev) => new Set([...prev, notification.id]))}
                className="text-red-500 hover:text-red-700 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
