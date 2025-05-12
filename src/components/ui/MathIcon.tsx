
import { cn } from '@/lib/utils';

type MathIconProps = {
  symbol: string;
  className?: string;
};

const MathIcon = ({ symbol, className }: MathIconProps) => {
  return (
    <div className={cn(
      "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-umat-yellow to-umat-green p-0.5",
      className
    )}>
      <div className="bg-white dark:bg-gray-900 rounded-full h-full w-full flex items-center justify-center p-2">
        <span className="text-lg font-bold" dangerouslySetInnerHTML={{ __html: symbol }} />
      </div>
    </div>
  );
};

export default MathIcon;
