import categoryIcons from '@/constants/categories';

export const getCategoryIcon = (slug: string) => {
  if (slug in categoryIcons) {
    return categoryIcons[slug as keyof typeof categoryIcons];
  }
  return null;
};

const CategoryIcon = ({ slug, className }: { slug: string; className?: string }) => {
  const Icon = getCategoryIcon(slug);
  if (!Icon) return null;
  return <Icon className={className} />;
};

export default CategoryIcon;
