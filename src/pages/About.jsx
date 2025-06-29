import React from 'react';

const team = [
  { name: 'George Weed', role: 'Producer, Creative Director' },
  { name: 'Henry Weed', role: 'DP, Director' },
  { name: 'Aiden Champeau', role: 'Producer, Editor' },
  { name: 'Jonas Spaulding', role: 'DP, Rigging Specialist' },
  { name: 'Joel Rader', role: 'DP, Director' },
  { name: 'Matthew Bajor', role: 'Straight up Vibes' },
];

export default function About() {
  return (
    <section id="about" className="bg-black text-white py-24">
      <h2 className="text-4xl font-bold text-center mb-12">About Us</h2>
      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4">
        {team.map((m, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-white text-black rounded-lg overflow-hidden shadow-lg"
          >
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              {/* Placeholder image */}
              <img
                src="/images/placeholder.jpg"
                alt={m.name}
                className="object-cover h-full"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold">
                <span className="text-gold">{m.name}</span>
              </h3>
              <p className="text-gray-700">{m.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}