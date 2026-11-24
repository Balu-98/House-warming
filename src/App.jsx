import React, { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { invitation as inv } from "./invitation.js";

/* ───────────── Icons ───────────── */
const Icon = ({ d, size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {d}
  </svg>
);
const I = {
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  pin: <><path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></>,
  nav: <polygon points="3 11 22 2 13 21 11 13 3 11" />,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>,
  copy: <><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  left: <path d="m15 18-6-6 6-6" />,
  right: <path d="m9 18 6-6-6-6" />,
  expand: <path d="M15 3h6v6M21 3l-7 7M3 21l7-7M9 21H3v-6" />,
  msg: <path d="M22 17a2 2 0 0 1-2 2H6.8a2 2 0 0 0-1.4.6l-2.2 2.2A.7.7 0 0 1 2 21.3V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  cal: <><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  sparkle: <path d="M12 3l1.9 5.8L20 10.5l-6.1 1.7L12 18l-1.9-5.8L4 10.5l6.1-1.7z" />,
  vol: <><path d="M11 4.7 6.4 8H3v8h3.4l4.6 3.3z" /><path d="M16 9a5 5 0 0 1 0 6M19.4 18.4a9 9 0 0 0 0-12.8" /></>,
  mute: <><path d="M11 4.7 6.4 8H3v8h3.4l4.6 3.3z" /><path d="m22 9-6 6M16 9l6 6" /></>,
};

/* Brass lamp (nilavilakku) with a house roof — the site's emblem */
function Emblem({ className = "" }) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="flame" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#FFF6B0" />
          <stop offset="45%" stopColor="#FFA726" />
          <stop offset="100%" stopColor="#E65100" />
        </radialGradient>
        <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E3A1" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8B6508" />
        </linearGradient>
      </defs>
      <path d="M10 62 60 22l50 40" fill="none" stroke="url(#brass)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 30c0 0-10 14-10 23 0 6 4.5 10 10 10s10-4 10-10c0-9-10-23-10-23z" fill="url(#flame)" className="flame" />
      <path d="M60 40c0 0-5 8-5 13 0 3 2.2 5 5 5s5-2 5-5c0-5-5-13-5-13z" fill="#FFF59D" />
      <ellipse cx="60" cy="68" rx="20" ry="5" fill="url(#brass)" />
      <path d="M40 68c0 7 9 12 20 12s20-5 20-12z" fill="url(#brass)" />
      <rect x="56" y="80" width="8" height="26" rx="2" fill="url(#brass)" />
      <ellipse cx="60" cy="93" rx="7" ry="3.5" fill="#B8860B" />
      <ellipse cx="60" cy="108" rx="14" ry="4.5" fill="url(#brass)" />
      <rect x="54" y="108" width="12" height="14" fill="url(#brass)" />
      <ellipse cx="60" cy="124" rx="25" ry="6" fill="url(#brass)" />
      <ellipse cx="60" cy="130" rx="28" ry="5" fill="#8B6508" />
    </svg>
  );
}

