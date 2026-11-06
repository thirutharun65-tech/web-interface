import { useState, useMemo } from 'react';
import { Menu } from 'lucide-react';
import { AppProvider, useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ToastContainer from '@/components/Toast';
import Modal from '@/components/Modal';
import ContactForm from '@/components/ContactForm';
import EmailComposer from '@/components/EmailComposer';
import ContactPicker from '@/components/ContactPicker';
import Dashboard from '@/pages/Dashboard';
import Contacts from '@/pages/Contacts';
import FollowUps from '@/pages/FollowUps';
import Birthdays from '@/pages/Birthdays';
import Favorites from '@/pages/Favorites';
import Groups from '@/pages/Groups';
import Activity from '@/pages/Activity';
import ImportExport from '@/pages/ImportExport';
import ContactDetailsPage from '@/pages/ContactDetailsPage';
import Settings from '@/pages/Settings';
import HelpCenter from '@/pages/HelpCenter';
import EmailHistoryPage from '@/pages/EmailHistoryPage';

function AppContent() {
  const { contacts, addContact, updateContact, deleteContact, showToast } = useApp();
  const [page, setPage] = useState('overview');
  const [selectedContact, setSelectedContact] = useState(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState(null);
  const [emailReplyData, setEmailReplyData] = useState(null);

  const handleNavigate = (id) => {
    setPage(id);
    setSelectedContact(null);
  };

  const handleSelectContact = (contact) => {
    const fresh = contacts.find((c) => c.id === contact.id) || contact;
    setSelectedContact(fresh);
  };

  const handleAddContact = () => {
    setShowAdd(true);
  };

  const handleEditContact = (contact) => {
    const fresh = contacts.find((c) => c.id === contact.id) || contact;
    setEditTarget(fresh);
  };

  const handleDeleteContact = (contact) => {
    setDeleteTarget(contact);
  };

  const handleSaveNew = (formData) => {
    addContact(formData);
    showToast('Contact added successfully');
    setShowAdd(false);
  };

  const handleSaveEdit = (formData) => {
    if (editTarget) {
      updateContact(editTarget.id, formData);
      showToast('Contact updated successfully');
      setEditTarget(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteContact(deleteTarget.id);
      showToast('Contact deleted successfully');
      setDeleteTarget(null);
      if (selectedContact && selectedContact.id === deleteTarget.id) {
        setSelectedContact(null);
      }
    }
  };

  const handleSendEmailDirect = (contact) => {
    if (!contact || !contact.email) {
      showToast('This contact does not have an email address', 'error');
      return;
    }
    setEmailRecipients([contact]);
    setEmailReplyData(null);
  };

  const handleSendEmailPicker = () => {
    setShowContactPicker(true);
  };

  const handlePickerContinue = (selectedContacts) => {
    setShowContactPicker(false);
    setEmailRecipients(selectedContacts);
    setEmailReplyData(null);
  };

  const handleEmailReply = (email) => {
    const replyContact = email.recipients && email.recipients.length > 0
      ? contacts.find((c) => c.id === email.recipients[0].id) || { email: email.recipients[0].email, firstName: email.recipients[0].name?.split(' ')[0] || '', lastName: email.recipients[0].name?.split(' ').slice(1).join(' ') || '', id: email.recipients[0].id }
      : contacts.find((c) => c.id === email.contactId) || { email: email.to };
    setEmailRecipients([replyContact]);
    setEmailReplyData({
      subject: email.subject?.startsWith('Re:') ? email.subject : `Re: ${email.subject || ''}`,
      message: '',
    });
  };

  const handleComposeAgain = (email) => {
    const composeContact = email.recipients && email.recipients.length > 0
      ? contacts.find((c) => c.id === email.recipients[0].id) || { email: email.recipients[0].email, firstName: email.recipients[0].name?.split(' ')[0] || '', lastName: email.recipients[0].name?.split(' ').slice(1).join(' ') || '', id: email.recipients[0].id }
      : contacts.find((c) => c.id === email.contactId) || { email: email.to };
    setEmailRecipients([composeContact]);
    setEmailReplyData({
      subject: email.subject || '',
      message: email.messagePreview || '',
    });
  };

  const handleEmailSent = () => {
    if (selectedContact) {
      setSelectedContact(contacts.find((c) => c.id === selectedContact.id) || selectedContact);
    }
  };

  const renderPage = () => {
    if (selectedContact) {
      return (
        <ContactDetailsPage
          contact={selectedContact}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onBack={() => setSelectedContact(null)}
          onSendEmail={handleSendEmailDirect}
          onReply={handleEmailReply}
          onComposeAgain={handleComposeAgain}
        />
      );
    }

    switch (page) {
      case 'overview':
        return <Dashboard onNavigate={handleNavigate} onSelectContact={handleSelectContact} onAddContact={handleAddContact} onSendEmail={handleSendEmailPicker} />;
      case 'contacts':
        return <Contacts onSelectContact={handleSelectContact} onEditContact={handleEditContact} onSendEmail={handleSendEmailDirect} />;
      case 'follow-ups':
        return <FollowUps onSelectContact={handleSelectContact} />;
      case 'birthdays':
        return <Birthdays onSelectContact={handleSelectContact} />;
      case 'favorites':
        return <Favorites onSelectContact={handleSelectContact} onEditContact={handleEditContact} onDelete={handleDeleteContact} onSendEmail={handleSendEmailDirect} />;
      case 'groups':
        return <Groups />;
      case 'activity':
        return <Activity />;
      case 'import-export':
        return <ImportExport />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <HelpCenter />;
      case 'email-history':
        return <EmailHistoryPage onReply={handleEmailReply} onComposeAgain={handleComposeAgain} />;
      default:
        return <Dashboard onNavigate={handleNavigate} onSelectContact={handleSelectContact} onAddContact={handleAddContact} onSendEmail={handleSendEmailPicker} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
      <Sidebar
        active={selectedContact ? 'contacts' : page}
        onNavigate={handleNavigate}
        mobileOpen={mobileSidebar}
        onCloseMobile={() => setMobileSidebar(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onNavigate={handleNavigate} onSelectContact={handleSelectContact} />
        <button
          onClick={() => setMobileSidebar(true)}
          className="lg:hidden fixed bottom-5 right-5 z-30 w-12 h-12 bg-brand-500 text-white rounded-full shadow-float flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {renderPage()}
        </main>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add new contact" size="lg">
        <ContactForm onSave={handleSaveNew} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit contact" size="lg">
        {editTarget && <ContactForm initial={editTarget} isEdit onSave={handleSaveEdit} onCancel={() => setEditTarget(null)} />}
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete contact?" size="sm">
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">
          Are you sure you want to permanently delete {deleteTarget ? `${deleteTarget.firstName} ${deleteTarget.lastName}` : 'this contact'}? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleConfirmDelete} className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">Delete contact</button>
        </div>
      </Modal>

      {showContactPicker && (
        <ContactPicker
          onContinue={handlePickerContinue}
          onClose={() => setShowContactPicker(false)}
        />
      )}

      {emailRecipients && (
        <EmailComposer
          contacts={emailRecipients}
          replyData={emailReplyData}
          onClose={() => { setEmailRecipients(null); setEmailReplyData(null); }}
          onSent={handleEmailSent}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
