import React from "react";

interface RiskMeterProps {
  riskScore: number; 
}

const RiskMeter: React.FC<RiskMeterProps> = ({ riskScore }) => {
  const calculateColor = (score: number): string => {
    if (score <= 50) {
      const red = Math.floor((255 * score) / 50);
      const green = 255;
      return `rgb(${red}, ${green}, 0)`;
    } else {
      const red = 255;
      const green = Math.floor(255 - ((255 * (score - 50)) / 50));
      return `rgb(${red}, ${green}, 0)`;
    }
  };

  const meterColor = calculateColor(riskScore);
  const barWidth = riskScore === 100 ? "calc(100% - 40px)" : `${riskScore}%`;

  return (
    <div className="flex items-center">
      <div
        className="w-full h-6 bg-gray-300 rounded-full overflow-hidden relative"
        style={{ marginBottom: "8px" }}
      >
              <div style={{ }}>{riskScore}</div>

        <div
          className="h-full"
          style={{
            width: barWidth,
            background: meterColor,
            transition: "width 0.3s ease-in-out",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></div>
      </div>
    </div>
  );
};

export default RiskMeter;

