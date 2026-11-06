import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import Seo from '@/components/Seo';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email address';
    }
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) {
      e.message = 'Message is required';
    } else if (form.message.trim().length < 20) {
      e.message = 'Message must be at least 20 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const mailtoUrl = `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
      window.location.href = mailtoUrl;
      setSubmitted(true);
    }
  };

  return (
    <>
      <Seo title="Contact" description="Get in touch with the PulsePress team" url="/contact" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
            Contact Us
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-2">
            We'd love to hear from you. Send us a message and we'll respond as soon as we can.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
              Your email client should have opened
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
              If it didn't, please email us directly at{' '}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="text-amber-600 dark:text-amber-400 underline"
              >
                {SITE_CONFIG.contactEmail}
              </a>
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({ name: '', email: '', subject: '', message: '' });
              }}
              className="mt-4 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-transparent focus:border-gray-300 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none text-gray-900 dark:text-neutral-100 transition-all"
              />
              {errors.name && (
                <p id="name-error" className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-transparent focus:border-gray-300 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none text-gray-900 dark:text-neutral-100 transition-all"
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-transparent focus:border-gray-300 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none text-gray-900 dark:text-neutral-100 transition-all"
              />
              {errors.subject && (
                <p id="subject-error" className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.subject}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-transparent focus:border-gray-300 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none text-gray-900 dark:text-neutral-100 transition-all resize-none"
              />
              {errors.message && (
                <p id="message-error" className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              <Send size={16} />
              Send Message
            </button>

            <p className="text-xs text-gray-400 dark:text-neutral-500 text-center">
              This form opens your email client. For backend email integration, connect a service like Resend or SendGrid.
            </p>
          </form>
        )}
      </div>
    </>
  );
}
