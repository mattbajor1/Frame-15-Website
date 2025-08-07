import { useState } from "react";
import RevealOnScroll from "../components/RevealOnScroll";
import { FiCamera, FiFilm, FiAperture, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const serviceData = {
  video: {
    title: "Video Production",
    icon: <FiFilm size={32} />, 
    description:
      "From concept to final cut, we craft cinematic videos with intention. Commercials, documentaries, and branded content built to move.",
    projects: [
      {
        title: "Renoun Doc",
        type: "video",
        src: "https://player.vimeo.com/video/1102554785?h=25a4d4ba50",
      },
      {
        title: "Another Cut",
        type: "video",
        src: "https://player.vimeo.com/video/1102554785?h=25a4d4ba50",
      },
    ],
  },
  photography: {
    title: "Photography",
    icon: <FiCamera size={32} />, 
    description:
      "Powerful stills that capture tone, mood, and story in a single frame. Editorial, product, and lifestyle visuals that resonate.",
    projects: [
      { title: "Mountain Light", type: "image", src: "/assets/photo1.jpg" },
      { title: "Urban Shadows", type: "image", src: "/assets/photo2.jpg" },
      { title: "Cinematic Portrait", type: "image", src: "/assets/photo3.jpg" },
    ],
  },
  aerial: {
    title: "Aerial & Drone",
    icon: <FiAperture size={32} />, 
    description:
      "Elevated perspectives with drone cinematography. We scout, plan, and fly for bold, breathtaking footage.",
    projects: [
      {
        title: "Drone Reel",
        type: "video",
        src: "https://player.vimeo.com/video/1102554785?h=25a4d4ba50",
      },
      {
        title: "Top Down",
        type: "video",
        src: "https://player.vimeo.com/video/1102554785?h=25a4d4ba50",
      },
    ],
  },
};

export default function OurWork() {
  const [activeTab, setActiveTab] = useState(null);
  const services = Object.entries(serviceData);

  return (
    <section
      id="projects"
      className="relative text-white py-28 px-6 bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/your-background.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <RevealOnScroll className="text-center mb-16">
          <h2 className="text-5xl font-bold uppercase tracking-wide text-yellow-500">
            Our Services
          </h2>
          <p className="mt-3 text-lg text-gray-300 max-w-xl mx-auto">
            Bold creative across formats — each crafted with clarity and intent.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {services.map(([key, service]) => (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`bg-black/80 border border-white/10 rounded-xl p-6 md:p-8 flex flex-col text-center shadow-lg backdrop-blur-sm transition-all relative col-span-1 ${
                activeTab === key ? 'md:col-span-3' : ''
              }`}
            >
              <div className="mb-4 text-yellow-500 flex justify-center">{service.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-300 mb-4">{service.description}</p>

              {activeTab !== key ? (
                <button
                  onClick={() => setActiveTab(key)}
                  className="mt-auto inline-block px-6 py-2 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-black transition"
                >
                  View Work
                </button>
              ) : (
                <div className="relative mt-4">
                  <button
                    onClick={() => setActiveTab(null)}
                    className="absolute -top-6 right-0 text-white bg-white/10 hover:bg-white/20 rounded-full p-1 border border-white/20"
                    aria-label="Close"
                  >
                    <FiX size={20} />
                  </button>

                  <div className="flex justify-center gap-4 flex-wrap mb-6 mt-4">
                    {services.map(([tabKey, tabService]) => (
                      <button
                        key={tabKey}
                        onClick={() => setActiveTab(tabKey)}
                        className={`px-5 py-1.5 rounded-full border text-sm font-semibold uppercase transition ${
                          activeTab === tabKey
                            ? 'bg-yellow-500 text-black border-yellow-500'
                            : 'text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-black'
                        }`}
                      >
                        {tabService.title}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {serviceData[activeTab].projects.map((project, idx) => (
                      <RevealOnScroll
                        key={idx}
                        className="relative group overflow-hidden rounded-xl shadow-lg"
                      >
                        {project.type === "video" ? (
                          <div className="aspect-w-16 aspect-h-9 w-full">
                            <iframe
                              src={`${project.src}?autoplay=0&loop=1&title=0&byline=0&portrait=0`}
                              className="w-full h-full rounded-xl"
                              frameBorder="0"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                              title={project.title}
                              loading="lazy"
                            ></iframe>
                          </div>
                        ) : (
                          <>
                            <img
                              src={project.src}
                              alt={project.title}
                              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xl font-semibold transition duration-300">
                              {project.title}
                            </div>
                          </>
                        )}
                      </RevealOnScroll>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
