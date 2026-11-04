import PlaceShell from '@/components/PlaceShell';
import ProjectList from '@/components/ProjectList';
import MemoryGame from '@/components/games/MemoryGame';

export default function Page() {
  return <PlaceShell place="gudang" title="Yang udah aku bangun." content={<ProjectList />} game={<MemoryGame />} />;
}