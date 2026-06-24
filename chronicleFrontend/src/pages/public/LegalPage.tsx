import { MinimalFooter, PublicHeader } from '../../layouts/PublicLayout';

export function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const isPrivacy = type === 'privacy';
  const sections = isPrivacy
    ? ['Reader data is used only to deliver subscriptions, analytics, and account services.', 'We minimize collection and retain editorial correspondence only for operational needs.', 'Readers may request deletion or correction through the editorial contact channel.']
    : ['Chronicle content is protected by copyright and may not be redistributed without permission.', 'Comments, tips, and submissions must not include unlawful or knowingly false material.', 'Access to the editorial portal is restricted to authorized team members.'];

  return (
    <>
      <PublicHeader />
      <main className="container-page py-14">
        <article className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 soft-shadow md:p-12">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-secondary">Chronicle Policy</p>
          <h1 className="font-display text-5xl font-bold text-primary">{isPrivacy ? 'Privacy Policy' : 'Terms of Service'}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Static policy preview for the Chronicle News frontend prototype. Final legal language should be reviewed before launch.</p>
          <div className="mt-10 space-y-6">{sections.map((section, index) => <section key={section} className="border-t border-slate-200 pt-6"><h2 className="font-display text-2xl font-bold text-primary">{index + 1}. {isPrivacy ? ['Data Use', 'Retention', 'Reader Rights'][index] : ['Content License', 'Acceptable Use', 'Account Access'][index]}</h2><p className="mt-2 leading-8 text-slate-600">{section}</p></section>)}</div>
        </article>
      </main>
      <MinimalFooter />
    </>
  );
}
