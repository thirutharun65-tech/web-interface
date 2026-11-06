import { useApp } from '@/context/AppContext';
import ContactDetails from '@/components/ContactDetails';

export default function ContactDetailsPage({ contact, onEdit, onDelete, onBack, onSendEmail, onReply, onComposeAgain }) {
  return <ContactDetails contact={contact} onEdit={onEdit} onDelete={onDelete} onBack={onBack} onSendEmail={onSendEmail} onReply={onReply} onComposeAgain={onComposeAgain} />;
}
