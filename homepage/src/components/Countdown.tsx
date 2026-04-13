"use client";

import { useEffect, useState } from "react";

function calcDiff(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

const TARGET = new Date("2026-07-18T00:00:00+09:00");

export default function Countdown() {
  const [time, setTime] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const initTimer = setTimeout(() => setTime(calcDiff(TARGET)), 0);
    const id = setInterval(() => setTime(calcDiff(TARGET)), 1000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(id);
    };
  }, []);

  const units = [
    { label: "일", value: time?.days ?? 0 },
    { label: "시간", value: time?.hours ?? 0 },
    { label: "분", value: time?.minutes ?? 0 },
    { label: "초", value: time?.seconds ?? 0 },
  ];

  if (!time) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        {["일", "시간", "분", "초"].map((label) => (
          <div key={label} className="text-center">
            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-white/10 backdrop-blur animate-pulse" />
            <div className="text-xs text-white/70 mt-1">{label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {units.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold font-inter text-white tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <div className="text-xs text-white/70 mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}
