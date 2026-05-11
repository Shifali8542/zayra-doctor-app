/**
 * Module-level in-memory cache for waveform data.
 * Keyed by record_id. Lives for the app session — no re-fetch for seen records.
 * No external library needed — a plain Map outlives any React component.
 */
import type { WaveformResponse } from '../../types';

const _cache = new Map<number, WaveformResponse>();

export const waveformCache = {
  get: (recordId: number): WaveformResponse | undefined =>
    _cache.get(recordId),

  set: (recordId: number, data: WaveformResponse): void => {
    _cache.set(recordId, data);
  },

  has: (recordId: number): boolean =>
    _cache.has(recordId),

  clear: (): void =>
    _cache.clear(),
};