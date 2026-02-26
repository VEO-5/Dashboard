import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import {
  LayoutDashboard, CreditCard, BarChart2, Bell, Settings, HelpCircle,
  Plus, Trash2, Pause, Play, Search, Menu, X, ChevronLeft, Sun, Moon, Edit3
} from "lucide-react";

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
  bg: "#ECEEF0",
  frame: "#ECEEF0",
  outer: "#E5ECCA",
  sidebar: "#FFFFFF",
  sidebarBorder: "#F0EFEB",
  sbText: "#1A1A1A",
  sbText2: "#8A8A8A",
  sbActiveBg: "#F0EDE7",
  sbActiveText: "#1A1A1A",
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
  sbText: "#F0F0F2",
  sbText2: "#B0B0BC",
  sbActiveBg: "#2D2D35",
  sbActiveText: "#F0F0F2",
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

const ALL_APPS = [
  { name: "ChatGPT Plus", category: "LLM", price: 20, color: "#4A7C59", logo: "https://icons.duckduckgo.com/ip3/chat.openai.com.ico" },
  { name: "Claude Pro", category: "LLM", price: 20, color: "#7C5A4A", logo: "https://icons.duckduckgo.com/ip3/claude.ai.ico" },
  { name: "Cursor", category: "Coding", price: 20, color: "#2E2E35", logo: "https://icons.duckduckgo.com/ip3/cursor.com.ico" },
  { name: "Gemini", category: "LLM", price: 20, color: "#4285F4", logo: "https://icons.duckduckgo.com/ip3/gemini.google.com.ico" },
  { name: "Open Canvas", category: "Design", price: 0, color: "#FF4F00", logo: "https://icons.duckduckgo.com/ip3/opencanvas.io.ico" },
  { name: "Lovable.dev", category: "Dev", price: 0, color: "#EC4899", logo: "https://icons.duckduckgo.com/ip3/lovable.dev.ico" },
  { name: "TikTok", category: "Video", price: 0, color: "#EE1D52", logo: "https://icons.duckduckgo.com/ip3/tiktok.com.ico" },
  { name: "Bolt.new", category: "Dev", price: 0, color: "#4B2DCB", logo: "https://icons.duckduckgo.com/ip3/bolt.new.ico" },
  { name: "Figma", category: "Design", price: 15, color: "#F24E1E", logo: "https://icons.duckduckgo.com/ip3/figma.com.ico" },
  { name: "Spotify", category: "Music", price: 11, color: "#1DB954", logo: "https://icons.duckduckgo.com/ip3/spotify.com.ico" },
  { name: "Netflix", category: "Video", price: 16, color: "#E50914", logo: "https://icons.duckduckgo.com/ip3/netflix.com.ico" },
  { name: "YouTube", category: "Video", price: 14, color: "#FF0000", logo: "https://icons.duckduckgo.com/ip3/youtube.com.ico" },
  { name: "Linear", category: "Dev", price: 12, color: "#5E6AD2", logo: "https://icons.duckduckgo.com/ip3/linear.app.ico" },
  { name: "Slack", category: "Productivity", price: 8, color: "#4A154B", logo: "https://icons.duckduckgo.com/ip3/slack.com.ico" },
  { name: "Perplexity Pro", category: "Search", price: 20, color: "#7C6A4A", logo: "https://icons.duckduckgo.com/ip3/perplexity.ai.ico" },
  { name: "Qwen", category: "LLM", price: 0, color: "#5454FF", logo: "https://icons.duckduckgo.com/ip3/qwenlm.ai.ico" },
  { name: "Midjourney", category: "Image", price: 30, color: "#5A4A7C", logo: "https://icons.duckduckgo.com/ip3/midjourney.com.ico" },
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
  grid: <LayoutDashboard size={18} strokeWidth={1.6} />,
  list: <CreditCard size={18} strokeWidth={1.6} />,
  plus: <Plus size={16} strokeWidth={2} />,
  bell: <Bell size={18} strokeWidth={1.6} />,
  settings: <Settings size={18} strokeWidth={1.6} />,
  chart: <BarChart2 size={18} strokeWidth={1.6} />,
  tag: <CreditCard size={18} strokeWidth={1.6} />,
  help: <HelpCircle size={18} strokeWidth={1.6} />,
  trash: <Trash2 size={14} strokeWidth={1.6} />,
  pause: <Pause size={14} strokeWidth={1.8} />,
  play: <Play size={14} strokeWidth={1.6} />,
};

