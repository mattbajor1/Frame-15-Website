import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
<div className="p-8 bg-white">
</div>

      <main className="pt-16 bg-black text-white">
        <Home />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
