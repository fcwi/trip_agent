/* eslint-disable react-refresh/only-export-components -- Isolated browser fixture exposes a mount entry point. */
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { PwaNotice } from "../../src/components/PwaUpdatePrompt.jsx";

function Fixture() {
  const [visible, setVisible] = useState(true);
  const [updating, setUpdating] = useState(false);
  return visible ? (
    <PwaNotice
      needRefresh
      isUpdating={updating}
      onDismiss={() => setVisible(false)}
      onUpdate={() => setUpdating(true)}
    />
  ) : null;
}
export function mountNotice() {
  document.getElementById("root")?.remove();
  const host = document.createElement("div");
  host.style.transform = "translateX(100px)";
  host.style.overflow = "hidden";
  document.body.append(host);
  createRoot(host).render(<Fixture />);
}