/* ── professional logo icon ── */
function Logo({ t, size = 32 }: { t: Theme; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill={t.logoIcon} fillOpacity="0.1" />
      <path
        d="M10 18C10 16.8954 10.8954 16 12 16H20C21.1046 16 22 16.8954 22 18V20C22 21.1046 21.1046 22 20 22H12C10.8954 22 10 21.1046 10 20V18Z"
        fill={t.logoIcon}
        fillOpacity="0.8"
      />
      <path
        d="M10 12C10 10.8954 10.8954 10 12 10H20C21.1046 10 22 10.8954 22 12V14C22 15.1046 21.1046 16 20 16H12C10.8954 16 10 15.1046 10 14V12Z"
        fill={t.logoIcon}
        style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" }}
      />
    </svg>
  );
}

/* ── dark mode toggle ── */
interface DarkToggleProps {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  t: Theme;
  collapsed?: boolean;
}

function DarkToggle({ dark, setDark, t, collapsed }: DarkToggleProps) {
  return (
    <button
      onClick={() => setDark((d: boolean) => !d)}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        padding: collapsed ? "0" : "6px 14px 6px 4px", borderRadius: 40,
        width: collapsed ? 40 : "auto", height: collapsed ? 40 : "auto", margin: "0",
        border: collapsed ? "1px solid transparent" : `1px solid ${t.inputBorder}`,
        background: collapsed ? "transparent" : t.input, cursor: "pointer",
        fontFamily: "inherit", transition: "all .25s",
      }}
    >
      <div style={{
        width: 38, height: 22, borderRadius: 12,
        background: t.toggleTrack,
        position: "relative", transition: "background .3s", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 3, left: dark ? 19 : 3,
          width: 16, height: 16, borderRadius: "50%",
          background: t.toggleThumb,
          boxShadow: "0 1px 3px rgba(0,0,0,.3)",
          transition: "left .25s cubic-bezier(.16,1,.3,1)",
        }} />
      </div>
      {!collapsed && <span style={{ fontSize: 13, marginRight: 2 }}>{t.toggleIcon}</span>}
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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function Sidebar({ open, onClose, isMobile, active, setActive, dark, setDark, t, totalNow, collapsed = false, onToggleCollapse }: SidebarProps) {
  const navItems = [
    { name: "Dashboard", icon: "grid" },
    { name: "Subscriptions", icon: "tag" },
    { name: "Analytics", icon: "chart" },
    { name: "Notifications", icon: "bell", badge: 3 },
    { name: "Settings", icon: "settings" },
    { name: "Help", icon: "help" },
  ];

  const content = (
    <aside style={{ width: "100%", height: "100%", background: t.sidebar, display: "flex", flexDirection: "column", borderRight: `1px solid ${t.sidebarBorder}`, fontFamily: "inherit", transition: "background .3s, border-color .3s", overflow: "hidden" }}>

      {/* logo and user profile */}
      <div style={{ padding: collapsed ? "20px 0 10px" : "20px 18px 10px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", transition: "padding .3s" }}>
        {collapsed ? (
          <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Logo t={t} size={32} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Logo t={t} size={32} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15.5, color: t.sbText, letterSpacing: -0.3, whiteSpace: "nowrap", transition: "color .3s" }}>subbie</span>
          </div>
        )}
        {isMobile && (
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: t.sbText2, display: "flex", padding: 4 }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4l10 10M14 4L4 14" /></svg>
          </button>
        )}
      </div>



      {/* nav */}
      <div style={{ flex: 1, padding: collapsed ? "0 8px" : "0 10px", overflowY: "auto", overflowX: "hidden" }}>
        {!collapsed && <div style={{ padding: "8px 8px 6px", fontSize: 10, fontWeight: 600, letterSpacing: 1.2, color: t.sbText2, textTransform: "uppercase", whiteSpace: "nowrap" }}>MAIN MENU</div>}
        {collapsed && <div style={{ height: 14 }} />}
        {navItems.map(item => {
          const isA = active === item.name;
          return collapsed ? (
            /* collapsed: icon-only circle */
            <button key={item.name} title={item.name} onClick={() => { setActive(item.name); if (isMobile) onClose(); }} style={{
              position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40, borderRadius: 40, margin: "0 auto 4px",
              border: isA ? `1px solid ${t.navActiveBorder}` : "1px solid transparent",
              background: isA ? t.sbActiveBg : "transparent",
              color: isA ? t.sbActiveText : t.sbText2,
              cursor: "pointer", transition: "all .15s",
            }}>
              <span style={{ display: "flex" }}>{icons[item.icon]}</span>
              {item.badge && <span style={{ position: "absolute", top: 4, right: 4, background: t.accentBadge, color: "#fff", fontSize: 8, fontWeight: 700, borderRadius: "50%", width: 13, height: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.badge}</span>}
            </button>
          ) : (
            /* expanded: full row */
            <button key={item.name} onClick={() => { setActive(item.name); if (isMobile) onClose(); }} style={{
              display: "flex", alignItems: "center", gap: 9, width: "100%",
              padding: "9px 12px", borderRadius: 40,
              border: isA ? `1px solid ${t.navActiveBorder}` : "1px solid transparent",
              background: isA ? t.sbActiveBg : "transparent",
              color: isA ? t.sbActiveText : t.sbText2,
              fontSize: 13, fontWeight: isA ? 600 : 400, cursor: "pointer",
              fontFamily: "inherit", textAlign: "left", marginBottom: 1,
              transition: "all .15s", whiteSpace: "nowrap",
            }}>
              <span style={{ display: "flex", opacity: 0.6, flexShrink: 0 }}>{icons[item.icon]}</span>
              <span style={{ flex: 1 }}>{item.name}</span>
              {item.badge && <span style={{ background: t.accentBadge, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.badge}</span>}
            </button>
          );
        })}

        {/* collapse toggle button */}
        {!isMobile && (
          <button onClick={onToggleCollapse} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} style={{
            display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
            gap: 9, width: collapsed ? 40 : "100%",
            padding: collapsed ? "0" : "7px 10px",
            height: 40, borderRadius: 10,
            border: "1px solid transparent",
            background: "transparent",
            color: t.sbText2, cursor: "pointer",
            fontFamily: "inherit", marginBottom: 1, marginTop: 8,
            marginLeft: collapsed ? "auto" : 0, marginRight: collapsed ? "auto" : 0,
            transition: "all .15s",
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform .3s", flexShrink: 0 }}>
              <path d="M10 4L6 8l4 4" />
            </svg>
            {!collapsed && <span style={{ fontSize: 12, color: t.sbText2 }}>Collapse</span>}
          </button>
        )}
      </div>

      <div style={{ marginTop: "auto", padding: collapsed ? "0 8px 18px" : "0 10px 18px", display: "flex", flexDirection: "column", alignItems: collapsed ? "center" : "flex-start", gap: 8 }}>
        {/* user profile */}
        <div style={{ margin: "0", display: "flex", alignItems: "center", gap: 9, padding: collapsed ? "0" : "4px 8px 4px 4px", width: collapsed ? 40 : "100%", minWidth: 0, height: collapsed ? 40 : "auto", justifyContent: collapsed ? "center" : "flex-start", cursor: "pointer", transition: "all .25s", background: "transparent", border: "1px solid transparent", borderRadius: 40 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.avatar, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>U</div>
          {!collapsed && (
            <div style={{ overflow: "hidden", textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: t.sbText, lineHeight: 1.2, transition: "color .3s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>User</div>
              <div style={{ fontSize: 10.5, color: t.sbText2, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 1 }}>Personal Plan</div>
            </div>
          )}
        </div>

        {/* dark toggle */}
        <div style={{ display: "flex", justifyContent: collapsed ? "center" : "flex-start", width: collapsed ? "auto" : "100%", paddingLeft: collapsed ? 0 : 2 }}>
          <DarkToggle dark={dark} setDark={setDark} t={t} collapsed={collapsed} />
        </div>
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
    <div style={{ flex: "1 1 0", minWidth: 0, background: t.card, borderRadius: 24, border: `1px solid ${t.cardBorder}`, padding: "20px 22px", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(8px)", transition: "all .5s cubic-bezier(.16,1,.3,1), background .3s, border-color .3s" }}>
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
  onDelete: (s: Sub) => void;
  onEdit: (s: Sub) => void;
  t: Theme;
}

function SubRow({ s, onToggle, onDelete, onEdit, t }: SubRowProps) {
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
        <button onClick={() => onEdit(s)} style={{ width: 26, height: 26, borderRadius: 20, border: `1px solid ${t.inputBorder}`, background: t.input, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.text3 }}>
          <Edit3 size={12} />
        </button>
        <button onClick={() => onToggle(s.id)} style={{ width: 26, height: 26, borderRadius: 20, border: `1px solid ${t.inputBorder}`, background: t.input, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.text3 }}>{s.status === "active" ? icons.pause : icons.play}</button>
        <button onClick={() => onDelete(s)} style={{ width: 26, height: 26, borderRadius: 20, border: `1px solid ${t.inputBorder}`, background: t.input, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.red }}>{icons.trash}</button>
      </div>
    </div>
  );
}


/* ── add subscription modal ── */
interface AddSubModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (app: any) => void;
  t: Theme;
}

function AddSubModal({ open, onClose, onAdd, t }: AddSubModalProps) {
  const [q, setQ] = useState("");
  const featured = ALL_APPS.slice(0, 8);
  const filtered = ALL_APPS.filter(a => a.name.toLowerCase().includes(q.toLowerCase()));

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", transition: "all .3s" }}
      />
      <div style={{
        position: "relative", width: "100%", maxWidth: 540, maxHeight: "85vh",
        background: t.card === "#fff" ? "rgba(255,255,255,0.75)" : "rgba(30,30,35,0.75)",
        backdropFilter: "blur(24px)", borderRadius: 32, border: `1px solid ${t.divider}`,
        boxShadow: "0 30px 60px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", overflow: "hidden",
        animation: "modalIn .4s cubic-bezier(.16,1,.3,1)"
      }}>
        <div style={{ padding: "28px 24px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, letterSpacing: -0.6, lineHeight: 1 }}>Track New Service</h2>
              <p style={{ fontSize: 13, color: t.text4, marginTop: 4 }}>Choose an app to start tracking</p>
            </div>
            <button onClick={onClose} style={{ background: t.input, border: `1px solid ${t.inputBorder}`, color: t.text2, width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.text3 }} size={18} />
            <input
              autoFocus
              placeholder="Search 100+ applications..."
              value={q}
              onChange={e => setQ(e.target.value)}
              style={{ width: "100%", padding: "14px 14px 14px 44px", borderRadius: 16, border: `1px solid ${t.inputBorder}`, background: t.input, color: t.text, fontFamily: "inherit", outline: "none", fontSize: 15, transition: "all .2s" }}
            />
          </div>
        </div>
        <div className="main-scroll" style={{ flex: 1, overflowY: "auto", padding: "0 24px 28px" }}>
          {q === "" && (
            <div style={{ fontSize: 11, fontWeight: 700, color: t.text5, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Featured Services</div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
            {(q === "" ? featured : filtered).map(app => (
              <button
                key={app.name}
                onClick={() => { onAdd(app); onClose(); }}
                style={{
                  padding: "20px 12px", borderRadius: 24, border: `1px solid ${t.divider2}`,
                  background: t.card === "#fff" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.03)",
                  cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                  transition: "all .2s ease", textAlign: "center", position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = t.card === "#fff" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = t.green;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = t.card === "#fff" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.03)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.borderColor = t.divider2;
                }}
              >
                <LogoImg src={app.logo} color={app.color} size={48} radius={14} />
                <div style={{ minWidth: 0, width: "100%" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.name}</div>
                  <div style={{ fontSize: 11, color: t.text4, marginTop: 2 }}>{app.category}</div>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && q !== "" && (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>No apps found</div>
              <div style={{ fontSize: 13, color: t.text4, marginTop: 4 }}>Try searching for something else</div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
/* ── edit subscription modal ── */
interface EditModalProps {
  open: boolean;
  sub: Sub | null;
  onClose: () => void;
  onUpdate: (id: number, updates: Partial<Sub>) => void;
  t: Theme;
}

function EditModal({ open, sub, onClose, onUpdate, t }: EditModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [billing, setBilling] = useState("Monthly");
  const [next, setNext] = useState("");

  useEffect(() => {
    if (sub) {
      setName(sub.name);
      setPrice(sub.price);
      setBilling(sub.billing);
      setNext(sub.next);
    }
  }, [sub]);

  if (!open || !sub) return null;

  const handleSave = () => {
    onUpdate(sub.id, { name, price, billing, next });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }} />
      <div style={{
        position: "relative", width: "100%", maxWidth: 460, background: t.card, borderRadius: 28, border: `1px solid ${t.divider}`,
        boxShadow: "0 20px 50px rgba(0,0,0,0.2)", padding: 28, animation: "modalIn .3s ease-out"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text }}>Edit Subscription</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: t.text3 }}><X size={20} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.text4, marginBottom: 6 }}>Service Name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${t.inputBorder}`, background: t.input, color: t.text, fontSize: 14 }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.text4, marginBottom: 6 }}>Monthly Price ($)</label>
              <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${t.inputBorder}`, background: t.input, color: t.text, fontSize: 14 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.text4, marginBottom: 6 }}>Billing Cycle</label>
              <select value={billing} onChange={e => setBilling(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${t.inputBorder}`, background: t.input, color: t.text, fontSize: 14 }}>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.text4, marginBottom: 6 }}>Next Renewal</label>
            <input value={next} onChange={e => setNext(e.target.value)} placeholder="e.g. Mar 1" style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${t.inputBorder}`, background: t.input, color: t.text, fontSize: 14 }} />
          </div>
        </div>

        <button onClick={handleSave} style={{ width: "100%", marginTop: 24, padding: "14px", borderRadius: 14, border: "none", background: t.addBtn, color: t.addBtnText, fontWeight: 600, cursor: "pointer", transition: "all .2s" }}>Save Changes</button>
      </div>
    </div>
  );
}

/* ── confirmation modal ── */
interface ConfirmDeleteModalProps {
  open: boolean;
  sub: Sub | null;
  onClose: () => void;
  onConfirm: () => void;
  t: Theme;
}

function ConfirmDeleteModal({ open, sub, onClose, onConfirm, t }: ConfirmDeleteModalProps) {
  if (!open || !sub) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "relative", width: "100%", maxWidth: 360, background: t.card, borderRadius: 24, border: `1px solid ${t.divider}`,
        boxShadow: "0 20px 50px rgba(0,0,0,0.2)", padding: 24, textAlign: "center", animation: "modalIn .3s ease-out"
      }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${t.red}15`, color: t.red, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, margin: "0 auto 16px" }}>
          <Trash2 size={24} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 8 }}>Remove Subscription?</h3>
        <p style={{ fontSize: 13, color: t.text4, lineHeight: 1.5, marginBottom: 24 }}>
          Are you sure you want to remove <strong>{sub.name}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${t.inputBorder}`, background: t.input, color: t.text2, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: t.red, color: "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
        </div>
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [subs, setSubs] = useState<Sub[]>(() => {
    const saved = localStorage.getItem("subbie_data");
    return saved ? JSON.parse(saved) : SUBS_INIT;
  });

  useEffect(() => {
    localStorage.setItem("subbie_data", JSON.stringify(subs));
  }, [subs]);
  const [filter, setFilter] = useState("All");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Sub | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState<Sub | null>(null);

  const t = dark ? DARK : LIGHT;

  const updateSub = (id: number, updates: Partial<Sub>) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleEdit = (s: Sub) => {
    setEditingSub(s);
    setEditModalOpen(true);
  };


  const onAddSubscription = (app: any) => {
    const newSub = {
      id: Date.now(),
      name: app.name,
      category: app.category,
      price: app.price || 15,
      billing: "Monthly",
      status: "active",
      logo: app.logo,
      color: app.color,
      next: "Mar 1"
    };
    setSubs(prev => [newSub, ...prev]);
  };


  const activeSubs2 = subs.filter(s => s.status === "active");
  const totalNow = activeSubs2.reduce((a, s) => a + s.price, 0);
  const categories = ["All", ...Array.from(new Set(subs.map(s => s.category)))];
  const filtered = filter === "All" ? subs : subs.filter(s => s.category === filter);
  const UPCOMING = subs.filter(s => s.status === "active" && s.next !== "—")
    .sort((a, b) => parseDate(a.next) - parseDate(b.next)).slice(0, 4);


  const toggleSub = (id: number) => setSubs(p => p.map(s => s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s));
  const deleteSub = (s: Sub) => {
    setSubToDelete(s);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (subToDelete) {
      setSubs(p => p.filter(s => s.id !== subToDelete.id));
      setSubToDelete(null);
      setConfirmDeleteOpen(false);
    }
  };

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

      <div style={{ "--scroll-thumb": t.scrollThumb, fontFamily: "'DM Sans', sans-serif", width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.outer, padding: 0, transition: "background .3s" } as React.CSSProperties}>
        <div style={{ width: "100%", maxWidth: 1440, height: "100vh", background: t.frame, borderRadius: 0, overflow: "hidden", display: "flex", boxShadow: "none", transition: "background .3s" }}>

          {/* sidebar */}
          {isMobile ? (
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile active={activeNav} setActive={setActiveNav} dark={dark} setDark={setDark} t={t} totalNow={totalNow} />
          ) : (
            <div style={{ width: sidebarCollapsed ? 64 : 220, minWidth: sidebarCollapsed ? 64 : 220, height: "100%", flexShrink: 0, transition: "width .3s cubic-bezier(.16,1,.3,1), min-width .3s cubic-bezier(.16,1,.3,1)" }}>
              <Sidebar open isMobile={false} onClose={() => { }} active={activeNav} setActive={setActiveNav} dark={dark} setDark={setDark} t={t} totalNow={totalNow} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(c => !c)} />
            </div>
          )}

          {/* main */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.bg, overflow: "hidden", transition: "background .3s" }}>
            {/* sticky header bar */}
            <div style={{ padding: pad, paddingBottom: 14, background: t.bg, borderBottom: `1px solid ${t.divider}`, flexShrink: 0, transition: "background .3s, border-color .3s" }}>

              {/* header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {isMobile && (
                    <button onClick={() => setSidebarOpen(true)} style={{ width: 36, height: 36, borderRadius: 40, border: `1px solid ${t.inputBorder}`, background: t.input, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.text2 }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 5h12M3 9h12M3 13h12" /></svg>
                    </button>
                  )}
                  <div>
                    <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: t.text, letterSpacing: -0.5, lineHeight: 1, transition: "color .3s" }}>{activeNav}</h1>
                    <div style={{ fontSize: 12, color: t.text4, marginTop: 2 }}>February 2026</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {/* add subscription button */}
                  <button
                    onClick={() => setAddModalOpen(true)}
                    style={{ padding: "10px 18px", borderRadius: 40, border: "none", background: t.addBtn, color: t.addBtnText, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, transition: "background .3s", boxShadow: "0 2px 8px rgba(74, 124, 89, 0.2)" }}
                  >
                    {icons.plus} {!isMobile && "Add Subscription"}
                  </button>

                </div>
              </div>
            </div>
            {/* scrollable content */}
            <div className="main-scroll" style={{ flex: 1, overflowY: "auto" }}>
              <div style={{ padding: pad, display: "flex", flexDirection: "column", gap: 14 }}>

                {/* ── Dashboard view ── */}
                {activeNav === "Dashboard" && (<>
                  {/* stat cards */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <StatCard label="Monthly Spend" value={totalNow} sub={`${activeSubs2.length} active subscriptions`} change="$20" positive={false} delay={0} t={t} />
                    <StatCard label="Annual Projection" value={totalNow * 12} sub="Based on current subs" change="12% YoY" positive={false} delay={80} t={t} />
                    <StatCard label="Active Subs" value={activeSubs2.length} sub={`${subs.length - activeSubs2.length} paused`} positive delay={160} prefix="" t={t} />
                    <StatCard label="Avg. Per Tool" value={Math.round(totalNow / (activeSubs2.length || 1))} sub="Per active subscription" delay={240} t={t} />
                  </div>

                  {/* active subs list */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>Active Subscriptions</div>
                      <button onClick={() => setActiveNav("Subscriptions")} style={{ fontSize: 12, color: t.text3, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View All</button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                      {subs.length === 0 ? (
                        <div style={{ gridColumn: "1 / -1", background: t.card, borderRadius: 24, border: `1px solid ${t.cardBorder}`, padding: "40px", textAlign: "center" }}>
                          <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
                          <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text }}>No subscriptions yet</h3>
                          <p style={{ fontSize: 13, color: t.text4, marginTop: 4 }}>Add your first service to start tracking your expenses.</p>
                        </div>
                      ) : (
                        subs.filter(s => s.status === "active").slice(0, 8).map(s => (
                          <div key={s.id} style={{
                            background: t.card, borderRadius: 24, border: `1px solid ${t.cardBorder}`,
                            padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
                            transition: "all .3s ease", cursor: "pointer", position: "relative"
                          }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = t.shadow;
                              const actions = e.currentTarget.querySelector('.card-actions') as HTMLElement;
                              if (actions) actions.style.opacity = "1";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "none";
                              e.currentTarget.style.boxShadow = "none";
                              const actions = e.currentTarget.querySelector('.card-actions') as HTMLElement;
                              if (actions) actions.style.opacity = "0";
                            }}
                          >
                            <LogoImg src={s.logo} color={s.color} size={40} radius={12} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                              <div style={{ fontSize: 11, color: t.text4 }}>{s.billing} • Next: {s.next}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>${s.price}</div>
                              <div style={{ fontSize: 10, color: t.text5 }}>/mo</div>
                            </div>

                            {/* Hover Actions */}
                            <div className="card-actions" style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4, opacity: 0, transition: "opacity .2s" }}>
                              <button onClick={(e) => { e.stopPropagation(); handleEdit(s); }} style={{ width: 24, height: 24, borderRadius: "50%", background: t.input, border: `1px solid ${t.inputBorder}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.text3 }}>
                                <Edit3 size={12} />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); deleteSub(s); }} style={{ width: 24, height: 24, borderRadius: "50%", background: t.input, border: `1px solid ${t.inputBorder}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.red }}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>)}


                {/* ── Analytics view ── */}
                {activeNav === "Analytics" && (<>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* trend */}
                    <div style={{ background: t.card, borderRadius: 24, border: `1px solid ${t.cardBorder}`, padding: "22px 24px", transition: "all .3s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Monthly Spend Trend</div>
                          <div style={{ fontSize: 12, color: t.text4, marginTop: 2 }}>Visualizing your spending habits over the last 8 months</div>
                        </div>
                        <div style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.inputBorder}`, fontSize: 12, color: t.text3, cursor: "pointer", background: t.input }}>Timeframe: 8 Months ▾</div>
                      </div>
                      <div style={{ height: 300 }}>
                        <ResponsiveContainer>
                          <LineChart data={MONTHLY} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} vertical={false} />
                            <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: t.text4 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: t.text4 }} domain={[80, "auto"]} tickFormatter={(v: any) => `$${v}`} />
                            <Tooltip formatter={(v: any) => [`$${v ?? 0}`, "Spend"]} contentStyle={tooltipStyle} />
                            <Line type="monotone" dataKey="spend" stroke={t.line} strokeWidth={3} dot={{ fill: t.dot, r: 5 }} activeDot={{ r: 7 }} animationDuration={1000} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 14, flexWrap: isDesktop ? "nowrap" : "wrap" }}>
                      {/* category */}
                      <div style={{ flex: 1, background: t.card, borderRadius: 24, border: `1px solid ${t.cardBorder}`, padding: "22px 24px", transition: "all .3s" }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 4 }}>Spend by Category</div>
                        <div style={{ fontSize: 12, color: t.text4, marginBottom: 16 }}>Current month breakdown by subscription type</div>
                        <div style={{ height: 260 }}>
                          <ResponsiveContainer>
                            <BarChart data={CATEGORY_DATA} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} vertical={false} />
                              <XAxis dataKey="cat" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: t.text4 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: t.text4 }} tickFormatter={(v: any) => `$${v}`} />
                              <Tooltip formatter={(v: any) => [`$${v ?? 0}`, "Spend"]} contentStyle={tooltipStyle} />
                              <Bar dataKey="total" fill={t.bar} radius={[4, 4, 0, 0]} animationDuration={900} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Summary panel */}
                      <div style={{ flex: "0 0 320px", background: t.card, borderRadius: 24, border: `1px solid ${t.cardBorder}`, padding: "22px 24px", transition: "all .3s" }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 16 }}>Insights</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          <div style={{ padding: "12px 16px", background: t.greenBg, borderRadius: 16, border: `1px solid ${t.green}22` }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: t.greenText }}>Most Expensive</div>
                            <div style={{ fontSize: 15, color: t.text, marginTop: 4 }}>Runway ML ($35)</div>
                          </div>
                          <div style={{ padding: "12px 16px", background: t.amberBg, borderRadius: 16, border: `1px solid ${t.amber}22` }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: t.amber }}>Pending Renewals</div>
                            <div style={{ fontSize: 15, color: t.text, marginTop: 4 }}>3 services this week</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>)}


                {/* ── Subscriptions view ── */}
                {activeNav === "Subscriptions" && (<>

                  {/* subs table + side panels */}
                  <div style={{ display: "flex", gap: 14, flexWrap: isDesktop ? "nowrap" : "wrap" }}>
                    {/* table */}
                    <div style={{ flex: "1 1 420px", minWidth: 0, background: t.card, borderRadius: 24, border: `1px solid ${t.cardBorder}`, padding: "20px 0 8px", transition: "all .3s" }}>
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
                      {filtered.map(s => <SubRow key={s.id} s={s} onToggle={toggleSub} onDelete={deleteSub} onEdit={handleEdit} t={t} />)}
                      {filtered.length === 0 && <div style={{ padding: "24px", textAlign: "center", color: t.text4, fontSize: 13 }}>No subscriptions in this category.</div>}
                    </div>

                    {/* right panels */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: "0 0 280px", minWidth: 0 }}>
                      {/* upcoming */}
                      <div style={{ background: t.card, borderRadius: 24, border: `1px solid ${t.cardBorder}`, padding: "20px 20px 14px", transition: "all .3s" }}>
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
                      <div style={{ background: t.card, borderRadius: 24, border: `1px solid ${t.cardBorder}`, padding: "20px 20px 14px", transition: "all .3s" }}>
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

                </>)}
              </div> {/* closes padding container (746) */}
            </div> {/* closes main-scroll (745) */}
          </div> {/* closes main contentArea (715) */}
          <AddSubModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={onAddSubscription} t={t} />
          <EditModal open={editModalOpen} sub={editingSub} onClose={() => { setEditModalOpen(false); setEditingSub(null); }} onUpdate={updateSub} t={t} />
          <ConfirmDeleteModal open={confirmDeleteOpen} sub={subToDelete} onClose={() => { setConfirmDeleteOpen(false); setSubToDelete(null); }} onConfirm={confirmDelete} t={t} />
        </div> {/* closes frame (703) */}
      </div> {/* closes outer (702) */}
    </>
  );
}
