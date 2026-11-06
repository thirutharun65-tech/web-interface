import { Mail, MessageSquare } from 'lucide-react';

export default function SupportCard({ onContactSupport, onSendFeedback }) {
  return (
    <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-6 sm:p-8 text-white shadow-float">
      <h3 className="text-lg font-bold mb-1">Still need help?</h3>
      <p className="text-sm text-white/80 mb-5">Can't find what you're looking for? Our support resources can help you get the most out of Contactly.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onContactSupport} className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand-600 bg-white hover:bg-white/90 rounded-xl transition-colors">
          <Mail className="w-4 h-4" /> Contact Support
        </button>
        <button onClick={onSendFeedback} className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 rounded-xl transition-colors">
          <MessageSquare className="w-4 h-4" /> Send Feedback
        </button>
      </div>
    </div>
  );
}
