import { Circle } from 'lucide-react';

export default function ActiveUsers({ userCount }: { userCount: number }) {
  return (
    <div className="mr-auto flex items-center justify-center gap-2 text-sm font-medium">
      <Circle fill="green" size={10} />
      <span>{userCount} Online</span>
    </div>
  );
}
