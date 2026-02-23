import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

function useWindowSize() {
  const [s, setS] = useState({ w: window.innerWidth });
  useEffect(() => {
    const h = () => setS({ w: window.innerWidth });
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return s;
}

interface AnimNumProps {
  value: number;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

function AnimNum({ value, prefix = "", duration = 1100, decimals = 0 }: AnimNumProps) {
  const [d, setD] = useState(0);
  const r = useRef<number | null>(null);
  useEffect(() => {
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setD(parseFloat(((1 - Math.pow(1 - p, 3)) * value).toFixed(decimals)));
      if (p < 1) r.current = requestAnimationFrame(tick);
    };
    r.current = requestAnimationFrame(tick);
    return () => {
      if (r.current !== null) cancelAnimationFrame(r.current);
    };
  }, [value, duration, decimals]);
  return <>{prefix}{decimals > 0 ? d.toFixed(decimals) : d.toLocaleString()}</>;
}

/* ── theme tokens ── */
const LIGHT = {
  bg: "#F4F2EE",
  frame: "#F4F2EE",
  outer: "#E8E5DE",
  sidebar: "#FAFAF8",
  sidebarBorder: "#EEECE8",
  card: "#fff",
  cardBorder: "#EEEDEA",
  input: "#fff",
  inputBorder: "#DEDBD5",
  navActive: "#F0EDE7",
  navActiveBorder: "#E0DDD6",
  navBadgeBg: "#E8F3E8",
  accentBadge: "#E8453C",
  text: "#1A1A1A",
  text2: "#5A5A5A",
  text3: "#8A8A8A",
  text4: "#A0A0A0",
  text5: "#A8A8A8",
  divider: "#F0EFEB",
  divider2: "#F8F7F5",
  rowHover: "#FDFCFB",
  green: "#4A7C59",
  greenBg: "#E8F3E8",
  greenText: "#4A7C59",
  red: "#C75050",
  amber: "#C4A050",
  amberBg: "#FAF3E0",
  bar: "#A8C5A8",
  line: "#4A7C59",
  dot: "#4A7C59",
  gridLine: "#F0F0EE",
  scrollThumb: "#D8D5CE",
  spendbg: "#F0EDE7",
  spendBorder: "#E5E2DC",
  addBtn: "#4A7C59",
  addBtnText: "#fff",
  logoIcon: "#4A7C59",
  avatar: "linear-gradient(135deg,#C4A882,#A08060)",
  pillActive: "#1A1A1A",
  pillActiveBorder: "#1A1A1A",
  pillBg: "#fff",
  pillText: "#888",
  tooltipBg: "#fff",
  tooltipBorder: "#eee",
  toggleTrack: "#E0DDD6",
  toggleThumb: "#fff",
  toggleIcon: "☀️",
  shadow: "0 8px 40px rgba(0,0,0,.08)",
};

type Theme = typeof LIGHT;

const DARK: Theme = {
  bg: "#18181B",
  frame: "#1C1C1F",
  outer: "#111113",
  sidebar: "#1A1A1E",
  sidebarBorder: "#2A2A2F",
  card: "#222228",
  cardBorder: "#2E2E35",
  input: "#2A2A30",
  inputBorder: "#38383F",
  navActive: "#2D2D35",
  navActiveBorder: "#3A3A44",
  navBadgeBg: "#1E3328",
  accentBadge: "#E8453C",
  text: "#F0F0F2",
  text2: "#B0B0BC",
  text3: "#7A7A8A",
  text4: "#666672",
  text5: "#5A5A68",
  divider: "#2A2A32",
  divider2: "#262630",
  rowHover: "#26262E",
  green: "#5DBE7A",
  greenBg: "#1A2E22",
  greenText: "#5DBE7A",
  red: "#E06868",
  amber: "#D4B060",
  amberBg: "#2A2010",
  bar: "#4A6B5A",
  line: "#5DBE7A",
  dot: "#5DBE7A",
  gridLine: "#2A2A32",
  scrollThumb: "#3A3A44",
  spendbg: "#252530",
  spendBorder: "#323240",
  addBtn: "#5DBE7A",
  addBtnText: "#0A1A10",
  logoIcon: "#5DBE7A",
  avatar: "linear-gradient(135deg,#7A6040,#5A4428)",
  pillActive: "#F0F0F2",
  pillActiveBorder: "#888",
  pillBg: "#2A2A30",
  pillText: "#777",
  tooltipBg: "#2A2A32",
  tooltipBorder: "#3A3A44",
  toggleTrack: "#5DBE7A",
  toggleThumb: "#fff",
  toggleIcon: "🌙",
  shadow: "0 8px 40px rgba(0,0,0,.4)",
};

/* ── data ── */
interface Sub {
  id: number;
  name: string;
  category: string;
  price: number;
  billing: string;
  status: string;
  logo: string;
  color: string;
  next: string;
}

const SUBS_INIT: Sub[] = [
  { id: 1, name: "ChatGPT Plus", category: "LLM", price: 20, billing: "Monthly", status: "active", logo: "https://icons.duckduckgo.com/ip3/chat.openai.com.ico", color: "#4A7C59", next: "Feb 28" },
  { id: 2, name: "Claude Pro", category: "LLM", price: 20, billing: "Monthly", status: "active", logo: "https://icons.duckduckgo.com/ip3/claude.ai.ico", color: "#7C5A4A", next: "Mar 3" },
  { id: 3, name: "Midjourney", category: "Image", price: 30, billing: "Monthly", status: "active", logo: "https://icons.duckduckgo.com/ip3/midjourney.com.ico", color: "#5A4A7C", next: "Feb 25" },
  { id: 4, name: "GitHub Copilot", category: "Coding", price: 10, billing: "Monthly", status: "active", logo: "https://icons.duckduckgo.com/ip3/github.com.ico", color: "#4A6B7C", next: "Mar 1" },
  { id: 5, name: "Perplexity Pro", category: "Search", price: 20, billing: "Monthly", status: "active", logo: "https://icons.duckduckgo.com/ip3/perplexity.ai.ico", color: "#7C6A4A", next: "Mar 5" },
  { id: 6, name: "Runway ML", category: "Video", price: 35, billing: "Monthly", status: "paused", logo: "https://icons.duckduckgo.com/ip3/runwayml.com.ico", color: "#7C4A4A", next: "—" },
  { id: 7, name: "ElevenLabs", category: "Audio", price: 22, billing: "Monthly", status: "active", logo: "https://icons.duckduckgo.com/ip3/elevenlabs.io.ico", color: "#4A7C74", next: "Feb 27" },
  { id: 8, name: "Notion AI", category: "Productivity", price: 8, billing: "Monthly", status: "active", logo: "https://icons.duckduckgo.com/ip3/notion.so.ico", color: "#6B7C4A", next: "Mar 2" },
];
const MONTHLY = [
  { m: "Jul", spend: 105 }, { m: "Aug", spend: 115 }, { m: "Sep", spend: 120 }, { m: "Oct", spend: 130 },
  { m: "Nov", spend: 145 }, { m: "Dec", spend: 165 }, { m: "Jan", spend: 155 }, { m: "Feb", spend: 165 },
];
const CATEGORY_DATA = [
  { cat: "LLM", total: 40 }, { cat: "Image", total: 30 }, { cat: "Coding", total: 10 },
  { cat: "Search", total: 20 }, { cat: "Video", total: 35 }, { cat: "Audio", total: 22 }, { cat: "Prod.", total: 8 },
];
const RECENT = [
  { sub: "ElevenLabs", amount: 22, date: "Feb 19", logo: "https://icons.duckduckgo.com/ip3/elevenlabs.io.ico", color: "#4A7C74" },
  { sub: "ChatGPT Plus", amount: 20, date: "Feb 17", logo: "https://icons.duckduckgo.com/ip3/chat.openai.com.ico", color: "#4A7C59" },
  { sub: "Notion AI", amount: 8, date: "Feb 16", logo: "https://icons.duckduckgo.com/ip3/notion.so.ico", color: "#6B7C4A" },
  { sub: "Perplexity Pro", amount: 20, date: "Feb 15", logo: "https://icons.duckduckgo.com/ip3/perplexity.ai.ico", color: "#7C6A4A" },
  { sub: "Claude Pro", amount: 20, date: "Feb 14", logo: "https://icons.duckduckgo.com/ip3/claude.ai.ico", color: "#7C5A4A" },
  { sub: "GitHub Copilot", amount: 10, date: "Feb 13", logo: "https://icons.duckduckgo.com/ip3/github.com.ico", color: "#4A6B7C" },
];

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
};

function parseDate(d: string): number {
  if (d === "—") return Infinity;
  const [m, day] = d.split(" ");
  return MONTH_MAP[m] * 100 + parseInt(day);
}


const icons: Record<string, React.ReactNode> = {
  grid: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="5.5" height="5.5" rx="1.2" /><rect x="10.5" y="2" width="5.5" height="5.5" rx="1.2" /><rect x="2" y="10.5" width="5.5" height="5.5" rx="1.2" /><rect x="10.5" y="10.5" width="5.5" height="5.5" rx="1.2" /></svg>,
  list: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 5h12M3 9h12M3 13h12" /></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3v10M3 8h10" /></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 6.5a4.5 4.5 0 00-9 0c0 5-2.25 6.5-2.25 6.5h13.5s-2.25-1.5-2.25-6.5" /><path d="M10.3 15a1.5 1.5 0 01-2.6 0" /></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="2.5" /><path d="M14.5 11a1 1 0 00.2 1.1l.1.1a1.2 1.2 0 01-1.7 1.7l-.1-.1a1 1 0 00-1.1-.2 1 1 0 00-.6.9v.3a1.2 1.2 0 01-2.4 0v-.2a1 1 0 00-.7-.9 1 1 0 00-1.1.2l-.1.1a1.2 1.2 0 01-1.7-1.7l.1-.1A1 1 0 005.5 11a1 1 0 00-.9-.6h-.3a1.2 1.2 0 010-2.4h.2a1 1 0 00.9-.7 1 1 0 00-.2-1.1l-.1-.1a1.2 1.2 0 011.7-1.7l.1.1a1 1 0 001.1.2h0a1 1 0 00.6-.9v-.3a1.2 1.2 0 012.4 0v.2a1 1 0 00.6.9 1 1 0 001.1-.2l.1-.1a1.2 1.2 0 011.7 1.7l-.1.1a1 1 0 00-.2 1.1v0a1 1 0 00.9.6h.3a1.2 1.2 0 010 2.4h-.2a1 1 0 00-.9.6z" /></svg>,
  chart: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 14l4-5 4 3 4-7 2 2" /></svg>,
  tag: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2h7l7 7a2 2 0 010 2.8l-4.2 4.2a2 2 0 01-2.8 0L2 9z" /><circle cx="6.5" cy="6.5" r="1" /></svg>,
  help: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="7" /><path d="M6.5 6.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" /><circle cx="9" cy="13" r=".5" fill="currentColor" /></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4h10M4 4V2h6v2M5 7v4M9 7v4M3 4l.7 8h6.6L11 4" /></svg>,
  pause: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 3v8M10 3v8" /></svg>,
  play: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2l10 5-10 5z" /></svg>,
};

/* ── dark mode toggle ── */
interface DarkToggleProps {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  t: Theme;
}

function DarkToggle({ dark, setDark, t }: DarkToggleProps) {
  return (
    <button
      onClick={() => setDark((d: boolean) => !d)}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "6px 10px 6px 8px", borderRadius: 20,
        border: `1px solid ${t.inputBorder}`,
        background: t.input, cursor: "pointer",
        fontFamily: "inherit", transition: "all .25s",
      }}
    >
      <div style={{
        width: 32, height: 18, borderRadius: 10,
        background: t.toggleTrack,
        position: "relative", transition: "background .3s", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 2, left: dark ? 16 : 2,
          width: 14, height: 14, borderRadius: "50%",
          background: t.toggleThumb,
          boxShadow: "0 1px 3px rgba(0,0,0,.3)",
          transition: "left .25s cubic-bezier(.16,1,.3,1)",
        }} />
      </div>
      <span style={{ fontSize: 13 }}>{t.toggleIcon}</span>
    </button>

  );
}

