import { useMemo } from 'react';
import { Mail, Plus, ArrowRight, Sparkles, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getGreeting, getFullName, daysUntil, daysUntilBirthday } from '@/utils/helpers';
import { loadEmailHistory } from '@/services/emailService';
import StatCard from '@/components/StatCard';
import GrowthChart from '@/components/GrowthChart';
import FollowUpCard from '@/components/FollowUpCard';
import BirthdayCard from '@/components/BirthdayCard';

export default function Dashboard({ onNavigate, onSelectContact, onAddContact, onSendEmail }) {
  const { contacts, user } = useApp();
  const now = new Date();

  const stats = useMemo(() => {
    const followupsDue = contacts.filter((c) => c.followUpDate && daysUntil(c.followUpDate) <= 7 && daysUntil(c.followUpDate) >= -3).length;
    const favorites = contacts.filter((c) => c.favorite).length;
    const upcomingBdays = contacts.filter((c) => c.birthday && daysUntilBirthday(c.birthday) <= 30).length;
    const emailsSent = loadEmailHistory().length;
    return { total: contacts.length, followups: followupsDue, favorites, birthdays: upcomingBdays, emails: emailsSent };
  }, [contacts]);

  const upcomingFollowups = useMemo(() => {
    return contacts
      .filter((c) => c.followUpDate)
      .map((c) => ({ ...c, days: daysUntil(c.followUpDate) }))
      .filter((c) => c.days >= -3 && c.days <= 14)
      .sort((a, b) => a.days - b.days)
      .slice(0, 5);
  }, [contacts]);

  const upcomingBirthdays = useMemo(() => {
    return contacts
      .filter((c) => c.birthday)
      .map((c) => ({ ...c, days: daysUntilBirthday(c.birthday) }))
      .filter((c) => c.days <= 30)
      .sort((a, b) => a.days - b.days)
      .slice(0, 5);
  }, [contacts]);

  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-wider text-ink-400 dark:text-ink-500 uppercase">{dateStr}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-ink-50 mt-1">
            {getGreeting(now)}, {user.firstName} <Sparkles className="inline w-6 h-6 text-brand-500" />
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Here's what's happening with your network today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSendEmail(null)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-600 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors"
          >
            <Mail className="w-4 h-4" /> <span className="hidden sm:inline">Send email</span>
          </button>
          <button
            onClick={onAddContact}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-soft transition-colors"
          >
            <Plus className="w-4 h-4" /> Add contact
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard type="contacts" title="Total contacts" value={stats.total} status="All contacts" trend="+12.5%" trendUp={true} />
        <StatCard type="followups" title="Follow-ups due" value={stats.followups} status="Active" trend={null} trendUp={null} />
        <StatCard type="favorites" title="Favorites" value={stats.favorites} status="Starred" trend={null} trendUp={null} />
        <StatCard type="birthdays" title="Birthdays" value={stats.birthdays} status="Upcoming" trend={null} trendUp={null} />
        <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl p-5 shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center">
              <Send className="w-5 h-5 text-brand-500" />
            </div>
            <div className="flex items-end gap-1 h-10">
              {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
                <div key={i} className="w-1.5 rounded-full bg-brand-400 dark:bg-brand-500 opacity-60" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <p className="text-3xl font-bold text-ink-900 dark:text-ink-50 tabular-nums">{stats.emails}</p>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">Emails sent</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="text-xs font-medium text-ink-500 dark:text-ink-400">All time</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GrowthChart contacts={contacts} />
        </div>
        <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-ink-900 dark:text-ink-50">Upcoming follow-ups</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400">Next 2 weeks</p>
            </div>
            <button onClick={() => onNavigate('follow-ups')} className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {upcomingFollowups.length > 0 ? (
              upcomingFollowups.map((c) => (
                <FollowUpCard key={c.id} contact={c} onClick={onSelectContact} />
              ))
            ) : (
              <p className="text-sm text-ink-500 dark:text-ink-400 text-center py-8">No upcoming follow-ups</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-ink-900 dark:text-ink-50">Quick actions</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400">Common tasks</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button onClick={onAddContact} className="flex flex-col items-center gap-2 p-4 bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 rounded-xl transition-colors">
              <Plus className="w-5 h-5 text-brand-500" />
              <span className="text-sm font-medium text-brand-600 dark:text-brand-300">Add contact</span>
            </button>
            <button onClick={() => onSendEmail(null)} className="flex flex-col items-center gap-2 p-4 bg-ink-50 dark:bg-ink-700/50 hover:bg-ink-100 dark:hover:bg-ink-700 rounded-xl transition-colors">
              <Mail className="w-5 h-5 text-ink-500 dark:text-ink-300" />
              <span className="text-sm font-medium text-ink-600 dark:text-ink-300">Send email</span>
            </button>
            <button onClick={() => onNavigate('contacts')} className="flex flex-col items-center gap-2 p-4 bg-ink-50 dark:bg-ink-700/50 hover:bg-ink-100 dark:hover:bg-ink-700 rounded-xl transition-colors">
              <ArrowRight className="w-5 h-5 text-ink-500 dark:text-ink-300" />
              <span className="text-sm font-medium text-ink-600 dark:text-ink-300">View contacts</span>
            </button>
            <button onClick={() => onNavigate('follow-ups')} className="flex flex-col items-center gap-2 p-4 bg-ink-50 dark:bg-ink-700/50 hover:bg-ink-100 dark:hover:bg-ink-700 rounded-xl transition-colors">
              <ArrowRight className="w-5 h-5 text-ink-500 dark:text-ink-300" />
              <span className="text-sm font-medium text-ink-600 dark:text-ink-300">Follow-ups</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-ink-900 dark:text-ink-50">Upcoming birthdays</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400">Next 30 days</p>
            </div>
            <button onClick={() => onNavigate('birthdays')} className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {upcomingBirthdays.length > 0 ? (
              upcomingBirthdays.map((c) => (
                <BirthdayCard key={c.id} contact={c} onClick={onSelectContact} />
              ))
            ) : (
              <p className="text-sm text-ink-500 dark:text-ink-400 text-center py-8">No upcoming birthdays</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
