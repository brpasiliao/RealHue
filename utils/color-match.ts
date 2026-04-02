import { hexToHsl } from "./color-helper";

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