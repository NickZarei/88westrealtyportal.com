// components/PointsSystem.jsx

export default function PointsSystem() {
  const pointsData = [
    {
      title: 'Client Satisfaction',
      description: '100 points for each 5-star Google review that mentions 88West.',
      points: 100,
    },
    {
      title: 'Participation in Office Activities',
      description: '100 points per attendance at office events.',
      points: 100,
    },
    {
      title: 'Video Content Creation about 88West',
      description: '200 points for creating video content promoting 88West and encouraging licensees to join.',
      points: 200,
    },
    {
      title: 'Recruitment Incentive – Realtor A (0–2 years exp)',
      description: '10,000 points for introducing a new licensee with under 2 years of experience who stays for 6+ months.',
      points: 10000,
    },
    {
      title: 'Recruitment Incentive – Realtor B (2+ years exp)',
      description: '20,000 points for introducing a new licensee with over 2 years of experience who stays for 6+ months.',
      points: 20000,
    },
    {
      title: 'Promotional & Community Engagement',
      description: '200 points for organizing a community event (seminar, webinar, etc.) that promotes 88West.',
      points: 200,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-red-700 mb-4">88West Points & Prizes System</h2>
      <ul className="space-y-4">
        {pointsData.map((item, index) => (
          <li key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold text-red-600">{item.title}</h3>
            <p className="text-gray-700">{item.description}</p>
            <span className="text-sm text-gray-500 font-medium">Points: {item.points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
