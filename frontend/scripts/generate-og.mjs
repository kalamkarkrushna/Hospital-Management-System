import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
await mkdir(PUBLIC, { recursive: true });

const fontDir = join(ROOT, "node_modules", "@fontsource", "figtree", "files");
const fonts = [];
for (const w of [400, 500, 600, 700, 800]) {
  fonts.push({ name: "Figtree", data: await readFile(join(fontDir, `figtree-latin-${w}-normal.woff`)), weight: w, style: "normal" });
}

const render = async (el, w, h) => {
  const svg = await satori(el, { width: w, height: h, fonts });
  if (w === 1200) await writeFile(join(PUBLIC, "debug.svg"), svg);
  return new Resvg(svg, { fitTo: { mode: "width", value: w } }).render().asPng();
};

const D = (s, ...c) => ({ type: "div", props: { style: { display: "flex", ...s }, children: c.length === 1 ? c[0] : c } });
const T = (t, s) => D(s, t);
const R = (s, ...c) => D({ flexDirection: "row", ...s }, ...c);
const C = (s, ...c) => D({ flexDirection: "column", ...s }, ...c);

const ACCENT = "#0f9488";
const INK = "#0f172a";
const MUTED = "#64748b";
const FAINT = "#94a3b8";
const BORDER = "#e2e8f0";
const WHITE = "#ffffff";

