"use client";

import { useEffect, useState } from "react";

type AppLoaderProps = {
  children: React.ReactNode;
};

export default function AppLoader({ children }: AppLoaderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onReady = () => setReady(true);

    if (document.readyState === "complete") {
      setReady(true);
    } else {
      window.addEventListener("load", onReady);
    }

    return () => {
      window.removeEventListener("load", onReady);
    };
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <div className="app-loader" />
      </div>
    );
  }

  return <>{children}</>;
}
