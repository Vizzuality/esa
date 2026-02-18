import Card from '@/components/ui/card';
import GradientLine from '@/components/ui/gradient-line';

import DashboardNumbers from './numbers';
import DashboardRegions from './regions';

import { ExternalLinkIcon, X } from 'lucide-react';

const Dashboard = () => {
  return (
    <>
      <div>
        <Card className="h-fit">
          <DashboardNumbers />
        </Card>
        <div>
          <GradientLine />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-fit">
          <Card title="Programme Dashboard">
            <a
              target="_blank"
              className="font-open-sans flex justify-between gap-4 px-4 text-sm leading-snug"
              href="https://gda.esa.int/impact-dashboard/"
            >
              Detailed report dashboard on ESA GDA programme.
              <ExternalLinkIcon className="h-4 w-4 shrink-0" />
            </a>
          </Card>
        </div>
        <div className="h-fit">
          <Card title="Knowledge Hub">
            <a
              target="_blank"
              className="font-open-sans flex justify-between gap-4 px-4 text-sm leading-snug"
              href="https://knowledge-hub-gda.esa.int/"
            >
              Extensive and interactive repository of European Earth Observation service
              capabilities.
              <ExternalLinkIcon className="h-4 w-4 shrink-0" />
            </a>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