/* ── sidebar ── */
interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
  active: string;
  setActive: (name: string) => void;
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  t: Theme;
  totalNow: number;
}

function Sidebar({ open, onClose, isMobile, active, setActive, dark, setDark, t, totalNow }: SidebarProps) {
  const navItems = [
    { name: "Dashboard", icon: "grid" },
    { name: "Subscriptions", icon: "tag" },
    { name: "Analytics", icon: "chart" },
    { name: "Notifications", icon: "bell", badge: 3 },
    { name: "Settings", icon: "settings" },
    { name: "Help", icon: "help" },
  ];

  const content = (
    <aside style={{ width: "100%", height: "100%", background: t.sidebar, display: "flex", flexDirection: "column", borderRight: `1px solid ${t.sidebarBorder}`, fontFamily: "inherit", transition: "background .3s, border-color .3s" }}>
      {/* logo */}
      <div style={{ padding: "20px 18px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: t.logoIcon, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
          <span style={{ fontWeight: 700, fontSize: 15.5, color: t.text, letterSpacing: -0.3, transition: "color .3s" }}>SubTrackr</span>
        </div>
        {isMobile && (
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: t.text3, display: "flex", padding: 4 }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4l10 10M14 4L4 14" /></svg>
          </button>
        )}
      </div>

      {/* user */}
      <div style={{ padding: "6px 18px 14px", display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: t.avatar, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 600 }}>RA</div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text, transition: "color .3s" }}>Rahat Ali</div>
          <div style={{ fontSize: 10.5, color: t.text4 }}>Personal Plan</div>
        </div>
      </div>

      {/* nav */}
      <div style={{ flex: 1, padding: "0 10px", overflowY: "auto" }}>
        <div style={{ padding: "8px 8px 6px", fontSize: 10, fontWeight: 600, letterSpacing: 1.2, color: t.text5, textTransform: "uppercase" }}>MAIN MENU</div>
        {navItems.map(item => {
          const isA = active === item.name;
          return (
            <button key={item.name} onClick={() => { setActive(item.name); if (isMobile) onClose(); }} style={{
              display: "flex", alignItems: "center", gap: 9, width: "100%",
              padding: "7px 10px", borderRadius: 8,
              border: isA ? `1px solid ${t.navActiveBorder}` : "1px solid transparent",
              background: isA ? t.navActive : "transparent",
              color: isA ? t.text : t.text2,
              fontSize: 13, fontWeight: isA ? 600 : 400, cursor: "pointer",
              fontFamily: "inherit", textAlign: "left", marginBottom: 1,
              transition: "all .15s",
            }}>
              <span style={{ display: "flex", opacity: 0.6 }}>{icons[item.icon]}</span>
              <span style={{ flex: 1 }}>{item.name}</span>
              {item.badge && <span style={{ background: t.accentBadge, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.badge}</span>}
            </button>
          );
        })}
      </div>

      {/* monthly spend badge */}
      <div style={{ margin: "8px 14px", padding: "12px 14px", borderRadius: 10, background: t.spendbg, border: `1px solid ${t.spendBorder}`, transition: "all .3s" }}>
        <div style={{ fontSize: 10.5, color: t.text4, marginBottom: 4 }}>This month's spend</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: t.text, letterSpacing: -0.5 }}>${totalNow}</div>
        <div style={{ fontSize: 10.5, color: t.greenText, marginTop: 2, fontWeight: 500 }}>↑ $20 from last month</div>
      </div>

      {/* dark toggle + add btn */}
      <div style={{ padding: "4px 14px 6px" }}>
        <DarkToggle dark={dark} setDark={setDark} t={t} />
      </div>
      <div style={{ padding: "6px 14px 18px" }}>
        <button style={{ width: "100%", padding: "9px", borderRadius: 8, border: "none", background: t.addBtn, color: t.addBtnText, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background .3s" }}>
          {icons.plus} Add Subscription
        </button>
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <>
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 998, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .25s" }} />
        <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 260, zIndex: 999, transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform .3s cubic-bezier(.16,1,.3,1)" }}>{content}</div>
      </>
    );
  }
  return content;
}

/* ── stat card ── */
interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  change?: string;
  positive?: boolean;
  delay?: number;
  prefix?: string;
  t: Theme;
}

