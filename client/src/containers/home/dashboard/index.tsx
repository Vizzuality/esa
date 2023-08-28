import ItemsLayout from '../item-layout';

import DashboardNumbers from './numbers';
import DashboardRegions from './regions';

const Dashboard = () => {
  return (
    <div className="w-60">
      <ItemsLayout>
        <DashboardNumbers />
      </ItemsLayout>
      <div className="bg-header-line my-4 h-[1px]"></div>
      <ItemsLayout title="Regions">
        <DashboardRegions />
      </ItemsLayout>
    </div>
  );
};

export default Dashboard;
