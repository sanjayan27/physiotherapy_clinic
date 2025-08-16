"use client";

import { useState, useEffect, useRef } from "react";

// Counter animation hook with cleanup
function useCountUp(target: unknown, duration = 2000) {
  const [count, setCount] = useState(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    let startTime: number | undefined;
    const numericTarget =
      typeof target === "number" ? target : parseInt(target as string, 10);

    const animate = (timestamp: number) => {
      if (startTime === undefined) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * numericTarget));

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [target, duration]);

  return count;
}

// Individual stat item component
type StatItemProps = {
  number: string | number;
  suffix?: string;
  label: string;
  color?: string;
};

const StatItem = ({
  number,
  suffix = "",
  label,
  color = "teal",
}: StatItemProps) => {
  const animatedNumber = useCountUp(parseInt(number as string));

  const getColorClass = (color: string) => {
    switch (color) {
      case "teal":
        return "global-text-color-teal";
      case "green":
        return "global-text-color-teal";
      case "blue":
        return "global-text-color-teal";
      case "cyan":
        return "global-text-color-teal";
      default:
        return "global-text-color-teal";
    }
  };

  return (
    <div className="text-center my-5">
      <div
        className={`text-4xl md:text-5xl lg:text-6xl font-bold ${getColorClass(
          color
        )} mb-2`}
      >
        {animatedNumber}
        {suffix}
      </div>
      <div className="text-gray-600 text-base md:text-lg font-medium">
        {label}
      </div>
    </div>
  );
};

// Main statistics section component
const StatisticsSection = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <StatItem
            number="500"
            suffix="+"
            label="Happy Patients"
            color="teal"
          />
          <StatItem
            number="10"
            suffix="+"
            label="Years Experience"
            color="green"
          />
          <StatItem number="95" suffix="%" label="Success Rate" color="blue" />
          <StatItem
            number="24"
            suffix="/7"
            label="Support Available"
            color="cyan"
          />
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
