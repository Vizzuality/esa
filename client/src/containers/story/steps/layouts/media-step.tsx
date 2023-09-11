import { StepLayoutItem, StepLayoutMediaStepComponent } from '@/types/generated/strapi.schemas';

type MediaStepLayoutProps = {
  step: StepLayoutItem;
};

const MediaStepLayout = ({ step }: MediaStepLayoutProps) => {
  const { content, title } = step as StepLayoutMediaStepComponent;

  return (
    <div>
      <div>
        <h1>{title}</h1>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default MediaStepLayout;
