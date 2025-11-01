import { useMemo, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../../lib/storage';

type Ticket = { id: string; subject: string; description: string; status: 'open' | 'in_progress' | 'closed' };
const STORAGE_KEY = 'support-tickets';

const defaultFaqs = [
  { q: 'How to pay bills?', a: 'Go to Accounting Settings → Add payment method → Enable auto-pay or pay manually.' },
  { q: 'How to book amenities?', a: 'Use the Amenities module in the main app (not part of this demo).' },
  { q: 'Login issues?', a: 'Reset your password from the login screen or contact support.' },
  { q: 'Billing queries?', a: 'Check invoice preferences and notification settings in Accounting.' },
];

export function HelpSupport() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>(() => loadFromStorage(STORAGE_KEY, [] as Ticket[]));

  function submitTicket() {
    if (!subject || !description) return;
    const id = `T${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const newTicket: Ticket = { id, subject, description, status: 'open' };
    const next: Ticket[] = [...tickets, newTicket];
    setTickets(next);
    saveToStorage(STORAGE_KEY, next);
    setSubject('');
    setDescription('');
  }

  function advanceStatus(id: string) {
    const computeNextStatus = (s: Ticket['status']): Ticket['status'] => (s === 'open' ? 'in_progress' : 'closed');
    const next: Ticket[] = tickets.map(t => (t.id === id ? { ...t, status: computeNextStatus(t.status) } : t));
    setTickets(next);
    saveToStorage(STORAGE_KEY, next);
  }

  const emergencyContacts = useMemo(() => ([
    { label: 'Security Desk', value: '+91-99999-11111' },
    { label: 'Maintenance', value: '+91-99999-22222' },
    { label: 'Society Office', value: '+91-99999-33333' },
  ]), []);

  return (
    <div className="section">
      <h2>Help & Support</h2>

      <div className="card">
        <h3>FAQs</h3>
        <div className="row">
          {defaultFaqs.map((f, i) => (
            <details key={i}>
              <summary><strong>{f.q}</strong></summary>
              <p className="muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Contact Support</h3>
        <div className="row">
          <div>Email: <a href="mailto:support@example.com">support@example.com</a></div>
          <div>Phone: <a href="tel:+919999900000">+91-99999-00000</a></div>
          <div>WhatsApp: <a href="https://wa.me/919999900000" target="_blank" rel="noreferrer">Chat on WhatsApp</a></div>
        </div>
      </div>

      <div className="card">
        <h3>Ticketing System</h3>
        <div className="row">
          <label>Subject</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} />
          <label>Description</label>
          <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} />
          <div className="actions">
            <button onClick={submitTicket} disabled={!subject || !description}>Raise Ticket</button>
          </div>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <h4>My Tickets</h4>
          {tickets.length === 0 && <p className="muted">No tickets yet.</p>}
          {tickets.map(t => (
            <div key={t.id} className="row" style={{ borderBottom: '1px solid #eee', paddingBottom: 12 }}>
              <div><span className="badge">{t.status}</span> {t.id} — {t.subject}</div>
              <div className="muted">{t.description}</div>
              {t.status !== 'closed' && <div className="actions"><button className="secondary" onClick={() => advanceStatus(t.id)}>Advance Status</button></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Community Guides</h3>
        <ul>
          <li>How to pay bills</li>
          <li>How to book amenities</li>
          <li>How to raise complaints</li>
        </ul>
      </div>

      <div className="card">
        <h3>Emergency Contacts</h3>
        <ul>
          {emergencyContacts.map((c, i) => <li key={i}><strong>{c.label}:</strong> {c.value}</li>)}
        </ul>
      </div>

      <div className="card">
        <h3>Live Chatbot (optional)</h3>
        <p className="muted">Placeholder — integrate a chatbot provider here.</p>
      </div>
    </div>
  );
}