function StatCard({ label, value, sub, change, positive, delay = 0, prefix = "$", t }: StatCardProps) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t2 = setTimeout(() => setVis(true), delay); return () => clearTimeout(t2); }, []);
  return (
    <div style={{ flex: "1 1 0", minWidth: 0, background: t.card, borderRadius: 12, border: `1px solid ${t.cardBorder}`, padding: "16px 18px", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(8px)", transition: "all .5s cubic-bezier(.16,1,.3,1), background .3s, border-color .3s" }}>
      <div style={{ fontSize: 12, color: t.text3, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: t.text, letterSpacing: -0.8, lineHeight: 1 }}>
        <AnimNum value={value} prefix={prefix} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 11, color: t.text4 }}>
        <span>{sub}</span>
        {change && <span style={{ color: positive ? t.green : t.red, fontWeight: 600, fontSize: 11 }}>{positive ? "▲" : "▼"} {change}</span>}
      </div>
    </div>
  );
}

/* ── logo img helper ── */
interface LogoImgProps {
  src: string;
  color: string;
  size?: number;
  radius?: number;
}

function LogoImg({ src, color, size = 32, radius = 8 }: LogoImgProps) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
      {!err
        ? <img src={src} onError={() => setErr(true)} style={{ width: size * 0.72, height: size * 0.72, objectFit: "contain", imageRendering: "auto" }} />
        : <span style={{ fontSize: size * 0.5, opacity: 0.5 }}>?</span>}
    </div>
  );
}

