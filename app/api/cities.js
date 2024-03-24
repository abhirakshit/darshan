// pages/api/cities.js
import cities from 'all-the-cities';

export default function handler(req, res) {
  const query = (req.query.q || '').toLowerCase();
  const matchedCities = cities.filter(city =>
    city.name.toLowerCase().startsWith(query)
  ).slice(0, 10); // Limit the number of cities returned

  res.status(200).json(matchedCities);
}
