import categoryIcons from '@/constants/categories';

import { Skeleton } from '@/components/ui/skeleton';

export const getCategoryIcon = (slug: string) => {
  if (slug in categoryIcons) {
    return categoryIcons[slug as keyof typeof categoryIcons];
  }
  return null;
};

const CategoryIcon = ({ slug, className }: { slug: string; className?: string }) => {
  const Icon = getCategoryIcon(slug);
  if (!Icon) return <Skeleton className="bg-background h-10 w-10 rounded-full" />;
  return <Icon className={className} />;
};

export default CategoryIcon;
