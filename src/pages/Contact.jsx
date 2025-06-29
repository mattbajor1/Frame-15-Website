import React, { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState(null);
  const handleSubmit = e => {
    e.preventDefault();
    setStatus('Message sent!');
    e.target.reset();
  };

  return (
    <section id="contact" className="bg-white text-black py-24 px-4">
      <h2 className="text-4xl font-bold text-center mb-8">Contact</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto space-y-6"
      >
        {['Name','Email','Message'].map((label, i) => (
          label !== 'Message' ? (
            <input
              key={i}
              type={label==='Email'?'email':'text'}
              name={label.toLowerCase()}
              placeholder={label}
              required
              className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:border-gold"
            />
          ) : (
            <textarea
              key={i}
              name="message"
              rows={5}
              placeholder="Message"
              required
              className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:border-gold"
            ></textarea>
          )
        ))}
        <button
          type="submit"
          className="w-full py-3 border-2 border-gold text-gold font-semibold rounded hover:bg-gold hover:text-black transition-colors"
        >
          Send Message
        </button>
        {status && (
          <p className="text-green-600 text-center mt-4">
            {status}
          </p>
        )}
      </form>
    </section>
  );
}