import { useState } from "react";

export default function useSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const show = (msg) => {
    setMessage(msg);
    setOpen(true);
  };

  const close = () => setOpen(false);

  return { open, message, show, close };
}
