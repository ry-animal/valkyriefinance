'use client';

import { ArrowRight, Brain, Clock, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { restoreNavigationState, trackNavigation } from '@/lib/store-persistence';
import { cn } from '@/lib/utils';

interface NavigationSuggestion {
  path: string;
  label: string;
  reason: 'frequent' | 'recommended' | 'contextual' | 'trending';
  score: number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AINavigationSuggestionsProps {
  className?: string;
  maxSuggestions?: number;
  showReasons?: boolean;
}

// Mock AI suggestions - in real implementation, this would come from your AI service
const getAISuggestions = async (
  currentPath: string,
  userHistory: string[]
): Promise<NavigationSuggestion[]> => {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const suggestions: NavigationSuggestion[] = [];

  // Contextual suggestions based on current page
  const contextualSuggestions: Record<string, NavigationSuggestion[]> = {
    '/dashboard': [
      {
        path: '/portfolio',
        label: 'View Portfolio',
        reason: 'contextual',
        score: 0.9,
        description: 'Check your current positions and performance',
        icon: TrendingUp,
      },
      {
        path: '/ai',
        label: 'AI Assistant',
        reason: 'recommended',
        score: 0.8,
        description: 'Get AI-powered investment insights',
        icon: Brain,
      },
    ],
    '/portfolio': [
      {
        path: '/swap',
        label: 'Swap Tokens',
        reason: 'contextual',
        score: 0.85,
        description: 'Rebalance your portfolio',
      },
      {
        path: '/ai-analytics',
        label: 'AI Analytics',
        reason: 'recommended',
        score: 0.8,
        description: 'Analyze portfolio performance with AI',
        icon: Brain,
      },
    ],
    '/ai': [
      {
        path: '/vault',
        label: 'Yield Vault',
        reason: 'recommended',
        score: 0.9,
        description: 'Earn yield on your assets',
      },
      {
        path: '/ai-analytics',
        label: 'Advanced Analytics',
        reason: 'contextual',
        score: 0.85,
        description: 'Deep dive into AI insights',
        icon: Brain,
      },
    ],
  };

  // Add contextual suggestions
  if (contextualSuggestions[currentPath]) {
    suggestions.push(...contextualSuggestions[currentPath]);
  }

  // Add frequent paths from user history
  const frequentPaths = userHistory.slice(0, 3).map((path, index) => ({
    path,
    label: getPathLabel(path),
    reason: 'frequent' as const,
    score: 0.7 - index * 0.1,
    description: 'You visit this page often',
    icon: Clock,
  }));

  suggestions.push(...frequentPaths);

  // Add trending suggestions (mock)
  if (Math.random() > 0.5) {
    suggestions.push({
      path: '/governance',
      label: 'Governance',
      reason: 'trending',
      score: 0.75,
      description: 'New proposal available for voting',
      icon: Star,
    });
  }

  // Sort by score and remove duplicates
  return suggestions
    .filter(
      (suggestion, index, self) => self.findIndex((s) => s.path === suggestion.path) === index
    )
    .sort((a, b) => b.score - a.score);
};

function getPathLabel(path: string): string {
  const labels: Record<string, string> = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/portfolio': 'Portfolio',
    '/swap': 'Swap',
    '/vault': 'Vault',
    '/staking': 'Staking',
    '/ai': 'AI Assistant',
    '/ai-analytics': 'AI Analytics',
    '/hyperliquid': 'Hyperliquid',
    '/settings': 'Settings',
    '/profile': 'Profile',
    '/transactions': 'Transactions',
    '/governance': 'Governance',
  };

  return labels[path] || path.split('/').pop()?.replace(/[-_]/g, ' ') || 'Unknown';
}

function getReasonLabel(reason: NavigationSuggestion['reason']): string {
  switch (reason) {
    case 'frequent':
      return 'Often visited';
    case 'recommended':
      return 'AI recommended';
    case 'contextual':
      return 'Relevant now';
    case 'trending':
      return 'Trending';
    default:
      return '';
  }
}

function getReasonColor(reason: NavigationSuggestion['reason']): string {
  switch (reason) {
    case 'frequent':
      return 'text-blue-600 bg-blue-100';
    case 'recommended':
      return 'text-purple-600 bg-purple-100';
    case 'contextual':
      return 'text-green-600 bg-green-100';
    case 'trending':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function AINavigationSuggestions({
  className,
  maxSuggestions = 4,
  showReasons = true,
}: AINavigationSuggestionsProps) {
  const pathname = usePathname();
  const [suggestions, setSuggestions] = useState<NavigationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [userHistory, setUserHistory] = useState<string[]>([]);

  // Load user navigation history
  useEffect(() => {
    const loadNavigationData = async () => {
      try {
        const navigationState = await restoreNavigationState();
        if (navigationState?.frequentPaths) {
          setUserHistory(navigationState.frequentPaths);
        }
      } catch (error) {
        console.warn('Failed to load navigation history:', error);
      }
    };

    loadNavigationData();
  }, []);

  // Generate AI suggestions when path or history changes
  useEffect(() => {
    const generateSuggestions = async () => {
      setLoading(true);
      try {
        const aiSuggestions = await getAISuggestions(pathname, userHistory);
        setSuggestions(aiSuggestions.slice(0, maxSuggestions));
      } catch (error) {
        console.warn('Failed to generate AI suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    generateSuggestions();
  }, [pathname, userHistory, maxSuggestions]);

  const handleSuggestionClick = async (suggestion: NavigationSuggestion) => {
    // Track the suggestion click for AI learning
    await trackNavigation(suggestion.path);
  };

  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Brain className="h-4 w-4 animate-pulse" />
          <span>Loading AI suggestions...</span>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`loading-${i}`} className="h-12 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Brain className="h-4 w-4" />
        <span>AI Suggestions</span>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;

          return (
            <Link
              key={suggestion.path}
              href={suggestion.path as any}
              onClick={() => handleSuggestionClick(suggestion)}
              className="group block p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {Icon && <Icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground group-hover:text-accent-foreground">
                        {suggestion.label}
                      </span>
                      {showReasons && (
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full font-medium',
                            getReasonColor(suggestion.reason)
                          )}
                        >
                          {getReasonLabel(suggestion.reason)}
                        </span>
                      )}
                    </div>

                    {suggestion.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {suggestion.description}
                      </p>
                    )}
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors flex-shrink-0 mt-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Compact version for sidebars
export function CompactAISuggestions({ className }: { className?: string }) {
  return <AINavigationSuggestions className={className} maxSuggestions={3} showReasons={false} />;
}
