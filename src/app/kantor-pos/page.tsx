import PlaceShell from '@/components/PlaceShell';
import ContactInfo from '@/components/ContactInfo';
import ChatGame from '@/components/games/ChatGame';

export default function Page() {
  return <PlaceShell place="pos" title="Mau bikin sesuatu bareng?" content={<ContactInfo />} game={<ChatGame />} gameFirst />;
}