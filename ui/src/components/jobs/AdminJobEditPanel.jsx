'use client';

import { useState } from 'react';
import { apiFetch } from '../../lib/api';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function AdminJobEditPanel({ jobId, registrationPayload, outcomeMessage, onSaved }) {
  const [payload, setPayload] = useState(registrationPayload || {});
  const [message, setMessage] = useState(outcomeMessage || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setPayload((p) => ({ ...p, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch(`/jobs/${jobId}/admin-edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationPayload: payload, outcomeMessage: message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save');
      }
      setSaved(true);
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5 border-blue-150 bg-blue-50/20">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">✏️</span>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Admin Edit — Job Record</h3>
          <p className="text-sm text-slate-500">Update stored registration details for this completed job.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="First Name" value={payload.firstName || ''} onChange={(v) => handleChange('firstName', v.toUpperCase())} />
          <Field label="Last Name" value={payload.lastName || ''} onChange={(v) => handleChange('lastName', v.toUpperCase())} />
          <Field label="Date of Birth (MMDDYYYY)" value={payload.dateOfBirth || ''} onChange={(v) => handleChange('dateOfBirth', v)} />
          <Field label="Pincode" value={payload.pincode || ''} onChange={(v) => handleChange('pincode', v)} />
          <Field label="Mobile" value={payload.mobile || ''} onChange={(v) => handleChange('mobile', v)} />
          <Field label="Email" value={payload.email || ''} onChange={(v) => handleChange('email', v)} />
        </div>
        <div>
          <label className="text-xs text-slate-600 font-semibold block mb-1">Outcome Message</label>
          <textarea
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 min-h-[72px]"
            value={message}
            onChange={(e) => { setMessage(e.target.value); setSaved(false); }}
          />
        </div>
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        {saved && <p className="text-sm text-green-600 font-medium">Saved successfully.</p>}
        <Button type="submit" loading={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md">
          Save Changes
        </Button>
      </form>
    </Card>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs text-slate-600 font-semibold block mb-1">{label}</label>
      <input
        type="text"
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
