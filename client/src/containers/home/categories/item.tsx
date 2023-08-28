import { useRecoilState, useResetRecoilState } from 'recoil';

import { cn } from '@/lib/classnames';

import { categoryAtom } from '@/store/story';

import { Button } from '@/components/ui/button';

type CategoryProps = {
  name: string;
  id: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const Category = ({ name, id, Icon }: CategoryProps) => {
  const [category, setCategory] = useRecoilState(categoryAtom);
  const resetCategory = useResetRecoilState(categoryAtom);

  const handleClick = (id: string) => {
    if (category === id) {
      return resetCategory();
    }
    setCategory(id);
  };

  return (
    <Button
      size="icon"
      variant="icon"
      title={name}
      onClick={() => handleClick(id)}
      className={cn(
        'hover:fill-secondary transition-all delay-200 ease-out hover:-translate-y-2 hover:opacity-100',
        category === id ? 'fill-secondary opacity-70' : 'fill-primary  opacity-50'
      )}
    >
      <Icon className="opacity-100" />
    </Button>
  );
};

export default Category;
