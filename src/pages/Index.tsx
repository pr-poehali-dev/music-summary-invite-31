import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const tracks = [
  {
    id: 1,
    title: "Нашей Встрече",
    artist: "Вечер, который изменил всё",
    duration: "3:42",
    plays: "1",
  },
  {
    id: 2,
    title: "Первый Взгляд",
    artist: "Момент, который остался навсегда",
    duration: "4:15",
    plays: "∞",
  },
  {
    id: 3,
    title: "Между Словами",
    artist: "То, что не нужно говорить",
    duration: "3:58",
    plays: "каждый день",
  },
  {
    id: 4,
    title: "Ты и Я",
    artist: "Наша история",
    duration: "5:21",
    plays: "всегда",
  },
];

const SoundBars = ({ active }: { active: boolean }) => (
  <div className="flex items-end gap-[2px] h-4 w-5">
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className={`w-[3px] rounded-full bg-[var(--sp-green)] transition-all ${
          active ? "animate-sound-bar" : "h-1"
        }`}
        style={{
          animationDelay: active ? `${i * 0.15}s` : "0s",
          height: active ? undefined : "4px",
        }}
      />
    ))}
  </div>
);

export default function Index() {
  const [activeTrack, setActiveTrack] = useState<number | null>(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(38);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.2));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentTrack = tracks.find((t) => t.id === activeTrack) || tracks[0];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "var(--sp-dark)" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none animate-glow"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(29,185,84,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(29,185,84,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="w-full max-w-md relative z-10">

        {/* Header label */}
        <div
          className={`text-center mb-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <span
            className="text-xs font-golos tracking-[0.25em] uppercase"
            style={{ color: "var(--sp-green)" }}
          >
            персональное приглашение
          </span>
        </div>

        {/* Album art + title */}
        <div
          className={`text-center mb-10 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "0.15s" }}
        >
          {/* Vinyl disk */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div
              className={`w-48 h-48 rounded-full border-4 flex items-center justify-center ${isPlaying ? "animate-spin-slow" : ""}`}
              style={{
                background:
                  "conic-gradient(from 0deg, #1a1a1a 0%, #2a2a2a 25%, #1a1a1a 50%, #222 75%, #1a1a1a 100%)",
                borderColor: "var(--sp-surface2)",
                boxShadow: "0 0 40px rgba(29,185,84,0.2), inset 0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--sp-dark)",
                  border: "3px solid var(--sp-surface2)",
                }}
              >
                <div
                  className="w-3 h-3 rounded-full animate-pulse-green"
                  style={{ background: "var(--sp-green)" }}
                />
              </div>
            </div>
            {/* Grooves */}
            {[60, 72, 84, 96].map((s) => (
              <div
                key={s}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: s * 2,
                  height: s * 2,
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              />
            ))}
          </div>

          <h1
            className="font-cormorant text-5xl font-light leading-tight mb-2"
            style={{ color: "var(--sp-text)" }}
          >
            {currentTrack.title}
          </h1>
          <p
            className="font-golos text-sm font-normal"
            style={{ color: "var(--sp-muted)" }}
          >
            {currentTrack.artist}
          </p>
        </div>

        {/* Progress bar */}
        <div
          className={`mb-6 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "0.3s" }}
        >
          <div
            className="h-1 rounded-full overflow-hidden cursor-pointer group"
            style={{ background: "var(--sp-surface2)" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              setProgress((x / rect.width) * 100);
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-100 relative"
              style={{
                width: `${progress}%`,
                background: "var(--sp-green)",
              }}
            >
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "var(--sp-text)", transform: "translate(50%, -50%)" }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-golos text-xs" style={{ color: "var(--sp-muted)" }}>
              {Math.floor((progress / 100) * 3)}:
              {String(Math.floor(((progress / 100) * 222) % 60)).padStart(2, "0")}
            </span>
            <span className="font-golos text-xs" style={{ color: "var(--sp-muted)" }}>
              {currentTrack.duration}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div
          className={`flex items-center justify-center gap-8 mb-10 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "0.4s" }}
        >
          <button
            className="transition-opacity hover:opacity-100 opacity-60"
            onClick={() => setActiveTrack((p) => (p && p > 1 ? p - 1 : tracks.length))}
          >
            <Icon name="SkipBack" size={22} style={{ color: "var(--sp-text)" }} />
          </button>

          <button
            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{
              background: "var(--sp-green)",
              boxShadow: "0 0 24px rgba(29,185,84,0.4)",
            }}
            onClick={() => setIsPlaying((p) => !p)}
          >
            <Icon
              name={isPlaying ? "Pause" : "Play"}
              size={22}
              style={{ color: "#000", marginLeft: isPlaying ? 0 : 2 }}
            />
          </button>

          <button
            className="transition-opacity hover:opacity-100 opacity-60"
            onClick={() => setActiveTrack((p) => (p && p < tracks.length ? p + 1 : 1))}
          >
            <Icon name="SkipForward" size={22} style={{ color: "var(--sp-text)" }} />
          </button>
        </div>

        {/* Divider */}
        <div
          className={`mb-6 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "0.5s" }}
        >
          <div className="h-px" style={{ background: "var(--sp-surface2)" }} />
        </div>

        {/* Track list */}
        <div
          className={`space-y-1 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "0.55s" }}
        >
          <p
            className="font-golos text-xs tracking-widest uppercase mb-4"
            style={{ color: "var(--sp-muted)" }}
          >
            Плейлист
          </p>

          {tracks.map((track, idx) => {
            const isActive = activeTrack === track.id;
            return (
              <div
                key={track.id}
                className={`flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                  isActive ? "bg-white/5" : "hover:bg-white/[0.03]"
                }`}
                onClick={() => {
                  setActiveTrack(track.id);
                  setIsPlaying(true);
                  setProgress(0);
                }}
              >
                <div className="w-5 flex items-center justify-center flex-shrink-0">
                  {isActive && isPlaying ? (
                    <SoundBars active={true} />
                  ) : (
                    <span
                      className="font-golos text-sm"
                      style={{ color: isActive ? "var(--sp-green)" : "var(--sp-muted)" }}
                    >
                      {idx + 1}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="font-golos text-sm font-medium truncate"
                    style={{ color: isActive ? "var(--sp-green)" : "var(--sp-text)" }}
                  >
                    {track.title}
                  </p>
                  <p
                    className="font-golos text-xs truncate mt-0.5"
                    style={{ color: "var(--sp-muted)" }}
                  >
                    {track.artist}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="font-golos text-xs"
                    style={{ color: "var(--sp-muted)" }}
                  >
                    {track.plays} ♥
                  </span>
                  <span
                    className="font-golos text-xs"
                    style={{ color: "var(--sp-muted)" }}
                  >
                    {track.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer invite text */}
        <div
          className={`text-center mt-10 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "0.8s" }}
        >
          <p
            className="font-cormorant text-lg italic font-light"
            style={{ color: "var(--sp-muted)" }}
          >
            «Ты — лучшая мелодия в моей жизни»
          </p>
        </div>

      </div>
    </div>
  );
}
