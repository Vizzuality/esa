const regions = [
  { name: 'East Asia and Pacific', stories: 32 },
  { name: 'Latin America and Caribbean', stories: 28 },
  { name: 'Middle-East and North Africa', stories: 24 },
  { name: 'Sub-Saharan Africa', stories: 21 },
  { name: 'South Asia', stories: 16 },
  { name: 'Europe and Central Asia', stories: 8 },
];

const DashboardRegions = () => {
  const getWidth = (stories: number) => {
    const max = Math.max(...regions.map((region) => region.stories));
    return `${(stories / max) * 100}%`;
  };

  return (
    <div>
      <ul>
        {regions.map(({ name, stories }) => (
          <li key={name}>
            <div className="flex justify-between py-2 text-sm">
              <p>{name}</p>
              <p className="font-semibold">{stories}</p>
            </div>
            <div className="h-[3px] w-full rounded-lg bg-teal-800/50">
              <div
                style={{
                  width: getWidth(stories),
                }}
                className="from-primary to-secondary h-full bg-gradient-to-r"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardRegions;
