import React, { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState(null);
  const handleSubmit = e => {
    e.preventDefault();
    setStatus('Message sent!');
    e.target.reset();
  };
  return (
    <section className="pt-24 pb-16 px-4 bg-gray-50">
      <h2 className="text-4xl font-bold text-center mb-8">Contact</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
        <input type="text" name="name" placeholder="Your Name" required className="w-full p-3 border rounded" />
        <input type="email" name="email" placeholder="Your Email" required className="w-full p-3 border rounded" />
        <textarea name="message" rows={5} placeholder="Message..." required className="w-full p-3 border rounded"></textarea>
        <button type="submit" className="w-full py-3 bg-black text-white font-semibold rounded">Send Message</button>
        {status && <p className="text-green-600 text-center mt-4">{status}</p>}
      </form>
    </section>
  );
}
