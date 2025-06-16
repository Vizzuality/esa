const numbers = [
  { stat: 'Supported countries', number: 72 },
  { stat: 'Case Studies in progress', number: 52 },
  { stat: 'IFI projects', number: 95 },
];

const DashboardNumbers = () => {
  return (
    <div className="flex gap-x-1 px-4">
      {numbers.map(({ stat, number }) => (
        <div key={stat} className="flex-1 space-y-1 text-center text-xs">
          <p className="text-4xl font-bold">{number}</p>
          <p className="font-open-sans font-semibold text-gray-400">{stat}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardNumbers;
