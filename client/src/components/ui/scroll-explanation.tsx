import { PropsWithChildren } from 'react';

const ScrollExplanation = ({ children }: PropsWithChildren) => {
  return (
    <div className="font-notes z-10 flex w-full items-center justify-center gap-2 text-center text-sm italic text-white">
      <div className="flex h-8 w-4 justify-center rounded-full border border-gray-200 bg-gray-900">
        <div className="animate-fade-up sm:animate-fade-down h-2 w-2 rounded-full bg-gray-200" />
      </div>
      <p>{children}</p>
    </div>
  );
};

export default ScrollExplanation;
