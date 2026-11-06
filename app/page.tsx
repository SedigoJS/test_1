"use client";

import { ArrowUpRight, Download, Mail } from "lucide-react";
import Scene, { hover } from "../components/scene";

// ---------------------------------------------------------------------------
// CONTENT
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
    tags: ["E-commerce", "Neon PostgreSQL", "Stripe"],
    href: "https://lume-ecommerce.vercel.app/",
  },
  {
    index: "02",
    year: "2024",
    title: "LMS x AAI",
    description:
      "Learning management system for courses, assignments, and quizzes, with REST APIs and role-based access for admins, teachers, and students.",
    tags: ["Role-Based Access", "Education", "Full Stack"],
    href: "https://cwd-lms.vercel.app/",
  },
  {
    index: "03",
    year: "2024",
    title: "SurfxBini",
    description:
      "Promo platform where users submit entries and staff validate them in an admin CMS, with AWS cloud storage for media and uploads.",
    tags: ["CMS", "Admin Panel", "AWS"],
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
    tags: ["Animations", "Dynamic UI", "Web App"],
    href: "https://randomizer-cwd.vercel.app/",
  },
  {
    index: "06",
    year: "2024",
    title: "CloudCast",
    description:
      "A weather app providing real-time forecasts and location-based weather data via API integration.",
    tags: ["API", "Weather", "Next.js"],
    href: "https://cloudcast-sy.vercel.app/",
  },
];

const SPECS = [
  ["Frontend Development", "Responsive, accessible interfaces with React, Next.js, TypeScript, and Tailwind CSS."],
  ["Backend Development", "REST APIs and data models with Prisma and PostgreSQL, including auth, roles, and Stripe payments."],
  ["Deployment and Tooling", "Git, GitHub, and CI/CD pipelines, with hosting on Vercel, Cloudflare, and AWS."],
  ["Automation Tools", "Web tools and Windows scripts that process Excel, Word, and PDF files, including OCR."],
  ["Data and Documentation", "Accurate record management, spreadsheet organization, and structured document handling."],
  ["Operations Support", "Case files, document preparation, and office workflows with accuracy and deadline discipline."],
] as const;

// ---------------------------------------------------------------------------
// PIECES
// ---------------------------------------------------------------------------

