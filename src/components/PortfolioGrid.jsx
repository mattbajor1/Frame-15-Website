import { useState } from "react";

const projects = [
   { type: "video", title: "Nike Spec", vimeoId: "123456789" },
  { type: "aerial", title: "Drone Reel", vimeoId: "987654321" },
];

export default function PortfolioGrid() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? projects : projects.filter(p => p.type === filter);

  return (
    <div className="px-6 py-12" id="portfolio">
      <h2 className="text-4xl font-bold text-center mb-6">Our Work</h2>
      <div className="flex justify-center space-x-4 mb-8">
        {["all", "video", "design", "aerial"].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 border rounded-full transition ${
              filter === cat ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((project, idx) => (
          <div key={idx} className="relative group">
            <img src={project.src} alt={project.title} className="w-full h-auto rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xl transition">
              {project.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}