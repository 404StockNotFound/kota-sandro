import { Suspense } from 'react';
import Link from 'next/link';
import RedirectNotice from '@/components/RedirectNotice';
import PortfolioNav from '@/components/PortfolioNav';
import ProjectList from '@/components/ProjectList';
import SkillList from '@/components/SkillList';
import JourneyList from '@/components/JourneyList';
import ContactInfo from '@/components/ContactInfo';
import AboutCard from '@/components/AboutCard';
import ChatGame from '@/components/games/ChatGame';

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="flex w-full min-w-0 scroll-mt-24 flex-col gap-4">
    <h2 className="text-[clamp(26px,3.5vw,34px)] font-extrabold tracking-tight">{title}</h2>
    {children}
  </section>
);

export default function Portfolio() {
  return (
    <div className="min-h-screen">
      <PortfolioNav />

      <main className="mx-auto flex max-w-[1100px] flex-col gap-10 px-4 pb-12 pt-6 sm:gap-14 sm:px-6 sm:pb-16 sm:pt-8">
        <Suspense fallback={null}>
          <RedirectNotice />
        </Suspense>
        <Section id="tentang" title="Halo, aku Sandro.">
          <AboutCard />
        </Section>
        <Section id="proyek" title="Proyek"><ProjectList showAll /></Section>
        <Section id="skill" title="Skill"><SkillList /></Section>
        <Section id="perjalanan" title="Perjalanan"><JourneyList showAll /></Section>
        <Section id="kontak" title="Yuk ngobrol.">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* chat: paling atas di HP, kiri di laptop */}
            <div className="flex w-full flex-col items-center gap-3 md:w-[340px] md:flex-none">
              <p className="text-center text-sm font-bold text-slate-500">
                Coba chat aku langsung dari sini 👇
              </p>
              <ChatGame reward={false} />
            </div>

            {/* kontak lain */}
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <p className="text-sm font-bold text-slate-500 md:hidden">Atau langsung hubungi lewat:</p>
              <ContactInfo />
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}