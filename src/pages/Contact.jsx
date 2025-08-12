import React, { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.set('form-name', 'contact');

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      form.reset();
      setStatus({
        type: 'success',
        message: "Thanks! We got it. We'll get back to you shortly.",
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Something went wrong. Mind trying again in a moment?',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-white text-black py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-2">Contact</h2>
        <p className="text-center text-neutral-600 mb-10">
          Tell us a bit about your project.
        </p>

        <form
          name="contact"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          className="grid grid-cols-1 gap-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>
              Don’t fill this out if you’re human: <input name="bot-field" />
            </label>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Name*</span>
              <input
                required
                type="text"
                name="name"
                autoComplete="name"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Jane Doe"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Email*</span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="jane@company.com"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Company</span>
              <input
                type="text"
                name="company"
                autoComplete="organization"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Company Name"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Website / Link</span>
              <input
                type="url"
                name="referenceUrl"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="https://example.com"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Budget*</span>
              <select
                required
                name="budget"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a range
                </option>
                <option value="Under $5k">Under $5k</option>
                <option value="$5k–$10k">$5k–$10k</option>
                <option value="$10k–$25k">$10k–$25k</option>
                <option value="$25k–$50k">$25k–$50k</option>
                <option value="$50k–$100k">$50k–$100k</option>
                <option value="$100k+">$100k+</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Timeline*</span>
              <select
                required
                name="timeline"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                defaultValue=""
              >
                <option value="" disabled>
                  When do you need this?
                </option>
                <option value="ASAP">ASAP</option>
                <option value="2–4 weeks">2–4 weeks</option>
                <option value="1–3 months">1–3 months</option>
                <option value="Flexible">Flexible</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Tell us about the project*</span>
            <textarea
              required
              name="message"
              rows={6}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Goals, audience, references, must-haves…"
            />
          </label>

          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-xs text-neutral-500">
              By submitting, you agree to be contacted about your project.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl border border-black bg-black px-6 py-3 text-white transition hover:translate-y-[-1px] hover:shadow-md disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Send'}
            </button>
          </div>

          {status.message && (
            <div
              className={`mt-3 rounded-xl px-4 py-3 text-sm ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {status.message}
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Prefer email?{' '}
          <a href="mailto:info@frame15.com" className="underline">
            info@frame15.com
          </a>
        </p>
      </div>
    </section>
  );
}
