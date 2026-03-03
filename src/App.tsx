import React, { useState, useEffect, useRef, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import {
  LayoutDashboard, CreditCard, BarChart2, Bell, Settings, HelpCircle,
  Plus, Trash2, Pause, Play, Search, Menu, X, ChevronLeft, Sun, Moon, Edit3, TrendingUp, Zap, Shield, Calendar
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
const ALL_APPS = [
  // --- AI & INTELLIGENCE ---
  { name: "ChatGPT", plan: "Plus", category: "AI", price: 20, color: "#10a37f", logo: "https://icons.duckduckgo.com/ip3/chat.openai.com.ico" },
  { name: "Claude", plan: "Pro", category: "AI", price: 20, color: "#d97757", logo: "https://icons.duckduckgo.com/ip3/claude.ai.ico" },
  { name: "Perplexity", plan: "Pro", category: "AI", price: 20, color: "#20b2aa", logo: "https://icons.duckduckgo.com/ip3/perplexity.ai.ico" },
  { name: "Midjourney", plan: "Basic", category: "AI", price: 10, color: "#5A4A7C", logo: "https://icons.duckduckgo.com/ip3/midjourney.com.ico" },
  { name: "Midjourney", plan: "Pro", category: "AI", price: 60, color: "#5A4A7C", logo: "https://icons.duckduckgo.com/ip3/midjourney.com.ico" },
  { name: "Runway", plan: "Standard", category: "AI", price: 15, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/runwayml.com.ico" },
  { name: "ElevenLabs", plan: "Starter", category: "AI", price: 5, color: "#2563eb", logo: "https://icons.duckduckgo.com/ip3/elevenlabs.io.ico" },
  { name: "Gemini", plan: "Advanced", category: "AI", price: 20, color: "#4285F4", logo: "https://icons.duckduckgo.com/ip3/gemini.google.com.ico" },
  { name: "Jasper", plan: "Creator", category: "AI", price: 49, color: "#8b5cf6", logo: "https://icons.duckduckgo.com/ip3/jasper.ai.ico" },
  { name: "Poe", plan: "Subscription", category: "AI", price: 20, color: "#6b21a8", logo: "https://icons.duckduckgo.com/ip3/poe.com.ico" },
  { name: "Grok", plan: "Premium+", category: "AI", price: 16, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/x.com.ico" },
  { name: "Mistral", plan: "La Plateforme", category: "AI", price: 0, color: "#ff8c00", logo: "https://icons.duckduckgo.com/ip3/mistral.ai.ico" },

  // --- DEVELOPMENT TOOLS ---
  { name: "GitHub", plan: "Copilot Individual", category: "Coding", price: 10, color: "#24292e", logo: "https://icons.duckduckgo.com/ip3/github.com.ico" },
  { name: "GitHub", plan: "Pro Account", category: "Coding", price: 4, color: "#24292e", logo: "https://icons.duckduckgo.com/ip3/github.com.ico" },
  { name: "Cursor", plan: "Pro", category: "Coding", price: 20, color: "#2E2E35", logo: "https://icons.duckduckgo.com/ip3/cursor.com.ico" },
  { name: "IntelliJ IDEA", plan: "Individual", category: "Coding", price: 16.90, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/jetbrains.com.ico" },
  { name: "Tower Git", plan: "Basic", category: "Coding", price: 6, color: "#2F2F2F", logo: "https://icons.duckduckgo.com/ip3/git-tower.com.ico" },
  { name: "GitKraken", plan: "Pro", category: "Coding", price: 4.95, color: "#179287", logo: "https://icons.duckduckgo.com/ip3/gitkraken.com.ico" },
  { name: "WebStorm", plan: "Individual", category: "Coding", price: 6.90, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/jetbrains.com.ico" },
  { name: "PyCharm", plan: "Individual", category: "Coding", price: 9.90, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/jetbrains.com.ico" },

  // --- CLOUD & INFRASTRUCTURE ---
  { name: "Vercel", plan: "Pro", category: "Cloud", price: 20, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/vercel.com.ico" },
  { name: "Netlify", plan: "Pro", category: "Cloud", price: 19, color: "#00ad9f", logo: "https://icons.duckduckgo.com/ip3/netlify.com.ico" },
  { name: "Supabase", plan: "Pro", category: "Cloud", price: 25, color: "#3ecf8e", logo: "https://icons.duckduckgo.com/ip3/supabase.com.ico" },
  { name: "Convex", plan: "Starter (Pro)", category: "Cloud", price: 25, color: "#24A148", logo: "https://icons.duckduckgo.com/ip3/convex.dev.ico" },
  { name: "Railway", plan: "Developer", category: "Cloud", price: 5, color: "#131313", logo: "https://icons.duckduckgo.com/ip3/railway.app.ico" },
  { name: "Fly.io", plan: "Usage-Based", category: "Cloud", price: 5, color: "#24185b", logo: "https://icons.duckduckgo.com/ip3/fly.io.ico" },
  { name: "DigitalOcean", plan: "Basic Droplet", category: "Cloud", price: 6, color: "#0080FF", logo: "https://icons.duckduckgo.com/ip3/digitalocean.com.ico" },
  { name: "Neon", plan: "Launch", category: "Cloud", price: 19, color: "#00e599", logo: "https://icons.duckduckgo.com/ip3/neon.tech.ico" },
  { name: "PlanetScale", plan: "Scaler", category: "Cloud", price: 29, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/planetscale.com.ico" },
  { name: "Mongodb Atlas", plan: "Dedicated", category: "Cloud", price: 57, color: "#00ed64", logo: "https://icons.duckduckgo.com/ip3/mongodb.com.ico" },
  { name: "Upstash", plan: "Pay-as-you-go", category: "Cloud", price: 0, color: "#00e9a3", logo: "https://icons.duckduckgo.com/ip3/upstash.com.ico" },
  { name: "Axiom", plan: "Basic", category: "Cloud", price: 25, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/axiom.co.ico" },

  // --- AUTH & SERVICES ---
  { name: "Clerk", plan: "Core", category: "Auth", price: 25, color: "#6c47ff", logo: "https://icons.duckduckgo.com/ip3/clerk.com.ico" },
  { name: "Auth0", plan: "B2C Essentials", category: "Auth", price: 23, color: "#eb5424", logo: "https://icons.duckduckgo.com/ip3/auth0.com.ico" },
  { name: "Kinde", plan: "Pro", category: "Auth", price: 25, color: "#131313", logo: "https://icons.duckduckgo.com/ip3/kinde.com.ico" },
  { name: "Stytch", plan: "Standard", category: "Auth", price: 0, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/stytch.com.ico" },

  // --- MONITORING & DEVOPS ---
  { name: "Sentry", plan: "Team", category: "Ops", price: 26, color: "#362d59", logo: "https://icons.duckduckgo.com/ip3/sentry.io.ico" },
  { name: "Datadog", plan: "Pro", category: "Ops", price: 15, color: "#632CA6", logo: "https://icons.duckduckgo.com/ip3/datadoghq.com.ico" },
  { name: "BetterStack", plan: "Pro", category: "Ops", price: 24, color: "#2563eb", logo: "https://icons.duckduckgo.com/ip3/betterstack.com.ico" },
  { name: "Doppler", plan: "Team", category: "Ops", price: 9, color: "#ff3e00", logo: "https://icons.duckduckgo.com/ip3/doppler.com.ico" },
  { name: "Logtail", plan: "Individual", category: "Ops", price: 5, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/logtail.com.ico" },

  // --- DESIGN & CREATIVE ---
  { name: "Figma", plan: "Professional", category: "Design", price: 15, color: "#F24E1E", logo: "https://icons.duckduckgo.com/ip3/figma.com.ico" },
  { name: "Framer", plan: "Mini", category: "Design", price: 5, color: "#0055FF", logo: "https://icons.duckduckgo.com/ip3/framer.com.ico" },
  { name: "Framer", plan: "Pro", category: "Design", price: 30, color: "#0055FF", logo: "https://icons.duckduckgo.com/ip3/framer.com.ico" },
  { name: "Webflow", plan: "CMS Plan", category: "Design", price: 23, color: "#4353FF", logo: "https://icons.duckduckgo.com/ip3/webflow.com.ico" },
  { name: "Canva", plan: "Pro", category: "Design", price: 12.99, color: "#00c4cc", logo: "https://icons.duckduckgo.com/ip3/canva.com.ico" },
  { name: "CleanShot", plan: "Cloud Pro", category: "Design", price: 8, color: "#2f80ed", logo: "https://icons.duckduckgo.com/ip3/getcleanshot.com.ico" },
  { name: "Adobe CC", plan: "All Apps", category: "Design", price: 54, color: "#ff0000", logo: "https://icons.duckduckgo.com/ip3/adobe.com.ico" },
  { name: "ScreenStudio", plan: "Individual", category: "Design", price: 0, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/screen.studio.ico" },

  // --- PRODUCTIVITY & TOOLS ---
  { name: "Notion", plan: "Plus", category: "Productivity", price: 10, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/notion.so.ico" },
  { name: "Slack", plan: "Pro", category: "Productivity", price: 8.75, color: "#4A154B", logo: "https://icons.duckduckgo.com/ip3/slack.com.ico" },
  { name: "Linear", plan: "Plus", category: "Productivity", price: 10, color: "#5E6AD2", logo: "https://icons.duckduckgo.com/ip3/linear.app.ico" },
  { name: "Raycast", plan: "Pro", category: "Productivity", price: 10, color: "#FF6363", logo: "https://icons.duckduckgo.com/ip3/raycast.com.ico" },
  { name: "Cron", plan: "Free", category: "Productivity", price: 0, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/cron.com.ico" },
  { name: "Akiflow", plan: "Individual", category: "Productivity", price: 15, color: "#2563eb", logo: "https://icons.duckduckgo.com/ip3/akiflow.com.ico" },
  { name: "Google Workspace", plan: "Starter", category: "Productivity", price: 6, color: "#4285F4", logo: "https://icons.duckduckgo.com/ip3/google.com.ico" },
  { name: "Google Workspace", plan: "Standard", category: "Productivity", price: 12, color: "#4285F4", logo: "https://icons.duckduckgo.com/ip3/google.com.ico" },
  { name: "Microsoft 365", plan: "Business Basic", category: "Productivity", price: 6, color: "#00a4ef", logo: "https://icons.duckduckgo.com/ip3/microsoft.com.ico" },
  { name: "1Password", plan: "Personal", category: "Productivity", price: 2.99, color: "#0094ee", logo: "https://icons.duckduckgo.com/ip3/1password.com.ico" },
  { name: "Bitwarden", plan: "Premium", category: "Productivity", price: 0.83, color: "#175ddc", logo: "https://icons.duckduckgo.com/ip3/bitwarden.com.ico" },

  // --- MARKETING & EMAILS ---
  { name: "Beehiiv", plan: "Grow", category: "Marketing", price: 49, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/beehiiv.com.ico" },
  { name: "ConvertKit", plan: "Creator", category: "Marketing", price: 29, color: "#7723af", logo: "https://icons.duckduckgo.com/ip3/convertkit.com.ico" },
  { name: "Mailchimp", plan: "Essentials", category: "Marketing", price: 13, color: "#ffe01b", logo: "https://icons.duckduckgo.com/ip3/mailchimp.com.ico" },
  { name: "Loops.so", plan: "Startup", category: "Marketing", price: 49, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/loops.so.ico" },
  { name: "Resend", plan: "Pro", category: "Marketing", price: 20, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/resend.com.ico" },
  { name: "Postmark", plan: "10k Pack", category: "Marketing", price: 15, color: "#ffcd00", logo: "https://icons.duckduckgo.com/ip3/postmarkapp.com.ico" },
  { name: "Substack", plan: "Free", category: "Marketing", price: 0, color: "#ff6719", logo: "https://icons.duckduckgo.com/ip3/substack.com.ico" },

  // --- ANALYTICS ---
  { name: "Plausible", plan: "Growth", category: "Analytics", price: 9, color: "#5850ec", logo: "https://icons.duckduckgo.com/ip3/plausible.io.ico" },
  { name: "Mixpanel", plan: "Growth", category: "Analytics", price: 20, color: "#7856ff", logo: "https://icons.duckduckgo.com/ip3/mixpanel.com.ico" },
  { name: "PostHog", plan: "Growth", category: "Analytics", price: 0, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/posthog.com.ico" },
  { name: "Hotjar", plan: "Plus", category: "Analytics", price: 32, color: "#ff1c36", logo: "https://icons.duckduckgo.com/ip3/hotjar.com.ico" },
  { name: "Amplitude", plan: "Starter", category: "Analytics", price: 0, color: "#212121", logo: "https://icons.duckduckgo.com/ip3/amplitude.com.ico" },

  // --- MEDIA & ENTERTAINMENT ---
  { name: "Spotify", plan: "Premium", category: "Music", price: 10.99, color: "#1DB954", logo: "https://icons.duckduckgo.com/ip3/spotify.com.ico" },
  { name: "Netflix", plan: "Standard", category: "Video", price: 15.49, color: "#E50914", logo: "https://icons.duckduckgo.com/ip3/netflix.com.ico" },
  { name: "YouTube", plan: "Premium", category: "Video", price: 13.99, color: "#FF0000", logo: "https://icons.duckduckgo.com/ip3/youtube.com.ico" },
  { name: "Disney+", plan: "Premium", category: "Video", price: 13.99, color: "#0063e5", logo: "https://icons.duckduckgo.com/ip3/disneyplus.com.ico" },
  { name: "Lemon Squeezy", plan: "Basic", category: "Fintech", price: 0, color: "#9EF344", logo: "https://icons.duckduckgo.com/ip3/lemonsqueezy.com.ico" },
  { name: "Stripe", plan: "Usage", category: "Fintech", price: 0, color: "#635BFF", logo: "https://icons.duckduckgo.com/ip3/stripe.com.ico" },
  { name: "Paddle", plan: "Basic", category: "Fintech", price: 0, color: "#000000", logo: "https://icons.duckduckgo.com/ip3/paddle.com.ico" },
  { name: "Intercom", plan: "Starter", category: "Support", price: 74, color: "#286efa", logo: "https://icons.duckduckgo.com/ip3/intercom.com.ico" },
  { name: "Crisp", plan: "Pro", category: "Support", price: 25, color: "#1976d2", logo: "https://icons.duckduckgo.com/ip3/crisp.chat.ico" },
  { name: "Shopify", plan: "Basic", category: "E-Commerce", price: 39, color: "#95bf47", logo: "https://icons.duckduckgo.com/ip3/shopify.com.ico" },
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
  calendar: <Calendar size={18} strokeWidth={1.6} />,
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
  notifications: any[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  userName?: string;
  userEmail?: string;
}

function Sidebar({ open, onClose, isMobile, active, setActive, dark, setDark, t, totalNow, notifications, collapsed = false, onToggleCollapse, userName, userEmail }: SidebarProps) {
  const navItems = [
    { name: "Dashboard", icon: "grid" },
    { name: "Subscriptions", icon: "tag" },
    { name: "Analytics", icon: "chart" },
    { name: "Calendar", icon: "calendar" },
    { name: "Notifications", icon: "bell", badge: notifications.length },
    { name: "Settings", icon: "settings" },
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
        <div
          onClick={() => setActive("Settings")}
          style={{ margin: "0", display: "flex", alignItems: "center", gap: 9, padding: collapsed ? "0" : "4px 8px 4px 4px", width: collapsed ? 40 : "100%", minWidth: 0, height: collapsed ? 40 : "auto", justifyContent: collapsed ? "center" : "flex-start", cursor: "pointer", transition: "all .25s", background: "transparent", border: "1px solid transparent", borderRadius: 40 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.avatar, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
            {userName ? userName.split(" ").map(n => n[0]).join("") : "U"}
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden", textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: t.sbText, lineHeight: 1.2, transition: "color .3s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName || "User"}</div>
              <div style={{ fontSize: 10.5, color: t.sbText2, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 1 }}>Pro Member</div>
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
  currencySymbol: string;
  currencyRate: number;
  t: Theme;
}

function SubRow({ s, onToggle, onDelete, onEdit, currencySymbol, currencyRate, t }: SubRowProps) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "grid", gridTemplateColumns: "36px 1fr 100px 90px 90px 80px 60px", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: `1px solid ${t.divider2}`, background: hov ? t.rowHover : "transparent", transition: "background .1s", borderRadius: 8 }}>
      <LogoImg src={s.logo} color={s.color} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
        <div style={{ fontSize: 11, color: t.text4 }}>{s.category}</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: t.text2 }}>{currencySymbol}{Math.round(s.price * currencyRate)}/mo</div>
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
              placeholder="Search 80+ applications and plans..."
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
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.name}</div>
                  <div style={{ fontSize: 11, color: t.text4, marginTop: 2 }}>{app.plan} • {app.category}</div>
                  <div style={{ fontSize: 12, color: t.green, fontWeight: 700, marginTop: 4 }}>${app.price}/mo</div>
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

const InspirationTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(99, 102, 241, 0.9)",
        backdropFilter: "blur(4px)",
        padding: "6px 16px",
        borderRadius: "20px",
        color: "#fff",
        fontWeight: "700",
        fontSize: "14px",
        boxShadow: "0 8px 16px rgba(99, 102, 241, 0.3)",
        border: "1px solid rgba(255,255,255,0.2)",
        position: "relative",
        transform: "translateY(-30px)"
      }}>
        ${payload[0].value}
        <div style={{
          position: "absolute",
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "0",
          height: "0",
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid rgba(99, 102, 241, 0.9)"
        }} />
      </div>
    );
  }
  return null;
};

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

function EditProfileModal({ open, onClose, name, email, onSave, t }: { open: boolean, onClose: () => void, name: string, email: string, onSave: (n: string, e: string) => void, t: Theme }) {
  const [n, setN] = useState(name);
  const [e, setE] = useState(email);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 400, background: t.card, borderRadius: 28, padding: 32, boxShadow: t.shadow, animation: "modalIn .3s ease-out" }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 20 }}>Edit Profile</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: t.text4, marginBottom: 8 }}>Display Name</label>
            <input value={n} onChange={x => setN(x.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 14, background: t.input, border: `1px solid ${t.inputBorder}`, color: t.text, fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: t.text4, marginBottom: 8 }}>Email Address</label>
            <input value={e} onChange={x => setE(x.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 14, background: t.input, border: `1px solid ${t.inputBorder}`, color: t.text, fontSize: 14 }} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 14, border: `1px solid ${t.divider}`, background: "transparent", color: t.text2, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => { onSave(n, e); onClose(); }} style={{ flex: 1, padding: "12px", borderRadius: 14, border: "none", background: t.addBtn, color: t.addBtnText, fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [timeframe, setTimeframe] = useState("7 Days");
  const [calView, setCalView] = useState("Monthly");
  const [currency, setCurrency] = useState("USD");
  const [userName, setUserName] = useState("Indie Builder");
  const [userEmail, setUserEmail] = useState("hi@subbie.app");
  const [notifPrefs, setNotifPrefs] = useState({ upcoming: true, optimization: true, security: true });
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
  const currencyRate = currency === "EUR" ? 0.92 : currency === "GBP" ? 0.79 : 1;

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
      name: `${app.name} (${app.plan})`,
      category: app.category,
      price: app.price,
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

  // Dynamic Data Calculation for Analytics (Scoped after totalNow)
  const getDynamicChartData = () => {
    const base = totalNow;
    if (timeframe === "7 Days") {
      return [
        { label: "Sun", spend: base * 0.03 },
        { label: "Mon", spend: base * 0.05 },
        { label: "Tue", spend: base * 0.04 },
        { label: "Wed", spend: base * 0.12 },
        { label: "Thu", spend: base * 0.07 },
        { label: "Fri", spend: base * 0.06 },
        { label: "Sat", spend: base * 0.14 },
      ];
    }
    if (timeframe === "30 Days") {
      return [
        { label: "Week 1", spend: base * 0.22 },
        { label: "Week 2", spend: base * 0.28 },
        { label: "Week 3", spend: base * 0.21 },
        { label: "Week 4", spend: base * 0.29 },
      ];
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();

    if (timeframe === "3 Months") {
      return Array.from({ length: 3 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1);
        return { label: monthNames[d.getMonth()], spend: base * (0.85 + (i * 0.075)) };
      });
    }
    if (timeframe === "6 Months") {
      return Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return { label: monthNames[d.getMonth()], spend: base * (0.8 + (i * 0.04)) };
      });
    }
    // 1 Year
    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (10 - i * 2), 1);
      const yr = d.getFullYear().toString().slice(2);
      return { label: `${monthNames[d.getMonth()]} '${yr}`, spend: base * (0.7 + (i * 0.06)) };
    });
  };

  const chartData = getDynamicChartData();
  const displayTotal = timeframe === "7 Days" ? (totalNow / 4.3) :
    timeframe === "30 Days" ? totalNow :
      timeframe === "3 Months" ? (totalNow * 3) :
        timeframe === "6 Months" ? (totalNow * 6) : (totalNow * 12);
  const displayChange = 0;

  // Aggregated data for Spending Distribution
  const categoryData = Object.entries(
    activeSubs2.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + s.price;
      return acc;
    }, {} as Record<string, number>)
  ).map(([cat, total]) => ({ cat, total }));

  // Dynamic Recent Payments
  const recentPayments = activeSubs2.slice(0, 5).map(s => ({
    sub: s.name,
    amount: s.price,
    date: s.next,
    logo: s.logo,
    color: s.color
  }));

  // Production-Ready Dynamic Insights
  const topCategory = categoryData.sort((a, b) => b.total - a.total)[0] || { cat: "N/A", total: 0 };
  const topPercent = totalNow > 0 ? Math.round((topCategory.total / totalNow) * 100) : 0;
  const nextUp = UPCOMING[0] || { name: "None", next: "N/A" };
  const savingsTool = activeSubs2[0] || { name: "Subscriptions" };

  // Dynamic Notifications Logic
  const notifications = useMemo(() => {
    const list = [];
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'short' });

    // 1. Upcoming Payments (Next 4 days)
    activeSubs2.forEach(s => {
      if (s.next.includes(currentMonth)) {
        const day = parseInt(s.next.split(' ')[1]);
        if (day >= now.getDate() && day <= now.getDate() + 4) {
          list.push({
            id: `pay-${s.id}`,
            title: "Upcoming Renewal",
            msg: `Your ${s.name} payment of ${currencySymbol}${Math.round(s.price * currencyRate)} is due on ${s.next}.`,
            type: "warning",
            time: "Action Required",
            icon: "bell"
          });
        }
      }
    });

    // 2. Optimization Alerts
    if (activeSubs2.length > 0) {
      list.push({
        id: "opt-1",
        title: "Optimization Insight",
        msg: `Switching ${savingsTool.name} to annual billing could save you ${currencySymbol}${Math.round(totalNow * 0.2 * currencyRate)} annually.`,
        type: "success",
        time: "New Strategy",
        icon: "zap"
      });
    }

    // 3. Security / Meta
    list.push({
      id: "sec-1",
      title: "Security Verified",
      msg: "Your local database is encrypted and synced with browser storage.",
      type: "info",
      time: "System",
      icon: "shield"
    });

    return list;
  }, [activeSubs2, savingsTool]);




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
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile active={activeNav} setActive={setActiveNav} dark={dark} setDark={setDark} t={t} totalNow={totalNow} notifications={notifications} userName={userName} />
          ) : (
            <div style={{ width: sidebarCollapsed ? 64 : 220, minWidth: sidebarCollapsed ? 64 : 220, height: "100%", flexShrink: 0, transition: "width .3s cubic-bezier(.16,1,.3,1), min-width .3s cubic-bezier(.16,1,.3,1)" }}>
              <Sidebar open isMobile={false} onClose={() => { }} active={activeNav} setActive={setActiveNav} dark={dark} setDark={setDark} t={t} totalNow={totalNow} notifications={notifications} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(c => !c)} userName={userName} />
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
                    <StatCard label="Monthly Spend" value={totalNow * currencyRate} sub={`${activeSubs2.length} active subscriptions`} prefix={currencySymbol} delay={0} t={t} />
                    <StatCard label="Annual Projection" value={totalNow * 12 * currencyRate} sub="Based on current subs" prefix={currencySymbol} delay={80} t={t} />
                    <StatCard label="Active Subs" value={activeSubs2.length} sub={`${subs.length - activeSubs2.length} paused`} positive delay={160} prefix="" t={t} />
                    <StatCard label="Avg. Per Tool" value={Math.round((totalNow / (activeSubs2.length || 1)) * currencyRate)} prefix={currencySymbol} sub="Per active subscription" delay={240} t={t} />
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
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Top Row: Quick Stats */}
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 200, background: t.card, borderRadius: 24, padding: "20px", border: `1px solid ${t.cardBorder}`, display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: t.text4, textTransform: "uppercase", letterSpacing: 0.5 }}>Monthly Burn</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: t.text }}>${totalNow}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 200, background: t.card, borderRadius: 24, padding: "20px", border: `1px solid ${t.cardBorder}`, display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: t.text4, textTransform: "uppercase", letterSpacing: 0.5 }}>Annual Forecast</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: t.text }}>${totalNow * 12}</div>
                        <div style={{ fontSize: 11, color: t.text3 }}>Based on active tools</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 200, background: t.card, borderRadius: 24, padding: "20px", border: `1px solid ${t.cardBorder}`, display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: t.text4, textTransform: "uppercase", letterSpacing: 0.5 }}>Avg. Tool Cost</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: t.text }}>${(totalNow / (activeSubs2.length || 1)).toFixed(2)}</div>
                        <div style={{ fontSize: 11, color: t.text3 }}>Per active subscription</div>
                      </div>
                    </div>

                    {/* trend */}
                    <div style={{
                      background: t.card === "#fff" ? "#fff" : "rgba(30,30,35,0.5)",
                      borderRadius: 40,
                      border: `1px solid ${t.cardBorder}`,
                      padding: "40px",
                      transition: "all .3s",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: t.card === "#fff" ? "0 20px 50px rgba(0,0,0,0.05)" : "0 20px 50px rgba(0,0,0,0.2)"
                    }}>
                      <div style={{ position: "relative", zIndex: 2 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: t.text3, marginBottom: 8, opacity: 0.8 }}>Spending Overview</div>
                            <h2 style={{ fontSize: 48, fontWeight: 700, color: t.text, letterSpacing: -1.5, marginBottom: 16 }}>
                              <AnimNum value={displayTotal} prefix="$" decimals={2} />
                            </h2>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                            <div style={{
                              display: displayChange > 0 ? "flex" : "none", alignItems: "center", gap: 6,
                              padding: "8px 16px", borderRadius: 14,
                              background: t.card === "#fff" ? "rgba(79, 70, 229, 0.08)" : "rgba(79, 70, 229, 0.15)",
                              border: `1px solid rgba(79, 70, 229, 0.2)`,
                              fontSize: 13, fontWeight: 700, color: "#4f46e5"
                            }}>
                              + ${displayChange} <TrendingUp size={14} />
                            </div>

                            {/* Timeframe Selector */}
                            <div style={{ display: "flex", background: t.card === "#fff" ? "#f1f5f9" : "rgba(255,255,255,0.05)", padding: 4, borderRadius: 12, border: `1px solid ${t.cardBorder}` }}>
                              {["7 Days", "30 Days", "3 Months", "6 Months", "1 Year"].map(tf => (
                                <button
                                  key={tf}
                                  onClick={() => setTimeframe(tf)}
                                  style={{
                                    padding: "6px 12px", borderRadius: 8, border: "none",
                                    background: timeframe === tf ? (t.card === "#fff" ? "#fff" : "rgba(255,255,255,0.1)") : "transparent",
                                    color: timeframe === tf ? t.text : t.text4,
                                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                                    transition: "all .2s",
                                    boxShadow: timeframe === tf ? "0 2px 4px rgba(0,0,0,0.05)" : "none"
                                  }}
                                >
                                  {tf}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div style={{ height: 340, marginTop: 10 }}>
                          <ResponsiveContainer>
                            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.6} />
                                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                                <pattern id="particles" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                  <circle cx="10" cy="10" r="1.2" fill="white" fillOpacity="0.4" />
                                  <circle cx="30" cy="40" r="1" fill="white" fillOpacity="0.3" />
                                  <circle cx="50" cy="20" r="1.5" fill="white" fillOpacity="0.5" />
                                  <circle cx="70" cy="50" r="1" fill="white" fillOpacity="0.2" />
                                  <circle cx="90" cy="30" r="1.2" fill="white" fillOpacity="0.4" />
                                  <circle cx="20" cy="80" r="1" fill="white" fillOpacity="0.3" />
                                  <circle cx="40" cy="60" r="1.5" fill="white" fillOpacity="0.4" />
                                  <circle cx="60" cy="90" r="1" fill="white" fillOpacity="0.2" />
                                  <circle cx="80" cy="70" r="1.2" fill="white" fillOpacity="0.4" />
                                </pattern>
                              </defs>
                              <CartesianGrid strokeDasharray="0" stroke={t.card === "#fff" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)"} horizontal={false} />
                              <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 13, fill: t.text3, fontWeight: 500 }}
                                dy={10}
                              />
                              <YAxis hide domain={["dataMin - 100", "dataMax + 100"]} />
                              <Tooltip content={<InspirationTooltip />} cursor={{ stroke: '#4f46e5', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                              <Area
                                type="monotone"
                                dataKey="spend"
                                stroke="#4f46e5"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorSpend)"
                                animationDuration={1000}
                                activeDot={{ r: 8, fill: "#fff", stroke: "#4f46e5", strokeWidth: 3 }}
                              />
                              <Area
                                type="monotone"
                                dataKey="spend"
                                stroke="none"
                                fill="url(#particles)"
                                pointerEvents="none"
                                animationDuration={1000}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 14, flexWrap: isDesktop ? "nowrap" : "wrap" }}>
                      {/* category */}
                      <div style={{ flex: 1, background: t.card, borderRadius: 24, border: `1px solid ${t.cardBorder}`, padding: "22px 24px", transition: "all .3s" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 4 }}>Spending Distribution</div>
                        <div style={{ fontSize: 12, color: t.text4, marginBottom: 20 }}>Allocation by subscription category</div>
                        <div style={{ height: 260 }}>
                          <ResponsiveContainer>
                            <BarChart data={categoryData} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} vertical={false} />
                              <XAxis dataKey="cat" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: t.text3, fontWeight: 500 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: t.text4 }} tickFormatter={(v: any) => `$${v}`} />
                              <Tooltip formatter={(v: any) => [`$${v ?? 0}`, "Total"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", padding: "10px 14px", fontWeight: 600 }} />
                              <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} animationDuration={900} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Summary panel */}
                      <div style={{ flex: "0 0 340px", background: t.card, borderRadius: 24, border: `1px solid ${t.cardBorder}`, padding: "22px 24px", transition: "all .3s" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 18 }}>Financial Insights</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          <div style={{ padding: "16px", background: t.card === "#fff" ? "#f8fafc" : "rgba(255,255,255,0.02)", borderRadius: 18, border: `1px solid ${t.cardBorder}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.green }} />
                              <div style={{ fontSize: 11, fontWeight: 700, color: t.text4, textTransform: "uppercase" }}>Optimization</div>
                            </div>
                            <div style={{ fontSize: 14, color: t.text, lineHeight: 1.4 }}>You could save <strong>20%</strong> by switching to an annual plan for {savingsTool.name}.</div>
                          </div>
                          <div style={{ padding: "16px", background: t.card === "#fff" ? "#fff1f2" : "rgba(224, 104, 104, 0.05)", borderRadius: 18, border: `1px solid ${t.cardBorder}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.red }} />
                              <div style={{ fontSize: 11, fontWeight: 700, color: t.text4, textTransform: "uppercase" }}>Focus Area</div>
                            </div>
                            <div style={{ fontSize: 14, color: t.text, lineHeight: 1.4 }}><strong>{topCategory.cat} Tools</strong> make up {topPercent}% of your total spend.</div>
                          </div>
                          <div style={{ padding: "16px", background: t.card === "#fff" ? "#f0f9ff" : "rgba(99, 102, 241, 0.05)", borderRadius: 18, border: `1px solid ${t.cardBorder}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0ea5e9" }} />
                              <div style={{ fontSize: 11, fontWeight: 700, color: t.text4, textTransform: "uppercase" }}>Strategy</div>
                            </div>
                            <div style={{ fontSize: 14, color: t.text, lineHeight: 1.4 }}>Next major renewal: <strong>{nextUp.name}</strong> on {nextUp.next}.</div>
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
                      {filtered.map(s => <SubRow key={s.id} s={s} onToggle={toggleSub} onDelete={deleteSub} onEdit={handleEdit} currencySymbol={currencySymbol} currencyRate={currencyRate} t={t} />)}
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
                            <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{currencySymbol}{Math.round(s.price * currencyRate)}</div>
                          </div>
                        ))}
                      </div>

                      {/* recent payments */}
                      <div style={{ background: t.card, borderRadius: 24, border: `1px solid ${t.cardBorder}`, padding: "20px 20px 14px", transition: "all .3s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>Recent Payments</div>
                          <span style={{ fontSize: 12, color: t.text2, cursor: "pointer", fontWeight: 500 }}>View All</span>
                        </div>
                        {recentPayments.map((r, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < recentPayments.length - 1 ? `1px solid ${t.divider2}` : "none" }}>
                            <LogoImg src={r.logo} color={r.color} size={28} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12.5, fontWeight: 500, color: t.text }}>{r.sub}</div>
                              <div style={{ fontSize: 11, color: t.text4 }}>{r.date}</div>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: t.red }}>−{currencySymbol}{Math.round(r.amount * currencyRate)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </>)}

                {/* ── Notifications view ── */}
                {activeNav === "Notifications" && (
                  <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", animation: "fadeUp 0.4s ease-out" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                      <div>
                        <h2 style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: "-0.5px" }}>Activity Feed</h2>
                        <p style={{ fontSize: 13, color: t.text4 }}>Intelligence and alerts for your stack</p>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button style={{ padding: "10px 18px", borderRadius: 14, border: `1px solid ${t.divider}`, background: t.card, fontSize: 12, fontWeight: 600, color: t.text3, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                          <Bell size={14} /> Clear All
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {notifications.map((n, idx) => (
                        <div key={idx} style={{
                          background: t.card, borderRadius: 28, border: `1px solid ${t.cardBorder}`,
                          padding: "24px", display: "flex", gap: 20, alignItems: "center",
                          transition: "all .3s ease", cursor: "default",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                        }}>
                          <div style={{
                            width: 52, height: 52, borderRadius: 18, flexShrink: 0,
                            background: n.type === "warning" ? "rgba(245, 158, 11, 0.12)" : n.type === "success" ? "rgba(16, 185, 129, 0.12)" : "rgba(79, 70, 229, 0.12)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: n.type === "warning" ? "#f59e0b" : n.type === "success" ? "#10b981" : "#4f46e5"
                          }}>
                            {n.icon === "bell" && <Bell size={24} />}
                            {n.icon === "zap" && <Zap size={24} />}
                            {n.icon === "shield" && <Shield size={24} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                              <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{n.title}</h3>
                              <span style={{ fontSize: 11, fontWeight: 700, color: t.text5, padding: "4px 10px", background: t.pillBg, borderRadius: 20 }}>{n.time}</span>
                            </div>
                            <p style={{ fontSize: 14, color: t.text3, lineHeight: 1.6 }}>{n.msg}</p>
                          </div>
                          <div style={{ color: t.text5, cursor: "pointer", padding: 8 }}>
                            <X size={16} />
                          </div>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div style={{ textAlign: "center", padding: "60px 20px" }}>
                          <div style={{ fontSize: 40, marginBottom: 16 }}>🔕</div>
                          <h3 style={{ color: t.text, fontSize: 18, fontWeight: 700 }}>All Caught Up!</h3>
                          <p style={{ color: t.text4, fontSize: 14, marginTop: 4 }}>No new notifications at the moment.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Settings view ── */}
                {activeNav === "Settings" && (
                  <div style={{ maxWidth: 840, margin: "0 auto", width: "100%", animation: "fadeUp 0.4s ease-out" }}>
                    <div style={{ marginBottom: 28 }}>
                      <h2 style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: "-0.5px" }}>Control Center</h2>
                      <p style={{ fontSize: 13, color: t.text4 }}>Manage your account and app preferences</p>
                    </div>

                    <div style={{ gridTemplateColumns: "1fr", gap: 16 }}>
                      <div style={{ background: t.card, borderRadius: 28, border: `1px solid ${t.cardBorder}`, padding: "32px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                          {/* Profile */}
                          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <div style={{ width: 64, height: 64, borderRadius: 20, background: t.addBtn, display: "flex", alignItems: "center", justifyContent: "center", color: t.addBtnText, fontSize: 24, fontWeight: 700 }}>{userName.split(" ").map(n => n[0]).join("")}</div>
                            <div>
                              <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{userName}</div>
                              <div style={{ fontSize: 13, color: t.text4 }}>{userEmail} • Pro Plan</div>
                            </div>
                            <button
                              onClick={() => setEditProfileOpen(true)}
                              style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: 12, border: `1px solid ${t.divider}`, background: t.card, fontSize: 12, fontWeight: 600, color: t.text2, cursor: "pointer" }}>Edit Profile</button>
                          </div>

                          {/* Options */}
                          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, borderTop: `1px solid ${t.divider}`, paddingTop: 32 }}>
                            <div>
                              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 6 }}>Display Currency</label>
                              <p style={{ fontSize: 12, color: t.text4, marginBottom: 12 }}>Preferred currency for burn calculations.</p>
                              <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                style={{ width: "100%", padding: "12px", borderRadius: 14, background: t.input, border: `1px solid ${t.inputBorder}`, color: t.text, fontSize: 14, cursor: "pointer" }}>
                                <option value="USD">United States Dollar ($)</option>
                                <option value="EUR">Euro (€)</option>
                                <option value="GBP">British Pound (£)</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 6 }}>App Appearance</label>
                              <p style={{ fontSize: 12, color: t.text4, marginBottom: 12 }}>Choose your interface visual style.</p>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => setDark(false)} style={{ flex: 1, padding: "12px", borderRadius: 14, border: !dark ? `2px solid ${t.addBtn}` : `1.5px solid ${t.divider2}`, background: !dark ? `${t.addBtn}11` : t.card, color: !dark ? t.addBtn : t.text3, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Light</button>
                                <button onClick={() => setDark(true)} style={{ flex: 1, padding: "12px", borderRadius: 14, border: dark ? `2px solid ${t.addBtn}` : `1.5px solid ${t.divider2}`, background: dark ? `${t.addBtn}11` : t.card, color: dark ? t.addBtn : t.text3, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Dark</button>
                              </div>
                            </div>
                          </div>

                          {/* Danger zone */}
                          <div style={{ borderTop: `1px solid ${t.divider}`, paddingTop: 32, display: "flex", flexDirection: isMobile ? "column" : "row", gap: 24 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                  <div style={{ fontSize: 14, fontWeight: 700, color: t.red }}>Security & Data</div>
                                  <p style={{ fontSize: 12, color: t.text4 }}>Erase all local data permanently.</p>
                                </div>
                                <button
                                  onClick={() => { if (window.confirm("Are you sure you want to wipe all data? This cannot be undone.")) { localStorage.removeItem("subbie_data"); window.location.reload(); } }}
                                  style={{ padding: "12px 24px", borderRadius: 14, border: "none", background: `${t.red}15`, color: t.red, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Wipe Local Data</button>
                              </div>
                            </div>
                            {!isMobile && <div style={{ width: 1, background: t.divider }} />}
                            <div style={{ flex: 1 }}>
                              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 8 }}>Quick Links</label>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                <button onClick={() => setActiveNav("Dashboard")} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${t.divider}`, background: t.bg, color: t.text2, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Dashboard Home</button>
                                <button onClick={() => setActiveNav("Notifications")} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${t.divider}`, background: t.bg, color: t.text2, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>System Status</button>
                                <button onClick={() => window.open('https://github.com', '_blank')} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${t.divider}`, background: t.bg, color: t.text2, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>API Documentation</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Calendar view ── */}
                {activeNav === "Calendar" && (() => {
                  const now = new Date();
                  const year = now.getFullYear();
                  const month = now.getMonth();
                  const monthName = now.toLocaleString('default', { month: 'long' });

                  // Days generation logic
                  let days = [];
                  if (calView === "Monthly") {
                    const firstDay = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();

                    // Padding for start of month
                    for (let p = 0; p < firstDay; p++) {
                      days.push({ type: 'pad', id: `pad-${p}` });
                    }

                    for (let d = 1; d <= daysInMonth; d++) {
                      days.push({ type: 'day', date: d, id: `day-${d}` });
                    }
                  } else {
                    // Weekly view: current week
                    const today = now.getDate();
                    const dayOfWeek = now.getDay();
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(today - dayOfWeek);

                    for (let i = 0; i < 7; i++) {
                      const d = new Date(startOfWeek);
                      d.setDate(startOfWeek.getDate() + i);
                      days.push({
                        type: 'day',
                        date: d.getDate(),
                        month: d.toLocaleString('default', { month: 'short' }),
                        isToday: d.toDateString() === now.toDateString(),
                        id: `week-day-${i}`
                      });
                    }
                  }

                  return (
                    <div style={{ maxWidth: 1000, margin: "0 auto", width: "100%", animation: "fadeUp 0.4s ease-out" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                            <h2 style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: "-0.5px" }}>Billing Schedule</h2>
                            <div style={{ padding: "4px 10px", borderRadius: 20, background: t.pillBg, color: t.addBtn, fontSize: 11, fontWeight: 700 }}>{monthName} {year}</div>
                          </div>
                          <p style={{ fontSize: 13, color: t.text4 }}>Track and visualize your recurring charges</p>
                        </div>
                        <div style={{ display: "flex", gap: 8, background: t.card, padding: 4, borderRadius: 14, border: `1px solid ${t.cardBorder}`, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                          <button
                            onClick={() => setCalView("Monthly")}
                            style={{
                              padding: "8px 16px", borderRadius: 10, border: "none",
                              background: calView === "Monthly" ? t.addBtn : "transparent",
                              color: calView === "Monthly" ? t.addBtnText : t.text4,
                              fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .2s"
                            }}>Monthly</button>
                          <button
                            onClick={() => setCalView("Weekly")}
                            style={{
                              padding: "8px 16px", borderRadius: 10, border: "none",
                              background: calView === "Weekly" ? t.addBtn : "transparent",
                              color: calView === "Weekly" ? t.addBtnText : t.text4,
                              fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .2s"
                            }}>Weekly</button>
                        </div>
                      </div>

                      <div style={{
                        background: t.card, borderRadius: 32, border: `1px solid ${t.cardBorder}`,
                        padding: isMobile ? "16px" : "24px", overflow: "hidden", boxShadow: t.shadow
                      }}>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: calView === "Weekly" ? "repeat(7, 1fr)" : (isMobile ? "repeat(2, 1fr)" : "repeat(7, 1fr)"),
                          gap: 1, background: t.divider, border: `1px solid ${t.divider}`, borderRadius: 20, overflow: "hidden"
                        }}>
                          {(calView === "Monthly" && !isMobile || calView === "Weekly") && ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                            <div key={d} style={{
                              background: t.bg, padding: "12px", textAlign: "center", fontSize: 11,
                              fontWeight: 700, color: t.text5, textTransform: "uppercase", borderBottom: `1px solid ${t.divider}`
                            }}>{isMobile && calView === "Weekly" ? d[0] : d}</div>
                          ))}

                          {days.map((dayObj: any) => {
                            if (dayObj.type === 'pad') {
                              return <div key={dayObj.id} style={{ background: t.card === "#fff" ? "#fafafa" : "rgba(255,255,255,0.02)" }} />;
                            }

                            const daySubs = activeSubs2.filter(s => {
                              // Rough matching for current month/year
                              const currentMonthShort = now.toLocaleString('default', { month: 'short' });
                              return s.next.includes(`${dayObj.date}`) && (s.next.includes(currentMonthShort) || s.billing === 'Monthly');
                            });

                            return (
                              <div key={dayObj.id} style={{
                                background: dayObj.isToday ? (dark ? "rgba(99, 102, 241, 0.05)" : "#f0f7ff") : t.card,
                                minHeight: isMobile ? 80 : 120, padding: 12,
                                display: "flex", flexDirection: "column", gap: 6,
                                transition: "all .2s", border: dayObj.isToday ? `1px solid ${t.addBtn}44` : "none"
                              }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div style={{
                                    fontSize: 13, fontWeight: 800,
                                    color: dayObj.isToday ? t.addBtn : (daySubs.length > 0 ? t.text : t.text5)
                                  }}>
                                    {dayObj.date} {dayObj.month && <span style={{ fontSize: 10, fontWeight: 500, color: t.text4 }}>{dayObj.month}</span>}
                                  </div>
                                  {daySubs.length > 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.addBtn }} />}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4, overflow: "hidden" }}>
                                  {daySubs.slice(0, 3).map((s, idx) => (
                                    <div key={idx} style={{
                                      padding: "4px 8px", borderRadius: 8, background: `${s.color}15`,
                                      borderLeft: `3px solid ${s.color}`, fontSize: 9, fontWeight: 700,
                                      color: s.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                    }}>
                                      ${s.price} {s.name}
                                    </div>
                                  ))}
                                  {daySubs.length > 3 && (
                                    <div style={{ fontSize: 9, color: t.text4, paddingLeft: 4 }}>+ {daySubs.length - 3} more</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div> {/* closes padding container (746) */}
            </div> {/* closes main-scroll (745) */}
          </div> {/* closes main contentArea (715) */}
          <AddSubModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={onAddSubscription} t={t} />
          <EditModal open={editModalOpen} sub={editingSub} onClose={() => { setEditModalOpen(false); setEditingSub(null); }} onUpdate={updateSub} t={t} />
          <ConfirmDeleteModal open={confirmDeleteOpen} sub={subToDelete} onClose={() => { setConfirmDeleteOpen(false); setSubToDelete(null); }} onConfirm={confirmDelete} t={t} />
          <EditProfileModal
            open={editProfileOpen}
            onClose={() => setEditProfileOpen(false)}
            name={userName}
            email={userEmail}
            onSave={(n, e) => { setUserName(n); setUserEmail(e); }}
            t={t}
          />
        </div> {/* closes frame (703) */}
      </div> {/* closes outer (702) */}
    </>
  );
}
