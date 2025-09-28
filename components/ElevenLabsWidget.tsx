// "use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ElevenLabsWidget() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if we should show the widget after hydration
    setShouldShow(pathname !== "/dashboard/chat");
  }, [pathname]);

  useEffect(() => {
    if (!isClient || !shouldShow) return;

    // Load the ElevenLabs script dynamically
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    document.body.appendChild(script);

    // Create the widget element
    const widget = document.createElement("elevenlabs-convai");
    widget.setAttribute("agent-id", "agent_0701k4ys2srwe4m852x1z5x4yzc1--");
    document.body.appendChild(widget);

    return () => {
      // Cleanup
      if (document.body.contains(widget)) {
        document.body.removeChild(widget);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isClient, shouldShow]);

  // Don't render anything on server or if we shouldn't show
  if (!isClient || !shouldShow) {
    return null;
  }

  return null;
}
