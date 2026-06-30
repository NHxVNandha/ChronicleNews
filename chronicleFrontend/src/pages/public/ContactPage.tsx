import { useEffect, useState } from 'react';
import { Field, Icon } from '../../components/ui';
import { getPublicSiteSettings, type PublicSiteSettings } from '../../services';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';
import { PublicErrorBanner, PublicLoadingBlock } from '../../components/public/PublicAsyncState';

export function ContactPage() {
  const [settings, setSettings] = useState<PublicSiteSettings | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getPublicSiteSettings();
        if (isMounted) setSettings(data);
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load contact details.');
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!settings) {
    return (
      <>
        <PublicHeader />
        <main className="container-page py-14">{error ? <PublicErrorBanner message={error} /> : <PublicLoadingBlock className="h-96" />}</main>
        <MinimalFooter />
      </>
    );
  }

  return (
    <>
      <PublicHeader />
      <main className="container-page py-14">
        <section className="grid gap-10 rounded-2xl bg-white p-8 soft-shadow lg:grid-cols-2 lg:p-12">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-secondary">Contact Editorial</p>
            <h1 className="font-display text-5xl font-bold text-primary">{settings.contactHeading}</h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">{settings.contactSummary}</p>
            <div className="mt-10 space-y-5">
              {[
                ['mail', 'Editorial Desk', settings.editorialEmail],
                ['encrypted', 'Secure Tip Line', settings.secureTipLine],
                ['location_on', 'Headquarters', settings.headquartersAddress],
              ].map(([icon, title, value]) => <div key={title} className="flex gap-4"><span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-50 text-secondary"><Icon name={icon} /></span><div><h2 className="font-bold text-primary">{title}</h2><p className="text-slate-600">{value}</p></div></div>)}
            </div>
          </div>
          <form className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <Field label="Full Name" placeholder="Jane Reader" icon="badge" />
            <Field label="Email" placeholder="jane@example.com" icon="mail" type="email" />
            <label className="block"><span className="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-600">Message</span><textarea className="w-full rounded-lg border border-slate-200 bg-white p-4 outline-none focus:border-secondary" rows={6} placeholder="How can our editorial team help?" /></label>
            <button className="w-full rounded-lg bg-primary py-4 font-bold text-white" type="button">Submit Inquiry</button>
          </form>
        </section>
      </main>
      <MinimalFooter />
    </>
  );
}
