const numbers = [
  { stat: 'Supported countries', number: 53 },
  { stat: 'Organizations Involved', number: 41 },
  { stat: 'IFI projects', number: 50 },
];

const DashboardNumbers = () => {
  return (
    <div className="flex gap-x-1">
      {numbers.map(({ stat, number }) => (
        <div key={stat} className="text-xs">
          <p className="text-3xl font-bold">{number}</p>
          <p>{stat}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardNumbers;
