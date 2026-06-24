import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './ui';

type SuggestionStatus = 'open' | 'applied' | 'ignored';

type Suggestion = {
  issue: string;
  original: string;
  suggestion: string;
  reason: string;
  status: SuggestionStatus;
};

export function AiEditorialAssistant() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { issue: 'Kata tidak baku', original: 'aktifitas', suggestion: 'aktivitas', reason: 'Bentuk baku menurut KBBI.', status: 'open' },
    { issue: 'Gaya kurang formal', original: 'di era digital ini', suggestion: 'pada era digital ini', reason: 'Lebih sesuai untuk gaya jurnalistik formal.', status: 'open' },
  ]);

  const actions = ['Check KBBI', 'Fix Grammar', 'Check 5W+1H', 'Improve Headline', 'Generate Summary', 'SEO Suggestion'];
  const checks = [
    { label: 'KBBI checked', action: 'Check KBBI' },
    { label: 'Grammar checked', action: 'Fix Grammar' },
    { label: 'Editorial tone checked', action: 'Improve Headline' },
  ];

  function runAction(action: string) {
    setActiveAction(action);

    if (action === 'Check KBBI') {
      setCheckedItems((current) => Array.from(new Set([...current, 'Check KBBI'])));
      setSuggestions((current) => current.map((item) => item.original === 'aktifitas' ? { ...item, status: 'open' } : item));
      return;
    }

    if (action === 'Fix Grammar') {
      setCheckedItems((current) => Array.from(new Set([...current, 'Fix Grammar'])));
      return;
    }

    if (action === 'Improve Headline') {
      setCheckedItems((current) => Array.from(new Set([...current, 'Improve Headline'])));
    }
  }

  function updateSuggestion(original: string, status: SuggestionStatus) {
    setSuggestions((current) => current.map((item) => item.original === original ? { ...item, status } : item));
  }

  const openSuggestions = suggestions.filter((item) => item.status === 'open');
  const resolvedCount = suggestions.length - openSuggestions.length;

  return (
    <section className="rounded-xl border border-blue-100 bg-blue-50 p-4">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-white"><Icon name="auto_fix_high" /></span>
        <div>
          <h3 className="font-bold text-primary">AI Editorial Assistant</h3>
          <p className="text-sm leading-6 text-slate-600">Koreksi bahasa Indonesia sesuai KBBI, tata bahasa, dan gaya jurnalistik.</p>
        </div>
      </div>
      <div className="mb-4 space-y-2">
        {checks.map((item) => {
          const isChecked = checkedItems.includes(item.action);
          return <div key={item.label} className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Icon name={isChecked ? 'check_circle' : 'radio_button_unchecked'} className={`text-base ${isChecked ? 'text-emerald-600' : 'text-slate-400'}`} />{isChecked ? item.label : item.label.replace(' checked', ' not checked')}</div>;
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((item, index) => <button key={item} className={`rounded-lg px-3 py-2 text-xs font-bold ${activeAction === item || index === 0 ? 'bg-primary text-white' : 'bg-white text-primary'}`} type="button" onClick={() => runAction(item)}>{item}</button>)}
      </div>
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Mock Suggestions</p><span className="text-xs font-bold text-slate-500">{resolvedCount}/{suggestions.length} resolved</span></div>
        {openSuggestions.length ? openSuggestions.map((item) => <article key={item.original} className="rounded-lg bg-white p-3 text-sm"><div className="mb-2 flex items-center justify-between gap-2"><span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">{item.issue}</span><div className="flex gap-1"><button className="rounded bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700" type="button" onClick={() => updateSuggestion(item.original, 'applied')}>Apply</button><button className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600" type="button" onClick={() => updateSuggestion(item.original, 'ignored')}>Ignore</button></div></div><p><span className="font-bold text-red-600">{item.original}</span> &rarr; <span className="font-bold text-emerald-700">{item.suggestion}</span></p><p className="mt-1 text-xs leading-5 text-slate-500">{item.reason}</p></article>) : <div className="rounded-lg bg-white p-4 text-sm font-semibold text-emerald-700"><Icon name="task_alt" className="mr-2 align-middle text-base" />All suggestions resolved.</div>}
        {suggestions.some((item) => item.status !== 'open') && <div className="space-y-2 rounded-lg bg-white/70 p-3">{suggestions.filter((item) => item.status !== 'open').map((item) => <div key={item.original} className="flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-slate-600">{item.original} → {item.suggestion}</span><span className={`rounded-full px-2 py-1 font-bold ${item.status === 'applied' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{item.status === 'applied' ? 'Applied' : 'Ignored'}</span></div>)}</div>}
      </div>
      <Link className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-primary" to="/admin/optimization"><Icon name="settings" className="text-base" /> Optimization Settings</Link>
    </section>
  );
}
