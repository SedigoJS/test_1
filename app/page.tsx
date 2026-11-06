"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import Massing from "../components/massing";

// ---------------------------------------------------------------------------
// CONTENT: edit here. The layout below only renders it.
// ---------------------------------------------------------------------------

const PROFILE = {
  name: "Joshua Sedigo",
  role: "Fullstack Web Developer | React, Next.js, TypeScript, PostgreSQL",
  location: "Rizal, Philippines",
  tagline:
    "I build full-stack web applications, from database schemas and API routes to responsive interfaces. I also build automation tools that cut manual work in real operations.",
  bio: "I work across web development, data management, and legal administration, creating user-friendly websites, maintaining accurate records, and assisting with legal documentation and administrative tasks. My focus is on delivering reliable, detail-oriented solutions that improve productivity and support business success.",
  email: "sedigojs@gmail.com",
  social: [
    { label: "GitHub", href: "https://github.com/SedigoJS" },
    { label: "CV Resume", href: "/Joshua_Sedigo_Resume.pdf", download: true },
    { label: "LinkedIn", href: "https://linkedin.com/in/joshua-sedigo-463bb2341" },
  ],
};

const WORK: {
  index: string;
  year: string;
  title: string;
  description: string;
  tags: string[];
  href?: string;
  links?: { label: string; href: string }[];
}[] = [
  {
    index: "01",
    year: "2026",
    title: "Lume E-Commerce",
    description:
      "Full-stack e-commerce store with product discovery, cart management, and Stripe Checkout, backed by Prisma and PostgreSQL.",
    tags: ["Online Store", "E-commerce", "Neon PostgreSQL", "Stripe"],
    href: "https://lume-ecommerce.vercel.app/",
  },
  {
    index: "02",
    year: "2024",
    title: "LMS x AAI",
    description:
      "Learning management system for courses, assignments, and quizzes, with REST APIs and role-based access for admins, teachers, and students.",
    tags: ["Role-Based Access", "Education Platform", "Full Stack"],
    href: "https://cwd-lms.vercel.app/",
  },
  {
    index: "03",
    year: "2024",
    title: "SurfxBini",
    description:
      "Promo platform where users submit entries and staff validate them in an admin CMS, with AWS cloud storage for media and file uploads.",
    tags: ["CMS", "Admin Panel", "User Submissions", "Full Stack"],
    href: "https://bini-con.vercel.app/",
  },
  {
    index: "04",
    year: "2026",
    title: "ALAW Projects",
    description:
      "Web apps and automation tools for document processing, PDF renaming, and Excel reporting, deployed on Vercel and Cloudflare.",
    tags: ["Web Apps", "Automation", "PDF Tools", "Excel"],
    links: [
      { label: "ALAW Compile", href: "https://alawcompile.vercel.app/" },
      { label: "ALAW iMail", href: "https://alawimail.vercel.app/" },
      { label: "ALAW FDL", href: "https://alaw-fdl.vercel.app/" },
      { label: "FDL Calc", href: "https://fdlcalc.vercel.app/" },
      { label: "ALAW Campaign", href: "https://alawcampaign.vercel.app/" },
      { label: "ALAW USDA", href: "https://alawusda.vercel.app/" },
    ],
  },
  {
    index: "05",
    year: "2024",
    title: "Randomizer",
    description:
      "A spin-wheel web app for random selection used in giveaways, decisions, and interactive activities.",
    tags: ["Animations", "Dynamic UI", "Web App", "Full Stack"],
    href: "https://randomizer-cwd.vercel.app/",
  },
  {
    index: "06",
    year: "2024",
    title: "CloudCast",
    description:
      "A weather app providing real-time forecasts and location-based weather data via API integration.",
    tags: ["API", "Weather App", "Music App", "Next.js", "Full Stack"],
    href: "https://cloudcast-sy.vercel.app/",
  },
];

