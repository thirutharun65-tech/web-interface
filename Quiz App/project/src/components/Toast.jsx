import { useEffect, useState } from "react";

// Small toast notification system. Usage:
//   const { notify } = useToast();  // via ToastProvider context
// or import the imperative helper:
//   import { toast } from "./Toast";
//   toast.success("Saved");
// The provider renders the stack.

export function toast(message, type = "info") {
  window.dispatchEvent(
    new CustomEvent("quiz-toast", { detail: { message, type } })
  );
}

toast.success = (m) => toast(m, "success");
toast.error = (m) => toast(m, "error");
toast.info = (m) => toast(m, "info");

export default function Toast() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    function handler(e) {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, ...e.detail }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }, 3000);
    }
    window.addEventListener("quiz-toast", handler);
    return () => window.removeEventListener("quiz-toast", handler);
  }, []);

  return (
    <div className="toast-stack">
      {items.map((i) => (
        <div key={i.id} className={`toast toast-${i.type}`}>
          {i.message}
        </div>
      ))}
    </div>
  );
}
