import { Injectable } from '@angular/core';

/**
 * useTransform-style API (Angular equivalent of Framer Motion's useTransform).
 * Maps scroll progress through inputRange to outputRange for opacity, scale, y, etc.
 * Example: transform(heroProgress(), [0, 0.5, 1], [1, 0.92, 0.85]) for scale.
 */
@Injectable({ providedIn: 'root' })
export class ScrollMotionService {
  /**
   * Map a progress value (0-1) through input range to output range.
   * Like Framer Motion's useTransform(progress, inputRange, outputRange).
   */
  transform(
    progress: number,
    inputRange: number[],
    outputRange: number[]
  ): number {
    if (inputRange.length !== outputRange.length || inputRange.length < 2)
      return outputRange[0] ?? 0;
    let i = 0;
    while (i < inputRange.length - 1 && progress > inputRange[i + 1]) i++;
    const a = inputRange[i];
    const b = inputRange[i + 1];
    const t = b === a ? 1 : (progress - a) / (b - a);
    const outA = outputRange[i];
    const outB = outputRange[i + 1];
    return outA + t * (outB - outA);
  }

  /** Clamp progress to [0, 1] */
  clamp(progress: number): number {
    return Math.max(0, Math.min(1, progress));
  }
}
