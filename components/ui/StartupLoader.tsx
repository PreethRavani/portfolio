"use client";

import { useEffect, useRef, useState } from "react";

export function StartupLoader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const finishRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("portfolio-loader-seen") === "true") {
        const hideTimer = window.setTimeout(() => setVisible(false), 0);
        document.documentElement.classList.add("portfolio-ready");
        window.dispatchEvent(new Event("portfolio:loader-finished"));
        return () => window.clearTimeout(hideTimer);
      }
    } catch {
      // Keep the loader usable when storage is blocked.
    }

    const startedAt = performance.now();
    let pageLoaded = document.readyState === "complete";
    let minimumTimePassed = false;
    let dismissed = false;
    let exitTimer = 0;
    let minimumTimer = 0;
    let safetyTimer = 0;

    const complete = () => {
      if (dismissed) return;
      dismissed = true;
      setExiting(true);
      window.clearTimeout(minimumTimer);
      window.clearTimeout(safetyTimer);
      exitTimer = window.setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem("portfolio-loader-seen", "true");
        } catch {
          // The intro still completes normally when storage is blocked.
        }
        document.documentElement.classList.add("portfolio-ready");
        window.dispatchEvent(new Event("portfolio:loader-finished"));
      }, 240);
    };
    finishRef.current = complete;

    const finishIfReady = () => {
      if (!pageLoaded || !minimumTimePassed || dismissed) return;
      complete();
    };

    const onLoad = () => {
      pageLoaded = true;
      finishIfReady();
    };
    window.addEventListener("load", onLoad, { once: true });

    minimumTimer = window.setTimeout(() => {
      minimumTimePassed = true;
      finishIfReady();
    }, Math.max(850, 1050 - (performance.now() - startedAt)));
    safetyTimer = window.setTimeout(() => {
      pageLoaded = true;
      minimumTimePassed = true;
      finishIfReady();
    }, 2600);

    return () => {
      window.clearTimeout(minimumTimer);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("load", onLoad);
      finishRef.current = () => undefined;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`startup-loader${exiting ? " is-exiting" : ""}`} role="status" aria-label="Loading portfolio">
      <div className="startup-loader__brand" aria-hidden="true">
        <span className="startup-loader__mark">N</span>
        <span>PREETH / PORTFOLIO</span>
      </div>
      <div className="startup-loader__dots" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => <span key={index} />)}
      </div>
      <span className="startup-loader__caption" aria-hidden="true">INITIALIZING EXPERIENCE</span>
      <button className="startup-loader__skip" type="button" onClick={() => finishRef.current()}>
        Skip intro
      </button>
    </div>
  );
}
