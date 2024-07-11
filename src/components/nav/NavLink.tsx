'use client';
import { ComponentProps } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const NavLink = (props: Omit<ComponentProps<typeof Link>, 'className'>) => {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      className={cn(
        'p-4 border-b-2 border-b-primary hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground',
        pathname === props.href && 'bg-background text-foreground'
      )}
    />
  );
};

export default NavLink;
