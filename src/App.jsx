import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import OurWork from './pages/OurWork';
import About from './pages/About';
import Contact from './pages/Contact';
import useEasterEggs from './hooks/useEasterEggs';

export default function App() {
  const { showBlooper, setShowBlooper } = useEasterEggs();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white scroll-smooth overflow-x-hidden relative z-0 scroll-py-12">
      <Navbar />
      <main className="flex-grow">
        <Home />
        <OurWork />
        <About />
        <Contact />
      </main>
      <Footer />

   
      {showBlooper && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="relative max-w-4xl w-[92vw]">
            <video
              src="/videos/blooper.mp4"  // place in /public/videos
              controls
              autoPlay
              className="w-full max-h-[80vh] rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setShowBlooper(false)}
              className="absolute -top-4 -right-4 bg-black/80 text-white w-10 h-10 rounded-full border border-white/20"
              aria-label="Close blooper"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
