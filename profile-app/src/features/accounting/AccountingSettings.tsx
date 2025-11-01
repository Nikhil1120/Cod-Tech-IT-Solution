import { useEffect, useMemo, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../../lib/storage';

type PaymentMethod = {
  id: string;
  type: 'bank' | 'upi' | 'card';
  label: string;
  details: Record<string, string>;
};

type AccountingState = {
  paymentMethods: PaymentMethod[];
  billingAddress: {
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  autoPayEnabled: boolean;
  invoicePreferences: 'email' | 'app' | 'both';
  notificationPreferences: {
    dueDate: boolean;
    latePayment: boolean;
    receiptConfirmation: boolean;
  };
  taxInformation: { gstNumber: string };
};

const STORAGE_KEY = 'accounting-settings';

const defaultState: AccountingState = {
  paymentMethods: [],
  billingAddress: {
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  },
  autoPayEnabled: false,
  invoicePreferences: 'both',
  notificationPreferences: {
    dueDate: true,
    latePayment: true,
    receiptConfirmation: true,
  },
  taxInformation: { gstNumber: '' },
};

export function AccountingSettings() {
  const [state, setState] = useState<AccountingState>(() => loadFromStorage(STORAGE_KEY, defaultState));
  const [newMethodType, setNewMethodType] = useState<PaymentMethod['type']>('bank');
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    saveToStorage(STORAGE_KEY, state);
  }, [state]);

  const methodSchema = useMemo(() => ({
    bank: ['accountHolder', 'accountNumber', 'ifsc', 'bankName'],
    upi: ['upiId'],
    card: ['cardHolder', 'cardNumber', 'expiry', 'cvv'],
  } as const), []);

  const [methodDraft, setMethodDraft] = useState<Record<string, string>>({});

  function resetDraft() {
    setMethodDraft({});
    setFormError('');
  }

  function addPaymentMethod() {
    const required = methodSchema[newMethodType];
    for (const key of required) {
      if (!methodDraft[key]) {
        setFormError(`Missing field: ${key}`);
        return;
      }
    }
    const id = `${newMethodType}-${Date.now()}`;
    const label = newMethodType === 'bank' ? `${methodDraft.bankName || 'Bank'} •••${(methodDraft.accountNumber || '').slice(-4)}`
      : newMethodType === 'upi' ? `${methodDraft.upiId}`
      : `${methodDraft.cardHolder || 'Card'} •••${(methodDraft.cardNumber || '').slice(-4)}`;

    setState(s => ({ ...s, paymentMethods: [...s.paymentMethods, { id, type: newMethodType, label, details: { ...methodDraft } }] }));
    resetDraft();
  }

  function removePaymentMethod(id: string) {
    setState(s => ({ ...s, paymentMethods: s.paymentMethods.filter(m => m.id !== id) }));
  }

  return (
    <div className="section">
      <h2>Accounting Settings</h2>

      <div className="card">
        <h3>Payment Methods</h3>
        <div className="row">
          {state.paymentMethods.length === 0 && <p className="muted">No payment methods added yet.</p>}
          {state.paymentMethods.map(pm => (
            <div key={pm.id} className="row" style={{ borderBottom: '1px solid #eee', paddingBottom: 12 }}>
              <div><span className="badge">{pm.type.toUpperCase()}</span> {pm.label}</div>
              <div className="actions">
                <button className="secondary" onClick={() => removePaymentMethod(pm.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <label>Add new method</label>
          <select value={newMethodType} onChange={e => setNewMethodType(e.target.value as PaymentMethod['type'])}>
            <option value="bank">Bank Account</option>
            <option value="upi">UPI</option>
            <option value="card">Credit/Debit Card</option>
          </select>
          <div className="row-2">
            {methodSchema[newMethodType].map(field => (
              <div key={field}>
                <label>{field}</label>
                <input value={methodDraft[field] || ''} onChange={e => setMethodDraft({ ...methodDraft, [field]: e.target.value })} />
              </div>
            ))}
          </div>
          {formError && <div className="muted" style={{ color: '#b91c1c' }}>{formError}</div>}
          <div className="actions">
            <button onClick={addPaymentMethod}>Add Method</button>
            <button className="secondary" onClick={resetDraft}>Reset</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Billing Address</h3>
        <div className="row-2">
          <div>
            <label>Name</label>
            <input value={state.billingAddress.name} onChange={e => setState(s => ({ ...s, billingAddress: { ...s.billingAddress, name: e.target.value } }))} />
          </div>
          <div>
            <label>Line 1</label>
            <input value={state.billingAddress.line1} onChange={e => setState(s => ({ ...s, billingAddress: { ...s.billingAddress, line1: e.target.value } }))} />
          </div>
          <div>
            <label>Line 2</label>
            <input value={state.billingAddress.line2} onChange={e => setState(s => ({ ...s, billingAddress: { ...s.billingAddress, line2: e.target.value } }))} />
          </div>
          <div>
            <label>City</label>
            <input value={state.billingAddress.city} onChange={e => setState(s => ({ ...s, billingAddress: { ...s.billingAddress, city: e.target.value } }))} />
          </div>
          <div>
            <label>State</label>
            <input value={state.billingAddress.state} onChange={e => setState(s => ({ ...s, billingAddress: { ...s.billingAddress, state: e.target.value } }))} />
          </div>
          <div>
            <label>ZIP</label>
            <input value={state.billingAddress.zip} onChange={e => setState(s => ({ ...s, billingAddress: { ...s.billingAddress, zip: e.target.value } }))} />
          </div>
          <div>
            <label>Country</label>
            <input value={state.billingAddress.country} onChange={e => setState(s => ({ ...s, billingAddress: { ...s.billingAddress, country: e.target.value } }))} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Auto-Pay Settings</h3>
        <label>
          <input
            type="checkbox"
            checked={state.autoPayEnabled}
            onChange={e => setState(s => ({ ...s, autoPayEnabled: e.target.checked }))}
          /> Enable recurring maintenance auto-debit
        </label>
      </div>

      <div className="card">
        <h3>Invoice Preferences</h3>
        <div className="row">
          <label>
            <input type="radio" name="invoicePref" checked={state.invoicePreferences === 'email'} onChange={() => setState(s => ({ ...s, invoicePreferences: 'email' }))} /> Email only
          </label>
          <label>
            <input type="radio" name="invoicePref" checked={state.invoicePreferences === 'app'} onChange={() => setState(s => ({ ...s, invoicePreferences: 'app' }))} /> App only
          </label>
          <label>
            <input type="radio" name="invoicePref" checked={state.invoicePreferences === 'both'} onChange={() => setState(s => ({ ...s, invoicePreferences: 'both' }))} /> Both
          </label>
        </div>
      </div>

      <div className="card">
        <h3>Notification Preferences</h3>
        <div className="row">
          <label>
            <input type="checkbox" checked={state.notificationPreferences.dueDate} onChange={e => setState(s => ({ ...s, notificationPreferences: { ...s.notificationPreferences, dueDate: e.target.checked } }))} /> Due date alerts
          </label>
          <label>
            <input type="checkbox" checked={state.notificationPreferences.latePayment} onChange={e => setState(s => ({ ...s, notificationPreferences: { ...s.notificationPreferences, latePayment: e.target.checked } }))} /> Late payment alerts
          </label>
          <label>
            <input type="checkbox" checked={state.notificationPreferences.receiptConfirmation} onChange={e => setState(s => ({ ...s, notificationPreferences: { ...s.notificationPreferences, receiptConfirmation: e.target.checked } }))} /> Receipt confirmation
          </label>
        </div>
      </div>

      <div className="card">
        <h3>Tax Information</h3>
        <div className="row-2">
          <div>
            <label>GST Number</label>
            <input placeholder="Optional" value={state.taxInformation.gstNumber} onChange={e => setState(s => ({ ...s, taxInformation: { gstNumber: e.target.value } }))} />
          </div>
        </div>
      </div>
    </div>
  );
}

