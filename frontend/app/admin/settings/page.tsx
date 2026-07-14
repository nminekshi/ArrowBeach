'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: '',
    description: '',
    tagline: '',
    location: '',
    phone: '',
    phoneDisplay: '',
    email: '',
    address: '',
    whatsapp: '',
    mapQuery: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data.settings) {
        setSettings({
          name: data.settings.name || '',
          description: data.settings.description || '',
          tagline: data.settings.tagline || '',
          location: data.settings.location || '',
          phone: data.settings.phone || '',
          phoneDisplay: data.settings.phoneDisplay || '',
          email: data.settings.email || '',
          address: data.settings.address || '',
          whatsapp: data.settings.whatsapp || '',
          mapQuery: data.settings.mapQuery || '',
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1 text-base">Update your hotel information displayed on the website.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Hotel Information</h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-base font-semibold text-slate-700 block mb-2">Hotel Name</label>
            <input name="name" value={settings.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
          </div>
          <div>
            <label className="text-base font-semibold text-slate-700 block mb-2">Tagline</label>
            <input name="tagline" value={settings.tagline} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
          </div>
        </div>

        <div>
          <label className="text-base font-semibold text-slate-700 block mb-2">Description</label>
          <textarea name="description" value={settings.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none" />
        </div>

        <div>
          <label className="text-base font-semibold text-slate-700 block mb-2">Location</label>
          <input name="location" value={settings.location} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Contact Details</h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-base font-semibold text-slate-700 block mb-2">Phone Number</label>
            <input name="phone" value={settings.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
          </div>
          <div>
            <label className="text-base font-semibold text-slate-700 block mb-2">Display Phone</label>
            <input name="phoneDisplay" value={settings.phoneDisplay} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-base font-semibold text-slate-700 block mb-2">Email</label>
            <input name="email" type="email" value={settings.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
          </div>
          <div>
            <label className="text-base font-semibold text-slate-700 block mb-2">WhatsApp (number only)</label>
            <input name="whatsapp" value={settings.whatsapp} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" placeholder="94775290351" />
          </div>
        </div>

        <div>
          <label className="text-base font-semibold text-slate-700 block mb-2">Full Address</label>
          <input name="address" value={settings.address} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
        </div>

        <div>
          <label className="text-base font-semibold text-slate-700 block mb-2">Google Maps Query</label>
          <input name="mapQuery" value={settings.mapQuery} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-base text-green-600 font-semibold">✓ Settings saved successfully</span>}
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-base shadow-sm disabled:opacity-50">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
