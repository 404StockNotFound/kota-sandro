import PlaceShell from '@/components/PlaceShell';
import JourneyList from '@/components/JourneyList';
import TollGame from '@/components/games/TollGame';

export default function Page() {
  return <PlaceShell place="tol" title="Perjalananku sejauh ini." content={<JourneyList />} game={<TollGame />} />;
}