import { useEffect, useState } from 'react';
import { Icon, ImagePanel } from '../../components/ui';
import { getPublicSiteSettings, type PublicSiteSettings } from '../../services';
import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';
import { PublicErrorBanner, PublicLoadingBlock } from '../../components/public/PublicAsyncState';

export function AboutPage() {
  const [settings, setSettings] = useState<PublicSiteSettings | null>(null);
  const [error, setError] = useState('');

  const team = [
    { role: 'Editor-in-Chief', name: 'Eleanor Vance', bio: 'Three-decade veteran of investigative reporting and former foreign correspondent.', className: 'md:col-span-2 md:row-span-2', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1000&q=85' },
    { role: 'Managing Editor', name: 'Julian Thorne', className: 'md:col-span-2', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85' },
    { role: 'Arts & Culture', name: 'Sasha Grey', className: '', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85' },
    { role: 'Tech & Science', name: 'Marcus Chen', className: '', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85' },
  ];

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getPublicSiteSettings();
        if (isMounted) setSettings(data);
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load about page.');
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
      <main className="w-full overflow-x-hidden">
        <section className="relative flex h-[716px] items-center justify-center overflow-hidden bg-white"><div className="absolute inset-0 opacity-20"><ImagePanel image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1800&q=85" className="h-full w-full grayscale" /></div><div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#f7f9fb]" /><div className="relative z-10 max-w-4xl px-6 text-center"><span className="mb-3 block text-sm font-bold uppercase tracking-[0.25em] text-secondary">Established 1924</span><h1 className="font-display mb-6 text-5xl font-bold leading-tight text-primary md:text-6xl">{settings.aboutHeadline}</h1><p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">{settings.aboutSummary}</p></div></section>
        <section className="bg-[#f7f9fb] px-6 py-16 md:py-24"><div className="mx-auto grid max-w-[1280px] items-center gap-12 md:grid-cols-12"><div className="md:col-span-5"><div className="group relative"><div className="absolute -inset-4 rounded-xl bg-secondary/10 blur-2xl transition group-hover:bg-secondary/20" /><img className="relative z-10 aspect-[4/5] w-full rounded-lg object-cover grayscale shadow-xl transition duration-700 hover:grayscale-0" src="https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=900&q=85" alt="Vintage printing press" /></div></div><div className="md:col-span-7 md:pl-12"><h2 className="font-display mb-6 text-4xl font-bold text-primary">{settings.missionTitle}</h2><div className="space-y-6"><p className="text-lg leading-8 text-slate-600">{settings.missionBody}</p><p className="leading-7 text-slate-600">{settings.missionBodySecondary}</p><div className="flex gap-12 border-t border-slate-200 pt-8"><div><p className="font-display text-5xl font-bold text-primary">42</p><p className="text-sm font-bold uppercase tracking-widest text-slate-500">Pulitzer Prizes</p></div><div><p className="font-display text-5xl font-bold text-primary">150+</p><p className="text-sm font-bold uppercase tracking-widest text-slate-500">Global Bureau</p></div></div></div></div></div></section>
        <section className="bg-slate-100 px-6 py-16 md:py-24"><div className="mx-auto max-w-[1280px]"><div className="mb-12 text-center"><h2 className="font-display text-4xl font-bold text-primary">The Editorial Desk</h2><p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">{settings.editorialDeskSummary}</p></div><div className="grid h-auto grid-cols-1 gap-6 md:h-[800px] md:grid-cols-4 md:grid-rows-2">{team.map((member) => <div key={member.name} className={`group relative overflow-hidden rounded-xl bg-white shadow-sm ${member.className}`}><img className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" src={member.image} alt={member.name} /><div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/90 via-transparent to-transparent p-6"><span className="mb-1 text-sm font-bold uppercase tracking-widest text-blue-200">{member.role}</span><h3 className="font-display text-3xl font-semibold text-white">{member.name}</h3>{member.bio && <p className="mt-2 line-clamp-2 text-white/70 opacity-0 transition duration-500 group-hover:opacity-100">{member.bio}</p>}</div></div>)}</div></div></section>
        <section className="bg-white px-6 py-16 md:py-24"><div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-2"><div><h2 className="font-display mb-6 text-4xl font-bold text-primary">Connect With Us</h2><p className="max-w-md leading-7 text-slate-600">{settings.contactSummary}</p><div className="mt-12 space-y-6">{[['mail', 'Editorial Inquiries', settings.editorialEmail], ['location_on', 'Headquarters', settings.headquartersAddress], ['encrypted', 'Secure Tip Line', settings.secureTipLine]].map(([icon, title, value]) => <div key={title} className="flex items-start gap-4"><div className="rounded-lg bg-blue-100 p-3 text-primary"><Icon name={icon} /></div><div><h4 className="font-bold text-primary">{title}</h4><p className="text-slate-600">{value}</p></div></div>)}</div></div><div className="rounded-xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur lg:p-8"><form className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-1 block font-bold text-slate-600">Full Name</span><input className="w-full rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-secondary focus:ring-2 focus:ring-blue-100" placeholder="John Doe" /></label><label className="block"><span className="mb-1 block font-bold text-slate-600">Email Address</span><input className="w-full rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-secondary focus:ring-2 focus:ring-blue-100" placeholder="john@example.com" type="email" /></label></div><label className="block"><span className="mb-1 block font-bold text-slate-600">Department</span><select className="w-full rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-secondary focus:ring-2 focus:ring-blue-100"><option>General Editorial</option><option>Investigations</option><option>Press & Media</option><option>Audience</option></select></label><label className="block"><span className="mb-1 block font-bold text-slate-600">Message</span><textarea className="w-full rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-secondary focus:ring-2 focus:ring-blue-100" rows={5} placeholder="Tell us how we can help." /></label><button className="w-full rounded-lg bg-primary px-6 py-4 font-bold text-white">Send Message</button></form></div></div></section>
      </main>
      <MinimalFooter text="Journalism of integrity and depth since 1924. Committed to the pursuit of truth." />
    </>
  );
}
