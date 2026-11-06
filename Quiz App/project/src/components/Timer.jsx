import { useEffect, useRef, useState } from "react";

// Countdown timer. Calls onExpire() when it reaches zero.
export default function Timer({ seconds, onExpire, running = true }) {
  const [remaining, setRemaining] = useState(seconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          onExpireRef.current?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const danger = remaining <= 30;

  return (
    <div className={`timer ${danger ? "timer-danger" : ""}`}>
      <span className="timer-label">Time Remaining</span>
      <span className="timer-value">
        {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}
