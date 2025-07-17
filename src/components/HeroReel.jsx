import React from "react";

export default function HeroReel() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
  <div className="absolute top-0 left-0 w-full h-full">
    <iframe
      src="https://player.vimeo.com/video/YOUR_VIDEO_ID?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    ></iframe>
  </div>

  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 bg-black/40">
    <h1 className="text-5xl md:text-7xl font-bold mb-6">Frame 15</h1>
    <p className="text-lg md:text-2xl max-w-xl">Crafting stories frame by frame</p>
  </div>

  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
    <a href="#portfolio" className="text-white animate-bounce">▼</a>
  </div>
</div>
  );
}