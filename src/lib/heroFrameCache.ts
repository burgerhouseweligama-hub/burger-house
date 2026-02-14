/**
 * Singleton hero frame cache.
 *
 * ES module scope is evaluated once and persists for the lifetime of the
 * client-side SPA session. Frames are loaded once and reused across
 * navigations — eliminating flickering and redundant network requests.
 */

const TOTAL_FRAMES = 192;
const BATCH_SIZE = 10;

const getFramePath = (index: number): string => {
    const paddedIndex = index.toString().padStart(3, "0");
    const delay = index % 3 === 1 ? "0.041s" : "0.042s";
    return `/burgerzip/frame_${paddedIndex}_delay-${delay}.jpg`;
};

// Module-level cache
let cachedFrames: HTMLImageElement[] | null = null;
let loadingPromise: Promise<HTMLImageElement[]> | null = null;

export type ProgressCallback = (loaded: number, total: number) => void;

/**
 * Load a single image and resolve with the element.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img); // resolve even on error to avoid stalling
    });
}

/**
 * Load all frames in controlled batches, calling `onProgress` after each batch.
 */
async function loadAllFrames(
    onProgress?: ProgressCallback
): Promise<HTMLImageElement[]> {
    const frames: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loaded = 0;

    for (let start = 0; start < TOTAL_FRAMES; start += BATCH_SIZE) {
        const end = Math.min(start + BATCH_SIZE, TOTAL_FRAMES);
        const batchPromises: Promise<void>[] = [];

        for (let i = start; i < end; i++) {
            batchPromises.push(
                loadImage(getFramePath(i)).then((img) => {
                    frames[i] = img;
                })
            );
        }

        await Promise.all(batchPromises);
        loaded += end - start;
        onProgress?.(loaded, TOTAL_FRAMES);
    }

    return frames;
}

/**
 * Returns cached frames instantly if available, otherwise loads them once.
 *
 * Multiple simultaneous callers share the same loading promise — no duplicate
 * requests are fired.
 */
export function getHeroFrames(
    onProgress?: ProgressCallback
): Promise<HTMLImageElement[]> {
    // Already fully cached — return synchronously-resolving promise
    if (cachedFrames) {
        onProgress?.(TOTAL_FRAMES, TOTAL_FRAMES);
        return Promise.resolve(cachedFrames);
    }

    // Already loading — attach to the existing promise
    if (loadingPromise) {
        return loadingPromise;
    }

    // Start fresh load
    loadingPromise = loadAllFrames(onProgress).then((frames) => {
        cachedFrames = frames;
        loadingPromise = null;
        return frames;
    });

    return loadingPromise;
}

/**
 * Check if frames have already been loaded and cached.
 */
export function areFramesCached(): boolean {
    return cachedFrames !== null;
}

export { TOTAL_FRAMES };
