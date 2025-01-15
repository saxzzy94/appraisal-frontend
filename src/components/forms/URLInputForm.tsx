'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const urlSchema = z.object({
  url: z.string().url('Please enter a valid property URL'),
});

type URLFormValues = z.infer<typeof urlSchema>;

interface URLInputFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading?: boolean;
}

export function URLInputForm({ onSubmit, isLoading = false }: URLInputFormProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<URLFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
    },
  });

  const handleSubmit = async (values: URLFormValues) => {
    try {
      setError(null);
      await onSubmit(values.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter property listing URL..."
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Property'}
        </Button>
      </form>
    </Form>
  );
}
