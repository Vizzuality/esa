import Card from '@/components/ui/card';
import GradientLine from '@/components/ui/gradient-line';

import DashboardNumbers from './numbers';
import DashboardRegions from './regions';

const Dashboard = () => {
  return (
    <div className="w-60">
      <Card>
        <DashboardNumbers />
      </Card>
      <GradientLine />
      <Card title="Regions">
        <DashboardRegions />
      </Card>
    </div>
  );
};

export default Dashboard;
