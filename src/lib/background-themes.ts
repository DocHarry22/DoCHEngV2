export type BackgroundThemeId =
  | "cosmological-default"
  | "observatory-grid"
  | "nebula-soft"
  | "signal-field"
  | "minimal-deep-space";

export type BackgroundMode = "light" | "dark";

export type BackgroundVariableMap = Record<`--${string}`, string>;

export interface BackgroundThemePreset {
  id: BackgroundThemeId;
  label: string;
  description: string;
  intensity?: "quiet" | "balanced" | "immersive";
  animationProfile?: "still" | "slow" | "balanced";
  heroEnhancement?: "subtle" | "standard" | "rich";
  vars: {
    light: BackgroundVariableMap;
    dark: BackgroundVariableMap;
  };
}

export const backgroundThemeStorageKey = "docheng.background-theme";

export const backgroundThemePresets: readonly BackgroundThemePreset[] = [
  {
    id: "cosmological-default",
    label: "Cosmological Default",
    description: "Ambient cosmic haze with orbital traces and restrained star fields.",
    intensity: "balanced",
    animationProfile: "balanced",
    heroEnhancement: "standard",
    vars: {
      light: {
        "--bg-global-ambient-opacity": "0.64",
        "--bg-global-geometry-opacity": "0.46",
        "--bg-hero-ambient-opacity": "0.86",
        "--bg-hero-geometry-opacity": "0.78",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "72s",
        "--bg-anim-global-2-duration": "108s",
        "--bg-anim-global-orbit-duration": "190s",
        "--bg-global-layer-1": "radial-gradient(58% 46% at 12% 8%, rgba(247, 252, 255, 0.42), transparent 72%), radial-gradient(42% 34% at 84% 16%, rgba(109, 145, 192, 0.22), transparent 76%), radial-gradient(54% 42% at 52% 84%, rgba(76, 108, 149, 0.12), transparent 78%), radial-gradient(0.12rem 0.12rem at 18% 24%, rgba(23, 45, 74, 0.14), transparent 60%), radial-gradient(0.09rem 0.09rem at 68% 12%, rgba(30, 57, 94, 0.1), transparent 62%), radial-gradient(0.1rem 0.1rem at 82% 68%, rgba(30, 57, 94, 0.1), transparent 60%), radial-gradient(0.08rem 0.08rem at 34% 72%, rgba(23, 45, 74, 0.14), transparent 62%)",
        "--bg-global-layer-2": "conic-gradient(from 90deg at 24% 58%, transparent 0deg, rgba(53, 94, 142, 0.12) 32deg, transparent 80deg, transparent 360deg), conic-gradient(from 210deg at 76% 38%, transparent 0deg, rgba(53, 94, 142, 0.12) 34deg, transparent 90deg, transparent 360deg), linear-gradient(120deg, transparent 0%, rgba(43, 78, 121, 0.09) 42%, transparent 48%), radial-gradient(42% 36% at 38% 62%, rgba(118, 164, 214, 0.15), transparent 80%), radial-gradient(35% 30% at 72% 52%, rgba(118, 164, 214, 0.15), transparent 82%)"
      },
      dark: {
        "--bg-global-ambient-opacity": "0.76",
        "--bg-global-geometry-opacity": "0.6",
        "--bg-hero-ambient-opacity": "0.92",
        "--bg-hero-geometry-opacity": "0.86",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "72s",
        "--bg-anim-global-2-duration": "108s",
        "--bg-anim-global-orbit-duration": "190s",
        "--bg-global-layer-1": "radial-gradient(58% 46% at 12% 8%, rgba(145, 194, 255, 0.2), transparent 72%), radial-gradient(42% 34% at 84% 16%, rgba(72, 132, 213, 0.3), transparent 76%), radial-gradient(54% 42% at 52% 84%, rgba(30, 56, 95, 0.38), transparent 78%), radial-gradient(0.12rem 0.12rem at 18% 24%, rgba(202, 225, 255, 0.2), transparent 60%), radial-gradient(0.09rem 0.09rem at 68% 12%, rgba(176, 209, 255, 0.16), transparent 62%), radial-gradient(0.1rem 0.1rem at 82% 68%, rgba(176, 209, 255, 0.16), transparent 60%), radial-gradient(0.08rem 0.08rem at 34% 72%, rgba(202, 225, 255, 0.2), transparent 62%)",
        "--bg-global-layer-2": "conic-gradient(from 90deg at 24% 58%, transparent 0deg, rgba(126, 182, 245, 0.2) 32deg, transparent 80deg, transparent 360deg), conic-gradient(from 210deg at 76% 38%, transparent 0deg, rgba(126, 182, 245, 0.2) 34deg, transparent 90deg, transparent 360deg), linear-gradient(120deg, transparent 0%, rgba(153, 203, 255, 0.16) 42%, transparent 48%), radial-gradient(42% 36% at 38% 62%, rgba(99, 167, 231, 0.18), transparent 80%), radial-gradient(35% 30% at 72% 52%, rgba(99, 167, 231, 0.18), transparent 82%)"
      }
    }
  },
  {
    id: "observatory-grid",
    label: "Observatory Grid",
    description: "Scientific mapping lines, subtle arcs, and measured celestial geometry.",
    intensity: "balanced",
    animationProfile: "slow",
    heroEnhancement: "standard",
    vars: {
      light: {
        "--bg-global-ambient-opacity": "0.56",
        "--bg-global-geometry-opacity": "0.5",
        "--bg-hero-ambient-opacity": "0.78",
        "--bg-hero-geometry-opacity": "0.82",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "90s",
        "--bg-anim-global-2-duration": "132s",
        "--bg-anim-global-orbit-duration": "240s",
        "--bg-global-layer-1": "radial-gradient(62% 50% at 10% 8%, rgba(241, 248, 255, 0.52), transparent 74%), radial-gradient(46% 38% at 82% 14%, rgba(122, 156, 198, 0.2), transparent 78%), radial-gradient(56% 44% at 50% 82%, rgba(82, 116, 158, 0.11), transparent 80%), radial-gradient(0.1rem 0.1rem at 14% 18%, rgba(43, 70, 103, 0.12), transparent 60%), radial-gradient(0.09rem 0.09rem at 66% 24%, rgba(52, 81, 116, 0.1), transparent 62%), radial-gradient(0.08rem 0.08rem at 78% 68%, rgba(43, 70, 103, 0.1), transparent 62%)",
        "--bg-global-layer-2": "linear-gradient(transparent 96%, rgba(52, 84, 122, 0.12) 98%, transparent 100%), linear-gradient(90deg, transparent 96%, rgba(52, 84, 122, 0.12) 98%, transparent 100%), conic-gradient(from 72deg at 22% 58%, transparent 0deg, rgba(70, 108, 154, 0.18) 28deg, transparent 86deg, transparent 360deg), conic-gradient(from 240deg at 74% 36%, transparent 0deg, rgba(70, 108, 154, 0.16) 24deg, transparent 84deg, transparent 360deg), radial-gradient(42% 36% at 56% 50%, rgba(120, 162, 214, 0.12), transparent 82%)"
      },
      dark: {
        "--bg-global-ambient-opacity": "0.7",
        "--bg-global-geometry-opacity": "0.66",
        "--bg-hero-ambient-opacity": "0.84",
        "--bg-hero-geometry-opacity": "0.9",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "90s",
        "--bg-anim-global-2-duration": "132s",
        "--bg-anim-global-orbit-duration": "240s",
        "--bg-global-layer-1": "radial-gradient(62% 50% at 10% 8%, rgba(120, 166, 228, 0.26), transparent 74%), radial-gradient(46% 38% at 82% 14%, rgba(80, 132, 198, 0.28), transparent 78%), radial-gradient(56% 44% at 50% 82%, rgba(38, 69, 112, 0.34), transparent 80%), radial-gradient(0.1rem 0.1rem at 14% 18%, rgba(173, 208, 255, 0.22), transparent 60%), radial-gradient(0.09rem 0.09rem at 66% 24%, rgba(160, 197, 247, 0.2), transparent 62%), radial-gradient(0.08rem 0.08rem at 78% 68%, rgba(173, 208, 255, 0.2), transparent 62%)",
        "--bg-global-layer-2": "linear-gradient(transparent 96%, rgba(121, 170, 233, 0.2) 98%, transparent 100%), linear-gradient(90deg, transparent 96%, rgba(121, 170, 233, 0.2) 98%, transparent 100%), conic-gradient(from 72deg at 22% 58%, transparent 0deg, rgba(121, 174, 241, 0.24) 28deg, transparent 86deg, transparent 360deg), conic-gradient(from 240deg at 74% 36%, transparent 0deg, rgba(121, 174, 241, 0.2) 24deg, transparent 84deg, transparent 360deg), radial-gradient(42% 36% at 56% 50%, rgba(88, 145, 219, 0.18), transparent 82%)"
      }
    }
  },
  {
    id: "nebula-soft",
    label: "Nebula Soft",
    description: "Cinematic atmospheric gradients with softer structure and generous space.",
    intensity: "immersive",
    animationProfile: "slow",
    heroEnhancement: "rich",
    vars: {
      light: {
        "--bg-global-ambient-opacity": "0.68",
        "--bg-global-geometry-opacity": "0.34",
        "--bg-hero-ambient-opacity": "0.92",
        "--bg-hero-geometry-opacity": "0.6",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "78s",
        "--bg-anim-global-2-duration": "140s",
        "--bg-anim-global-orbit-duration": "280s",
        "--bg-global-layer-1": "radial-gradient(72% 58% at 8% 14%, rgba(249, 242, 255, 0.52), transparent 76%), radial-gradient(56% 42% at 84% 16%, rgba(199, 219, 247, 0.32), transparent 78%), radial-gradient(68% 56% at 52% 84%, rgba(166, 198, 236, 0.24), transparent 80%), radial-gradient(42% 32% at 66% 38%, rgba(231, 218, 255, 0.24), transparent 76%), radial-gradient(0.08rem 0.08rem at 18% 24%, rgba(41, 66, 95, 0.08), transparent 60%), radial-gradient(0.08rem 0.08rem at 72% 64%, rgba(41, 66, 95, 0.08), transparent 60%)",
        "--bg-global-layer-2": "radial-gradient(48% 42% at 28% 52%, rgba(162, 194, 233, 0.18), transparent 84%), radial-gradient(44% 38% at 74% 56%, rgba(194, 176, 236, 0.16), transparent 82%), linear-gradient(128deg, transparent 0%, rgba(80, 118, 166, 0.08) 42%, transparent 50%)"
      },
      dark: {
        "--bg-global-ambient-opacity": "0.82",
        "--bg-global-geometry-opacity": "0.42",
        "--bg-hero-ambient-opacity": "0.95",
        "--bg-hero-geometry-opacity": "0.66",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "78s",
        "--bg-anim-global-2-duration": "140s",
        "--bg-anim-global-orbit-duration": "280s",
        "--bg-global-layer-1": "radial-gradient(72% 58% at 8% 14%, rgba(139, 160, 219, 0.34), transparent 76%), radial-gradient(56% 42% at 84% 16%, rgba(88, 136, 205, 0.3), transparent 78%), radial-gradient(68% 56% at 52% 84%, rgba(60, 99, 156, 0.36), transparent 80%), radial-gradient(42% 32% at 66% 38%, rgba(118, 106, 196, 0.24), transparent 76%), radial-gradient(0.08rem 0.08rem at 18% 24%, rgba(178, 208, 255, 0.16), transparent 60%), radial-gradient(0.08rem 0.08rem at 72% 64%, rgba(178, 208, 255, 0.16), transparent 60%)",
        "--bg-global-layer-2": "radial-gradient(48% 42% at 28% 52%, rgba(89, 145, 215, 0.2), transparent 84%), radial-gradient(44% 38% at 74% 56%, rgba(114, 96, 202, 0.2), transparent 82%), linear-gradient(128deg, transparent 0%, rgba(126, 168, 229, 0.12) 42%, transparent 50%)"
      }
    }
  },
  {
    id: "signal-field",
    label: "Signal Field",
    description: "Abstract technical energy contours with restrained data-wave rhythm.",
    intensity: "balanced",
    animationProfile: "balanced",
    heroEnhancement: "standard",
    vars: {
      light: {
        "--bg-global-ambient-opacity": "0.58",
        "--bg-global-geometry-opacity": "0.56",
        "--bg-hero-ambient-opacity": "0.8",
        "--bg-hero-geometry-opacity": "0.88",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "66s",
        "--bg-anim-global-2-duration": "94s",
        "--bg-anim-global-orbit-duration": "170s",
        "--bg-global-layer-1": "radial-gradient(58% 46% at 10% 10%, rgba(233, 247, 255, 0.44), transparent 72%), radial-gradient(48% 38% at 86% 18%, rgba(178, 214, 246, 0.24), transparent 78%), radial-gradient(54% 42% at 54% 84%, rgba(121, 174, 228, 0.18), transparent 80%), radial-gradient(0.08rem 0.08rem at 22% 20%, rgba(36, 69, 110, 0.1), transparent 62%), radial-gradient(0.08rem 0.08rem at 82% 72%, rgba(36, 69, 110, 0.1), transparent 62%)",
        "--bg-global-layer-2": "conic-gradient(from 110deg at 20% 62%, transparent 0deg, rgba(58, 122, 188, 0.2) 24deg, transparent 82deg, transparent 360deg), conic-gradient(from 258deg at 78% 34%, transparent 0deg, rgba(58, 122, 188, 0.2) 24deg, transparent 80deg, transparent 360deg), linear-gradient(115deg, transparent 0%, rgba(49, 93, 142, 0.12) 30%, transparent 40%), linear-gradient(245deg, transparent 0%, rgba(49, 93, 142, 0.1) 34%, transparent 45%), radial-gradient(38% 30% at 52% 50%, rgba(128, 189, 244, 0.14), transparent 82%)"
      },
      dark: {
        "--bg-global-ambient-opacity": "0.72",
        "--bg-global-geometry-opacity": "0.7",
        "--bg-hero-ambient-opacity": "0.88",
        "--bg-hero-geometry-opacity": "0.94",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "66s",
        "--bg-anim-global-2-duration": "94s",
        "--bg-anim-global-orbit-duration": "170s",
        "--bg-global-layer-1": "radial-gradient(58% 46% at 10% 10%, rgba(112, 170, 227, 0.28), transparent 72%), radial-gradient(48% 38% at 86% 18%, rgba(66, 129, 194, 0.32), transparent 78%), radial-gradient(54% 42% at 54% 84%, rgba(39, 87, 146, 0.34), transparent 80%), radial-gradient(0.08rem 0.08rem at 22% 20%, rgba(169, 212, 255, 0.2), transparent 62%), radial-gradient(0.08rem 0.08rem at 82% 72%, rgba(169, 212, 255, 0.2), transparent 62%)",
        "--bg-global-layer-2": "conic-gradient(from 110deg at 20% 62%, transparent 0deg, rgba(102, 176, 255, 0.26) 24deg, transparent 82deg, transparent 360deg), conic-gradient(from 258deg at 78% 34%, transparent 0deg, rgba(102, 176, 255, 0.26) 24deg, transparent 80deg, transparent 360deg), linear-gradient(115deg, transparent 0%, rgba(116, 181, 252, 0.16) 30%, transparent 40%), linear-gradient(245deg, transparent 0%, rgba(116, 181, 252, 0.14) 34%, transparent 45%), radial-gradient(38% 30% at 52% 50%, rgba(86, 150, 223, 0.2), transparent 82%)"
      }
    }
  },
  {
    id: "minimal-deep-space",
    label: "Minimal Deep Space",
    description: "Quiet low-noise depth with sparse stars for distraction-free reading.",
    intensity: "quiet",
    animationProfile: "still",
    heroEnhancement: "subtle",
    vars: {
      light: {
        "--bg-global-ambient-opacity": "0.4",
        "--bg-global-geometry-opacity": "0.2",
        "--bg-hero-ambient-opacity": "0.58",
        "--bg-hero-geometry-opacity": "0.38",
        "--bg-anim-play-state": "paused",
        "--bg-anim-global-1-duration": "80s",
        "--bg-anim-global-2-duration": "120s",
        "--bg-anim-global-orbit-duration": "210s",
        "--bg-global-layer-1": "radial-gradient(62% 50% at 12% 8%, rgba(246, 250, 255, 0.54), transparent 76%), radial-gradient(52% 40% at 86% 16%, rgba(208, 223, 241, 0.2), transparent 80%), radial-gradient(58% 48% at 54% 86%, rgba(152, 177, 206, 0.12), transparent 82%), radial-gradient(0.08rem 0.08rem at 18% 22%, rgba(45, 67, 96, 0.1), transparent 60%), radial-gradient(0.07rem 0.07rem at 78% 66%, rgba(45, 67, 96, 0.08), transparent 60%)",
        "--bg-global-layer-2": "radial-gradient(40% 32% at 52% 52%, rgba(132, 170, 213, 0.1), transparent 84%), linear-gradient(125deg, transparent 0%, rgba(80, 113, 152, 0.06) 42%, transparent 50%)"
      },
      dark: {
        "--bg-global-ambient-opacity": "0.54",
        "--bg-global-geometry-opacity": "0.24",
        "--bg-hero-ambient-opacity": "0.68",
        "--bg-hero-geometry-opacity": "0.42",
        "--bg-anim-play-state": "paused",
        "--bg-anim-global-1-duration": "80s",
        "--bg-anim-global-2-duration": "120s",
        "--bg-anim-global-orbit-duration": "210s",
        "--bg-global-layer-1": "radial-gradient(62% 50% at 12% 8%, rgba(90, 126, 176, 0.22), transparent 76%), radial-gradient(52% 40% at 86% 16%, rgba(53, 88, 133, 0.22), transparent 80%), radial-gradient(58% 48% at 54% 86%, rgba(30, 55, 88, 0.28), transparent 82%), radial-gradient(0.08rem 0.08rem at 18% 22%, rgba(178, 207, 249, 0.14), transparent 60%), radial-gradient(0.07rem 0.07rem at 78% 66%, rgba(178, 207, 249, 0.12), transparent 60%)",
        "--bg-global-layer-2": "radial-gradient(40% 32% at 52% 52%, rgba(74, 117, 171, 0.14), transparent 84%), linear-gradient(125deg, transparent 0%, rgba(113, 162, 224, 0.08) 42%, transparent 50%)"
      }
    }
  }
];

export const backgroundThemeMap: Readonly<Record<BackgroundThemeId, BackgroundThemePreset>> =
  backgroundThemePresets.reduce((acc, preset) => {
    acc[preset.id] = preset;
    return acc;
  }, {} as Record<BackgroundThemeId, BackgroundThemePreset>);

export const backgroundThemeIds = backgroundThemePresets.map((preset) => preset.id) as readonly BackgroundThemeId[];

export const defaultBackgroundThemeId: BackgroundThemeId = "cosmological-default";

export function isBackgroundThemeId(value: string): value is BackgroundThemeId {
  return (backgroundThemeIds as readonly string[]).includes(value);
}

export function getBackgroundThemePreset(themeId: BackgroundThemeId): BackgroundThemePreset {
  return backgroundThemeMap[themeId] ?? backgroundThemeMap[defaultBackgroundThemeId];
}