/* ───────────── Helpers ───────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

function SafeImg({ src, alt, className, ...rest }) {
  const [ok, setOk] = useState(Boolean(src));
  if (!ok) return null;
  return <img src={src} alt={alt} className={className} onError={() => setOk(false)} {...rest} />;
}

const mapsLink = inv.venue.mapsUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inv.venue.mapsQuery || inv.venue.address)}`;
const mapsEmbed =
  `https://maps.google.com/maps?q=${encodeURIComponent(inv.venue.mapsQuery || inv.venue.address)}&z=15&output=embed`;

const inviteSentence = `${inv.host} ${inv.invite} ${inv.houseName}.`;
const dateLine = `${inv.date.day}, ${inv.date.fullDate}`;

function stamp(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }

function googleCalendarUrl() {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `${inv.eventLabel} – ${inv.houseName}`,
    dates: `${stamp(new Date(inv.date.iso))}/${stamp(new Date(inv.date.endIso || inv.date.iso))}`,
    details: `${inviteSentence}\n\n${window.location.href}`,
    location: inv.venue.address ? `${inv.houseName}, ${inv.venue.address}` : mapsLink,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

function downloadIcs() {
  const esc = (v) => String(v || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Housewarming Invitation//EN", "BEGIN:VEVENT",
    `UID:${Date.now()}@housewarming`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(new Date(inv.date.iso))}`, `DTEND:${stamp(new Date(inv.date.endIso || inv.date.iso))}`,
    `SUMMARY:${esc(`${inv.eventLabel} – ${inv.houseName}`)}`,
    `LOCATION:${esc(inv.venue.address ? `${inv.houseName}, ${inv.venue.address}` : mapsLink)}`,
    `DESCRIPTION:${esc(inv.events.map((e) => `${e.title}: ${e.time}`).join("\n") + "\n\n" + inviteSentence)}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = "housewarming.ics"; a.click();
  URL.revokeObjectURL(url);
}

/* ───────────── Sections ───────────── */
function Intro({ onEnter, leaving }) {
  return (
    <div className={`intro ${leaving ? "leaving" : ""}`}>
      <SafeImg src={inv.introImage} alt="" className="bg-img blurred" fetchpriority="high" />
      <div className="intro-shade" />
      <div className="intro-card">
        <div className="inner-border" />
        <Emblem className="emblem emblem-md" />
        <span className="eyebrow gold-dark">{inv.eventLabel}</span>
        <p className="intro-sub">You are invited to</p>
        <h1 className="house-title">{inv.houseName}</h1>
        <div className="rule" />
        <button className="btn-primary" onClick={onEnter}>
          Open Invitation <span className="nudge">→</span>
        </button>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <SafeImg src={inv.heroImage} alt="" className="bg-img blurred" />
      <div className="hero-shade" />
      <div className="hero-content rise">
        <Emblem className="emblem emblem-lg float" />
        <span className="eyebrow gold">{inv.eventLabel} · House Warming</span>
        <h1 className="hero-name">{inv.houseName}</h1>
        <div className="rule light" />
        <p className="hero-date">{dateLine}</p>
        <button className="btn-primary" onClick={() => document.getElementById("invitation")?.scrollIntoView({ behavior: "smooth" })}>
          View Invitation ↓
        </button>
      </div>
    </section>
  );
}

/* Decorative divider: hairlines with a brass diamond */
function Ornament({ className = "" }) {
  return (
    <svg className={`ornament ${className}`} viewBox="0 0 120 12" aria-hidden="true">
      <path d="M0 6h48M72 6h48" stroke="currentColor" strokeWidth="1" />
      <path d="M60 1l5 5-5 5-5-5z" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="60" cy="6" r="1.6" fill="currentColor" />
    </svg>
  );
}

function SectionTitle({ kicker, title }) {
  return (
    <div className="section-title reveal">
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      <Ornament />
    </div>
  );
}

function InvitationCard() {
  return (
    <section id="invitation" className="section">
      <div className="card big-card reveal">
        <div className="inner-border" />
        <Emblem className="emblem emblem-sm card-emblem" />
        <span className="eyebrow gold-dark">{inv.eventLabel}</span>
        <h2 className="hosts">{inv.host}</h2>
        <p className="lead">{inv.invite}</p>
        <h3 className="house-name">{inv.houseName}</h3>
        <Ornament className="card-ornament" />
        <div className="date-block">
          <p className="date-line">{dateLine}</p>
          {inv.date.malayalamDate && <p className="date-ml">{inv.date.malayalamDate}</p>}
        </div>
        <p className="quote">“{inv.quote}”</p>
      </div>
    </section>
  );
}

