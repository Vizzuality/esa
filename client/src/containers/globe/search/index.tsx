import { SearchIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useSyncSearch } from '@/store/globe';

const SearchStories = () => {
  const [search, setSearch] = useSyncSearch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="hover:border-secondary relative flex w-full items-center gap-2 rounded-sm border border-gray-800">
      <SearchIcon className="absolute left-4 w-[18px] shrink-0 stroke-gray-200" />
      <input
        value={search || ''}
        className="placeholder:gray-600 font-open-sans h-full w-full bg-transparent py-2 pl-11 pr-8 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Search story"
        onChange={handleChange}
      />
      <XIcon
        onClick={() => setSearch(null)}
        className={cn(
          'absolute right-3 h-4 w-4 cursor-pointer stroke-gray-200',
          !!search ? 'block' : 'hidden'
        )}
      />
    </div>
  );
};

export default SearchStories;
