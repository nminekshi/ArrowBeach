'use client';

import { useEffect, useState } from 'react';
import { Mail, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = () => {
    fetch('/api/messages').then(r => r.json()).then(data => {
      setMessages(data.messages || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (id: string, currentRead: boolean) => {
    await fetch(`/api/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: !currentRead }),
    });
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    fetchMessages();
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-600 mt-1 text-base">
          {messages.length} message{messages.length !== 1 ? 's' : ''} · {unreadCount} unread
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400 text-base">
          <Mail size={48} className="mx-auto mb-4 text-slate-350" />
          No messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg: any) => (
            <div key={msg.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition ${
              msg.read ? 'border-slate-200' : 'border-blue-200 bg-blue-50/30'
            }`}>
              <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => toggleExpand(msg.id)}>
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${msg.read ? 'bg-slate-300' : 'bg-blue-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-base font-semibold ${msg.read ? 'text-slate-700' : 'text-slate-900'}`}>{msg.name}</p>
                    <span className="text-xs text-slate-400">·</span>
                    <p className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-base text-slate-700 font-semibold mt-0.5">{msg.subject || 'No subject'}</p>
                  {expandedId !== msg.id && (
                    <p className="text-sm text-slate-400 mt-1 truncate">{msg.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); toggleRead(msg.id, msg.read); }} className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-400 hover:text-slate-600" title={msg.read ? 'Mark unread' : 'Mark read'}>
                    {msg.read ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }} className="p-2 rounded-lg hover:bg-red-50 transition text-slate-400 hover:text-red-600" title="Delete">
                    <Trash2 size={18} />
                  </button>
                  {expandedId === msg.id ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </div>
              </div>

              {expandedId === msg.id && (
                <div className="px-5 pb-5 pt-0 border-t border-slate-100 ml-6">
                  <div className="flex gap-5 text-sm text-slate-500 mt-4 mb-4">
                    <span>📧 {msg.email}</span>
                    {msg.phone && <span>📞 {msg.phone}</span>}
                  </div>
                  <p className="text-base text-slate-800 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  <div className="mt-4">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your inquiry'}`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Mail size={16} /> Reply via Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
