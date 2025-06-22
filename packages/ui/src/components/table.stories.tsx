import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { Button } from './button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV004</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$450.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV005</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$550.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV006</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$200.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV007</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$300.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <Table>
      <TableCaption>User management table with status badges.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>
            <Badge variant="secondary">Admin</Badge>
          </TableCell>
          <TableCell>
            <Badge variant="default">Active</Badge>
          </TableCell>
          <TableCell>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>
            <Badge variant="outline">User</Badge>
          </TableCell>
          <TableCell>
            <Badge variant="default">Active</Badge>
          </TableCell>
          <TableCell>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Bob Johnson</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>
            <Badge variant="outline">User</Badge>
          </TableCell>
          <TableCell>
            <Badge variant="destructive">Inactive</Badge>
          </TableCell>
          <TableCell>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Alice Wilson</TableCell>
          <TableCell>alice@example.com</TableCell>
          <TableCell>
            <Badge variant="secondary">Moderator</Badge>
          </TableCell>
          <TableCell>
            <Badge variant="default">Active</Badge>
          </TableCell>
          <TableCell>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Simple: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Laptop</TableCell>
          <TableCell>$999.00</TableCell>
          <TableCell>5</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Mouse</TableCell>
          <TableCell>$29.99</TableCell>
          <TableCell>12</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Keyboard</TableCell>
          <TableCell>$79.99</TableCell>
          <TableCell>8</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithoutCaption: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Assignee</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Update documentation</TableCell>
          <TableCell>
            <Badge variant="default">In Progress</Badge>
          </TableCell>
          <TableCell>
            <Badge variant="destructive">High</Badge>
          </TableCell>
          <TableCell>John Doe</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Fix login bug</TableCell>
          <TableCell>
            <Badge variant="outline">Todo</Badge>
          </TableCell>
          <TableCell>
            <Badge variant="destructive">High</Badge>
          </TableCell>
          <TableCell>Jane Smith</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Design new feature</TableCell>
          <TableCell>
            <Badge variant="secondary">Review</Badge>
          </TableCell>
          <TableCell>
            <Badge variant="secondary">Medium</Badge>
          </TableCell>
          <TableCell>Bob Johnson</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableCaption>Monthly sales report.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Units Sold</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Pro Plan</TableCell>
          <TableCell>150</TableCell>
          <TableCell className="text-right">$15,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Basic Plan</TableCell>
          <TableCell>300</TableCell>
          <TableCell className="text-right">$9,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Enterprise Plan</TableCell>
          <TableCell>50</TableCell>
          <TableCell className="text-right">$25,000</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>500</TableCell>
          <TableCell className="text-right">$49,000</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const LargeDataSet: Story = {
  render: () => (
    <div className="max-h-96 overflow-auto">
      <Table>
        <TableCaption>Large dataset with scrollable container.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Salary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 20 }, (_, i) => (
            <TableRow key={i}>
              <TableCell>{String(i + 1).padStart(3, '0')}</TableCell>
              <TableCell>Employee {i + 1}</TableCell>
              <TableCell>employee{i + 1}@company.com</TableCell>
              <TableCell>{['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'][i % 5]}</TableCell>
              <TableCell>${(50000 + i * 2000).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
