// File: src/components/globe/LanguageGlobe.tsx

import { useEffect, useRef, useState } from "react";
import styles from "./LanguageGlobe.module.css";

// Map language codes to country names and neon colors
const LANGUAGE_COUNTRY_MAP: Record<
  string,
  {
    country: string;
    displayName: string;
    color: string;
    glowColor: string;
  }
> = {
  de: {
    country: "Germany",
    displayName: "German",
    color: "#00C9FF",
    glowColor: "rgba(0, 201, 255, 0.3)",
  },
  fr: {
    country: "France",
    displayName: "French",
    color: "#A78BFA",
    glowColor: "rgba(167, 139, 250, 0.3)",
  },
  tr: {
    country: "Turkey",
    displayName: "Turkish",
    color: "#00E58A",
    glowColor: "rgba(0, 229, 138, 0.3)",
  },
  es: {
    country: "Spain",
    displayName: "Spanish",
    color: "#F0A500",
    glowColor: "rgba(240, 165, 0, 0.3)",
  },
  it: {
    country: "Italy",
    displayName: "Italian",
    color: "#FF6B6B",
    glowColor: "rgba(255, 107, 107, 0.3)",
  },
  ja: {
    country: "Japan",
    displayName: "Japanese",
    color: "#FF9ECD",
    glowColor: "rgba(255, 158, 205, 0.3)",
  },
};

type GeoFeature = {
  type: string;
  properties: { name: string };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
};

type Props = {
  // Language codes active in the app — from the database
  activeLanguageCodes: string[];
};

function LanguageGlobe({ activeLanguageCodes }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const geoDataRef = useRef<GeoFeature[] | null>(null);
  const animIdRef = useRef<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get active language entries for labels
  const activeLanguages = activeLanguageCodes
    .filter((code) => LANGUAGE_COUNTRY_MAP[code])
    .map((code) => ({ code, ...LANGUAGE_COUNTRY_MAP[code] }));

  // Split into left and right columns
  const leftLanguages = activeLanguages.filter((_, i) => i % 2 === 0);
  const rightLanguages = activeLanguages.filter((_, i) => i % 2 === 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!
    if (!ctx) return;
    // Store as non-null for use inside nested functions
    
    const SIZE = 420;
    canvas.width = SIZE;
    canvas.height = SIZE;

    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const radius = SIZE / 2 - 10;

    // Project 3D sphere coordinates to 2D canvas
    function project(
      lon: number,
      lat: number,
      rotation: number,
    ): { x: number; y: number; visible: boolean } {
      const lonRad = ((lon + rotation) * Math.PI) / 180;
      const latRad = (lat * Math.PI) / 180;

      const x3d = Math.cos(latRad) * Math.cos(lonRad);
      const y3d = Math.sin(latRad);
      const z3d = Math.cos(latRad) * Math.sin(lonRad);

      return {
        x: cx + radius * x3d,
        y: cy - radius * y3d,
        visible: z3d > 0,
      };
    }

    function drawGlobe(features: GeoFeature[]) {
      ctx.clearRect(0, 0, SIZE, SIZE);

      // ── Sphere background ─────────────────────────
      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.3,
        cy - radius * 0.3,
        0,
        cx,
        cy,
        radius,
      );
      sphereGrad.addColorStop(0, "#0D1B3E");
      sphereGrad.addColorStop(0.5, "#080F24");
      sphereGrad.addColorStop(1, "#040812");

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // ── Atmosphere glow at edge ───────────────────
      const atmosGrad = ctx.createRadialGradient(
        cx,
        cy,
        radius * 0.85,
        cx,
        cy,
        radius * 1.1,
      );
      atmosGrad.addColorStop(0, "rgba(0, 100, 255, 0)");
      atmosGrad.addColorStop(0.5, "rgba(0, 80, 200, 0.08)");
      atmosGrad.addColorStop(1, "rgba(0, 60, 180, 0)");

      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.1, 0, Math.PI * 2);
      ctx.fillStyle = atmosGrad;
      ctx.fill();

      // ── Clip to sphere ────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      const rot = rotationRef.current;

      // ── Draw all countries ────────────────────────
      features.forEach((feature) => {
        const countryName = feature.properties.name;
        const matchedLang = Object.entries(LANGUAGE_COUNTRY_MAP).find(
          ([code, data]) =>
            data.country === countryName && activeLanguageCodes.includes(code),
        );

        const isActive = !!matchedLang;
        const activeColor = matchedLang ? matchedLang[1].color : null;

        const drawPolygon = (coords: number[][]) => {
          if (coords.length < 2) return;

          ctx.beginPath();
          let started = false;
          let allHidden = true;

          coords.forEach((coord) => {
            const p = project(coord[0], coord[1], rot);
            if (p.visible) allHidden = false;

            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          });

          if (allHidden) return;
          ctx.closePath();

          if (isActive && activeColor) {
            // Parse hex to rgba for fill
            const r = parseInt(activeColor.slice(1, 3), 16);
            const g = parseInt(activeColor.slice(3, 5), 16);
            const b = parseInt(activeColor.slice(5, 7), 16);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
            ctx.fill();
            ctx.strokeStyle = activeColor;
            ctx.lineWidth = 0.8;
          } else {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 0.4;
          }
          ctx.stroke();
        };

        const geom = feature.geometry;
        if (geom.type === "Polygon") {
          const coords = geom.coordinates as number[][][];
          drawPolygon(coords[0]);
        } else if (geom.type === "MultiPolygon") {
          const coords = geom.coordinates as number[][][][];
          coords.forEach((poly) => drawPolygon(poly[0]));
        }
      });

      ctx.restore();

      // ── Globe border ──────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(100, 150, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Highlight shimmer ─────────────────────────
      const shimmer = ctx.createRadialGradient(
        cx - radius * 0.4,
        cy - radius * 0.4,
        0,
        cx - radius * 0.4,
        cy - radius * 0.4,
        radius * 0.6,
      );
      shimmer.addColorStop(0, "rgba(255, 255, 255, 0.06)");
      shimmer.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = shimmer;
      ctx.fill();

      // Advance rotation — slow east to west
      rotationRef.current -= 0.08;
      animIdRef.current = requestAnimationFrame(() => drawGlobe(features));
    }

    // Fetch GeoJSON from public CDN
    fetch(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    )
      .then((res) => res.json())
      .then((data) => {
        geoDataRef.current = data.features;
        setIsLoaded(true);
        drawGlobe(data.features);
      })
      .catch((err) => console.error("Failed to load globe data", err));

    return () => {
      cancelAnimationFrame(animIdRef.current);
    };
  }, [activeLanguageCodes]);

  return (
    <div className={styles.container}>
      {/* Left language labels */}
      <div className={styles.leftLabels}>
        {leftLanguages.map((lang) => (
          <div
            key={lang.code}
            className={styles.label}
            style={{
              color: lang.color,
              textShadow: `0 0 12px ${lang.glowColor}`,
            }}
          >
            {lang.displayName}
          </div>
        ))}
      </div>

      {/* Globe canvas */}
      <div className={styles.globeWrapper}>
        {!isLoaded && <div className={styles.loading}>Loading globe...</div>}
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      {/* Right language labels */}
      <div className={styles.rightLabels}>
        {rightLanguages.map((lang) => (
          <div
            key={lang.code}
            className={styles.label}
            style={{
              color: lang.color,
              textShadow: `0 0 12px ${lang.glowColor}`,
            }}
          >
            {lang.displayName}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LanguageGlobe;
