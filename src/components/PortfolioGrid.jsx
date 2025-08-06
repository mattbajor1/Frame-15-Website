import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const projects = [
  { type: "video", title: "Renoun Doc", src: "/assets/nike.jpg" },
  { type: "design", title: "Logo Work", src: "/assets/logo.jpg" },
  { type: "aerial", title: "Drone Reel", src: "/assets/drone.jpg" },
  // New photography projects
  { type: "photography", title: "Mountain Light", src: "/assets/photo1.jpg" },
  { type: "photography", title: "Urban Shadows", src: "/assets/photo2.jpg" },
  { type: "photography", title: "Cinematic Portrait", src: "/assets/photo3.jpg" },
];

export default function PortfolioGrid() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.type === filter);

  return (
    <div className="bg-black text-white px-6 py-20" id="portfolio">
      <RevealOnScroll className="text-center mb-12">
        <h2 className="text-5xl font-bold uppercase tracking-wide text-gold">
          Our Work
        </h2>
        <p className="mt-2 text-lg text-gray-400">
          Curated storytelling across formats
        </p>
      </RevealOnScroll>

      {/* Filter buttons */}
      <RevealOnScroll className="flex justify-center flex-wrap gap-4 mb-12">
        {["all", "video", "design", "aerial", "photography"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 uppercase border border-gold rounded-full font-semibold transition-all duration-300 hover:bg-gold hover:text-black ${
              filter === cat ? "bg-gold text-black" : "text-gold"
            }`}
          >
            {cat}
          </button>
        ))}
      </RevealOnScroll>

      {/* Project grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {filtered.map((project, idx) => (
          <RevealOnScroll
            key={idx}
            className="relative group rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={project.src}
              alt={project.title}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-2xl font-bold transition duration-300">
              {project.title}
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}
