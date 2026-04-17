/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import { SONGS, COLOR_MAP } from './constants';

export default function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = SONGS[currentSongIndex];
  const colors = COLOR_MAP[currentSong.color] || COLOR_MAP['neon-blue'];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSongIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextSong = () => setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
  const prevSong = () => setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="grid grid-cols-[280px_1fr] grid-rows-[1fr_100px] h-screen w-screen overflow-hidden border border-zinc-900 bg-bg text-text-main">
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
         onEnded={nextSong}
      />

      {/* Sidebar */}
      <aside className="bg-panel border-r border-zinc-900 p-6 flex flex-col gap-8 h-full">
        <div className="text-[1.2rem] font-extrabold tracking-[2px] uppercase text-neon-blue neon-text-blue mb-4">
          PulseOS
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-[2px] text-text-dim mb-4">
            Playlist — Midnight AI
          </div>
          <div className="space-y-2">
            {SONGS.map((song, idx) => (
              <div
                key={song.id}
                onClick={() => {
                  setCurrentSongIndex(idx);
                  setIsPlaying(true);
                }}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  idx === currentSongIndex 
                    ? 'bg-neon-blue/10 border border-neon-blue/20' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-[4px] bg-gradient-to-br transition-all ${
                  idx === currentSongIndex ? 'scale-110' : 'opacity-40'
                }`} style={{
                  background: `linear-gradient(135deg, ${COLOR_MAP[song.color].hex}, #ff007f)`
                }} />
                <div className="overflow-hidden">
                  <div className="text-[14px] font-medium truncate">{song.title}</div>
                  <div className="text-[11px] text-text-dim truncate">{song.artist} — {song.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-4 pt-4 border-t border-zinc-900">
          <div className="text-[10px] uppercase tracking-[2px] text-text-dim">Session Stats</div>
          <div className="font-mono text-[13px] space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500">System High</span>
              <span className="text-neon-pink neon-text-pink">1,240</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Runtime</span>
              <span className="text-text-main">01:14:22</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Game Area */}
      <main className="bg-black relative overflow-hidden h-full w-full">
        <SnakeGame />
      </main>

      {/* Player Bar (Footer) */}
      <footer className="col-span-2 bg-panel border-t border-zinc-900 flex items-center justify-between px-8 py-0 h-full">
        {/* Now Playing */}
        <div className="flex items-center gap-4 w-[300px]">
          <div className="w-12 h-12 rounded-[4px] bg-gradient-to-br from-neon-blue to-neon-pink" />
          <div className="overflow-hidden">
            <div className="text-[14px] font-semibold truncate text-white">{currentSong.title}</div>
            <div className="text-[12px] text-text-dim truncate">{currentSong.artist}</div>
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex flex-col items-center gap-2 max-w-[500px] w-full">
          <div className="flex items-center gap-6">
            <button onClick={prevSong} className="text-text-main hover:text-neon-blue transition-colors">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 bg-text-main text-bg rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>
            <button onClick={nextSong} className="text-text-main hover:text-neon-blue transition-colors">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          <div className="w-full flex flex-col items-center gap-1">
            <div className="w-full h-1 bg-zinc-900 rounded-full relative overflow-hidden group">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-neon-blue neon-shadow-blue"
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.1 }}
              />
            </div>
            <div className="w-full flex justify-between font-mono text-[10px] text-text-dim mt-1">
              <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor((audioRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')}</span>
              <span>{currentSong.duration}</span>
            </div>
          </div>
        </div>

        {/* Right Volume / Extras */}
        <div className="flex justify-end items-center gap-3 w-[150px]">
          <Volume2 className="w-[18px] text-text-dim" />
          <div className="flex-1 h-[3px] bg-zinc-800 relative">
            <div className="absolute top-0 left-0 h-full w-[80%] bg-text-dim" />
          </div>
        </div>
      </footer>
    </div>
  );
}
