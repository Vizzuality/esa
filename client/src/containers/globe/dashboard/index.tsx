import Card from '@/components/ui/card';
import GradientLine from '@/components/ui/gradient-line';

import DashboardNumbers from './numbers';
import DashboardRegions from './regions';

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
      <Card className="max-h-[calc(100%-142px)]" title="Regions">
        <DashboardRegions />
      </Card>
    </>
  );
};

export default Dashboard;
