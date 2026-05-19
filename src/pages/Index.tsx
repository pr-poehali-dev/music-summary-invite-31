import { useState, useEffect, useRef } from "react";

const TRACKS = [
  "https://files.catbox.moe/57i2o0.mp3",
  "https://files.catbox.moe/wwxsvw.mp3",
  "https://files.catbox.moe/k4hb46.mp3",
  "https://files.catbox.moe/whlrnp.mp3",
  "https://files.catbox.moe/pqkvab.mp3",
];

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const total = Math.max(0, diff);
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total % 86400000) / 3600000),
    minutes: Math.floor((total % 3600000) / 60000),
    seconds: Math.floor((total % 60000) / 1000),
  };
}

function Circles({ color = "#1DB954" }: { color?: string }) {
  const items = [
    { s: 280, x: -8, y: -12, o: 0.07 },
    { s: 200, x: 72, y: 10, o: 0.05 },
    { s: 160, x: 15, y: 68, o: 0.08 },
    { s: 240, x: 78, y: 60, o: 0.04 },
    { s: 110, x: 48, y: 42, o: 0.09 },
    { s: 190, x: -4, y: 78, o: 0.05 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: c.s,
            height: c.s,
            left: `${c.x}%`,
            top: `${c.y}%`,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            opacity: c.o,
            animation: `floatBg ${14 + i * 3}s ease-in-out infinite`,
            animationDelay: `${i * 1.8}s`,
          }}
        />
      ))}
    </div>
  );
}

function Slide({
  active,
  entering,
  children,
  bg,
}: {
  active: boolean;
  entering: boolean;
  children: React.ReactNode;
  bg: string;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-start overflow-y-auto"
      style={{
        background: bg,
        opacity: active ? 1 : 0,
        transform: active
          ? "translateY(0) scale(1)"
          : entering
          ? "translateY(40px) scale(0.97)"
          : "translateY(-20px) scale(0.97)",
        transition: "opacity 0.65s cubic-bezier(.4,0,.2,1), transform 0.65s cubic-bezier(.4,0,.2,1)",
        pointerEvents: active ? "auto" : "none",
        zIndex: active ? 10 : 1,
      }}
    >
      <div className="w-full max-w-sm px-6 py-10 flex flex-col items-center text-center gap-5 min-h-full justify-center">
        {children}
      </div>
    </div>
  );
}