const SPECS = [
  {
    label: "Frontend Development",
    detail:
      "Building responsive, accessible interfaces with React, Next.js, TypeScript, and Tailwind CSS, with reusable components.",
  },
  {
    label: "Backend Development",
    detail:
      "Designing REST APIs and data models with Prisma and PostgreSQL, including authentication, role-based access, and payment integration with Stripe.",
  },
  {
    label: "Deployment and Tooling",
    detail:
      "Shipping projects through Git, GitHub, and CI/CD pipelines, with hosting on Vercel, Cloudflare, and AWS.",
  },
  {
    label: "Automation Tools",
    detail:
      "Building web tools and Windows scripts that process Excel, Word, and PDF files, including OCR and document generation.",
  },
  {
    label: "Data and Documentation",
    detail:
      "Accurate record management, spreadsheet organization, and structured document handling.",
  },
  {
    label: "Operations Support",
    detail:
      "Organizing case files, preparing documents, and managing office workflows with accuracy and deadline discipline.",
  },
];

// ---------------------------------------------------------------------------
// STYLE TOKENS
// ---------------------------------------------------------------------------

const FONTS =
  "@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');";

const TOKENS = {
  "--paper": "#ECE8DF",
  "--paper-deep": "#E2DDD1",
  "--ink": "#1C2127",
  "--graphite": "#6B7079",
  "--rule": "#C9C3B6",
  "--signal": "#C2412D",
  "--font-display": "'Instrument Serif', Georgia, serif",
  "--font-body": "'IBM Plex Sans', system-ui, sans-serif",
  "--font-mono": "'IBM Plex Mono', ui-monospace, monospace",
} as React.CSSProperties;

const MONO = { fontFamily: "var(--font-mono)" } as const;
const DISPLAY = { fontFamily: "var(--font-display)" } as const;

// ---------------------------------------------------------------------------
// PIECES
// ---------------------------------------------------------------------------

function Nav() {
  return (
    <header className="flex items-center justify-between px-6 sm:px-10 lg:px-14 py-6 border-b" style={{ borderColor: "var(--ink)" }}>
      <a href="#top" className="text-2xl" style={{ ...DISPLAY }}>
        JS
      </a>
      <nav className="hidden md:flex items-center gap-9 text-sm" style={{ ...MONO }}>
        <a href="#work" className="hover:underline underline-offset-4">Work</a>
        <a href="#capabilities" className="hover:underline underline-offset-4">Specifications</a>
        <a href="#about" className="hover:underline underline-offset-4">About</a>
      </nav>
      <a
        href={`mailto:${PROFILE.email}`}
        className="flex items-center gap-1.5 text-sm border px-4 py-2 hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
        style={{ borderColor: "var(--ink)", ...MONO }}
      >
        Say hello <ArrowUpRight size={14} />
      </a>
    </header>
  );
}

function SectionHead({ sheet, title }: { sheet: string; title: string }) {
  return (
    <div className="flex items-end justify-between gap-6 border-b pb-4" style={{ borderColor: "var(--ink)" }}>
      <h2 className="text-5xl sm:text-6xl leading-none" style={{ ...DISPLAY }}>
        {title}
      </h2>
      <span className="text-xs whitespace-nowrap" style={{ ...MONO, color: "var(--graphite)" }}>
        {sheet}
      </span>
    </div>
  );
}

function ScaleBar() {
  return (
    <div className="flex items-center gap-3 text-[11px]" style={{ ...MONO, color: "var(--graphite)" }}>
      <div className="flex h-2 border" style={{ borderColor: "var(--ink)" }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="w-6" style={{ background: i % 2 ? "var(--paper)" : "var(--ink)" }} />
        ))}
      </div>
      <span>0 — 4 m</span>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="grid lg:grid-cols-[5fr_7fr] gap-x-12 gap-y-12 items-center px-6 sm:px-10 lg:px-14 py-16 lg:py-20">
      <div>
        <p className="text-sm" style={{ ...MONO, color: "var(--graphite)" }}>
          {PROFILE.role}
        </p>
        <h1 className="mt-6 leading-[0.92] tracking-tight" style={{ ...DISPLAY, fontSize: "clamp(4rem, 11vw, 9rem)" }}>
          Joshua
          <br />
          Sedigo
        </h1>
        <p className="mt-8 max-w-lg text-lg leading-relaxed" style={{ color: "var(--graphite)" }}>
          {PROFILE.tagline}
        </p>
        <p className="mt-10 flex items-center gap-2 text-sm" style={{ color: "var(--graphite)" }}>
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--signal)" }} />
          Available for freelance and full-time opportunities
        </p>
      </div>

      <figure>
        <div className="h-[55vh] lg:h-[70vh] border" style={{ borderColor: "var(--ink)", background: "var(--paper-deep)" }}>
          <Massing />
        </div>
        <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs" style={{ ...MONO, color: "var(--graphite)" }}>
          <span>Fig. 1: Massing model of six works, {PROFILE.location}</span>
          <ScaleBar />
        </figcaption>
      </figure>
    </section>
  );
}

