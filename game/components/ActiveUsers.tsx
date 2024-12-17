import { Circle } from 'lucide-react';

export default function ActiveUsers({ userCount }: { userCount: number }) {
  return (
    <div className="mr-auto">
      <p className="mx-auto text-[10px] font-bold text-muted-foreground">v0.0.1</p>
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        <Circle fill="green" size={10} />
        <span>{userCount} Online</span>
      </div>
    </div>
  );
}
