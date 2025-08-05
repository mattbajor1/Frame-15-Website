import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import OurWork from './pages/OurWork';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white scroll-smooth">
      <Navbar />
      <main className="flex-grow">
        <Home />
        <OurWork />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}