import { Button } from '@/components/ui/button';
import { cn } from '@/lib/classnames';

const FEEDBACK_URL = 'https://form.typeform.com/to/BM4lhJ4i';

const Feedback = ({ className }: { className?: string }) => (
  <div className={cn('flex flex-col items-center gap-2', className)}>
    <p id="feedback-prompt" className="text-center text-sm font-semibold leading-5 text-white">
      Help us improve the Impact Sphere. Share 1 minute of feedback.
    </p>
    <Button
      asChild
      variant="outline"
      className="h-auto rounded-full border-gray-800 bg-gray-900 px-4 py-2 text-xs font-normal leading-4 text-gray-200 hover:bg-gray-900/80 hover:text-gray-200"
    >
      <a
        href={FEEDBACK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby="feedback-prompt"
      >
        Give Feedback!
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </Button>
  </div>
);

export default Feedback;
