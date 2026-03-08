export type BackgroundThemeId =
  | "cosmological-default"
  | "observatory-grid"
  | "nebula-soft"
  | "signal-field"
  | "minimal-deep-space";

export type BackgroundMode = "light" | "dark";

export type BackgroundVariableMap = Record<`--${string}`, string>;

export type BackgroundIntensity = "quiet" | "balanced" | "immersive";
export type BackgroundAnimationProfile = "still" | "slow" | "balanced";
export type HeroEnhancement = "subtle" | "standard" | "rich";

export interface BackgroundThemeVariant {
  vars: BackgroundVariableMap;
}

export interface BackgroundThemePreset {
  id: BackgroundThemeId;
  label: string;
  description: string;
  intensity: BackgroundIntensity;
  animationProfile: BackgroundAnimationProfile;
  heroEnhancement: HeroEnhancement;
  variants: {
    light: BackgroundThemeVariant;
    dark: BackgroundThemeVariant;
  };
}

export const backgroundThemeStorageKey = "docheng.background-theme";

function definePreset(preset: BackgroundThemePreset): BackgroundThemePreset {
  return preset;
}

export const backgroundThemePresets: readonly BackgroundThemePreset[] = [
  definePreset({
    id: "cosmological-default",
    label: "Cosmological Default",
    description: "Ambient cosmic haze with orbital traces and restrained star fields.",
    intensity: "balanced",
    animationProfile: "balanced",
    heroEnhancement: "standard",
    variants: {
      light: {
        vars: {
        "--bg-global-ambient-opacity": "0.52",
        "--bg-global-geometry-opacity": "0.48",
        "--bg-hero-ambient-opacity": "0.74",
        "--bg-hero-geometry-opacity": "0.78",
          "--bg-page-ambient-opacity": "0.42",
          "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "104s",
        "--bg-anim-global-2-duration": "156s",
        "--bg-anim-global-orbit-duration": "280s",
        "--bg-anim-hero-1-duration": "76s",
        "--bg-anim-hero-2-duration": "118s",
        "--bg-anim-hero-orbit-duration": "260s",
        "--bg-anim-ecosystem-1-duration": "84s",
        "--bg-anim-ecosystem-2-duration": "136s",
        "--bg-anim-ecosystem-orbit-duration": "260s",
        "--bg-anim-twinkle-duration": "16s",
        "--bg-global-layer-1": "radial-gradient(60% 48% at 12% 8%, rgba(244, 250, 255, 0.5), transparent 74%), radial-gradient(44% 36% at 84% 14%, rgba(126, 162, 206, 0.18), transparent 78%), radial-gradient(52% 40% at 52% 84%, rgba(84, 120, 166, 0.11), transparent 80%), radial-gradient(0.09rem 0.09rem at 16% 20%, rgba(43, 70, 103, 0.1), transparent 60%), radial-gradient(0.08rem 0.08rem at 68% 26%, rgba(52, 81, 116, 0.09), transparent 62%), radial-gradient(0.08rem 0.08rem at 80% 70%, rgba(43, 70, 103, 0.09), transparent 62%)",
        "--bg-global-layer-2": "repeating-linear-gradient(to bottom, transparent 0, transparent 25px, rgba(52, 84, 122, 0.11) 25px, rgba(52, 84, 122, 0.11) 26px), repeating-linear-gradient(to right, transparent 0, transparent 25px, rgba(52, 84, 122, 0.11) 25px, rgba(52, 84, 122, 0.11) 26px), conic-gradient(from 74deg at 24% 58%, transparent 0deg, rgba(70, 108, 154, 0.17) 30deg, transparent 88deg, transparent 360deg), conic-gradient(from 240deg at 74% 36%, transparent 0deg, rgba(70, 108, 154, 0.15) 26deg, transparent 84deg, transparent 360deg), radial-gradient(40% 34% at 56% 50%, rgba(120, 162, 214, 0.1), transparent 82%)",
        "--bg-global-layer-1-size": "auto, auto, auto, 44rem 44rem, 50rem 50rem, 56rem 56rem",
        "--bg-global-layer-2-size": "28rem 28rem, 28rem 28rem, 64rem 64rem, 68rem 68rem, auto",
          "--bg-hero-layer-1": "radial-gradient(50% 36% at 22% 26%, rgba(247, 252, 255, 0.44), transparent 74%), radial-gradient(54% 42% at 78% 20%, rgba(109, 145, 192, 0.24), transparent 78%), radial-gradient(44% 38% at 54% 84%, rgba(118, 164, 214, 0.18), transparent 84%)",
          "--bg-hero-layer-2": "conic-gradient(from 125deg at 64% 52%, transparent 0deg, rgba(53, 94, 142, 0.14) 54deg, transparent 118deg, transparent 360deg), radial-gradient(0.11rem 0.11rem at 18% 22%, rgba(23, 45, 74, 0.14), transparent 58%), radial-gradient(0.08rem 0.08rem at 74% 30%, rgba(23, 45, 74, 0.12), transparent 60%), radial-gradient(0.09rem 0.09rem at 66% 72%, rgba(23, 45, 74, 0.14), transparent 58%)",
        "--bg-hero-layer-2-size": "56rem 56rem, 60rem 60rem, 26rem 26rem, 30rem 30rem",
          "--bg-ecosystem-layer-1": "radial-gradient(52% 38% at 15% 16%, rgba(247, 252, 255, 0.38), transparent 72%), radial-gradient(46% 38% at 84% 18%, rgba(109, 145, 192, 0.2), transparent 76%), radial-gradient(46% 40% at 52% 86%, rgba(118, 164, 214, 0.16), transparent 80%), radial-gradient(34% 26% at 52% 24%, rgba(223, 238, 255, 0.24), transparent 82%)",
        "--bg-ecosystem-layer-2": "conic-gradient(from 72deg at 24% 56%, transparent 0deg, rgba(70, 108, 154, 0.2) 34deg, transparent 94deg, transparent 360deg), conic-gradient(from 246deg at 76% 42%, transparent 0deg, rgba(70, 108, 154, 0.18) 28deg, transparent 88deg, transparent 360deg), radial-gradient(0.1rem 0.1rem at 16% 24%, rgba(43, 70, 103, 0.11), transparent 62%), radial-gradient(0.1rem 0.1rem at 74% 30%, rgba(43, 70, 103, 0.11), transparent 62%), radial-gradient(0.09rem 0.09rem at 64% 72%, rgba(43, 70, 103, 0.11), transparent 62%), repeating-linear-gradient(to bottom, transparent 0, transparent 23px, rgba(52, 84, 122, 0.09) 23px, rgba(52, 84, 122, 0.09) 24px), linear-gradient(180deg, rgba(122, 156, 198, 0.04) 0%, rgba(82, 116, 158, 0.08) 74%, rgba(82, 116, 158, 0.14) 100%)",
          "--bg-page-layer": "radial-gradient(42% 30% at 10% 6%, rgba(247, 252, 255, 0.24), transparent 82%), radial-gradient(34% 28% at 88% 12%, rgba(109, 145, 192, 0.14), transparent 84%)"
        }
      },
      dark: {
        vars: {
        "--bg-global-ambient-opacity": "0.66",
        "--bg-global-geometry-opacity": "0.62",
        "--bg-hero-ambient-opacity": "0.8",
        "--bg-hero-geometry-opacity": "0.86",
          "--bg-page-ambient-opacity": "0.48",
          "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "104s",
        "--bg-anim-global-2-duration": "156s",
        "--bg-anim-global-orbit-duration": "280s",
        "--bg-anim-hero-1-duration": "76s",
        "--bg-anim-hero-2-duration": "118s",
        "--bg-anim-hero-orbit-duration": "260s",
        "--bg-anim-ecosystem-1-duration": "84s",
        "--bg-anim-ecosystem-2-duration": "136s",
        "--bg-anim-ecosystem-orbit-duration": "260s",
        "--bg-anim-twinkle-duration": "16s",
        "--bg-global-layer-1": "radial-gradient(60% 48% at 12% 8%, rgba(124, 172, 236, 0.24), transparent 74%), radial-gradient(44% 36% at 84% 14%, rgba(82, 136, 206, 0.24), transparent 78%), radial-gradient(52% 40% at 52% 84%, rgba(38, 70, 116, 0.32), transparent 80%), radial-gradient(0.09rem 0.09rem at 16% 20%, rgba(176, 210, 255, 0.2), transparent 60%), radial-gradient(0.08rem 0.08rem at 68% 26%, rgba(160, 198, 247, 0.18), transparent 62%), radial-gradient(0.08rem 0.08rem at 80% 70%, rgba(176, 210, 255, 0.18), transparent 62%)",
        "--bg-global-layer-2": "repeating-linear-gradient(to bottom, transparent 0, transparent 25px, rgba(121, 170, 233, 0.18) 25px, rgba(121, 170, 233, 0.18) 26px), repeating-linear-gradient(to right, transparent 0, transparent 25px, rgba(121, 170, 233, 0.18) 25px, rgba(121, 170, 233, 0.18) 26px), conic-gradient(from 74deg at 24% 58%, transparent 0deg, rgba(121, 174, 241, 0.24) 30deg, transparent 88deg, transparent 360deg), conic-gradient(from 240deg at 74% 36%, transparent 0deg, rgba(121, 174, 241, 0.2) 26deg, transparent 84deg, transparent 360deg), radial-gradient(40% 34% at 56% 50%, rgba(88, 145, 219, 0.16), transparent 82%)",
        "--bg-global-layer-1-size": "auto, auto, auto, 44rem 44rem, 50rem 50rem, 56rem 56rem",
        "--bg-global-layer-2-size": "28rem 28rem, 28rem 28rem, 64rem 64rem, 68rem 68rem, auto",
          "--bg-hero-layer-1": "radial-gradient(50% 36% at 22% 26%, rgba(145, 194, 255, 0.22), transparent 74%), radial-gradient(54% 42% at 78% 20%, rgba(72, 132, 213, 0.3), transparent 78%), radial-gradient(44% 38% at 54% 84%, rgba(99, 167, 231, 0.2), transparent 84%)",
          "--bg-hero-layer-2": "conic-gradient(from 125deg at 64% 52%, transparent 0deg, rgba(126, 182, 245, 0.2) 54deg, transparent 118deg, transparent 360deg), radial-gradient(0.11rem 0.11rem at 18% 22%, rgba(202, 225, 255, 0.2), transparent 58%), radial-gradient(0.08rem 0.08rem at 74% 30%, rgba(202, 225, 255, 0.2), transparent 60%), radial-gradient(0.09rem 0.09rem at 66% 72%, rgba(202, 225, 255, 0.18), transparent 58%)",
        "--bg-hero-layer-2-size": "56rem 56rem, 60rem 60rem, 26rem 26rem, 30rem 30rem",
          "--bg-ecosystem-layer-1": "radial-gradient(52% 38% at 15% 16%, rgba(145, 194, 255, 0.2), transparent 72%), radial-gradient(46% 38% at 84% 18%, rgba(72, 132, 213, 0.28), transparent 76%), radial-gradient(46% 40% at 52% 86%, rgba(99, 167, 231, 0.2), transparent 80%), radial-gradient(34% 26% at 52% 24%, rgba(186, 220, 255, 0.18), transparent 82%)",
        "--bg-ecosystem-layer-2": "conic-gradient(from 72deg at 24% 56%, transparent 0deg, rgba(121, 174, 241, 0.26) 34deg, transparent 94deg, transparent 360deg), conic-gradient(from 246deg at 76% 42%, transparent 0deg, rgba(121, 174, 241, 0.22) 28deg, transparent 88deg, transparent 360deg), radial-gradient(0.1rem 0.1rem at 16% 24%, rgba(173, 208, 255, 0.2), transparent 62%), radial-gradient(0.1rem 0.1rem at 74% 30%, rgba(173, 208, 255, 0.2), transparent 62%), radial-gradient(0.09rem 0.09rem at 64% 72%, rgba(173, 208, 255, 0.2), transparent 62%), repeating-linear-gradient(to bottom, transparent 0, transparent 23px, rgba(121, 170, 233, 0.14) 23px, rgba(121, 170, 233, 0.14) 24px), linear-gradient(180deg, rgba(80, 132, 198, 0.08) 0%, rgba(38, 69, 112, 0.16) 74%, rgba(38, 69, 112, 0.24) 100%)",
          "--bg-page-layer": "radial-gradient(42% 30% at 10% 6%, rgba(145, 194, 255, 0.16), transparent 82%), radial-gradient(34% 28% at 88% 12%, rgba(72, 132, 213, 0.14), transparent 84%)"
        }
      }
    }
  }),
  definePreset({
    id: "observatory-grid",
    label: "Observatory Grid",
    description: "Scientific mapping lines, subtle arcs, and measured celestial geometry.",
    intensity: "balanced",
    animationProfile: "slow",
    heroEnhancement: "standard",
    variants: {
      light: {
        vars: {
        "--bg-global-ambient-opacity": "0.56",
        "--bg-global-geometry-opacity": "0.5",
        "--bg-hero-ambient-opacity": "0.78",
        "--bg-hero-geometry-opacity": "0.82",
        "--bg-page-ambient-opacity": "0.38",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "90s",
        "--bg-anim-global-2-duration": "132s",
        "--bg-anim-global-orbit-duration": "240s",
        "--bg-anim-hero-1-duration": "62s",
        "--bg-anim-hero-2-duration": "96s",
        "--bg-anim-hero-orbit-duration": "220s",
        "--bg-anim-ecosystem-1-duration": "70s",
        "--bg-anim-ecosystem-2-duration": "118s",
        "--bg-anim-ecosystem-orbit-duration": "220s",
        "--bg-anim-twinkle-duration": "13s",
        "--bg-global-layer-1": "radial-gradient(62% 50% at 10% 8%, rgba(241, 248, 255, 0.52), transparent 74%), radial-gradient(46% 38% at 82% 14%, rgba(122, 156, 198, 0.2), transparent 78%), radial-gradient(56% 44% at 50% 82%, rgba(82, 116, 158, 0.11), transparent 80%), radial-gradient(0.1rem 0.1rem at 14% 18%, rgba(43, 70, 103, 0.12), transparent 60%), radial-gradient(0.09rem 0.09rem at 66% 24%, rgba(52, 81, 116, 0.1), transparent 62%), radial-gradient(0.08rem 0.08rem at 78% 68%, rgba(43, 70, 103, 0.1), transparent 62%)",
        "--bg-global-layer-2": "linear-gradient(transparent 96%, rgba(52, 84, 122, 0.12) 98%, transparent 100%), linear-gradient(90deg, transparent 96%, rgba(52, 84, 122, 0.12) 98%, transparent 100%), conic-gradient(from 72deg at 22% 58%, transparent 0deg, rgba(70, 108, 154, 0.18) 28deg, transparent 86deg, transparent 360deg), conic-gradient(from 240deg at 74% 36%, transparent 0deg, rgba(70, 108, 154, 0.16) 24deg, transparent 84deg, transparent 360deg), radial-gradient(42% 36% at 56% 50%, rgba(120, 162, 214, 0.12), transparent 82%)",
        "--bg-hero-layer-1": "linear-gradient(transparent 95%, rgba(52, 84, 122, 0.16) 97%, transparent 100%), linear-gradient(90deg, transparent 95%, rgba(52, 84, 122, 0.16) 97%, transparent 100%), radial-gradient(46% 34% at 48% 56%, rgba(120, 162, 214, 0.16), transparent 84%)",
        "--bg-hero-layer-2": "conic-gradient(from 86deg at 32% 52%, transparent 0deg, rgba(70, 108, 154, 0.2) 36deg, transparent 94deg, transparent 360deg), conic-gradient(from 224deg at 72% 44%, transparent 0deg, rgba(70, 108, 154, 0.18) 30deg, transparent 88deg, transparent 360deg), radial-gradient(0.09rem 0.09rem at 24% 32%, rgba(43, 70, 103, 0.12), transparent 60%), radial-gradient(0.08rem 0.08rem at 74% 66%, rgba(43, 70, 103, 0.12), transparent 60%)",
        "--bg-ecosystem-layer-1": "linear-gradient(transparent 95%, rgba(52, 84, 122, 0.12) 97%, transparent 100%), linear-gradient(90deg, transparent 95%, rgba(52, 84, 122, 0.12) 97%, transparent 100%), radial-gradient(44% 34% at 52% 52%, rgba(120, 162, 214, 0.14), transparent 84%), radial-gradient(54% 42% at 14% 18%, rgba(241, 248, 255, 0.34), transparent 78%)",
        "--bg-ecosystem-layer-2": "conic-gradient(from 72deg at 24% 56%, transparent 0deg, rgba(70, 108, 154, 0.2) 34deg, transparent 94deg, transparent 360deg), conic-gradient(from 246deg at 76% 42%, transparent 0deg, rgba(70, 108, 154, 0.18) 28deg, transparent 88deg, transparent 360deg), radial-gradient(0.1rem 0.1rem at 16% 24%, rgba(43, 70, 103, 0.12), transparent 62%), radial-gradient(0.1rem 0.1rem at 74% 30%, rgba(43, 70, 103, 0.12), transparent 62%), radial-gradient(0.09rem 0.09rem at 64% 72%, rgba(43, 70, 103, 0.12), transparent 62%), linear-gradient(132deg, transparent 0%, rgba(52, 84, 122, 0.1) 32%, transparent 44%), linear-gradient(180deg, rgba(122, 156, 198, 0.04) 0%, rgba(82, 116, 158, 0.08) 74%, rgba(82, 116, 158, 0.14) 100%)",
        "--bg-page-layer": "linear-gradient(transparent 98%, rgba(52, 84, 122, 0.1) 100%), radial-gradient(36% 28% at 86% 10%, rgba(122, 156, 198, 0.12), transparent 84%)"
        }
      },
      dark: {
        vars: {
        "--bg-global-ambient-opacity": "0.7",
        "--bg-global-geometry-opacity": "0.66",
        "--bg-hero-ambient-opacity": "0.84",
        "--bg-hero-geometry-opacity": "0.9",
        "--bg-page-ambient-opacity": "0.44",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "90s",
        "--bg-anim-global-2-duration": "132s",
        "--bg-anim-global-orbit-duration": "240s",
        "--bg-anim-hero-1-duration": "62s",
        "--bg-anim-hero-2-duration": "96s",
        "--bg-anim-hero-orbit-duration": "220s",
        "--bg-anim-ecosystem-1-duration": "70s",
        "--bg-anim-ecosystem-2-duration": "118s",
        "--bg-anim-ecosystem-orbit-duration": "220s",
        "--bg-anim-twinkle-duration": "13s",
        "--bg-global-layer-1": "radial-gradient(62% 50% at 10% 8%, rgba(120, 166, 228, 0.26), transparent 74%), radial-gradient(46% 38% at 82% 14%, rgba(80, 132, 198, 0.28), transparent 78%), radial-gradient(56% 44% at 50% 82%, rgba(38, 69, 112, 0.34), transparent 80%), radial-gradient(0.1rem 0.1rem at 14% 18%, rgba(173, 208, 255, 0.22), transparent 60%), radial-gradient(0.09rem 0.09rem at 66% 24%, rgba(160, 197, 247, 0.2), transparent 62%), radial-gradient(0.08rem 0.08rem at 78% 68%, rgba(173, 208, 255, 0.2), transparent 62%)",
        "--bg-global-layer-2": "linear-gradient(transparent 96%, rgba(121, 170, 233, 0.2) 98%, transparent 100%), linear-gradient(90deg, transparent 96%, rgba(121, 170, 233, 0.2) 98%, transparent 100%), conic-gradient(from 72deg at 22% 58%, transparent 0deg, rgba(121, 174, 241, 0.24) 28deg, transparent 86deg, transparent 360deg), conic-gradient(from 240deg at 74% 36%, transparent 0deg, rgba(121, 174, 241, 0.2) 24deg, transparent 84deg, transparent 360deg), radial-gradient(42% 36% at 56% 50%, rgba(88, 145, 219, 0.18), transparent 82%)",
        "--bg-hero-layer-1": "linear-gradient(transparent 95%, rgba(121, 170, 233, 0.2) 97%, transparent 100%), linear-gradient(90deg, transparent 95%, rgba(121, 170, 233, 0.2) 97%, transparent 100%), radial-gradient(46% 34% at 48% 56%, rgba(88, 145, 219, 0.2), transparent 84%)",
        "--bg-hero-layer-2": "conic-gradient(from 86deg at 32% 52%, transparent 0deg, rgba(121, 174, 241, 0.26) 36deg, transparent 94deg, transparent 360deg), conic-gradient(from 224deg at 72% 44%, transparent 0deg, rgba(121, 174, 241, 0.22) 30deg, transparent 88deg, transparent 360deg), radial-gradient(0.09rem 0.09rem at 24% 32%, rgba(173, 208, 255, 0.2), transparent 60%), radial-gradient(0.08rem 0.08rem at 74% 66%, rgba(173, 208, 255, 0.2), transparent 60%)",
        "--bg-ecosystem-layer-1": "linear-gradient(transparent 95%, rgba(121, 170, 233, 0.16) 97%, transparent 100%), linear-gradient(90deg, transparent 95%, rgba(121, 170, 233, 0.16) 97%, transparent 100%), radial-gradient(44% 34% at 52% 52%, rgba(88, 145, 219, 0.2), transparent 84%), radial-gradient(54% 42% at 14% 18%, rgba(120, 166, 228, 0.24), transparent 78%)",
        "--bg-ecosystem-layer-2": "conic-gradient(from 72deg at 24% 56%, transparent 0deg, rgba(121, 174, 241, 0.26) 34deg, transparent 94deg, transparent 360deg), conic-gradient(from 246deg at 76% 42%, transparent 0deg, rgba(121, 174, 241, 0.22) 28deg, transparent 88deg, transparent 360deg), radial-gradient(0.1rem 0.1rem at 16% 24%, rgba(173, 208, 255, 0.2), transparent 62%), radial-gradient(0.1rem 0.1rem at 74% 30%, rgba(173, 208, 255, 0.2), transparent 62%), radial-gradient(0.09rem 0.09rem at 64% 72%, rgba(173, 208, 255, 0.2), transparent 62%), linear-gradient(132deg, transparent 0%, rgba(121, 170, 233, 0.14) 32%, transparent 44%), linear-gradient(180deg, rgba(80, 132, 198, 0.08) 0%, rgba(38, 69, 112, 0.16) 74%, rgba(38, 69, 112, 0.24) 100%)",
        "--bg-page-layer": "linear-gradient(transparent 98%, rgba(121, 170, 233, 0.16) 100%), radial-gradient(36% 28% at 86% 10%, rgba(88, 145, 219, 0.14), transparent 84%)"
        }
      }
    }
  }),
  definePreset({
    id: "nebula-soft",
    label: "Nebula Soft",
    description: "Cinematic atmospheric gradients with softer structure and generous space.",
    intensity: "immersive",
    animationProfile: "slow",
    heroEnhancement: "rich",
    variants: {
      light: {
        vars: {
        "--bg-global-ambient-opacity": "0.66",
        "--bg-global-geometry-opacity": "0.26",
        "--bg-hero-ambient-opacity": "0.9",
        "--bg-hero-geometry-opacity": "0.48",
        "--bg-page-ambient-opacity": "0.48",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "92s",
        "--bg-anim-global-2-duration": "172s",
        "--bg-anim-global-orbit-duration": "320s",
        "--bg-anim-hero-1-duration": "72s",
        "--bg-anim-hero-2-duration": "116s",
        "--bg-anim-hero-orbit-duration": "300s",
        "--bg-anim-ecosystem-1-duration": "88s",
        "--bg-anim-ecosystem-2-duration": "132s",
        "--bg-anim-ecosystem-orbit-duration": "300s",
        "--bg-anim-twinkle-duration": "18s",
        "--bg-global-layer-1": "radial-gradient(72% 58% at 8% 14%, rgba(249, 242, 255, 0.52), transparent 76%), radial-gradient(56% 42% at 84% 16%, rgba(199, 219, 247, 0.32), transparent 78%), radial-gradient(68% 56% at 52% 84%, rgba(166, 198, 236, 0.24), transparent 80%), radial-gradient(42% 32% at 66% 38%, rgba(231, 218, 255, 0.24), transparent 76%), radial-gradient(0.08rem 0.08rem at 18% 24%, rgba(41, 66, 95, 0.08), transparent 60%), radial-gradient(0.08rem 0.08rem at 72% 64%, rgba(41, 66, 95, 0.08), transparent 60%)",
        "--bg-global-layer-2": "radial-gradient(56% 46% at 24% 54%, rgba(162, 194, 233, 0.2), transparent 84%), radial-gradient(50% 42% at 76% 54%, rgba(194, 176, 236, 0.18), transparent 84%), linear-gradient(128deg, transparent 0%, rgba(80, 118, 166, 0.06) 42%, transparent 50%)",
        "--bg-global-layer-1-size": "auto, auto, auto, 72rem 72rem, 82rem 82rem, 90rem 90rem",
        "--bg-global-layer-2-size": "auto, auto, 90rem 90rem",
        "--bg-hero-layer-1": "radial-gradient(64% 52% at 16% 22%, rgba(249, 242, 255, 0.48), transparent 78%), radial-gradient(54% 44% at 82% 22%, rgba(199, 219, 247, 0.28), transparent 80%), radial-gradient(58% 46% at 52% 84%, rgba(166, 198, 236, 0.24), transparent 84%)",
        "--bg-hero-layer-2": "radial-gradient(42% 34% at 62% 42%, rgba(194, 176, 236, 0.2), transparent 78%), radial-gradient(0.08rem 0.08rem at 24% 26%, rgba(41, 66, 95, 0.06), transparent 60%), radial-gradient(0.08rem 0.08rem at 72% 66%, rgba(41, 66, 95, 0.06), transparent 60%)",
        "--bg-hero-layer-2-size": "auto, 46rem 46rem, 52rem 52rem",
        "--bg-ecosystem-layer-1": "radial-gradient(60% 48% at 12% 14%, rgba(249, 242, 255, 0.42), transparent 78%), radial-gradient(48% 38% at 84% 18%, rgba(199, 219, 247, 0.26), transparent 80%), radial-gradient(56% 46% at 52% 86%, rgba(166, 198, 236, 0.22), transparent 84%)",
        "--bg-ecosystem-layer-2": "radial-gradient(48% 38% at 24% 54%, rgba(162, 194, 233, 0.2), transparent 82%), radial-gradient(44% 36% at 76% 54%, rgba(194, 176, 236, 0.2), transparent 82%), linear-gradient(132deg, transparent 0%, rgba(80, 118, 166, 0.06) 34%, transparent 44%), radial-gradient(0.08rem 0.08rem at 18% 22%, rgba(41, 66, 95, 0.06), transparent 60%), radial-gradient(0.08rem 0.08rem at 72% 68%, rgba(41, 66, 95, 0.06), transparent 60%), radial-gradient(0.08rem 0.08rem at 62% 74%, rgba(41, 66, 95, 0.06), transparent 60%), linear-gradient(180deg, rgba(166, 198, 236, 0.06) 0%, rgba(166, 198, 236, 0.1) 76%, rgba(166, 198, 236, 0.16) 100%)",
        "--bg-page-layer": "radial-gradient(44% 32% at 12% 8%, rgba(231, 218, 255, 0.2), transparent 84%), radial-gradient(38% 30% at 86% 12%, rgba(162, 194, 233, 0.16), transparent 86%)"
        }
      },
      dark: {
        vars: {
        "--bg-global-ambient-opacity": "0.78",
        "--bg-global-geometry-opacity": "0.34",
        "--bg-hero-ambient-opacity": "0.9",
        "--bg-hero-geometry-opacity": "0.54",
        "--bg-page-ambient-opacity": "0.52",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "92s",
        "--bg-anim-global-2-duration": "172s",
        "--bg-anim-global-orbit-duration": "320s",
        "--bg-anim-hero-1-duration": "72s",
        "--bg-anim-hero-2-duration": "116s",
        "--bg-anim-hero-orbit-duration": "300s",
        "--bg-anim-ecosystem-1-duration": "88s",
        "--bg-anim-ecosystem-2-duration": "132s",
        "--bg-anim-ecosystem-orbit-duration": "300s",
        "--bg-anim-twinkle-duration": "18s",
        "--bg-global-layer-1": "radial-gradient(72% 58% at 8% 14%, rgba(139, 160, 219, 0.34), transparent 76%), radial-gradient(56% 42% at 84% 16%, rgba(88, 136, 205, 0.3), transparent 78%), radial-gradient(68% 56% at 52% 84%, rgba(60, 99, 156, 0.36), transparent 80%), radial-gradient(42% 32% at 66% 38%, rgba(118, 106, 196, 0.24), transparent 76%), radial-gradient(0.08rem 0.08rem at 18% 24%, rgba(178, 208, 255, 0.16), transparent 60%), radial-gradient(0.08rem 0.08rem at 72% 64%, rgba(178, 208, 255, 0.16), transparent 60%)",
        "--bg-global-layer-2": "radial-gradient(56% 46% at 24% 54%, rgba(89, 145, 215, 0.22), transparent 84%), radial-gradient(50% 42% at 76% 54%, rgba(114, 96, 202, 0.22), transparent 84%), linear-gradient(128deg, transparent 0%, rgba(126, 168, 229, 0.1) 42%, transparent 50%)",
        "--bg-global-layer-1-size": "auto, auto, auto, 72rem 72rem, 82rem 82rem, 90rem 90rem",
        "--bg-global-layer-2-size": "auto, auto, 90rem 90rem",
        "--bg-hero-layer-1": "radial-gradient(64% 52% at 16% 22%, rgba(139, 160, 219, 0.34), transparent 78%), radial-gradient(54% 44% at 82% 22%, rgba(88, 136, 205, 0.28), transparent 80%), radial-gradient(58% 46% at 52% 84%, rgba(60, 99, 156, 0.3), transparent 84%)",
        "--bg-hero-layer-2": "radial-gradient(42% 34% at 62% 42%, rgba(118, 106, 196, 0.24), transparent 78%), radial-gradient(0.08rem 0.08rem at 24% 26%, rgba(178, 208, 255, 0.14), transparent 60%), radial-gradient(0.08rem 0.08rem at 72% 66%, rgba(178, 208, 255, 0.14), transparent 60%)",
        "--bg-hero-layer-2-size": "auto, 46rem 46rem, 52rem 52rem",
        "--bg-ecosystem-layer-1": "radial-gradient(60% 48% at 12% 14%, rgba(139, 160, 219, 0.3), transparent 78%), radial-gradient(48% 38% at 84% 18%, rgba(88, 136, 205, 0.26), transparent 80%), radial-gradient(56% 46% at 52% 86%, rgba(60, 99, 156, 0.3), transparent 84%)",
        "--bg-ecosystem-layer-2": "radial-gradient(48% 38% at 24% 54%, rgba(89, 145, 215, 0.22), transparent 82%), radial-gradient(44% 36% at 76% 54%, rgba(114, 96, 202, 0.22), transparent 82%), linear-gradient(132deg, transparent 0%, rgba(126, 168, 229, 0.12) 34%, transparent 44%), radial-gradient(0.08rem 0.08rem at 18% 22%, rgba(178, 208, 255, 0.14), transparent 60%), radial-gradient(0.08rem 0.08rem at 72% 68%, rgba(178, 208, 255, 0.14), transparent 60%), radial-gradient(0.08rem 0.08rem at 62% 74%, rgba(178, 208, 255, 0.14), transparent 60%), linear-gradient(180deg, rgba(60, 99, 156, 0.08) 0%, rgba(60, 99, 156, 0.14) 76%, rgba(60, 99, 156, 0.22) 100%)",
        "--bg-page-layer": "radial-gradient(44% 32% at 12% 8%, rgba(118, 106, 196, 0.18), transparent 84%), radial-gradient(38% 30% at 86% 12%, rgba(89, 145, 215, 0.16), transparent 86%)"
        }
      }
    }
  }),
  definePreset({
    id: "signal-field",
    label: "Signal Field",
    description: "Abstract technical energy contours with restrained data-wave rhythm.",
    intensity: "balanced",
    animationProfile: "balanced",
    heroEnhancement: "standard",
    variants: {
      light: {
        vars: {
        "--bg-global-ambient-opacity": "0.54",
        "--bg-global-geometry-opacity": "0.58",
        "--bg-hero-ambient-opacity": "0.76",
        "--bg-hero-geometry-opacity": "0.84",
        "--bg-page-ambient-opacity": "0.4",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "72s",
        "--bg-anim-global-2-duration": "102s",
        "--bg-anim-global-orbit-duration": "182s",
        "--bg-anim-hero-1-duration": "50s",
        "--bg-anim-hero-2-duration": "74s",
        "--bg-anim-hero-orbit-duration": "164s",
        "--bg-anim-ecosystem-1-duration": "58s",
        "--bg-anim-ecosystem-2-duration": "82s",
        "--bg-anim-ecosystem-orbit-duration": "164s",
        "--bg-anim-twinkle-duration": "11s",
        "--bg-global-layer-1": "radial-gradient(58% 46% at 10% 10%, rgba(233, 247, 255, 0.42), transparent 72%), radial-gradient(46% 36% at 86% 18%, rgba(178, 214, 246, 0.22), transparent 78%), radial-gradient(52% 40% at 54% 84%, rgba(121, 174, 228, 0.17), transparent 80%), radial-gradient(0.08rem 0.08rem at 22% 20%, rgba(36, 69, 110, 0.1), transparent 62%), radial-gradient(0.08rem 0.08rem at 82% 72%, rgba(36, 69, 110, 0.1), transparent 62%)",
        "--bg-global-layer-2": "repeating-linear-gradient(120deg, transparent 0, transparent 22px, rgba(49, 93, 142, 0.12) 22px, rgba(49, 93, 142, 0.12) 23px), repeating-linear-gradient(240deg, transparent 0, transparent 26px, rgba(49, 93, 142, 0.1) 26px, rgba(49, 93, 142, 0.1) 27px), conic-gradient(from 110deg at 20% 62%, transparent 0deg, rgba(58, 122, 188, 0.2) 24deg, transparent 82deg, transparent 360deg), conic-gradient(from 258deg at 78% 34%, transparent 0deg, rgba(58, 122, 188, 0.2) 24deg, transparent 80deg, transparent 360deg), radial-gradient(38% 30% at 52% 50%, rgba(128, 189, 244, 0.14), transparent 82%)",
        "--bg-global-layer-1-size": "auto, auto, auto, 54rem 54rem, 62rem 62rem",
        "--bg-global-layer-2-size": "34rem 34rem, 40rem 40rem, 64rem 64rem, 72rem 72rem, auto",
        "--bg-hero-layer-1": "radial-gradient(48% 34% at 18% 24%, rgba(233, 247, 255, 0.36), transparent 76%), radial-gradient(44% 34% at 82% 20%, rgba(178, 214, 246, 0.26), transparent 78%), linear-gradient(120deg, transparent 0%, rgba(49, 93, 142, 0.12) 36%, transparent 46%)",
        "--bg-hero-layer-2": "repeating-linear-gradient(130deg, transparent 0, transparent 24px, rgba(49, 93, 142, 0.12) 24px, rgba(49, 93, 142, 0.12) 25px), conic-gradient(from 112deg at 26% 58%, transparent 0deg, rgba(58, 122, 188, 0.22) 28deg, transparent 88deg, transparent 360deg), conic-gradient(from 250deg at 74% 38%, transparent 0deg, rgba(58, 122, 188, 0.2) 24deg, transparent 84deg, transparent 360deg), radial-gradient(0.08rem 0.08rem at 20% 22%, rgba(36, 69, 110, 0.1), transparent 62%)",
        "--bg-hero-layer-2-size": "42rem 42rem, 56rem 56rem, 62rem 62rem, 28rem 28rem",
        "--bg-ecosystem-layer-1": "radial-gradient(52% 38% at 16% 14%, rgba(233, 247, 255, 0.32), transparent 76%), radial-gradient(44% 36% at 84% 18%, rgba(178, 214, 246, 0.24), transparent 78%), radial-gradient(44% 34% at 52% 84%, rgba(121, 174, 228, 0.2), transparent 80%), linear-gradient(130deg, transparent 0%, rgba(49, 93, 142, 0.1) 34%, transparent 46%)",
        "--bg-ecosystem-layer-2": "repeating-linear-gradient(122deg, transparent 0, transparent 22px, rgba(49, 93, 142, 0.12) 22px, rgba(49, 93, 142, 0.12) 23px), conic-gradient(from 112deg at 26% 58%, transparent 0deg, rgba(58, 122, 188, 0.24) 30deg, transparent 90deg, transparent 360deg), conic-gradient(from 250deg at 74% 38%, transparent 0deg, rgba(58, 122, 188, 0.22) 26deg, transparent 86deg, transparent 360deg), radial-gradient(0.08rem 0.08rem at 18% 24%, rgba(36, 69, 110, 0.1), transparent 62%), radial-gradient(0.08rem 0.08rem at 76% 30%, rgba(36, 69, 110, 0.1), transparent 62%), linear-gradient(180deg, rgba(121, 174, 228, 0.06) 0%, rgba(49, 93, 142, 0.1) 72%, rgba(49, 93, 142, 0.16) 100%)",
        "--bg-page-layer": "radial-gradient(40% 30% at 10% 8%, rgba(128, 189, 244, 0.18), transparent 84%), linear-gradient(110deg, transparent 0%, rgba(49, 93, 142, 0.1) 32%, transparent 42%)"
        }
      },
      dark: {
        vars: {
        "--bg-global-ambient-opacity": "0.66",
        "--bg-global-geometry-opacity": "0.72",
        "--bg-hero-ambient-opacity": "0.82",
        "--bg-hero-geometry-opacity": "0.9",
        "--bg-page-ambient-opacity": "0.46",
        "--bg-anim-play-state": "running",
        "--bg-anim-global-1-duration": "72s",
        "--bg-anim-global-2-duration": "102s",
        "--bg-anim-global-orbit-duration": "182s",
        "--bg-anim-hero-1-duration": "50s",
        "--bg-anim-hero-2-duration": "74s",
        "--bg-anim-hero-orbit-duration": "164s",
        "--bg-anim-ecosystem-1-duration": "58s",
        "--bg-anim-ecosystem-2-duration": "82s",
        "--bg-anim-ecosystem-orbit-duration": "164s",
        "--bg-anim-twinkle-duration": "11s",
        "--bg-global-layer-1": "radial-gradient(58% 46% at 10% 10%, rgba(112, 170, 227, 0.26), transparent 72%), radial-gradient(46% 36% at 86% 18%, rgba(66, 129, 194, 0.3), transparent 78%), radial-gradient(52% 40% at 54% 84%, rgba(39, 87, 146, 0.32), transparent 80%), radial-gradient(0.08rem 0.08rem at 22% 20%, rgba(169, 212, 255, 0.2), transparent 62%), radial-gradient(0.08rem 0.08rem at 82% 72%, rgba(169, 212, 255, 0.2), transparent 62%)",
        "--bg-global-layer-2": "repeating-linear-gradient(120deg, transparent 0, transparent 22px, rgba(116, 181, 252, 0.16) 22px, rgba(116, 181, 252, 0.16) 23px), repeating-linear-gradient(240deg, transparent 0, transparent 26px, rgba(116, 181, 252, 0.14) 26px, rgba(116, 181, 252, 0.14) 27px), conic-gradient(from 110deg at 20% 62%, transparent 0deg, rgba(102, 176, 255, 0.26) 24deg, transparent 82deg, transparent 360deg), conic-gradient(from 258deg at 78% 34%, transparent 0deg, rgba(102, 176, 255, 0.26) 24deg, transparent 80deg, transparent 360deg), radial-gradient(38% 30% at 52% 50%, rgba(86, 150, 223, 0.2), transparent 82%)",
        "--bg-global-layer-1-size": "auto, auto, auto, 54rem 54rem, 62rem 62rem",
        "--bg-global-layer-2-size": "34rem 34rem, 40rem 40rem, 64rem 64rem, 72rem 72rem, auto",
        "--bg-hero-layer-1": "radial-gradient(48% 34% at 18% 24%, rgba(112, 170, 227, 0.28), transparent 76%), radial-gradient(44% 34% at 82% 20%, rgba(66, 129, 194, 0.3), transparent 78%), linear-gradient(120deg, transparent 0%, rgba(116, 181, 252, 0.16) 36%, transparent 46%)",
        "--bg-hero-layer-2": "repeating-linear-gradient(130deg, transparent 0, transparent 24px, rgba(116, 181, 252, 0.16) 24px, rgba(116, 181, 252, 0.16) 25px), conic-gradient(from 112deg at 26% 58%, transparent 0deg, rgba(102, 176, 255, 0.28) 28deg, transparent 88deg, transparent 360deg), conic-gradient(from 250deg at 74% 38%, transparent 0deg, rgba(102, 176, 255, 0.26) 24deg, transparent 84deg, transparent 360deg), radial-gradient(0.08rem 0.08rem at 20% 22%, rgba(169, 212, 255, 0.2), transparent 62%)",
        "--bg-hero-layer-2-size": "42rem 42rem, 56rem 56rem, 62rem 62rem, 28rem 28rem",
        "--bg-ecosystem-layer-1": "radial-gradient(52% 38% at 16% 14%, rgba(112, 170, 227, 0.26), transparent 76%), radial-gradient(44% 36% at 84% 18%, rgba(66, 129, 194, 0.28), transparent 78%), radial-gradient(44% 34% at 52% 84%, rgba(39, 87, 146, 0.3), transparent 80%), linear-gradient(130deg, transparent 0%, rgba(116, 181, 252, 0.14) 34%, transparent 46%)",
        "--bg-ecosystem-layer-2": "repeating-linear-gradient(122deg, transparent 0, transparent 22px, rgba(116, 181, 252, 0.16) 22px, rgba(116, 181, 252, 0.16) 23px), conic-gradient(from 112deg at 26% 58%, transparent 0deg, rgba(102, 176, 255, 0.3) 30deg, transparent 90deg, transparent 360deg), conic-gradient(from 250deg at 74% 38%, transparent 0deg, rgba(102, 176, 255, 0.28) 26deg, transparent 86deg, transparent 360deg), radial-gradient(0.08rem 0.08rem at 18% 24%, rgba(169, 212, 255, 0.2), transparent 62%), radial-gradient(0.08rem 0.08rem at 76% 30%, rgba(169, 212, 255, 0.2), transparent 62%), linear-gradient(180deg, rgba(39, 87, 146, 0.1) 0%, rgba(39, 87, 146, 0.16) 72%, rgba(39, 87, 146, 0.24) 100%)",
        "--bg-page-layer": "radial-gradient(40% 30% at 10% 8%, rgba(86, 150, 223, 0.2), transparent 84%), linear-gradient(110deg, transparent 0%, rgba(116, 181, 252, 0.14) 32%, transparent 42%)"
        }
      }
    }
  }),
  definePreset({
    id: "minimal-deep-space",
    label: "Minimal Deep Space",
    description: "Quiet low-noise depth with sparse stars for distraction-free reading.",
    intensity: "quiet",
    animationProfile: "still",
    heroEnhancement: "subtle",
    variants: {
      light: {
        vars: {
        "--bg-global-ambient-opacity": "0.32",
        "--bg-global-geometry-opacity": "0.12",
        "--bg-hero-ambient-opacity": "0.44",
        "--bg-hero-geometry-opacity": "0.26",
        "--bg-page-ambient-opacity": "0.18",
        "--bg-anim-play-state": "paused",
        "--bg-anim-global-1-duration": "140s",
        "--bg-anim-global-2-duration": "220s",
        "--bg-anim-global-orbit-duration": "360s",
        "--bg-anim-hero-1-duration": "100s",
        "--bg-anim-hero-2-duration": "160s",
        "--bg-anim-hero-orbit-duration": "360s",
        "--bg-anim-ecosystem-1-duration": "110s",
        "--bg-anim-ecosystem-2-duration": "170s",
        "--bg-anim-ecosystem-orbit-duration": "360s",
        "--bg-anim-twinkle-duration": "22s",
        "--bg-global-layer-1": "radial-gradient(60% 48% at 12% 8%, rgba(248, 251, 255, 0.44), transparent 78%), radial-gradient(48% 36% at 84% 14%, rgba(208, 223, 241, 0.16), transparent 82%), radial-gradient(52% 42% at 54% 86%, rgba(152, 177, 206, 0.1), transparent 84%), radial-gradient(0.07rem 0.07rem at 18% 22%, rgba(45, 67, 96, 0.08), transparent 60%), radial-gradient(0.06rem 0.06rem at 78% 66%, rgba(45, 67, 96, 0.07), transparent 60%)",
        "--bg-global-layer-2": "radial-gradient(36% 30% at 52% 52%, rgba(132, 170, 213, 0.08), transparent 86%), linear-gradient(125deg, transparent 0%, rgba(80, 113, 152, 0.04) 42%, transparent 52%)",
        "--bg-global-layer-1-size": "auto, auto, auto, 92rem 92rem, 104rem 104rem",
        "--bg-global-layer-2-size": "auto, 110rem 110rem",
        "--bg-hero-layer-1": "radial-gradient(50% 38% at 18% 22%, rgba(246, 250, 255, 0.34), transparent 78%), radial-gradient(44% 36% at 82% 24%, rgba(208, 223, 241, 0.16), transparent 82%)",
        "--bg-hero-layer-2": "radial-gradient(0.07rem 0.07rem at 22% 24%, rgba(45, 67, 96, 0.08), transparent 62%), radial-gradient(0.07rem 0.07rem at 78% 68%, rgba(45, 67, 96, 0.07), transparent 62%)",
        "--bg-hero-layer-2-size": "52rem 52rem, 58rem 58rem",
        "--bg-ecosystem-layer-1": "radial-gradient(48% 36% at 16% 14%, rgba(246, 250, 255, 0.28), transparent 78%), radial-gradient(44% 34% at 84% 18%, rgba(208, 223, 241, 0.14), transparent 82%), radial-gradient(46% 36% at 54% 84%, rgba(152, 177, 206, 0.1), transparent 84%)",
        "--bg-ecosystem-layer-2": "radial-gradient(0.07rem 0.07rem at 18% 22%, rgba(45, 67, 96, 0.08), transparent 62%), radial-gradient(0.07rem 0.07rem at 76% 28%, rgba(45, 67, 96, 0.07), transparent 62%), radial-gradient(0.07rem 0.07rem at 64% 72%, rgba(45, 67, 96, 0.07), transparent 62%), linear-gradient(128deg, transparent 0%, rgba(80, 113, 152, 0.04) 32%, transparent 44%), linear-gradient(180deg, rgba(152, 177, 206, 0.03) 0%, rgba(152, 177, 206, 0.06) 80%, rgba(152, 177, 206, 0.1) 100%)",
        "--bg-page-layer": "radial-gradient(34% 26% at 12% 8%, rgba(208, 223, 241, 0.14), transparent 86%), radial-gradient(28% 24% at 86% 12%, rgba(132, 170, 213, 0.1), transparent 88%)"
        }
      },
      dark: {
        vars: {
        "--bg-global-ambient-opacity": "0.42",
        "--bg-global-geometry-opacity": "0.14",
        "--bg-hero-ambient-opacity": "0.5",
        "--bg-hero-geometry-opacity": "0.28",
        "--bg-page-ambient-opacity": "0.2",
        "--bg-anim-play-state": "paused",
        "--bg-anim-global-1-duration": "140s",
        "--bg-anim-global-2-duration": "220s",
        "--bg-anim-global-orbit-duration": "360s",
        "--bg-anim-hero-1-duration": "100s",
        "--bg-anim-hero-2-duration": "160s",
        "--bg-anim-hero-orbit-duration": "360s",
        "--bg-anim-ecosystem-1-duration": "110s",
        "--bg-anim-ecosystem-2-duration": "170s",
        "--bg-anim-ecosystem-orbit-duration": "360s",
        "--bg-anim-twinkle-duration": "22s",
        "--bg-global-layer-1": "radial-gradient(60% 48% at 12% 8%, rgba(90, 126, 176, 0.18), transparent 78%), radial-gradient(48% 36% at 84% 14%, rgba(53, 88, 133, 0.18), transparent 82%), radial-gradient(52% 42% at 54% 86%, rgba(30, 55, 88, 0.22), transparent 84%), radial-gradient(0.07rem 0.07rem at 18% 22%, rgba(178, 207, 249, 0.1), transparent 60%), radial-gradient(0.06rem 0.06rem at 78% 66%, rgba(178, 207, 249, 0.09), transparent 60%)",
        "--bg-global-layer-2": "radial-gradient(36% 30% at 52% 52%, rgba(74, 117, 171, 0.1), transparent 86%), linear-gradient(125deg, transparent 0%, rgba(113, 162, 224, 0.06) 42%, transparent 52%)",
        "--bg-global-layer-1-size": "auto, auto, auto, 92rem 92rem, 104rem 104rem",
        "--bg-global-layer-2-size": "auto, 110rem 110rem",
        "--bg-hero-layer-1": "radial-gradient(50% 38% at 18% 22%, rgba(90, 126, 176, 0.2), transparent 78%), radial-gradient(44% 36% at 82% 24%, rgba(53, 88, 133, 0.2), transparent 82%)",
        "--bg-hero-layer-2": "radial-gradient(0.07rem 0.07rem at 22% 24%, rgba(178, 207, 249, 0.1), transparent 62%), radial-gradient(0.07rem 0.07rem at 78% 68%, rgba(178, 207, 249, 0.09), transparent 62%)",
        "--bg-hero-layer-2-size": "52rem 52rem, 58rem 58rem",
        "--bg-ecosystem-layer-1": "radial-gradient(48% 36% at 16% 14%, rgba(90, 126, 176, 0.2), transparent 78%), radial-gradient(44% 34% at 84% 18%, rgba(53, 88, 133, 0.2), transparent 82%), radial-gradient(46% 36% at 54% 84%, rgba(30, 55, 88, 0.24), transparent 84%)",
        "--bg-ecosystem-layer-2": "radial-gradient(0.07rem 0.07rem at 18% 22%, rgba(178, 207, 249, 0.1), transparent 62%), radial-gradient(0.07rem 0.07rem at 76% 28%, rgba(178, 207, 249, 0.09), transparent 62%), radial-gradient(0.07rem 0.07rem at 64% 72%, rgba(178, 207, 249, 0.09), transparent 62%), linear-gradient(128deg, transparent 0%, rgba(113, 162, 224, 0.06) 32%, transparent 44%), linear-gradient(180deg, rgba(30, 55, 88, 0.06) 0%, rgba(30, 55, 88, 0.12) 80%, rgba(30, 55, 88, 0.18) 100%)",
        "--bg-page-layer": "radial-gradient(34% 26% at 12% 8%, rgba(90, 126, 176, 0.14), transparent 86%), radial-gradient(28% 24% at 86% 12%, rgba(74, 117, 171, 0.12), transparent 88%)"
        }
      }
    }
  })
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

export function getBackgroundThemeVariables(themeId: BackgroundThemeId, mode: BackgroundMode): BackgroundVariableMap {
  const preset = getBackgroundThemePreset(themeId);
  const selectedVariant = preset.variants?.[mode] ?? preset.variants?.light ?? preset.variants?.dark;
  return selectedVariant?.vars ?? {};
}