const CARD = "rounded-2xl border border-white bg-white/75 backdrop-blur-md shadow-[0_8px_30px_rgba(15,23,42,0.06)]";
const PILL = "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition";

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-20">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full border border-white bg-white/70 px-6 py-3 backdrop-blur-md shadow-sm mx-4 sm:mx-auto">
        <a href="#hero" className="font-semibold tracking-tight">JS</a>
        <nav className="hidden gap-8 text-sm text-slate-600 md:flex">
          <a href="#work" className="hover:text-slate-900">Work</a>
          <a href="#specs" className="hover:text-slate-900">Capabilities</a>
          <a href="#about" className="hover:text-slate-900">About</a>
        </nav>
        <a href={`mailto:${PROFILE.email}`} className={`${PILL} bg-slate-900 text-white py-2 hover:bg-indigo-600`}>
          Say hello <ArrowUpRight size={14} />
        </a>
      </div>
    </header>
  );
}

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative flex items-center px-6 sm:px-10 lg:px-20 py-28 ${className}`}>
      <div className="w-full max-w-6xl mx-auto lg:mx-0 lg:max-w-[46%]">{children}</div>
    </section>
  );
}

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-indigo-600">{eyebrow}</p>
      <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">{title}</h2>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECTIONS
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <Section id="hero" className="min-h-screen">
      <p className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-1.5 text-sm text-slate-600 shadow-sm backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Available for freelance and full-time work
      </p>
      <h1 className="mt-8 text-6xl sm:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight text-slate-900">
        Joshua
        <br />
        Sedigo
      </h1>
      <p className="mt-6 text-sm font-medium text-slate-500">{PROFILE.role}</p>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">{PROFILE.tagline}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a href="#work" className={`${PILL} bg-indigo-600 text-white hover:bg-indigo-700`}>
          View work <ArrowUpRight size={16} />
        </a>
        <a href="/Joshua_Sedigo_Resume.pdf" download="Joshua_Sedigo_CV.pdf" className={`${PILL} border border-slate-300 bg-white/70 text-slate-800 hover:bg-white`}>
          <Download size={16} /> Resume
        </a>
      </div>
    </Section>
  );
}

function Work() {
  return (
    <Section id="work">
      <Heading eyebrow="Selected work" title="Projects" />
      <div className="mt-10 flex flex-col gap-4">
        {WORK.map((item, i) => (
          <article
            key={item.index}
            onMouseEnter={() => (hover.index = i)}
            onMouseLeave={() => (hover.index = -1)}
            className={`${CARD} p-6 transition hover:shadow-[0_16px_40px_rgba(79,70,229,0.14)]`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-indigo-600">{item.index}</p>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="mt-1 block text-xl font-semibold text-slate-900 hover:text-indigo-600">
                    {item.title}
                  </a>
                ) : (
                  <h3 className="mt-1 text-xl font-semibold text-slate-900">{item.title}</h3>
                )}
              </div>
              <span className="text-sm text-slate-400">{item.year}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{t}</span>
              ))}
            </div>
            {item.links && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:border-indigo-400 hover:text-indigo-600">
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

function Specs() {
  return (
    <Section id="specs">
      <Heading eyebrow="Capabilities" title="What I build with" />
      <div className="mt-10 flex flex-col gap-3">
        {SPECS.map(([label, detail]) => (
          <div key={label} className={`${CARD} p-5`}>
            <h3 className="font-semibold text-slate-900">{label}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{detail}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function About() {
  return (
    <Section id="about">
      <Heading eyebrow="About" title="Who I am" />
      <p className="mt-8 text-xl sm:text-2xl leading-relaxed text-slate-700">{PROFILE.bio}</p>
      <div className="mt-10 grid max-w-sm grid-cols-2 gap-4">
        <div className={`${CARD} p-5`}>
          <p className="text-xs text-slate-500">Based in</p>
          <p className="mt-1 font-semibold text-slate-900">{PROFILE.location}</p>
        </div>
        <div className={`${CARD} p-5`}>
          <p className="text-xs text-slate-500">Experience</p>
          <p className="mt-1 font-semibold text-slate-900">{getExperience()}</p>
        </div>
      </div>
    </Section>
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

function Contact() {
  return (
    <Section id="contact" className="min-h-[70vh]">
      <p className="text-sm font-medium text-indigo-600">Get in touch</p>
      <a href={`mailto:${PROFILE.email}`} className="group mt-4 inline-flex items-center gap-3 text-5xl sm:text-6xl font-semibold tracking-tight text-slate-900">
        Let&apos;s talk
        <ArrowUpRight size={48} className="text-indigo-600 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
      </a>
      <div className="mt-10 flex flex-col gap-4 text-sm text-slate-600">
        <a href={`mailto:${PROFILE.email}`} className="inline-flex items-center gap-2 hover:text-slate-900">
          <Mail size={14} /> {PROFILE.email}
        </a>
        <div className="flex gap-6">
          {PROFILE.social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">{s.label}</a>
          ))}
        </div>
        <p className="mt-6 text-xs text-slate-400">© {new Date().getFullYear()} {PROFILE.name}</p>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// ROOT
// ---------------------------------------------------------------------------

export default function Portfolio() {
  return (
    <div
      className="relative min-h-screen bg-[#F4F6FB] text-slate-900 antialiased"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundImage: "radial-gradient(60% 50% at 80% 20%, #E0E7FF 0%, transparent 70%), radial-gradient(50% 40% at 10% 90%, #CCFBF1 0%, transparent 70%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
        a:focus-visible { outline: 2px solid #4f46e5; outline-offset: 3px; border-radius: 6px; }
      `}</style>

      <Scene />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Work />
        <Specs />
        <About />
      </main>
      <div className="relative z-10">
        <Contact />
      </div>
    </div>
  );
}
