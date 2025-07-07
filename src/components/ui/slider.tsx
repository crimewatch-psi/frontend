import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbClassName?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, thumbClassName, ...props }, ref) => {
  const [activeThumb, setActiveThumb] = React.useState<number | null>(null);
  const [hoveredThumb, setHoveredThumb] = React.useState<number | null>(null);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={`relative flex w-full touch-none select-none items-center ${className}`}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
        <SliderPrimitive.Range className="absolute h-full bg-gray-900 dark:bg-gray-900" />
      </SliderPrimitive.Track>

      {props.value?.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          onMouseEnter={() => setHoveredThumb(i)}
          onMouseLeave={() => setHoveredThumb(null)}
          onPointerDown={() => setActiveThumb(i)}
          onPointerUp={() => setActiveThumb(null)}
          className={`
            block h-5 w-5 rounded-full bg-gray-900
            shadow-md transition-all
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900
            focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
            ${
              hoveredThumb === i || activeThumb === i
                ? "border-2 border-gray-700"
                : "border-0"
            }
            ${
              hoveredThumb === i || activeThumb === i
                ? "scale-110 shadow-lg"
                : ""
            }
            ${thumbClassName}
          `}
        />
      ))}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