function buildOG() {
  const stats = [
    { l: "Patients", v: "1,247", d: "+12%" },
    { l: "Doctors", v: "86", d: "+3%" },
    { l: "Appointments", v: "3,891", d: "+18%" },
    { l: "Revenue", v: "$48.2K", d: "+7%" },
  ];
  const bars = [40, 65, 55, 80, 45, 90, 70, 60, 75, 85, 50, 95];
  const nav = ["Dashboard", "Patients", "Doctors", "Appointments", "Billing", "Labs"];

  return D(
    { width: 1200, height: 630, flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", fontFamily: "Figtree" },
    T("Hospital Management System", { fontSize: 42, fontWeight: 700, color: INK, textAlign: "center", lineHeight: "1.1", letterSpacing: "-0.02em" }),
    T("Every patient, appointment, and record in one calm view.", { fontSize: 18, fontWeight: 400, color: MUTED, textAlign: "center", lineHeight: "1.4" }),
    // Browser window
    D(
      { width: 920, height: 380, borderRadius: 14, border: `1px solid ${BORDER}`, backgroundColor: WHITE, flexDirection: "column", marginTop: 8, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" },
      // Chrome
      R({ height: 40, alignItems: "center", backgroundColor: "#f1f5f9", borderBottom: `1px solid ${BORDER}`, paddingLeft: 14, paddingRight: 14, gap: 8 },
        D({ width: 10, height: 10, borderRadius: 10, backgroundColor: "#ef4444" }),
        D({ width: 10, height: 10, borderRadius: 10, backgroundColor: "#f59e0b" }),
        D({ width: 10, height: 10, borderRadius: 10, backgroundColor: "#22c55e" }),
        D({ flex: 1, height: 26, borderRadius: 13, backgroundColor: WHITE, border: `1px solid ${BORDER}`, alignItems: "center", paddingLeft: 12 },
          T("hrm-k.up.railway.app", { fontSize: 11, fontWeight: 500, color: MUTED })
        )
      ),
      // Body
      R({ flex: 1, overflow: "hidden" },
        // Sidebar
        C({ width: 140, backgroundColor: INK, padding: 14, gap: 8 },
          R({ alignItems: "center", gap: 8, marginBottom: 8 },
            D({ width: 22, height: 22, borderRadius: 11, backgroundColor: ACCENT }),
            T("HMS", { fontSize: 13, fontWeight: 700, color: WHITE })
          ),
          ...nav.map((_, i) => D({ height: 12, width: i === 0 ? 90 : 70, borderRadius: 6, backgroundColor: i === 0 ? ACCENT : "rgba(255,255,255,0.15)" })),
          D({ flex: 1 }),
          R({ alignItems: "center", gap: 6 },
            D({ width: 16, height: 16, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.2)" }),
            D({ height: 8, width: 50, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.2)" })
          )
        ),
        // Main
        C({ flex: 1, padding: 16, gap: 14 },
          // Stat cards
          R({ gap: 10 },
            ...stats.map(s => C({ flex: 1, backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 12, gap: 4 },
              T(s.l, { fontSize: 9, fontWeight: 500, color: MUTED }),
              R({ alignItems: "baseline", gap: 4 },
                T(s.v, { fontSize: 16, fontWeight: 700, color: INK }),
                T(s.d, { fontSize: 8, fontWeight: 600, color: "#22c55e" })
              )
            ))
          ),
          // Charts
          R({ flex: 1, gap: 10 },
            C({ flex: 1.3, backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 12, gap: 8 },
              R({ justifyContent: "space-between", alignItems: "center" },
                T("Appointments", { fontSize: 10, fontWeight: 600, color: INK }),
                T("This month", { fontSize: 8, color: FAINT })
              ),
              D({ flex: 1, alignItems: "flex-end", gap: 4, paddingTop: 8 },
                ...bars.map(h => D({ width: "100%", height: `${h}%`, borderRadius: 3, backgroundColor: h > 70 ? ACCENT : "#ccfbf1" }))
              )
            ),
            C({ flex: 1, gap: 10 },
              // Department chart
              C({ flex: 1, backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 12, gap: 6 },
                T("Departments", { fontSize: 10, fontWeight: 600, color: INK }),
                R({ flex: 1, gap: 4, alignItems: "flex-end", paddingTop: 4 },
                  D({ flex: 1, height: "80%", borderRadius: 4, backgroundColor: ACCENT }),
                  D({ flex: 1, height: "55%", borderRadius: 4, backgroundColor: "#3b82f6" }),
                  D({ flex: 1, height: "40%", borderRadius: 4, backgroundColor: "#8b5cf6" })
                ),
                R({ gap: 8, justifyContent: "space-between" },
                  R({ alignItems: "center", gap: 4 }, D({ width: 6, height: 6, borderRadius: 2, backgroundColor: ACCENT }), T("OPD", { fontSize: 7, color: MUTED })),
                  R({ alignItems: "center", gap: 4 }, D({ width: 6, height: 6, borderRadius: 2, backgroundColor: "#3b82f6" }), T("IPD", { fontSize: 7, color: MUTED })),
                  R({ alignItems: "center", gap: 4 }, D({ width: 6, height: 6, borderRadius: 2, backgroundColor: "#8b5cf6" }), T("Lab", { fontSize: 7, color: MUTED }))
                )
              ),
              // Patient list
              D({ height: 80, backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 10, flexDirection: "column", gap: 5 },
                T("Recent Patients", { fontSize: 9, fontWeight: 600, color: INK }),
                ...["Ravi K.", "Priya S.", "Amit M."].map(n =>
                  R({ alignItems: "center", gap: 6 },
                    D({ width: 14, height: 14, borderRadius: 7, backgroundColor: "#ccfbf1" }),
                    T(n, { fontSize: 8, color: MUTED }),
                    D({ flex: 1 }),
                    D({ height: 6, width: 30, borderRadius: 3, backgroundColor: "#22c55e" })
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

function buildIcon(sz) {
  return D(
    { width: sz, height: sz, alignItems: "center", justifyContent: "center", backgroundColor: ACCENT, borderRadius: sz * 0.22 },
    T("H", { fontSize: sz * 0.42, fontWeight: 800, color: WHITE, lineHeight: "1" })
  );
}

function buildLogo(sz) {
  return D(
    { width: sz, height: sz, alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", fontFamily: "Figtree" },
    C({ alignItems: "center", gap: 16 },
      D(
        { width: sz * 0.25, height: sz * 0.25, borderRadius: sz * 0.055, backgroundColor: ACCENT, alignItems: "center", justifyContent: "center" },
        T("H", { fontSize: sz * 0.11, fontWeight: 800, color: WHITE, lineHeight: "1" })
      ),
      C({ alignItems: "center", gap: 4 },
        T("HMS", { fontSize: sz * 0.1, fontWeight: 800, color: INK }),
        T("Hospital Management System", { fontSize: sz * 0.04, fontWeight: 500, color: MUTED })
      )
    )
  );
}

console.log("Generating OG image (1200x630)...");
const og = await render(buildOG(), 1200, 630);
await writeFile(join(PUBLIC, "og-image.png"), og);
console.log(`  -> og-image.png (${(og.length / 1024).toFixed(1)} KB)`);

for (const [name, sz] of [["favicon.png", 48], ["favicon-32.png", 32], ["favicon-16.png", 16], ["apple-touch-icon.png", 180], ["android-chrome-192.png", 192], ["android-chrome-512.png", 512]]) {
  console.log(`Generating ${name}...`);
  const png = await render(buildIcon(sz), sz, sz);
  await writeFile(join(PUBLIC, name), png);
  console.log(`  -> ${name} (${(png.length / 1024).toFixed(1)} KB)`);
}

console.log("Generating logo...");
const logo = await render(buildLogo(512), 512, 512);
await writeFile(join(PUBLIC, "logo.png"), logo);
console.log(`  -> logo.png (${(logo.length / 1024).toFixed(1)} KB)`);

console.log("\nDone.");
