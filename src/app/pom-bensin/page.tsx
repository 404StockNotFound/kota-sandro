import PlaceShell from '@/components/PlaceShell';
import SkillList from '@/components/SkillList';
import FuelGame from '@/components/games/FuelGame';

export default function Page() {
  return <PlaceShell place="bensin" title="Bahan bakar kerjaku." content={<SkillList />} game={<FuelGame />} />;
}