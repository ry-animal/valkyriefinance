import {
  AuthStoreExample,
  PortfolioStoreExample,
  UIStoreExample,
  Web3StoreExample,
} from '@/components/examples/zustand-examples';

export default function StoresPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Zustand State Management</h1>
        <p className="text-muted-foreground mt-2">
          Interactive examples showing how our Zustand stores work across the application.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AuthStoreExample />
        <UIStoreExample />
        <PortfolioStoreExample />
        <Web3StoreExample />
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Store Architecture</h2>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            <strong>Auth Store:</strong> Manages user authentication state and profile data
          </li>
          <li>
            <strong>UI Store:</strong> Controls modals, notifications, theme, and global UI state
          </li>
          <li>
            <strong>Portfolio Store:</strong> Handles portfolio data, selection, and asset
            management
          </li>
          <li>
            <strong>Web3 Store:</strong> Manages wallet connection, transactions, and blockchain
            state
          </li>
        </ul>
      </div>
    </div>
  );
}