export default function Index() {
  const [slide, setSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(-1);
  const [musicStarted, setMusicStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const countdown = useCountdown(new Date("2026-06-27T17:30:00"));

  const playSlide = (idx: number) => {
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.pause();
    audioRef.current.src = TRACKS[idx];
    audioRef.current.volume = 0.65;
    audioRef.current.loop = true;
    audioRef.current.play().catch(() => {});
  };

  const goTo = (idx: number, stopAudio = false) => {
    if (stopAudio && audioRef.current) audioRef.current.pause();
    setPrevSlide(slide);
    setSlide(idx);
    if (!stopAudio) playSlide(idx);
    else setTimeout(() => playSlide(idx), 50);
  };

  const handleStart = () => {
    if (!audioRef.current) audioRef.current = new Audio();
    setMusicStarted(true);
    playSlide(0);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#121212", fontFamily: "'Golos Text', sans-serif" }}
    >
      <style>{`
        @keyframes floatBg {
          0%, 100% { transform: translateY(0px) scale(1); }
          33% { transform: translateY(-18px) scale(1.05); }
          66% { transform: translateY(12px) scale(0.97); }
        }
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGreen {
          0%, 100% { box-shadow: 0 0 0 0 rgba(29,185,84,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(29,185,84,0); }
        }
        .vinyl-spin { animation: vinylSpin 8s linear infinite; }
        .pulse-dot { animation: pulseGreen 2s ease-in-out infinite; }
        @keyframes barAnim {
          0%, 100% { height: 4px; }
          50% { height: 18px; }
        }
        .bar { animation: barAnim 1s ease-in-out infinite; }
      `}</style>

      {/* ───── SLIDE 1 ───── */}
      <Slide
        active={slide === 0}
        entering={prevSlide < 0}
        bg="linear-gradient(160deg,#060d06 0%,#0d1a0d 50%,#060606 100%)"
      >
        <Circles color="#1DB954" />
        <div className="relative z-10 w-full flex flex-col items-center gap-5">
          {/* Logo */}
          <div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "3.2rem",
                fontWeight: 900,
                lineHeight: 1,
                background: "linear-gradient(135deg,#1DB954,#4ade80)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-2px",
              }}
            >
              spot<span style={{ fontStyle: "italic" }}>IRA</span>
            </h1>
            <p style={{ color: "#4b7a55", fontSize: "11px", letterSpacing: "0.3em" }} className="mt-1 uppercase">
              2026 год
            </p>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.3rem",
                color: "#fff",
                lineHeight: 1.4,
                fontWeight: 300,
              }}
            >
              не просто музыкальные итоги —
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.3rem",
                color: "#1DB954",
                fontStyle: "italic",
                lineHeight: 1.4,
              }}
            >
              приглашение отметить мои 30
            </p>
            <p style={{ color: "#a7a7a7", fontSize: "0.95rem", marginTop: "6px" }}>
              Привет, Алёночка 🎵 это для тебя
            </p>
          </div>

          {/* Countdown */}
          <div
            className="w-full rounded-2xl px-4 py-4"
            style={{ background: "rgba(29,185,84,0.07)", border: "1px solid rgba(29,185,84,0.2)" }}
          >
            <p style={{ color: "#1DB954", fontSize: "10px", letterSpacing: "0.28em" }} className="uppercase mb-3">
              До праздника
            </p>
            <div className="grid grid-cols-4 gap-1">
              {[
                { v: countdown.days, l: "дней" },
                { v: countdown.hours, l: "часов" },
                { v: countdown.minutes, l: "минут" },
                { v: countdown.seconds, l: "секунд" },
              ].map(({ v, l }) => (
                <div key={l} className="flex flex-col items-center">
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "2rem",
                      color: "#fff",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {String(v).padStart(2, "0")}
                  </span>
                  <span style={{ color: "#4b7a55", fontSize: "9px" }} className="mt-1">
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          {!musicStarted ? (
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-full font-semibold text-sm transition-all active:scale-95"
              style={{
                background: "#1DB954",
                color: "#000",
                boxShadow: "0 0 35px rgba(29,185,84,0.45)",
                letterSpacing: "0.04em",
              }}
            >
              🎵 Нажми сюда
            </button>
          ) : (
            <button
              onClick={() => goTo(1)}
              className="w-full py-4 rounded-full font-semibold text-sm transition-all active:scale-95"
              style={{
                background: "#1DB954",
                color: "#000",
                boxShadow: "0 0 35px rgba(29,185,84,0.45)",
                letterSpacing: "0.04em",
              }}
            >
              Смотреть итоги →
            </button>
          )}
        </div>
      </Slide>

      {/* ───── SLIDE 2 ───── */}
      <Slide
        active={slide === 1}
        entering={prevSlide < 1}
        bg="linear-gradient(160deg,#08080f 0%,#0d0d1f 50%,#080808 100%)"
      >
        <Circles color="#a78bfa" />
        <div className="relative z-10 w-full flex flex-col items-center gap-5">
          <p style={{ color: "#a78bfa", fontSize: "10px", letterSpacing: "0.3em" }} className="uppercase">
            трек года
          </p>

          {/* Vinyl */}
          <div className="relative flex items-center justify-center w-44 h-44">
            <div
              className="vinyl-spin w-44 h-44 rounded-full flex items-center justify-center"
              style={{
                background: "conic-gradient(from 0deg,#12122a 0%,#1e1e3a 25%,#12122a 50%,#1a1a32 75%,#12122a 100%)",
                boxShadow: "0 0 50px rgba(167,139,250,0.25), inset 0 0 20px rgba(0,0,0,0.6)",
              }}
            >
              {[44, 56, 68, 80].map((s) => (
                <div
                  key={s}
                  className="absolute rounded-full pointer-events-none"
                  style={{ width: s * 2, height: s * 2, border: "1px solid rgba(167,139,250,0.06)" }}
                />
              ))}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "#08080f", border: "3px solid #2d2d50" }}
              >
                <div
                  className="w-3 h-3 rounded-full pulse-dot"
                  style={{ background: "#a78bfa" }}
                />
              </div>
            </div>
          </div>

          <div>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", color: "#fff", fontWeight: 300 }}
            >
              Трек, что ассоциируется<br />у меня с тобой
            </h2>
          </div>

          <div
            className="w-full rounded-2xl px-5 py-4 text-left"
            style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)" }}
          >
            <p style={{ color: "#d1d5db", fontSize: "0.9rem", lineHeight: 1.65 }}>
              Сколько раз ты пыталась меня выселить, а я всё равно остаюсь где-то поблизости. Давай дальше создавать крутые моменты и продолжать смеяться без остановки 🎶
            </p>
          </div>

          {/* Sound bars */}
          <div className="flex items-end gap-1 h-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bar w-1 rounded-full"
                style={{ background: "#a78bfa", animationDelay: `${i * 0.15}s`, height: "4px" }}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(2, true)}
            className="w-full py-4 rounded-full font-semibold text-sm transition-all active:scale-95"
            style={{
              background: "#a78bfa",
              color: "#000",
              boxShadow: "0 0 30px rgba(167,139,250,0.35)",
            }}
          >
            Далее →
          </button>
        </div>
      </Slide>

      {/* ───── SLIDE 3 ───── */}
      <Slide
        active={slide === 2}
        entering={prevSlide < 2}
        bg="linear-gradient(160deg,#060d08 0%,#091409 50%,#060606 100%)"
      >
        <Circles color="#34d399" />
        <div className="relative z-10 w-full flex flex-col items-center gap-5">
          <p style={{ color: "#34d399", fontSize: "10px", letterSpacing: "0.3em" }} className="uppercase">
            момент с тобой
          </p>

          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#fff", fontWeight: 300 }}
          >
            Момент с тобой
          </h2>

          <div
            className="w-full rounded-2xl px-5 py-5 text-left space-y-3"
            style={{ background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)" }}
          >
            <p style={{ color: "#d1d5db", fontSize: "0.9rem", lineHeight: 1.7 }}>
              Помнишь, как мы гуляли по Монголии? Вот это да. А как я узнала твой рецепт заправки салата и готовлю его по сей день? А как мы смотрели лакорны, буквально съедая свой кулак?
            </p>
            <p style={{ color: "#34d399", fontSize: "0.9rem", fontWeight: 600 }}>
              Спасибо тебе за эти моменты 🌿
            </p>
          </div>

          <button
            onClick={() => goTo(3, true)}
            className="w-full py-4 rounded-full font-semibold text-sm transition-all active:scale-95"
            style={{
              background: "#34d399",
              color: "#000",
              boxShadow: "0 0 30px rgba(52,211,153,0.35)",
            }}
          >
            Что там дальше? →
          </button>
        </div>
      </Slide>

      {/* ───── SLIDE 4 ───── */}
      <Slide
        active={slide === 3}
        entering={prevSlide < 3}
        bg="linear-gradient(160deg,#0f0608 0%,#1a0a10 50%,#080606 100%)"
      >
        <Circles color="#f472b6" />
        <div className="relative z-10 w-full flex flex-col items-center gap-5">
          <p style={{ color: "#f472b6", fontSize: "10px", letterSpacing: "0.3em" }} className="uppercase">
            статистика дружбы
          </p>

          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#fff", fontWeight: 300 }}
          >
            Наши цифры
          </h2>

          <div className="w-full space-y-3">
            {[
              { emoji: "🗓️", label: "Сколько мы дружим", value: "2 481 день" },
              { emoji: "🎂", label: "Сколько раз ты была на моём дне рождения", value: "5 раз" },
              { emoji: "💚", label: "Как сильно я дорожу тобой", value: "как банк самой большой купюрой деняк в этом мире" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl px-4 py-4 text-left"
                style={{ background: "rgba(244,114,182,0.07)", border: "1px solid rgba(244,114,182,0.2)" }}
              >
                <p style={{ color: "#9ca3af", fontSize: "11px" }} className="mb-1">
                  {item.emoji} {item.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.2rem",
                    color: "#fff",
                    lineHeight: 1.3,
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <p style={{ color: "#a7a7a7", fontSize: "0.875rem" }}>
            И я хочу разделить с тобой свои 30 лет и переход в новое десятилетие ✨
          </p>

          <button
            onClick={() => goTo(4)}
            className="w-full py-4 rounded-full font-semibold text-sm transition-all active:scale-95"
            style={{
              background: "#f472b6",
              color: "#000",
              boxShadow: "0 0 30px rgba(244,114,182,0.35)",
            }}
          >
            Подробности →
          </button>
        </div>
      </Slide>

      {/* ───── SLIDE 5 ───── */}
      <Slide
        active={slide === 4}
        entering={prevSlide < 4}
        bg="linear-gradient(160deg,#080810 0%,#0c0c1a 50%,#08080e 100%)"
      >
        <Circles color="#c084fc" />
        <div className="relative z-10 w-full flex flex-col items-center gap-4">
          <p style={{ color: "#c084fc", fontSize: "10px", letterSpacing: "0.3em" }} className="uppercase">
            финальный аккорд
          </p>

          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#fff", fontWeight: 300 }}
          >
            Жду тебя 🎉
          </h2>

          <div
            className="w-full rounded-2xl px-5 py-4 text-left space-y-2"
            style={{ background: "rgba(192,132,252,0.07)", border: "1px solid rgba(192,132,252,0.25)" }}
          >
            <p style={{ color: "#fff", fontWeight: 600, fontSize: "1rem" }}>📅 27 июня в 17:30</p>
            <p style={{ color: "#d1d5db", fontSize: "0.875rem", lineHeight: 1.6 }}>
              Московский проспект 139А<br />
              м. Электросила<br />
              <span style={{ color: "#9ca3af", fontSize: "11px" }}>
                (вход с торца здания через железную калитку)
              </span>
            </p>
            <p style={{ color: "#a7a7a7", fontSize: "0.85rem" }}>Мой номер знаешь!</p>
            <div className="pt-2" style={{ borderTop: "1px solid rgba(192,132,252,0.2)" }}>
              <p style={{ color: "#c084fc", fontSize: "10px", letterSpacing: "0.25em" }} className="uppercase mb-1">
                Тематика
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: "1.2rem" }}>
                🎤 Eurovision
              </p>
            </div>
          </div>

          {/* Program */}
          <div
            className="w-full rounded-2xl px-5 py-4 text-left space-y-3"
            style={{ background: "rgba(192,132,252,0.05)", border: "1px solid rgba(192,132,252,0.15)" }}
          >
            <p style={{ color: "#c084fc", fontSize: "10px", letterSpacing: "0.25em" }} className="uppercase">
              Что тебя ждёт?
            </p>
            {[
              { time: "17:30–18:30", desc: "Сбор, лёгкий перекус, первые тосты" },
              { time: "18:30–20:30", desc: "Вкусно кушаем, вкусно пьём и проходим квиз по Иришке" },
              { time: "20:30–22:00", desc: "Слушаем музыку, общаемся" },
            ].map((item) => (
              <div key={item.time} className="flex gap-3">
                <span style={{ color: "#c084fc", fontSize: "11px", flexShrink: 0, paddingTop: "2px", fontFamily: "monospace" }}>
                  {item.time}
                </span>
                <span style={{ color: "#d1d5db", fontSize: "0.85rem", lineHeight: 1.5 }}>{item.desc}</span>
              </div>
            ))}
          </div>

          <p style={{ color: "#6b7280", fontSize: "11px" }}>нажми, чтобы узнать подробности</p>

          <div className="flex flex-col gap-3 w-full">
            <a
              href="https://docs.google.com/document/d/19nD4DwoFk2GaUhR5G1j0_YAmeqTiTXoMtmebOjLU_JA/edit?tab=t.0"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full font-semibold text-sm text-center transition-all active:scale-95 block"
              style={{
                background: "#c084fc",
                color: "#000",
                boxShadow: "0 0 28px rgba(192,132,252,0.38)",
                textDecoration: "none",
              }}
            >
              🎤 Eurovision — подробности
            </a>
            <a
              href="https://docs.google.com/spreadsheets/d/1Ku3rdanulnFMoDGRRYnycAnj4sJThtFrm7mCLC-oufE/edit?gid=0#gid=0"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full font-semibold text-sm text-center transition-all active:scale-95 block"
              style={{
                background: "rgba(192,132,252,0.12)",
                color: "#c084fc",
                border: "1px solid rgba(192,132,252,0.4)",
                textDecoration: "none",
              }}
            >
              🎁 Wishlist
            </a>
          </div>
        </div>
      </Slide>

      {/* Dots */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2"
        style={{ zIndex: 20 }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-400"
            style={{
              width: slide === i ? 18 : 6,
              height: 6,
              background: slide === i
                ? ["#1DB954", "#a78bfa", "#34d399", "#f472b6", "#c084fc"][slide]
                : "rgba(255,255,255,0.18)",
              transition: "all 0.4s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
