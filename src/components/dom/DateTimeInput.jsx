import React, { useState } from "react";
import 'tailwindcss/tailwind.css';

export const DateTimeInput =  () => {
  const [filteredCities, setFilteredCities] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    timeOfBirth: '',
    city: '',
  });

  const handleCityInputChange = async (e) => {
    setFormData({ ...formData, city: e.target.value });

    const search = e.target.value;
    if (search.length > 0) {
      const response = await fetch(`/api/cities?q=${search}`);
      const matchedCities = await response.json();
      setFilteredCities(matchedCities);
    } else {
      setFilteredCities([]);
    }
  };

  const selectCity = (cityName) => {
    setFormData({ ...formData, city: cityName });
    setFilteredCities([]);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4">
      {!isFormVisible ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setFormVisible(true)}
        >
          Open Form
        </button>
      ) : (
        <div className="relative border p-4 rounded-md shadow-lg">
          <button
            className="absolute top-0 right-0 text-xl p-2"
            onClick={() => setFormVisible(false)}
          >
            ×
          </button>
          <form>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date of Birth (mm/dd/yy)
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Time of Birth (hh:mm:ss)
                </label>
                <input
                  type="time"
                  name="timeOfBirth"
                  value={formData.timeOfBirth}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleCityInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {filteredCities.length > 0 && (
                  <div className="absolute z-10 left-0 mt-2 w-full bg-white shadow-md max-h-60 overflow-y-auto">
                    {filteredCities.map(city => (
                      <div
                        key={city.id}
                        onClick={() => selectCity(city.name)}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                      >
                        {city.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </form>
        </div>
      )}
    </div>
  );
}


