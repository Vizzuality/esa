import { useRecoilState, useResetRecoilState } from 'recoil';

import { cn } from '@/lib/classnames';

import { categoryAtom } from '@/store/home';

import { Category } from '@/types/generated/strapi.schemas';

import { Button } from '@/components/ui/button';
import CategoryIcon from '@/components/ui/category-icon';
import { TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui/tooltip';

type CategoryProps = Pick<Category, 'name' | 'slug'>;

const Category = ({ name, slug }: CategoryProps) => {
  const [category, setCategory] = useRecoilState(categoryAtom);
  const resetCategory = useResetRecoilState(categoryAtom);

  const handleClick = (slug: string) => {
    if (category === slug) {
      return resetCategory();
    }
    setCategory(slug);
  };

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="icon"
          title={name}
          onClick={() => handleClick(slug)}
          className={cn(
            'hover:fill-secondary transition-all delay-200 ease-out hover:-translate-y-2 hover:opacity-100',
            slug === 'placeholder-category'
              ? 'animate-pulse'
              : category === slug
              ? 'fill-secondary opacity-70'
              : 'fill-primary  opacity-50'
          )}
        >
          <CategoryIcon slug={slug} />
        </Button>
      </TooltipTrigger>
      <TooltipContent
        align="center"
        side="top"
        className="border-none bg-transparent text-sm font-bold text-gray-200 shadow-none"
      >
        {name}
      </TooltipContent>
    </Tooltip>
  );
};

export default Category;
