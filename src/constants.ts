/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const SONGS = [
  {
    id: 1,
    title: "Synthetic Dreams",
    artist: "Neural Network",
    duration: "03:45",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "neon-blue"
  },
  {
    id: 2,
    title: "Data Stream",
    artist: "Algorithmic Beat",
    duration: "04:12",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "neon-green"
  },
  {
    id: 3,
    title: "Neon Drift",
    artist: "Lofi-Gen",
    duration: "02:58",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "neon-pink"
  }
];

export const COLOR_MAP: Record<string, { bg: string, text: string, shadow: string, hex: string }> = {
  'neon-blue': { bg: 'bg-neon-blue', text: 'text-neon-blue', shadow: 'rgba(0, 210, 255, 0.4)', hex: '#00d2ff' },
  'neon-pink': { bg: 'bg-neon-pink', text: 'text-neon-pink', shadow: 'rgba(255, 0, 127, 0.5)', hex: '#ff007f' },
  'neon-green': { bg: 'bg-neon-green', text: 'text-neon-green', shadow: 'rgba(57, 255, 20, 0.5)', hex: '#39ff14' },
};
