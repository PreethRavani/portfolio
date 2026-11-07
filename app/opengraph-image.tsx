import { ImageResponse } from "next/og";

export const alt = "Preeth Ravani — Full-Stack Developer and Engineering Student";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#050505", color: "#f4f4f4", fontFamily: "Arial, sans-serif", position: "relative" }}>
        <div style={{ position: "absolute", inset: 32, border: "1px solid #232323", display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#a0a0a0", fontSize: 20, letterSpacing: 5 }}>
          <span aria-hidden="true" style={{ width: 18, height: 18, background: "#ff3b30", transform: "rotate(45deg)" }} /> PREETH / PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 92, lineHeight: 1, fontWeight: 700, letterSpacing: -4 }}>DESIGN. CODE.</div>
          <div style={{ fontSize: 92, lineHeight: 1, fontWeight: 700, letterSpacing: -4, color: "#050505", WebkitTextStroke: "2px #f4f4f4" }}>CREATE.</div>
          <div style={{ marginTop: 18, color: "#9a9a9a", fontSize: 25 }}>Full-Stack Developer · Engineering Student · Mumbai, India</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          {[0, 1, 2, 3, 4].map((dot) => <span key={dot} style={{ width: 9, height: 9, borderRadius: 99, background: "#ff3b30" }} />)}
        </div>
      </div>
    ),
    size,
  );
}
