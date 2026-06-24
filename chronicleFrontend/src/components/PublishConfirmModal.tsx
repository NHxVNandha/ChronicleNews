import { useState } from 'react';
import { Icon } from './ui';

export function PublishConfirmModal({
  title,
  onPublish,
  onSchedule,
  onClose,
}: {
  title: string;
  onPublish: () => void;
  onSchedule: (date: string) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'now' | 'schedule'>('now');
  const [scheduleDate, setScheduleDate] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white soft-shadow">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h3 className="font-display text-2xl font-bold text-primary">Confirm Publication</h3>
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-primary" type="button" onClick={onClose}><Icon name="close" /></button>
        </div>
        <div className="space-y-6 p-6">
          <div>
            <p className="text-sm text-slate-500">You are about to publish:</p>
            <p className="mt-2 font-display text-xl font-semibold text-primary">&ldquo;{title}&rdquo;</p>
          </div>
          <div className="flex gap-3 rounded-xl bg-slate-50 p-2">
            <button className={`flex-1 rounded-lg py-3 text-center font-bold transition ${mode === 'now' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-white'}`} type="button" onClick={() => setMode('now')}>Publish Now</button>
            <button className={`flex-1 rounded-lg py-3 text-center font-bold transition ${mode === 'schedule' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-white'}`} type="button" onClick={() => setMode('schedule')}>Schedule</button>
          </div>
          {mode === 'schedule' && (
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">Schedule Date & Time</label>
              <input className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-secondary" type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
            </div>
          )}
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-slate-600"><input className="h-4 w-4 accent-secondary" type="checkbox" defaultChecked /> Send push notification to subscribers</label>
            <label className="flex items-center gap-3 text-sm text-slate-600"><input className="h-4 w-4 accent-secondary" type="checkbox" defaultChecked /> Feature on homepage</label>
            <label className="flex items-center gap-3 text-sm text-slate-600"><input className="h-4 w-4 accent-secondary" type="checkbox" /> Syndicate to partner outlets</label>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
          <button className="rounded-lg border border-slate-200 px-6 py-3 font-bold text-slate-600 hover:bg-slate-50" type="button" onClick={onClose}>Cancel</button>
          <button className="rounded-lg bg-secondary px-6 py-3 font-bold !text-white" type="button" onClick={() => { if (mode === 'now') onPublish(); else onSchedule(scheduleDate); }}>{mode === 'now' ? 'Publish Now' : 'Schedule Publication'}</button>
        </div>
      </div>
    </div>
  );
}
