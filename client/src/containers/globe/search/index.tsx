import { SearchIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useSyncSearch } from '@/store/globe';

const SearchStories = () => {
  const [search, setSearch] = useSyncSearch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="bg-background flex items-center gap-2 rounded-sm border border-gray-800 py-1 pl-4 pr-2">
      <SearchIcon className="h-5 w-5 shrink-0 stroke-gray-200" />
      <input
        value={search || ''}
        className="placeholder:gray-600 font-open-sans w-full bg-transparent p-1 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Search story"
        onChange={handleChange}
      />
      <XIcon
        onClick={() => setSearch(null)}
        className={cn('h-5 w-5 cursor-pointer stroke-gray-200', !!search ? 'block' : 'hidden')}
      />
    </div>
  );
};

export default SearchStories;
