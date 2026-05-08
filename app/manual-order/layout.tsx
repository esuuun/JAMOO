import { BagProvider } from '@/src/contexts/BagContext';

export default function ManualOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BagProvider>{children}</BagProvider>;
}
