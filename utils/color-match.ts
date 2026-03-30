type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

const WEIGHTS = { h: 2, l: 1, s: 1 };
const MAX_SCORE = 20; // tune this threshold

export function getColorScore(target: string, candidate: string): number {
  const [h1, s1, l1] = hexToHsl(target);
  const [h2, s2, l2] = hexToHsl(candidate);

  const hueDiff   = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2)) / 360; // 0-1
  const satDiff   = Math.abs(s1 - s2) / 100; // 0-1
  const lightDiff = Math.abs(l1 - l2) / 100; // 0-1

  return (
    hueDiff   * WEIGHTS.h * 100 +
    satDiff   * WEIGHTS.s * 100 +
    lightDiff * WEIGHTS.l * 100
  );
}

export function isColorMatch(target: string, candidate: string): boolean {
  return getColorScore(target, candidate) <= MAX_SCORE;
}