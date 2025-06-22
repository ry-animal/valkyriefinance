import { ChevronDown, Network } from 'lucide-react';
import { useChainId, useSwitchChain } from 'wagmi';
import { Badge } from '@valkyrie/ui';
import { Button } from '@valkyrie/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@valkyrie/ui-menu';
import { getChainById, networks } from '@/lib/wagmi-config';

export function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const currentChain = getChainById(chainId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          <Network className="h-4 w-4 mr-2" />
          {currentChain?.name || 'Unknown'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {networks.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            className="flex items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-2">
              {chain.name}
              {chain.id === chainId && (
                <Badge variant="secondary" className="text-xs">
                  Current
                </Badge>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
