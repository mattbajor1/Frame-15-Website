import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import useEasterEggs from './hooks/useEasterEggs';

// Lazy load page components for better performance
const Home = lazy(() => import('./pages/Home'));
const OurWork = lazy(() => import('./pages/OurWork'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const BTS = lazy(() => import('./pages/BTS'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white/60 font-display uppercase tracking-wide">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { showBlooper, setShowBlooper } = useEasterEggs();

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-black text-white scroll-smooth overflow-x-hidden relative z-0 scroll-py-12">
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <main className="flex-grow">
            <Home />
            <OurWork />
            <About />
            <BTS folder="BTS" includeSubfolders={true} />
            <Contact />
          </main>
        </Suspense>
        <Footer />

        {/* Portfolio modal */}
        <Suspense fallback={null}>
          <Portfolio />
        </Suspense>

        {/* Blooper Easter egg overlay */}
        {showBlooper && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="relative max-w-4xl w-[92vw]">
              <video
                src="/videos/blooper.mp4"
                controls
                autoPlay
                className="w-full max-h-[80vh] rounded-xl shadow-2xl"
                aria-label="Blooper video"
              >
                <track kind="captions" />
              </video>
              <button
                onClick={() => setShowBlooper(false)}
                className="absolute -top-4 -right-4 bg-black/80 text-white w-10 h-10 rounded-full border border-white/20 hover:bg-black transition"
                aria-label="Close blooper video"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
