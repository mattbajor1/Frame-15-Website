import React, { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState(null);

  return (
    <section id="contact" className="bg-white text-black py-24 px-4">
      <h2 className="text-4xl font-bold text-center mb-8">Contact</h2>

      {/* Netlify Forms: needs to be deployed on Netlify */}
      <form
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        className="max-w-xl mx-auto space-y-6"
        onSubmit={() => setStatus('Message sent!')}
      >
        {/* Netlify hidden inputs */}
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden">
          <label>
            Don’t fill this out if you’re human: <input name="bot-field" />
          </label>
        </p>

        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:border-yellow-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:border-yellow-500"
        />
        <textarea
          name="message"
          rows={5}
          placeholder="Message"
          required
          className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:border-yellow-500"
        ></textarea>

        <button
          type="submit"
          className="w-full py-3 border-2 border-yellow-500 text-yellow-500 font-semibold rounded hover:bg-yellow-500 hover:text-black transition-colors"
        >
          Send Message
        </button>

        {status && <p className="text-green-600 text-center mt-4">{status}</p>}
      </form>
    </section>
  );
}