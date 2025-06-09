import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { ErrorBoundary } from '../error-boundary';

const ThrowError = ({ shouldThrow }: { shouldThrow?: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error');
    }
    return <div>No error</div>;
};

describe('ErrorBoundary', () => {
    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('renders error UI when there is an error', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
        expect(screen.getByText('Refresh Page')).toBeInTheDocument();

        consoleSpy.mockRestore();
    });
}); 