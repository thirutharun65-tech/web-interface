import { useApp } from '@/context/AppContext';
import { Bell, Cake, UserCheck, Calendar, Monitor } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';
import SettingRow from './SettingRow';

export default function NotificationSettings() {
  const { notifications, updateNotifications } = useApp();

  const toggle = (key) => updateNotifications({ [key]: !notifications[key] });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink-900 dark:text-ink-50">Notifications</h2>
        <p className="text-sm text-ink-500 dark:text-ink-400">Choose what you want to be notified about.</p>
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6">
        <SettingRow icon={Bell} title="Follow-up reminders" description="Notify me when a follow-up is due.">
          <ToggleSwitch checked={notifications.followUps} onChange={() => toggle('followUps')} />
        </SettingRow>
        <SettingRow icon={Cake} title="Birthday reminders" description="Notify me about upcoming birthdays.">
          <ToggleSwitch checked={notifications.birthdays} onChange={() => toggle('birthdays')} />
        </SettingRow>
        <SettingRow icon={UserCheck} title="Contact updates" description="Notify me when contact information changes.">
          <ToggleSwitch checked={notifications.contactUpdates} onChange={() => toggle('contactUpdates')} />
        </SettingRow>
        <SettingRow icon={Calendar} title="Weekly summary" description="Receive a weekly overview of my network.">
          <ToggleSwitch checked={notifications.weeklySummary} onChange={() => toggle('weeklySummary')} />
        </SettingRow>
        <SettingRow icon={Monitor} title="Desktop notifications" description="Allow browser notifications.">
          <ToggleSwitch checked={notifications.desktopNotifications} onChange={() => toggle('desktopNotifications')} />
        </SettingRow>
      </div>
    </div>
  );
}
