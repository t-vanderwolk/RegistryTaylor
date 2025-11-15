"use client";

import { useEffect } from "react";

type BoardEmbedProps = {
  boardUrl: string;
};

export default function BoardEmbed({ boardUrl }: BoardEmbedProps) {
  useEffect(() => {
    const scriptId = "pinterest-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      script.src = "//assets.pinterest.com/js/pinit.js";
      document.body.appendChild(script);
    } else {
      const pinUtils = (window as unknown as { PinUtils?: { build?: () => void } }).PinUtils;
      pinUtils?.build?.();
    }
  }, []);

  return (
    <div className="my-6 overflow-hidden rounded-2xl bg-white/95 p-4 shadow-soft">
      <a
        data-pin-do="embedBoard"
        data-pin-board-width="800"
        data-pin-scale-height="400"
        data-pin-scale-width="80"
        href={boardUrl}
      />
    </div>
  );
}
