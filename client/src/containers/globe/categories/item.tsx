import { cn } from '@/lib/classnames';

import { useSyncCategory } from '@/store/globe';

import { Category } from '@/types/generated/strapi.schemas';

import { Button } from '@/components/ui/button';
import CategoryIcon, { getCategoryIcon } from '@/components/ui/category-icon';
import { TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui/tooltip';

type CategoryProps = Pick<Category, 'name' | 'slug'>;

const CategoryItem = ({ name, slug }: CategoryProps) => {
  const [category, setCategory] = useSyncCategory();

  const handleClick = (slug: string) => {
    if (category === slug) {
      setCategory(null);
      return;
    }
    setCategory(slug);
  };

  const hasCategoryIcon = getCategoryIcon(slug);

  if (!hasCategoryIcon) {
    return null;
  }

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="icon"
          title={name}
          onClick={() => handleClick(slug)}
          className={cn(
            'hover:fill-secondary pointer-events-auto transition-all delay-200 ease-out hover:-translate-y-2 hover:opacity-100',
            slug === 'placeholder-category'
              ? 'animate-pulse'
              : category === slug
              ? 'fill-secondary text-secondary opacity-70'
              : 'fill-primary text-primary'
          )}
        >
          <CategoryIcon className="h-10 w-10" slug={slug} />
        </Button>
      </TooltipTrigger>
      <TooltipContent
        align="center"
        side="top"
        className="bg-background hidden border-none py-1 text-sm font-bold text-gray-200 shadow-none sm:block"
      >
        {name}
      </TooltipContent>
    </Tooltip>
  );
};

export default CategoryItem;
