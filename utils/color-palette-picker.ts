const UPNG = require('upng-js');
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Image } from 'react-native';

type RGB = [number, number, number];


async function getPixels(uri: string): Promise<RGB[]> {
  const imageSize = await new Promise<{ width: number; height: number }>((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });

  const squareSize = Math.min(imageSize.width, imageSize.height);
  const originX = Math.floor((imageSize.width - squareSize) / 2);
  const originY = Math.floor((imageSize.height - squareSize) / 2);

  const context = ImageManipulator.manipulate(uri);
  context.crop({ originX, originY, width: squareSize, height: squareSize });
  context.resize({ width: 50, height: 50 });

  const image = await context.renderAsync();
  const resized = await image.saveAsync({ format: SaveFormat.PNG, base64: true });

  if (!resized.base64) throw new Error('Failed to get base64');

  const binary = atob(resized.base64);
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0)).buffer;
  const decoded = UPNG.decode(bytes);
  const pixels = new Uint8Array(UPNG.toRGBA8(decoded)[0]);

  const result: RGB[] = [];
  for (let i = 0; i < pixels.length; i += 4) {
    result.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
  }
  return result;
}

// --- k-means ---

function distance(a: RGB, b: RGB): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2
  );
}

function average(pixels: RGB[]): RGB {
  const sum = pixels.reduce(
    (acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]] as RGB,
    [0, 0, 0] as RGB
  );
  return [
    Math.round(sum[0] / pixels.length),
    Math.round(sum[1] / pixels.length),
    Math.round(sum[2] / pixels.length),
  ];
}

function kMeans(pixels: RGB[], k: number, iterations = 10): RGB[] {
  // seed centroids by spreading evenly through pixel array
  let centroids: RGB[] = Array.from({ length: k }, (_, i) =>
    pixels[Math.floor((i / k) * pixels.length)]
  );

  for (let iter = 0; iter < iterations; iter++) {
    // assign each pixel to nearest centroid
    const clusters: RGB[][] = Array.from({ length: k }, () => []);

    for (const pixel of pixels) {
      let nearest = 0;
      let minDist = Infinity;
      for (let i = 0; i < centroids.length; i++) {
        const d = distance(pixel, centroids[i]);
        if (d < minDist) {
          minDist = d;
          nearest = i;
        }
      }
      clusters[nearest].push(pixel);
    }

    // recalculate centroids
    centroids = centroids.map((c, i) =>
      clusters[i].length > 0 ? average(clusters[i]) : c
    );
  }

  return centroids;
}

function rgbToHex([r, g, b]: RGB): string {
  const toHex = (v: number) => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// --- main export ---

export async function getPalette(uri: string, colorCount = 5): Promise<string[]> {
  const pixels = await getPixels(uri);
  const clusters = kMeans(pixels, colorCount);
  return clusters.map(rgbToHex);
}