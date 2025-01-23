'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const ScrollArea = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'overflow-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-primary/20',
        className
      )}
      {...props}
    >
      <div className="min-h-full">{children}</div>
    </div>
  )
);

ScrollArea.displayName = 'ScrollArea';