function Work() {
  const [active, setActive] = useState<number>(0);
  const rows = useRef<(HTMLElement | null)[]>([]);

  // The row closest to the middle of the screen drives the model.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.getAttribute("data-i")));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    rows.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="work" className="grid lg:grid-cols-[5fr_7fr] gap-x-12 px-6 sm:px-10 lg:px-14">
      <div className="py-20">
        <SectionHead sheet="Sheet A-02" title="Selected work" />
        {WORK.map((item, i) => (
          <article
            key={item.index}
            ref={(el) => {
              rows.current[i] = el;
            }}
            data-i={i}
            onMouseEnter={() => setActive(i)}
            className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-3 py-10 border-b"
            style={{ borderColor: "var(--rule)" }}
          >
            <span className="text-sm pt-2" style={{ ...MONO, color: active === i ? "var(--signal)" : "var(--graphite)" }}>
              {item.index}
            </span>
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-3xl sm:text-4xl leading-tight hover:underline underline-offset-4 decoration-1"
                    style={{ ...DISPLAY }}
                  >
                    {item.title}
                  </a>
                ) : (
                  <span className="text-3xl sm:text-4xl leading-tight" style={{ ...DISPLAY }}>
                    {item.title}
                  </span>
                )}
                <span className="text-sm" style={{ ...MONO, color: "var(--graphite)" }}>
                  {item.year}
                </span>
              </div>
              <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: "var(--graphite)" }}>
                {item.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 border" style={{ borderColor: "var(--rule)", ...MONO, color: "var(--graphite)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              {item.links && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {item.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-1" style={{ ...MONO }}>
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Pinned model: stays in view while the schedule scrolls past it. */}
      <div className="lg:sticky lg:top-0 lg:h-screen py-10 lg:py-20">
        <figure className="h-full flex flex-col">
          <div className="flex-1 min-h-[60vh] border" style={{ borderColor: "var(--ink)", background: "var(--paper-deep)" }}>
            <Massing activeIndex={active} onSelect={setActive} />
          </div>
          <figcaption className="mt-4 text-xs" style={{ ...MONO, color: "var(--graphite)" }}>
            Fig. 2: {WORK[active].title}, volume {WORK[active].index}. Click a volume to select it.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Specifications() {
  return (
    <section id="capabilities" className="px-6 sm:px-10 lg:px-14 py-20 border-t" style={{ borderColor: "var(--ink)" }}>
      <SectionHead sheet="Sheet A-03" title="Specifications" />
      <div className="mt-2">
        {SPECS.map((s, i) => (
          <div
            key={s.label}
            className="grid grid-cols-[3rem_1fr] md:grid-cols-[5rem_1fr_1.6fr] gap-x-6 gap-y-2 py-7 border-b"
            style={{ borderColor: "var(--rule)" }}
          >
            <span className="text-sm pt-1" style={{ ...MONO, color: "var(--signal)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-2xl" style={{ ...DISPLAY }}>
              {s.label}
            </h3>
            <p className="col-span-2 md:col-span-1 text-sm leading-relaxed" style={{ color: "var(--graphite)" }}>
              {s.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  const years = getExperience();
  return (
    <section id="about" className="grid lg:grid-cols-[5fr_7fr] gap-x-12 gap-y-12 px-6 sm:px-10 lg:px-14 py-20 border-t" style={{ borderColor: "var(--ink)" }}>
      <figure>
        <div
          className="aspect-[4/5] border p-3"
          style={{ borderColor: "var(--ink)", background: "var(--paper-deep)" }}
        >
          <div
            className="h-full w-full bg-center bg-cover"
            style={{ backgroundImage: "url('/profile.jpg')" }}
            role="img"
            aria-label="Portrait of Joshua Sedigo"
          />
        </div>
        <figcaption className="mt-4 text-xs" style={{ ...MONO, color: "var(--graphite)" }}>
          Fig. 3: Elevation, portrait
        </figcaption>
      </figure>

      <div>
        <SectionHead sheet="Sheet A-04" title="About" />
        <p className="mt-10 text-3xl sm:text-4xl leading-snug" style={{ ...DISPLAY }}>
          {PROFILE.bio}
        </p>
        <dl className="mt-12 grid grid-cols-2 gap-6 max-w-sm text-sm">
          <div>
            <dt style={{ ...MONO, color: "var(--graphite)" }}>Based in</dt>
            <dd className="mt-1">{PROFILE.location}</dd>
          </div>
          <div>
            <dt style={{ ...MONO, color: "var(--graphite)" }}>Experience</dt>
            <dd className="mt-1">{years}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function getExperience() {
  const start = new Date(2025, 3);
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  months %= 12;
  const y = `${years} year${years !== 1 ? "s" : ""}`;
  const m = `${months} month${months !== 1 ? "s" : ""}`;
  if (years === 0) return m;
  if (months === 0) return y;
  return `${y} ${m}`;
}

/** Footer as a drawing title block: project, author, scale, sheet, plus the contact call to action. */
function Contact() {
  const cells = [
    ["Project", "Portfolio"],
    ["Drawn by", PROFILE.name],
    ["Scale", "1:1"],
    ["Sheet", "A-01 of 01"],
  ];
  return (
    <footer id="contact" className="px-6 sm:px-10 lg:px-14 py-20 border-t" style={{ borderColor: "var(--ink)" }}>
      <a href={`mailto:${PROFILE.email}`} className="group flex items-center gap-4 text-6xl sm:text-8xl leading-none" style={{ ...DISPLAY }}>
        Let&apos;s talk
        <ArrowUpRight size={56} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: "var(--signal)" }} />
      </a>

      <dl className="mt-16 grid grid-cols-2 md:grid-cols-4 border-t border-l text-sm" style={{ borderColor: "var(--ink)" }}>
        {cells.map(([k, v]) => (
          <div key={k} className="border-b border-r p-4" style={{ borderColor: "var(--ink)" }}>
            <dt className="text-xs" style={{ ...MONO, color: "var(--graphite)" }}>{k}</dt>
            <dd className="mt-1">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-sm">
        <a href={`mailto:${PROFILE.email}`} className="flex items-center gap-2 hover:underline underline-offset-4" style={{ ...MONO }}>
          <Mail size={14} /> {PROFILE.email}
        </a>
        <div className="flex items-center gap-6">
          {PROFILE.social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              download={s.download ? "Joshua_Sedigo_CV.pdf" : undefined}
              target={!s.download ? "_blank" : undefined}
              rel={!s.download ? "noopener noreferrer" : undefined}
              className="hover:underline underline-offset-4"
            >
              {s.label}
            </a>
          ))}
        </div>
        <span className="text-xs" style={{ ...MONO, color: "var(--graphite)" }}>
          © {new Date().getFullYear()} {PROFILE.name}
        </span>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// ROOT
// ---------------------------------------------------------------------------

export default function Portfolio() {
  return (
    <div
      style={{
        ...TOKENS,
        background: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-body)",
        minHeight: "100vh",
      }}
    >
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
        }
        a:focus-visible, button:focus-visible {
          outline: 2px solid var(--signal);
          outline-offset: 3px;
        }
      `}</style>

      {/* Drawing sheet frame */}
      <div className="m-3 sm:m-5 border min-h-[calc(100vh-2.5rem)]" style={{ borderColor: "var(--ink)" }}>
        <Nav />
        <main>
          <Hero />
          <Work />
          <Specifications />
          <About />
        </main>
        <Contact />
      </div>
    </div>
  );
}
