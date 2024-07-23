import { cn } from '@/lib/classnames';

type GradientLineProps = {
  className?: string;
};

const GradientLine = ({ className }: GradientLineProps) => (
  <div className={cn('bg-header-line relative my-4 h-[1px]', className)}></div>
);

export default GradientLine;
