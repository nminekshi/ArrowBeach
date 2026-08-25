'use client';

import { useEffect, useState } from 'react';
import { Save, Lock, ShieldCheck, User } from 'lucide-react';

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

  const [adminCreds, setAdminCreds] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [credSaving, setCredSaving] = useState(false);
  const [credMessage, setCredMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(r => r.json()),
      fetch('/api/admin/credentials').then(r => r.json()),
    ])
      .then(([settingsData, credsData]) => {
        if (settingsData.settings) {
          setSettings({
            name: settingsData.settings.name || '',
            description: settingsData.settings.description || '',
            tagline: settingsData.settings.tagline || '',
            location: settingsData.settings.location || '',
            phone: settingsData.settings.phone || '',
            phoneDisplay: settingsData.settings.phoneDisplay || '',
            email: settingsData.settings.email || '',
            address: settingsData.settings.address || '',
            whatsapp: settingsData.settings.whatsapp || '',
            mapQuery: settingsData.settings.mapQuery || '',
          });
        }
        if (credsData.admin) {
          setAdminCreds(prev => ({
            ...prev,
            username: credsData.admin.username || '',
            email: credsData.admin.email || '',
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleCredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminCreds({ ...adminCreds, [e.target.name]: e.target.value });
    setCredMessage({ type: '', text: '' });
  };

  const handleSaveSettings = async () => {
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

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredSaving(true);
    setCredMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminCreds),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCredMessage({ type: 'error', text: data.error || 'Failed to update credentials.' });
      } else {
        setCredMessage({ type: 'success', text: 'Admin credentials updated successfully.' });
        setAdminCreds(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      }
    } catch {
      setCredMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setCredSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1 text-base">Update hotel details and manage admin access security.</p>
      </div>

      {/* Admin Security Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">Admin Account & Security</h2>
        </div>

        {credMessage.text && (
          <div className={`p-4 rounded-lg text-sm font-semibold ${
            credMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {credMessage.text}
          </div>
        )}

        <form onSubmit={handleSaveCredentials} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Admin Username</label>
              <div className="relative">
                <input
                  name="username"
                  value={adminCreds.username}
                  onChange={handleCredChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Admin Email</label>
              <input
                name="email"
                type="email"
                value={adminCreds.email}
                onChange={handleCredChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Current Password (Required to change)</label>
              <input
                name="currentPassword"
                type="password"
                value={adminCreds.currentPassword}
                onChange={handleCredChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">New Password (Leave blank to keep current)</label>
              <input
                name="newPassword"
                type="password"
                value={adminCreds.newPassword}
                onChange={handleCredChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={credSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition text-sm shadow-sm disabled:opacity-50"
            >
              <Lock size={16} />
              {credSaving ? 'Updating...' : 'Update Admin Credentials'}
            </button>
          </div>
        </form>
      </div>

      {/* Hotel Information */}
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

      {/* Contact Details */}
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
        <button onClick={handleSaveSettings} disabled={saving} className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-base shadow-sm disabled:opacity-50">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
