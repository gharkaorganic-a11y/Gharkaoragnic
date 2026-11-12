import React from "react";

const StatCard = ({
  icon,
  label,
  value,
  iconBg = "bg-[#eaf2ff] text-[#2874F0]",
  accentBorder = "border-t-[#2874F0]",
}) => {
  const Icon = icon;
  return (
    <div
      className={`bg-white border border-[#e3e3e3] border-t-[3px] ${accentBorder} rounded-xl p-4 flex items-center gap-3.5 shadow-[0_1px_0_rgba(0,0,0,0.03)]`}>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
        {Icon && <Icon size={18} />}
      </div>
      <div>
        <p className="text-[11px] text-[#616161] font-semibold uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl font-bold text-[#212121] mt-0.5 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
