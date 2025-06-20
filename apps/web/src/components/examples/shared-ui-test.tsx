import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@valkyrie/ui';

export function SharedUITest() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Shared UI Components Test</CardTitle>
        <CardDescription>Testing components from @valkyrie/ui package</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Badges</h3>
          <div className="flex gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Buttons</h3>
          <div className="flex gap-2">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Input</h3>
          <Input placeholder="Test input from shared UI" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Avatars</h3>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>VF</AvatarFallback>
            </Avatar>
            <Avatar className="size-12">
              <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Skeletons</h3>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Checkboxes</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms1" />
              <label htmlFor="terms1" className="text-sm font-medium">
                Accept terms and conditions
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms2" defaultChecked />
              <label htmlFor="terms2" className="text-sm font-medium">
                Checked by default
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms3" disabled />
              <label htmlFor="terms3" className="text-sm font-medium text-gray-500">
                Disabled option
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Progress</h3>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Vault TVL</span>
                <span>33%</span>
              </div>
              <Progress value={33} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Risk Level</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>APY Target</span>
                <span>88%</span>
              </div>
              <Progress value={88} className="h-3" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Tabs</h3>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="space-y-2">
              <p className="text-sm">Manage your account settings here.</p>
            </TabsContent>
            <TabsContent value="password" className="space-y-2">
              <p className="text-sm">Change your password here.</p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Select</h3>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="astro">Astro</SelectItem>
              <SelectItem value="nuxt">Nuxt.js</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Dropdown Menu</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-sm text-gray-600">
          ✅ All components working from @valkyrie/ui package!
        </div>
      </CardContent>
    </Card>
  );
}
