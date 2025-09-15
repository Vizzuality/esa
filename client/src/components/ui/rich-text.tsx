import Markdown from 'react-markdown';

import Image from 'next/image';

import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';

import { cn } from '@/lib/classnames';
import { getImageSrc } from '@/lib/image-src';

type RichTextProps = {
  children: string | undefined | null;
  className?: string;
};

const RichText = ({ children, className }: RichTextProps) => {
  return (
    <Markdown
      components={{
        a: ({ node, href, ...props }) => (
          <a {...props} target="_blank" className="underline">
            {props.children}
          </a>
        ),
        ol: ({ node, ...props }) => (
          <ol {...props} className="ml-4 list-decimal">
            {props.children}
          </ol>
        ),
        li: ({ node, ...props }) => (
          <li {...props} className="ml-4 list-disc">
            {props.children}
          </li>
        ),
        img: ({ node, ...props }) => (
          <Image
            {...props}
            ref={null}
            placeholder={undefined}
            alt={props.alt || ''}
            src={getImageSrc(props.src)}
            className="h-auto w-full"
            width={400}
            height={200}
          />
        ),
        video: ({ node, ...props }) => {
          return (
            <video {...props} controls className="!my-4 h-auto w-full">
              <source src={props.src} />
            </video>
          );
        },
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="my-8 border-l-[3px] border-l-[rgba(204,204,204,0.5)] px-8 pl-[0.7em] pr-8 italic"
            {...props}
          />
        ),
      }}
      className={cn('space-y-2', className)}
      urlTransform={(url) => getImageSrc(url)}
      remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkUnwrapImages]}
      rehypePlugins={[rehypeRaw]}
    >
      {children}
    </Markdown>
  );
};

export default RichText;
