import { useDashboard, DashboardProps } from '@/hooks/dashboard';

const numbers: { stat: string; number: number; slug: keyof DashboardProps }[] = [
  { stat: 'Supported countries', number: 80, slug: 'supportedCountries' },
  { stat: 'Case Studies in progress', number: 120, slug: 'caseStudiesInProgress' },
  { stat: 'IFI projects', number: 118, slug: 'ifiProjects' },
];

const DashboardNumbers = () => {
  const { data } = useDashboard<DashboardProps>();

  return (
    <div className="flex gap-x-1 px-4">
      {numbers.map(({ stat, number, slug }) => (
        <div key={stat} className="flex-1 space-y-1 text-center text-xs">
          <p className="text-4xl font-bold">{data ? data[slug] : number}</p>
          <p className="font-open-sans font-semibold text-gray-400">{stat}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardNumbers;
