import * as React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '@/lib/classnames';

const buttonClasses = {
  default: 'w-fit rounded-3xl px-6 py-2 text-sm transition-all duration-300',
  unchecked: 'border-gray-200 border text-gray-200 hover:border-secondary hover:text-secondary',
  checked: 'text-background border border-secondary bg-secondary opacity-70 hover:opacity-100',
};

const CheckboxButton = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { label: string }
>(({ className, label, checked, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      {...props}
      className={cn(
        className,
        buttonClasses.default,
        checked ? buttonClasses.checked : buttonClasses.unchecked
      )}
    >
      <span>{label}</span>
    </CheckboxPrimitive.Root>
  );
});

CheckboxButton.displayName = CheckboxPrimitive.Root.displayName;

export { CheckboxButton };