/* ── sub row ── */
interface SubRowProps {
  s: Sub;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  t: Theme;
}

function SubRow({ s, onToggle, onDelete, t }: SubRowProps) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "grid", gridTemplateColumns: "36px 1fr 80px 80px 90px 80px 60px", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: `1px solid ${t.divider2}`, background: hov ? t.rowHover : "transparent", transition: "background .1s", borderRadius: 8 }}>
      <LogoImg src={s.logo} color={s.color} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{s.name}</div>
        <div style={{ fontSize: 11, color: t.text4 }}>{s.category}</div>
      </div>
      <div style={{ fontSize: 13, color: t.text2 }}>${s.price}/mo</div>
      <div style={{ fontSize: 11.5, color: t.text3 }}>{s.billing}</div>
      <div style={{ fontSize: 11.5 }}>
        <span style={{ padding: "3px 8px", borderRadius: 20, background: s.status === "active" ? t.greenBg : t.amberBg, color: s.status === "active" ? t.greenText : t.amber, fontWeight: 500 }}>
          {s.status === "active" ? "Active" : "Paused"}
        </span>
      </div>
      <div style={{ fontSize: 11.5, color: t.text3 }}>{s.next}</div>
      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <button onClick={() => onToggle(s.id)} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${t.inputBorder}`, background: t.input, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.text3 }}>{s.status === "active" ? icons.pause : icons.play}</button>
        <button onClick={() => onDelete(s.id)} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${t.inputBorder}`, background: t.input, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.red }}>{icons.trash}</button>
      </div>
    </div>
  );
}

