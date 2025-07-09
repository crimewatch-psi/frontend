import { Spinner as SpinnerHeroui } from "@heroui/spinner";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <SpinnerHeroui
      variant="wave"
      className={cn("h-4 w-4 animate-spin", className)}
    />
  );
}
