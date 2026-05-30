import { ReactNode } from 'react';
import { AppLayout } from './AppLayout';
import { cn } from '../../lib/utils';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <AppLayout>
      <div className={cn('min-h-full', className)}>
        {children}
      </div>
    </AppLayout>
  );
}
