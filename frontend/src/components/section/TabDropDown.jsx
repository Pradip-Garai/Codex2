import React, { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient";

const tabs = {
  Youtube: ["All Resources", "DSA", "Web Dev", "System Design"],
  Github: ["All Resources", "DSA", "Web Dev", "System Design"],
  Course: ["All Resources", "DSA", "OS", "DBMS", "CN", "Java"],
};

export default function TabDropdown() {
  const [activeTab, setActiveTab] = useState("Youtube");
  const [selected, setSelected] = useState(tabs["Youtube"][0]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      setResources([]);

      const typeMap = { Youtube: "youtube", Github: "github", Course: "course" };
      const type = typeMap[activeTab];

      try {
        const params = { type };
        // Pass tag only if selected is NOT "All Resources"
        if (selected && selected !== "All Resources") {
          params.tag = selected;
        }

        const response = await axiosClient.get("/resource/fetch-resources", { params });
        setResources(response.data || []);
      } catch (err) {
        setError("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [activeTab, selected]);

  return (
    <div className="text-white w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 sm:gap-8 border-b border-gray-800">
        {Object.keys(tabs).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelected(tabs[tab][0]);
            }}
            className={`pb-2 text-base sm:text-lg font-medium transition-colors ${
              activeTab === tab
                ? "text-blue-400 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dropdown */}
      <div className="mt-4 sm:mt-6">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full sm:w-auto bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {tabs[activeTab].map((item, idx) => (
            <option key={idx} value={item} className="bg-black text-white">
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Loading/Error */}
      {loading && <div className="mt-6 text-center text-gray-400">Loading...</div>}
      {error && <div className="mt-6 text-center text-red-500">{error}</div>}

      {/* Youtube Cards */}
      {activeTab === "Youtube" && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((video) => (
            <div
              key={video._id || video.id}
              className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={video.thumbnail || "https://via.placeholder.com/320x180"}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <span className="inline-block bg-blue-600 text-xs px-2 py-1 rounded-md mb-2">
                  {video.tag}
                </span>
                <h3 className="text-base sm:text-lg font-semibold mb-3 line-clamp-2">
                  {video.title}
                </h3>
                <a
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2 rounded-lg transition"
                >
                  Watch Now →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Github Cards */}
      {activeTab === "Github" && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((repo) => (
            <div
              key={repo._id || repo.id}
              className="bg-gray-900 border border-gray-700 rounded-xl p-5 hover:shadow-lg transition flex flex-col justify-between"
            >
              <h3 className="text-lg font-semibold text-blue-400 mb-2">{repo.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{repo.description}</p>
              <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                <span>⭐ {repo.stars}</span>
                <span>🍴 {repo.forks}</span>
              </div>
              <span className="inline-block bg-gray-800 text-xs px-2 py-1 rounded-md mb-3">
                {repo.tag}
              </span>
              <a
                href={repo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-center bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2 rounded-lg transition"
              >
                View Repository
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Course Cards */}
      {activeTab === "Course" && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((course) => (
            <div
              key={course._id || course.id}
              className="bg-gray-900 border border-gray-700 rounded-xl p-5 hover:shadow-lg transition flex flex-col justify-between"
            >
              <h3 className="text-lg font-semibold text-green-400 mb-2">{course.name}</h3>
              <p className="text-gray-300 text-sm mb-2">
                Instructor:{" "}
                <span className="text-gray-100 font-medium">{course.instructor}</span>
              </p>
              <p className="text-gray-400 text-sm mb-3">Price: {course.price}</p>
              <span className="inline-block bg-gray-800 text-xs px-2 py-1 rounded-md mb-4">
                {course.tag}
              </span>
              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-center bg-green-600 hover:bg-green-700 text-sm px-4 py-2 rounded-lg transition"
              >
                See Course
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