function Countdown() {
  const target = new Date(inv.date.iso).getTime();
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return null;
    return {
      Days: Math.floor(diff / 864e5),
      Hours: Math.floor((diff % 864e5) / 36e5),
      Minutes: Math.floor((diff % 36e5) / 6e4),
      Seconds: Math.floor((diff % 6e4) / 1e3),
    };
  };
  const [left, setLeft] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setLeft(calc()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!left) {
    return (
      <div className="countdown-done">
        <p className="cinzel">The auspicious day is here!</p>
        <p className="serif">Welcome to {inv.houseName}</p>
      </div>
    );
  }
  return (
    <div className="countdown">
      {Object.entries(left).map(([label, value]) => (
        <div key={label} className="cd-box">
          <span className="cd-num">{String(value).padStart(2, "0")}</span>
          <span className="cd-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

function Schedule() {
  return (
    <section id="schedule" className="section bordered">
      <SectionTitle kicker="Programme" title="Ceremonies & Timings" />

      <div className="countdown-wrap reveal">
        <span className="eyebrow">Countdown to Griha Pravesham Muhurtham</span>
        <Countdown />
      </div>

      <div className="event-grid">
        {inv.events.map((ev, i) => (
          <div key={i} className={`card event-card reveal ${ev.highlight ? "highlight" : ""}`} style={{ transitionDelay: `${i * 0.12}s` }}>
            <span className="eyebrow gold-dark">{ev.label}</span>
            <h3>{ev.title}</h3>
            <div className="mini-rule" />
            <p className="time"><Icon d={I.clock} size={15} /> {ev.time}</p>
          </div>
        ))}
      </div>

      <div className="cal-row reveal">
        <a className="btn-outline" href={googleCalendarUrl()} target="_blank" rel="noreferrer"><Icon d={I.cal} size={15} /> Google Calendar</a>
        <button className="btn-outline" onClick={downloadIcs}><Icon d={I.cal} size={15} /> Apple / Outlook (.ics)</button>
      </div>

      <div className="card map-card reveal">
        <div className="map-head">
          <span className="icon-chip"><Icon d={I.pin} size={20} /></span>
          <div className="map-title">
            <h4>{inv.houseName}</h4>
            <p className="muted">{inv.venue.address || `Residence of ${inv.host}`}</p>
          </div>
          <a className="btn-solid" href={mapsLink} target="_blank" rel="noopener noreferrer">
            <Icon d={I.nav} size={14} className="gold" /> Open in Google Maps
          </a>
        </div>
        <div className="map-frame">
          <iframe src={mapsEmbed} title="Venue map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} />
          {/* The pin is a raw coordinate, so Google's embedded info card can't load place details.
              Clicking the map opens the exact share link in Google Maps instead. */}
          <a className="map-overlay" href={mapsLink} target="_blank" rel="noopener noreferrer" aria-label="Open in Google Maps" />
        </div>

        {inv.contacts?.length > 0 && (
          <div className="contacts">
            {inv.contacts.map((c) => (
              <a key={c.phone} className="contact" href={`tel:${c.phone.replace(/\s/g, "")}`}>
                <Icon d={I.phone} size={14} /> {c.name}: {c.phone}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Gallery() {
  const [failed, setFailed] = useState([]);
  const photos = inv.gallery.filter((p) => !failed.includes(p.src));
  const [idx, setIdx] = useState(0);
  const [full, setFull] = useState(false);
  const n = photos.length;

  useEffect(() => {
    if (full || n < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 5000);
    return () => clearInterval(t);
  }, [full, n]);

  useEffect(() => { if (idx >= n && n) setIdx(0); }, [n, idx]);

  // Probe images once so missing files are dropped silently
  useEffect(() => {
    inv.gallery.forEach((p) => {
      const img = new Image();
      img.onerror = () => setFailed((f) => [...f, p.src]);
      img.src = p.src;
    });
  }, []);

  if (!n) return null;
  const cur = photos[Math.min(idx, n - 1)];
  const next = () => setIdx((i) => (i + 1) % n);
  const prev = () => setIdx((i) => (i - 1 + n) % n);

  return (
    <section id="gallery" className="section bordered alt">
      <SectionTitle kicker="Photo Memories" title="Glimpses of Home" />
      <div className="gallery-frame reveal">
        <div className="slide">
          <img key={cur.src} src={cur.src} alt={cur.title} className="slide-img" onClick={() => setFull(true)} />
          <div className="slide-shade" />
          {n > 1 && <>
            <button className="nav-btn left" onClick={prev} aria-label="Previous"><Icon d={I.left} size={20} /></button>
            <button className="nav-btn right" onClick={next} aria-label="Next"><Icon d={I.right} size={20} /></button>
          </>}
          <button className="expand-btn" onClick={() => setFull(true)} aria-label="Full screen"><Icon d={I.expand} size={16} /></button>
          <div className="slide-caption">
            <span className="cinzel">{cur.title}</span>
            <span className="serif">{cur.caption}</span>
          </div>
        </div>
        {n > 1 && (
          <div className="thumbs">
            {photos.map((p, i) => (
              <button key={p.src} className={`thumb ${i === idx ? "on" : ""}`} onClick={() => setIdx(i)}>
                <img src={p.src} alt={p.title} loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {full && (
        <div className="lightbox" onClick={() => setFull(false)}>
          <button className="lb-close" onClick={() => setFull(false)} aria-label="Close"><Icon d={I.x} size={24} /></button>
          {n > 1 && <>
            <button className="lb-nav left" onClick={(e) => { e.stopPropagation(); prev(); }}><Icon d={I.left} size={28} /></button>
            <button className="lb-nav right" onClick={(e) => { e.stopPropagation(); next(); }}><Icon d={I.right} size={28} /></button>
          </>}
          <div className="lb-body" onClick={(e) => e.stopPropagation()}>
            <img src={cur.src} alt={cur.title} />
            <h4 className="cinzel">{cur.title}</h4>
            <p className="serif">{cur.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function ShareModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href.split("#")[0];
  const text =
`*${inv.eventLabel} – House Warming Invitation*

${inv.host} ${inv.invite} *${inv.houseName}*.

*Date:* ${dateLine}
${inv.events.map((e) => `*${e.title}:* ${e.time}`).join("\n")}
${inv.venue.address ? `*Venue:* ${inv.venue.address}
` : ""}*Location:* ${mapsLink}

View invitation, photos & directions:
${url}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch { window.prompt("Copy link:", url); }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };
  const native = () => navigator.share?.({ title: `${inv.eventLabel} – ${inv.houseName}`, text: inviteSentence, url }).catch(() => {});

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><Icon d={I.x} size={20} /></button>
        <span className="badge lg"><Icon d={I.share} size={22} /></span>
        <h3 className="cinzel">Share Invitation</h3>
        <p className="serif muted-i">Share this joy with family &amp; friends</p>

        <a className="btn-wa" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">
          <Icon d={I.msg} /> Share on WhatsApp
        </a>
        {navigator.share && <button className="btn-solid wide" onClick={native}><Icon d={I.share} /> Share via Phone Apps</button>}

        <label className="link-label">Invitation link</label>
        <div className="link-box">
          <input readOnly value={url} />
          <button onClick={copy}><Icon d={copied ? I.check : I.copy} size={14} /> {copied ? "Copied" : "Copy"}</button>
        </div>
        <div className="qr">
          <QRCodeSVG value={url} size={120} fgColor="#2A1C15" includeMargin />
          <small>Scan to open</small>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <Emblem className="emblem emblem-sm" />
      <h3>{inv.houseName}</h3>
      <p className="footer-meta">{dateLine}</p>
      <p className="footer-note">With love,</p>
      <p className="footer-host">{inv.host}</p>
    </footer>
  );
}

/* ───────────── App ───────────── */
export default function App() {
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [musicOk, setMusicOk] = useState(Boolean(inv.music));
  const [share, setShare] = useState(false);
  const audio = useRef(null);

  useReveal();

  const getAudio = () => {
    if (!audio.current && inv.music) {
      const a = new Audio(inv.music);
      a.loop = true;
      a.addEventListener("error", () => { setMusicOk(false); setPlaying(false); });
      audio.current = a;
    }
    return audio.current;
  };
  useEffect(() => () => audio.current?.pause(), []);

  const play = () => getAudio()?.play().then(() => setPlaying(true)).catch(() => {});
  const toggle = () => {
    const a = getAudio();
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); } else play();
  };
  const enter = () => {
    setLeaving(true);
    play();
    setTimeout(() => setEntered(true), 800);
  };

  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
  }, [entered]);

  return (
    <div className="site">
      {!entered && <Intro onEnter={enter} leaving={leaving} />}

      <main>
        <Hero />
        <InvitationCard />
        <Schedule />
        <Gallery />
      </main>
      <Footer />

      {musicOk && (
        <button className={`music-btn ${playing ? "on" : ""}`} onClick={toggle} title={playing ? "Pause music" : "Play music"}>
          <Icon d={playing ? I.vol : I.mute} size={16} />
          <span className="hide-sm">{playing ? "Music On" : "Play Music"}</span>
          {playing && <span className="bars"><i /><i /><i /></span>}
        </button>
      )}
      <button className="share-fab" onClick={() => setShare(true)} aria-label="Share invitation">
        <Icon d={I.share} size={18} /> <span className="hide-sm">Share</span>
      </button>

      {share && <ShareModal onClose={() => setShare(false)} />}
    </div>
  );
}
