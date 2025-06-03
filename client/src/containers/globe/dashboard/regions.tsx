// const regions = [
//   { name: 'East Asia and Pacific', stories: 32 },
//   { name: 'Latin America and Caribbean', stories: 28 },
//   { name: 'Middle-East and North Africa', stories: 24 },
//   { name: 'Sub-Saharan Africa', stories: 21 },
//   { name: 'South Asia', stories: 16 },
//   { name: 'Europe and Central Asia', stories: 8 },
// ];

const thematicAreas = [
  { name: 'Implementation and support', value: 95 },
  { name: 'Preparation', value: 52 },
  { name: 'Identification', value: 42 },
  { name: 'Completion and evaluation', value: 19 },
  { name: 'Appraisal', value: 3 },
  { name: 'Negotiations and board approval', value: 3 },
];

const DashboardRegions = () => {
  const getWidth = (stories: number) => {
    const max = Math.max(...thematicAreas.map((region) => region.value));
    return `${(stories / max) * 100}%`;
  };

  return (
    <div>
      <ul>
        {thematicAreas.map(({ name, value }) => (
          <li key={name} className="space-y-2 px-4 py-2 hover:bg-white/10">
            <div className="flex justify-between text-sm">
              <p>{name}</p>
              <p className="font-semibold">{value}</p>
            </div>
            <div className="h-[3px] w-full rounded-lg bg-teal-800/50">
              <div
                style={{
                  width: getWidth(value),
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
