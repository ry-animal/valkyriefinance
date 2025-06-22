import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from './button';
import { Checkbox } from './checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Switch } from './switch';
import { Textarea } from './textarea';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Flexible form components built on react-hook-form with Zod validation.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Simple Contact Form
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

function ContactForm() {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof contactSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-96">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Your message..." {...field} />
              </FormControl>
              <FormDescription>Tell us what you'd like to discuss.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </Form>
  );
}

export const ContactFormExample: Story = {
  render: () => <ContactForm />,
};

// Advanced Settings Form
const settingsSchema = z.object({
  notifications: z.boolean(),
  newsletter: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
  bio: z.string().max(160, 'Bio must be 160 characters or less'),
});

function SettingsForm() {
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      notifications: true,
      newsletter: false,
      theme: 'system',
      language: 'en',
      bio: '',
    },
  });

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-96">
        <FormField
          control={form.control}
          name="notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Push Notifications</FormLabel>
                <FormDescription>
                  Receive notifications about your account activity.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newsletter"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Subscribe to newsletter</FormLabel>
                <FormDescription>Get updates about new features and releases.</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>You can @mention other users and organizations.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Update Settings
        </Button>
      </form>
    </Form>
  );
}

export const AdvancedSettingsForm: Story = {
  render: () => <SettingsForm />,
};

// DeFi Vault Deposit Form
const vaultDepositSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Minimum deposit is 0.01'),
  token: z.string().min(1, 'Please select a token'),
  slippage: z.coerce.number().min(0.1).max(10),
  autoCompound: z.boolean(),
});

function VaultDepositForm() {
  const form = useForm<z.infer<typeof vaultDepositSchema>>({
    resolver: zodResolver(vaultDepositSchema),
    defaultValues: {
      amount: 0,
      token: '',
      slippage: 0.5,
      autoCompound: true,
    },
  });

  function onSubmit(values: z.infer<typeof vaultDepositSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-96">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token to deposit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="eth">ETH - Ethereum</SelectItem>
                  <SelectItem value="usdc">USDC - USD Coin</SelectItem>
                  <SelectItem value="dai">DAI - Dai Stablecoin</SelectItem>
                  <SelectItem value="wbtc">WBTC - Wrapped Bitcoin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormDescription>Minimum deposit: 0.01 tokens</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slippage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slippage Tolerance (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" min="0.1" max="10" {...field} />
              </FormControl>
              <FormDescription>Maximum price movement you're willing to accept</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="autoCompound"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Auto-Compound</FormLabel>
                <FormDescription>Automatically reinvest rewards to maximize yield</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Deposit to Vault
        </Button>
      </form>
    </Form>
  );
}

export const VaultDepositFormExample: Story = {
  render: () => <VaultDepositForm />,
};
