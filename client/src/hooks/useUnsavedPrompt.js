import { useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export default function useUnsavedPrompt(unsavedChanges) {
  // 🔹 Warn on browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = ""; // required for Chrome/Edge
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  // 🔹 Block react-router navigation
  useEffect(() => {
    if (!unsavedChanges) return;

    const blocker = (tx) => {
      if (window.confirm("⚠️ You have unsaved changes. Leave anyway?")) {
        tx.retry();
      }
    };

    // Access router navigator
    const navigator = window.__REACT_ROUTER_CONTEXT__?.navigator;
    if (navigator?.block) {
      const unblock = navigator.block((tx) => blocker(tx));
      return unblock;
    }
  }, [unsavedChanges]);
}
