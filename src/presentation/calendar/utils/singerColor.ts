export interface SingerColorPalette {
  bg: string;
  border: string;
  text: string;
  ring: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentDot: string;
  selectedBg: string;
  selectedBorder: string;
  selectedRing: string;
}

const SINGER_PALETTES: SingerColorPalette[] = [
  {
    // Indigo / Violet
    bg: 'bg-indigo-950/60',
    border: 'border-indigo-500/70',
    text: 'text-indigo-200',
    ring: 'ring-indigo-500/40',
    badgeBg: 'bg-indigo-500/25',
    badgeText: 'text-indigo-300',
    badgeBorder: 'border-indigo-500/40',
    accentDot: 'bg-indigo-400',
    selectedBg: 'bg-indigo-600/35',
    selectedBorder: 'border-indigo-400',
    selectedRing: 'ring-2 ring-indigo-500/70',
  },
  {
    // Emerald / Mint
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-500/70',
    text: 'text-emerald-200',
    ring: 'ring-emerald-500/40',
    badgeBg: 'bg-emerald-500/25',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    accentDot: 'bg-emerald-400',
    selectedBg: 'bg-emerald-600/35',
    selectedBorder: 'border-emerald-400',
    selectedRing: 'ring-2 ring-emerald-500/70',
  },
  {
    // Fuchsia / Purple
    bg: 'bg-fuchsia-950/60',
    border: 'border-fuchsia-500/70',
    text: 'text-fuchsia-200',
    ring: 'ring-fuchsia-500/40',
    badgeBg: 'bg-fuchsia-500/25',
    badgeText: 'text-fuchsia-300',
    badgeBorder: 'border-fuchsia-500/40',
    accentDot: 'bg-fuchsia-400',
    selectedBg: 'bg-fuchsia-600/35',
    selectedBorder: 'border-fuchsia-400',
    selectedRing: 'ring-2 ring-fuchsia-500/70',
  },
  {
    // Sky / Cyan
    bg: 'bg-sky-950/60',
    border: 'border-sky-500/70',
    text: 'text-sky-200',
    ring: 'ring-sky-500/40',
    badgeBg: 'bg-sky-500/25',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-500/40',
    accentDot: 'bg-sky-400',
    selectedBg: 'bg-sky-600/35',
    selectedBorder: 'border-sky-400',
    selectedRing: 'ring-2 ring-sky-500/70',
  },
  {
    // Rose / Coral
    bg: 'bg-pink-950/60',
    border: 'border-pink-500/70',
    text: 'text-pink-200',
    ring: 'ring-pink-500/40',
    badgeBg: 'bg-pink-500/25',
    badgeText: 'text-pink-300',
    badgeBorder: 'border-pink-500/40',
    accentDot: 'bg-pink-400',
    selectedBg: 'bg-pink-600/35',
    selectedBorder: 'border-pink-400',
    selectedRing: 'ring-2 ring-pink-500/70',
  },
  {
    // Violet / Lavender
    bg: 'bg-violet-950/60',
    border: 'border-violet-500/70',
    text: 'text-violet-200',
    ring: 'ring-violet-500/40',
    badgeBg: 'bg-violet-500/25',
    badgeText: 'text-violet-300',
    badgeBorder: 'border-violet-500/40',
    accentDot: 'bg-violet-400',
    selectedBg: 'bg-violet-600/35',
    selectedBorder: 'border-violet-400',
    selectedRing: 'ring-2 ring-violet-500/70',
  },
  {
    // Teal
    bg: 'bg-teal-950/60',
    border: 'border-teal-500/70',
    text: 'text-teal-200',
    ring: 'ring-teal-500/40',
    badgeBg: 'bg-teal-500/25',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/40',
    accentDot: 'bg-teal-400',
    selectedBg: 'bg-teal-600/35',
    selectedBorder: 'border-teal-400',
    selectedRing: 'ring-2 ring-teal-500/70',
  },
  {
    // Cyan / Aqua
    bg: 'bg-cyan-950/60',
    border: 'border-cyan-500/70',
    text: 'text-cyan-200',
    ring: 'ring-cyan-500/40',
    badgeBg: 'bg-cyan-500/25',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/40',
    accentDot: 'bg-cyan-400',
    selectedBg: 'bg-cyan-600/35',
    selectedBorder: 'border-cyan-400',
    selectedRing: 'ring-2 ring-cyan-500/70',
  },
];

const GUEST_SINGER_PALETTE: SingerColorPalette = {
  bg: 'bg-amber-950/60',
  border: 'border-amber-500/70',
  text: 'text-amber-200',
  ring: 'ring-amber-500/40',
  badgeBg: 'bg-amber-500/25',
  badgeText: 'text-amber-300',
  badgeBorder: 'border-amber-500/40',
  accentDot: 'bg-amber-400',
  selectedBg: 'bg-amber-600/35',
  selectedBorder: 'border-amber-400',
  selectedRing: 'ring-2 ring-amber-500/70',
};

export function getSingerColor(singerName: string, isGuestSinger?: boolean): SingerColorPalette {
  if (isGuestSinger) return GUEST_SINGER_PALETTE;
  if (!singerName) return SINGER_PALETTES[0];

  let hash = 0;
  const name = singerName.trim().toLowerCase();
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % SINGER_PALETTES.length;
  return SINGER_PALETTES[index];
}
