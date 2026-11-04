import PlaceShell from '@/components/PlaceShell';
import AboutCard from '@/components/AboutCard';
import PaintGame from '@/components/games/PaintGame';

export default function Page() {
  return <PlaceShell place="garasi" title="Halo, aku Sandro." content={<AboutCard />} game={<PaintGame />} />;
}