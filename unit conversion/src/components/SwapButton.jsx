import { useState } from "react";

export default function SwapButton({ onSwap }) {
  const [spinning, setSpinning] = useState(false);

  const handleClick = () => {
    onSwap();
    setSpinning(true);
    window.setTimeout(() => setSpinning(false), 200);
  };

  return (
    <button
      type="button"
      className={`swap-button${spinning ? " spin" : ""}`}
      onClick={handleClick}
      aria-label="Swap from and to units"
      title="Swap units"
    >
      <span aria-hidden="true">⇄</span>
    </button>
  );
}
