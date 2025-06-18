'use client';

import { useEffect } from 'react';

import { useAtom } from 'jotai';
import { X } from 'lucide-react';

import { updateBrowserClickedAtom } from '@/store/globe';

import { Button } from '@/components/ui/button';

const Banners = () => {
  const [updateBrowserClicked, setUpdateBrowserClicked] = useAtom(updateBrowserClickedAtom);

  useEffect(() => {
    const updateBrowserStorage =
      typeof window !== undefined && localStorage?.getItem('esa-update-browser-clicked');
    if (updateBrowserStorage) {
      setUpdateBrowserClicked('true');
    } else {
      setUpdateBrowserClicked('false');
    }
  }, []);

  const handleCloseUpdateBrowser = () => {
    setUpdateBrowserClicked('true');
    localStorage.setItem('esa-update-browser-clicked', 'true');
  };

  return (
    <div className="fixed bottom-4 z-[100] w-full sm:bottom-0 ">
      {updateBrowserClicked === 'false' && (
        <div className="bg-background/30 flex w-full items-center justify-center gap-4 rounded border border-[#335E6F] px-6 py-1.5 text-white backdrop-blur-sm sm:px-0">
          <p>For a better experience, be sure that your browser is up-to-date</p>
          <Button
            onClick={handleCloseUpdateBrowser}
            className="bg-map-background hover:border-secondary hover:text-secondary w-min rounded-full border border-gray-800 px-4 py-2 text-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Banners;