/* ── main ── */
export default function App() {
  const { w } = useWindowSize();
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1080;
  const isDesktop = w >= 1080;
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [subs, setSubs] = useState(SUBS_INIT);
  const [filter, setFilter] = useState("All");

  const t = dark ? DARK : LIGHT;

  const activeSubs2 = subs.filter(s => s.status === "active");
  const totalNow = activeSubs2.reduce((a, s) => a + s.price, 0);
  const categories = ["All", ...Array.from(new Set(subs.map(s => s.category)))];
  const filtered = filter === "All" ? subs : subs.filter(s => s.category === filter);
  const UPCOMING = subs.filter(s => s.status === "active" && s.next !== "—")
    .sort((a, b) => parseDate(a.next) - parseDate(b.next)).slice(0, 4);


  const toggleSub = (id: number) => setSubs(p => p.map(s => s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s));
  const deleteSub = (id: number) => setSubs(p => p.filter(s => s.id !== id));

  const pad = isMobile ? "16px 14px" : "22px 26px";

  const tooltipStyle = { borderRadius: 8, border: `1px solid ${t.tooltipBorder}`, background: t.tooltipBg, color: t.text, fontSize: 11, boxShadow: "0 4px 12px rgba(0,0,0,.1)" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body, #root { height:100%; }
        * { scrollbar-width:none !important; -ms-overflow-style:none !important; }
        *::-webkit-scrollbar { display:none !important; }
        .main-scroll { scrollbar-width:thin !important; scrollbar-color:var(--scroll-thumb) transparent !important; }
        .main-scroll::-webkit-scrollbar { display:block !important; width:5px !important; }
        .main-scroll::-webkit-scrollbar-thumb { background:var(--scroll-thumb) !important; border-radius:4px !important; }
      `}</style>

      <div style={{ "--scroll-thumb": t.scrollThumb, fontFamily: "'DM Sans', sans-serif", width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.outer, padding: isMobile ? 0 : isTablet ? "10px" : "18px", transition: "background .3s" } as React.CSSProperties}>
        <div style={{ width: "100%", maxWidth: 1440, height: isMobile ? "100vh" : `calc(100vh - ${isTablet ? 20 : 36}px)`, background: t.frame, borderRadius: isMobile ? 0 : 20, overflow: "hidden", display: "flex", boxShadow: t.shadow, transition: "background .3s, box-shadow .3s" }}>

          {/* sidebar */}
          {isMobile ? (
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile active={activeNav} setActive={setActiveNav} dark={dark} setDark={setDark} t={t} totalNow={totalNow} />
          ) : (
            <div style={{ width: 220, minWidth: 220, height: "100%", flexShrink: 0 }}>
              <Sidebar open isMobile={false} onClose={() => { }} active={activeNav} setActive={setActiveNav} dark={dark} setDark={setDark} t={t} totalNow={totalNow} />
            </div>
          )}

          {/* main */}
          <div className="main-scroll" style={{ flex: 1, overflowY: "auto", background: t.bg, transition: "background .3s" }}>
            <div style={{ padding: pad, display: "flex", flexDirection: "column", gap: 14 }}>

              {/* header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {isMobile && (
                    <button onClick={() => setSidebarOpen(true)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.inputBorder}`, background: t.input, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.text2 }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 5h12M3 9h12M3 13h12" /></svg>
                    </button>
                  )}
                  <div>
                    <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: t.text, letterSpacing: -0.5, lineHeight: 1, transition: "color .3s" }}>Overview</h1>
                    <div style={{ fontSize: 12, color: t.text4, marginTop: 2 }}>February 2026</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 12px", borderRadius: 8, border: `1px solid ${t.inputBorder}`, background: t.input, fontSize: 12.5, color: t.text4, transition: "all .3s" }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6" cy="6" r="4.5" /><path d="M13 13l-3-3" /></svg>
                    {!isMobile && "Search..."}
                  </div>
                  {/* dark toggle in header for desktop */}
                  {!isMobile && <DarkToggle dark={dark} setDark={setDark} t={t} />}
                </div>
              </div>

              {/* stat cards */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <StatCard label="Monthly Spend" value={totalNow} sub={`${activeSubs2.length} active subscriptions`} change="$20" positive={false} delay={0} t={t} />
                <StatCard label="Annual Projection" value={totalNow * 12} sub="Based on current subs" change="12% YoY" positive={false} delay={80} t={t} />
                <StatCard label="Active Subs" value={activeSubs2.length} sub={`${subs.length - activeSubs2.length} paused`} positive delay={160} prefix="" t={t} />
                <StatCard label="Avg. Per Tool" value={Math.round(totalNow / (activeSubs2.length || 1))} sub="Per active subscription" delay={240} t={t} />
              </div>

              {/* charts row */}
              <div style={{ display: "flex", gap: 14, flexWrap: isDesktop ? "nowrap" : "wrap" }}>
                {/* trend */}
                <div style={{ flex: "1 1 380px", minWidth: 0, background: t.card, borderRadius: 12, border: `1px solid ${t.cardBorder}`, padding: "18px 20px", transition: "all .3s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>Monthly Spend Trend</div>
                      <div style={{ fontSize: 11, color: t.text4, marginTop: 2 }}>Last 8 months</div>
                    </div>
                    <div style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${t.inputBorder}`, fontSize: 12, color: t.text3, cursor: "pointer", background: t.input }}>2025–2026 ▾</div>
                  </div>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer>
                      <LineChart data={MONTHLY} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} vertical={false} />
                        <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: t.text4 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: t.text4 }} domain={[80, "auto"]} tickFormatter={(v: any) => `$${v}`} />
                        <Tooltip formatter={(v: any) => [`$${v ?? 0}`, "Spend"]} contentStyle={tooltipStyle} />
                        <Line type="monotone" dataKey="spend" stroke={t.line} strokeWidth={2.5} dot={{ fill: t.dot, r: 4 }} activeDot={{ r: 6 }} animationDuration={1000} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* category */}
                <div style={{ flex: "1 1 260px", minWidth: 0, background: t.card, borderRadius: 12, border: `1px solid ${t.cardBorder}`, padding: "18px 20px", transition: "all .3s" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 4 }}>Spend by Category</div>
                  <div style={{ fontSize: 11, color: t.text4, marginBottom: 16 }}>Current month breakdown</div>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer>
                      <BarChart data={CATEGORY_DATA} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} vertical={false} />
                        <XAxis dataKey="cat" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: t.text4 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: t.text4 }} tickFormatter={(v: any) => `$${v}`} />
                        <Tooltip formatter={(v: any) => [`$${v ?? 0}`, "Spend"]} contentStyle={tooltipStyle} />
                        <Bar dataKey="total" fill={t.bar} radius={[3, 3, 0, 0]} animationDuration={900} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* subs table + side panels */}
              <div style={{ display: "flex", gap: 14, flexWrap: isDesktop ? "nowrap" : "wrap" }}>
                {/* table */}
                <div style={{ flex: "1 1 420px", minWidth: 0, background: t.card, borderRadius: 12, border: `1px solid ${t.cardBorder}`, padding: "18px 0 8px", transition: "all .3s" }}>
                  <div style={{ padding: "0 14px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>All Subscriptions</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {categories.map(c => (
                        <button key={c} onClick={() => setFilter(c)} style={{ padding: "4px 12px", borderRadius: 20, border: filter === c ? `1.5px solid ${t.pillActiveBorder}` : `1px solid ${t.inputBorder}`, background: t.pillBg, fontSize: 11, color: filter === c ? t.pillActive : t.pillText, fontWeight: filter === c ? 600 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 80px 80px 90px 80px 60px", gap: 8, padding: "6px 14px 8px", borderBottom: `1px solid ${t.divider}`, fontSize: 10.5, color: t.text5, fontWeight: 500 }}>
                    <span /><span>Name</span><span>Price</span><span>Billing</span><span>Status</span><span>Next Due</span><span />
                  </div>
                  {filtered.map(s => <SubRow key={s.id} s={s} onToggle={toggleSub} onDelete={deleteSub} t={t} />)}
                  {filtered.length === 0 && <div style={{ padding: "24px", textAlign: "center", color: t.text4, fontSize: 13 }}>No subscriptions in this category.</div>}
                </div>

                {/* right panels */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: "0 0 280px", minWidth: 0 }}>
                  {/* upcoming */}
                  <div style={{ background: t.card, borderRadius: 12, border: `1px solid ${t.cardBorder}`, padding: "18px 18px 12px", transition: "all .3s" }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 4 }}>Upcoming Renewals</div>
                    <div style={{ fontSize: 11, color: t.text4, marginBottom: 14 }}>Next 7 days</div>
                    {UPCOMING.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < UPCOMING.length - 1 ? `1px solid ${t.divider2}` : "none" }}>
                        <LogoImg src={s.logo} color={s.color} size={30} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: t.text4 }}>{s.next}</div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>${s.price}</div>
                      </div>
                    ))}
                  </div>

                  {/* recent payments */}
                  <div style={{ background: t.card, borderRadius: 12, border: `1px solid ${t.cardBorder}`, padding: "18px 18px 12px", transition: "all .3s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>Recent Payments</div>
                      <span style={{ fontSize: 12, color: t.text2, cursor: "pointer", fontWeight: 500 }}>View All</span>
                    </div>
                    {RECENT.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < RECENT.length - 1 ? `1px solid ${t.divider2}` : "none" }}>
                        <LogoImg src={r.logo} color={r.color} size={28} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 500, color: t.text }}>{r.sub}</div>
                          <div style={{ fontSize: 11, color: t.text4 }}>{r.date}</div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: t.red }}>−${r.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
