import React from "react";
import PremiumDigitCard from "./PremiumDigitCard";

interface PremiumTimeUnitProps {
  value: number;
  label: string;
}

const PremiumTimeUnit: React.FC<PremiumTimeUnitProps> = ({ value, label }) => {
  const digits = value.toString().padStart(2, "0").split("");

  return (
    <div className="flex gap-0.5 sm:gap-2 md:gap-3">
      {digits.map((digit, index) => (
        <PremiumDigitCard
          key={`${label}-${index}`}
          digit={digit}
          label={index === 1 ? label : ""}
        />
      ))}
    </div>
  );
};

export default PremiumTimeUnit;
