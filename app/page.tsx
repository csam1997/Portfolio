'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useScroll, useSpring } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Bug,
  Camera,
  Cloud,
  ExternalLink,
  FileSearch,
  FolderGit2,
  Link2,
  Lock,
  Mail,
  MapPin,
  Menu,
  Server,
  Shield,
  Terminal,
  X,
} from 'lucide-react';

import InteractiveBentoGallery, {
  type BentoMediaItem,
} from '@/components/ui/interactive-bento-gallery';

type NavLink = {
  href: string;
  label: string;
};

type AccentColor = 'amber' | 'orange' | 'rose' | 'sky' | 'teal' | 'violet';

type SkillGroup = {
  color: AccentColor;
  icon: LucideIcon;
  skills: string[];
  title: string;
};

type Project = {
  color: AccentColor;
  description: string;
  github?: string;
  icon: LucideIcon;
  live?: string;
  tags: string[];
  title: string;
};

type Credential = {
  badge: string;
  badgeStyle: 'azure' | 'gold' | 'green';
  issuer: string;
  level?: string;
  status?: string;
  title: string;
};

const ACCENT_STYLES: Record<
  AccentColor,
  { chip: string; icon: string; tag: string }
> = {
  amber: {
    chip: 'border-amber-400/25 bg-amber-400/15',
    icon: 'text-amber-300',
    tag: 'border-amber-400/25 bg-amber-400/10 text-amber-200',
  },
  orange: {
    chip: 'border-orange-400/25 bg-orange-400/15',
    icon: 'text-orange-300',
    tag: 'border-orange-400/25 bg-orange-400/10 text-orange-200',
  },
  rose: {
    chip: 'border-rose-400/25 bg-rose-400/15',
    icon: 'text-rose-300',
    tag: 'border-rose-400/25 bg-rose-400/10 text-rose-200',
  },
  sky: {
    chip: 'border-sky-400/25 bg-sky-400/15',
    icon: 'text-sky-300',
    tag: 'border-sky-400/25 bg-sky-400/10 text-sky-200',
  },
  teal: {
    chip: 'border-teal-400/25 bg-teal-400/15',
    icon: 'text-teal-300',
    tag: 'border-teal-400/25 bg-teal-400/10 text-teal-200',
  },
  violet: {
    chip: 'border-violet-400/25 bg-violet-400/15',
    icon: 'text-violet-300',
    tag: 'border-violet-400/25 bg-violet-400/10 text-violet-200',
  },
};

const NAV_LINKS: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Credentials', href: '#credentials' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Off Screen', href: '#off-screen' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const SKILL_GROUPS: SkillGroup[] = [
  {
    icon: Terminal,
    title: 'Windows & Systems Administration',
    color: 'sky',
    skills: [
      'Windows Server 2022',
      'Active Directory (AD DS)',
      'DNS / DHCP',
      'Group Policy (GPO)',
      'OUs, Users & Groups',
      'File Services & NTFS Permissions',
      'Windows 10/11',
    ],
  },
  {
    icon: Server,
    title: 'Linux Administration',
    color: 'teal',
    skills: [
      'Ubuntu / Linux',
      'SSH & sudo',
      'systemd & journalctl',
      'UFW & Nginx',
      'Cron & Package Management',
      'Bash Scripting',
    ],
  },
  {
    icon: Cloud,
    title: 'Cloud & Infrastructure as Code',
    color: 'violet',
    skills: [
      'Azure VMs, VNets & NSGs',
      'Azure RBAC & Storage Accounts',
      'Load Balancer & Key Vault',
      'Terraform (Modules, Remote State)',
      'Bicep & ARM Templates',
      'Azure CLI',
      'GitHub Actions / Azure DevOps CI-CD',
    ],
  },
  {
    icon: Shield,
    title: 'Identity & Access Management',
    color: 'amber',
    skills: [
      'Microsoft Entra ID',
      'Active Directory & Group-Based Access',
      'SSO, MFA & Conditional Access',
      'SAML 2.0 / OAuth 2.0 / OIDC',
      'Joiner-Mover-Leaver Lifecycle',
      'Access Recertification & Least Privilege',
      'Okta (Federation Projects)',
    ],
  },
  {
    icon: Bug,
    title: 'QA Automation & Testing',
    color: 'rose',
    skills: [
      'Playwright (Python / pytest)',
      'Selenium WebDriver & Page Object Model',
      'TestNG / JUnit / Cucumber (BDD)',
      'Postman & Newman API Testing',
      'JSON Schema & Data Validation',
      'Cross-Browser & Regression Testing',
    ],
  },
  {
    icon: FileSearch,
    title: 'Delivery, Monitoring & Ops',
    color: 'orange',
    skills: [
      'Jenkins & GitHub Actions',
      'Git / GitHub & Azure DevOps',
      'JIRA, Zephyr & ServiceNow ITSM',
      'Azure Monitor & Log Analytics (KQL)',
      'Incident, Change & Root-Cause Docs',
      'PowerShell, Python & Bash',
    ],
  },
];

const PROJECTS: Project[] = [
  {
    icon: Terminal,
    title: 'Windows & Hybrid Identity Operations Lab',
    description:
      'A multi-VM Windows Server domain with a domain controller, file server, and Windows 11 client — OUs, GPOs, DNS/DHCP, and scoped Entra Connect Sync to test hybrid identity, provisioning/deprovisioning, and SSO concepts.',
    tags: ['Windows Server 2022', 'AD DS', 'GPO', 'Entra Connect Sync', 'PowerShell'],
    color: 'sky',
  },
  {
    icon: Cloud,
    title: 'Multi-Environment Azure IaC with Terraform',
    description:
      'Reusable Terraform modules for resource groups, networking, VMs, storage, and Key Vault, deployed across dev/prod via workspaces with a remote backend, an OIDC-authenticated GitHub Actions pipeline, and Entra-based RBAC.',
    tags: ['Terraform', 'Azure', 'GitHub Actions', 'OIDC', 'Key Vault'],
    color: 'violet',
  },
  {
    icon: Activity,
    title: 'Azure Administration, Monitoring & Cost Ops Lab',
    description:
      'A Bicep + PowerShell deployment of a tagged, locked Azure environment with Log Analytics alerting, KQL queries for RBAC/NSG changes and sign-in failures, and Azure Backup / Update Manager operations.',
    tags: ['Bicep', 'PowerShell', 'Azure Monitor', 'KQL', 'Azure Backup'],
    color: 'amber',
  },
  {
    icon: Server,
    title: 'Linux Server Administration & Automation Lab',
    description:
      'Ubuntu servers administered end to end — users, sudo, SSH keys, systemd services, UFW, Nginx, and cron — with Bash health checks and documented incident recovery for CPU, memory, disk, and service conditions.',
    tags: ['Ubuntu Server', 'SSH', 'systemd', 'Bash', 'UFW / Nginx'],
    color: 'teal',
  },
  {
    icon: Shield,
    title: 'Enterprise IAM Operations & Access Governance Lab',
    description:
      '10+ modeled identities with joiner-mover-leaver, contractor-expiration, and urgent-offboarding workflows validated through ServiceNow approvals, Microsoft Graph PowerShell automation, and Azure RBAC access recertification.',
    tags: ['Microsoft Entra ID', 'ServiceNow PDI', 'Graph PowerShell', 'Azure RBAC'],
    color: 'orange',
  },
  {
    icon: Lock,
    title: 'SSO & Federation Integration Lab',
    description:
      'Test applications integrated via OIDC/OAuth 2.0 and SAML SSO with group/app-role assignment and MFA, troubleshooting redirect URI, claims, and token issues documented in a reproducible support runbook.',
    tags: ['Okta', 'OIDC / OAuth 2.0', 'SAML 2.0', 'Postman'],
    color: 'violet',
  },
  {
    icon: Bug,
    title: 'Full-Stack Test Automation Framework',
    description:
      'A layered Playwright/pytest framework validating UI, API, and PostgreSQL data together — headless parallel execution in GitHub Actions with Allure reporting, flaky-test quarantine, and automatic ServiceNow ticket creation on failures.',
    tags: ['Playwright', 'pytest', 'PostgreSQL', 'GitHub Actions', 'Allure'],
    color: 'rose',
  },
  {
    icon: FileSearch,
    title: 'Enterprise Selenium BDD Regression Framework',
    description:
      'A Cucumber + Page Object Model framework covering login, RBAC, and access-denied journeys, paired with a Postman/Newman API layer and a Jenkins pipeline running parallel TestNG execution with smoke gates.',
    tags: ['Selenium', 'TestNG', 'Cucumber', 'Jenkins', 'Postman/Newman'],
    color: 'orange',
  },
  {
    icon: Lock,
    title: 'TrusLex',
    description:
      'An AI litigation dashboard that surfaces DAIL lawsuit data with state-level exploration, trend analysis, upload support, and filterable visualizations for faster legal research.',
    tags: ['Node.js', 'Express', 'XLSX', 'AI Litigation'],
    color: 'teal',
    github: 'https://github.com/csam1997/TrusLex',
    live: 'https://csam1997.github.io/TrusLex/',
  },
  {
    icon: Activity,
    title: 'Meals-on-Wheels',
    description:
      'An end-to-end automation framework built for parallel execution, visual regression checks, and reliable CI pipelines.',
    tags: ['Playwright', 'TypeScript', 'CI/CD', 'Docker'],
    color: 'sky',
  },
  {
    icon: FileSearch,
    title: 'AI Trip Planner',
    description:
      'A fully client-side travel planner with a 3-step wizard, Groq-powered itineraries, hotel and event recommendations, Google Maps and Flights links, exchange rates, and PNG trip export.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Groq API', 'html2canvas'],
    color: 'amber',
    github: 'https://github.com/SakethBandlapalli/Ai_Trip_Planner',
    live: 'https://sakethbandlapalli.github.io/Ai_Trip_Planner/',
  },
];

const EXPERIENCE = [
  {
    title: 'Events Assistant I (Part-Time)',
    organization: 'George Washington University, Washington, DC',
    period: 'Summer 2025',
    summary:
      'Supported scheduling, stakeholder communication, and day-of issue coordination in a fast-paced service environment alongside full-time graduate coursework.',
    highlights: [],
  },
  {
    title: 'QA Automation Engineer',
    organization:
      'Cognizant Technology Solutions - Banking & Financial Services Client, India',
    period: '2019-2024',
    summary:
      'Progressed from manual QA into automation framework development, Active Directory/Azure access validation, and identity governance for enterprise banking applications.',
    highlights: [
      {
        heading: 'Identity & Access Validation',
        period: '2022-2024',
        bullets: [
          'Validated RBAC, provisioning/deprovisioning, role-change, onboarding, and offboarding workflows for enterprise banking applications, improving reliability of access-lifecycle controls.',
          'Verified Active Directory account states, group-based entitlements, downstream permissions, and SSO/MFA authentication behavior across Windows-based enterprise environments.',
          'Validated Azure RBAC outcomes and Active Directory-dependent group/role mappings for regulated banking applications.',
          'Triaged ServiceNow access incidents and change requests with reproducible evidence, SLA-aware notes, escalation details, and retest results for IAM, support, and development teams.',
        ],
      },
      {
        heading: 'Automation & API Regression',
        period: '2020-2022',
        bullets: [
          'Designed and maintained Selenium (Python/Java) Page Object Model frameworks with TestNG/JUnit suites and parallel execution, reducing repeatable manual validation 45% and improving sprint-level throughput.',
          'Authored Cucumber/Gherkin BDD scenarios and Postman REST API suites (payload, schema, and negative validation), integrated into Jenkins CI with build-triggered regression execution.',
          'Validated authentication-dependent APIs and payload/schema integrity across QA and pre-production, including cloud-connected application behavior.',
          'Managed Zephyr/JIRA test cycles, coverage matrices, defect records, retest evidence, and release-readiness documentation across Agile delivery cycles.',
        ],
      },
      {
        heading: 'Manual QA & Defect Validation',
        period: '2019-2020',
        bullets: [
          'Created and executed functional, smoke, sanity, and regression test cases from business requirements and user stories, documenting defects and release-impact evidence in JIRA.',
          'Supported end-to-end validation of access-related workflows, catching UI, data, and permission defects before production handoff.',
          'Partnered with developers and business teams during defect triage and retesting to move validated fixes back into the release cycle faster.',
        ],
      },
    ],
  },
];

const EDUCATION = [
  {
    degree: 'MS, Computer Science (Cybersecurity)',
    school: 'The George Washington University, SEAS',
    meta: 'Expected May 2026 - Washington, DC',
    details: [
      'Computer Security',
      'Network Security',
      'Computer Network Defense',
      'Cloud Computing',
      'Unix Systems Administration',
      'Computer System Architecture',
      'Management of Information & Systems Security',
    ],
  },
  {
    degree: 'BTech, Electrical & Computer Engineering',
    school: 'Indira Gandhi Institute of Technology',
    meta: '2019 - India',
    details: [],
  },
];

const CREDENTIALS: Credential[] = [
  {
    badge: 'MS',
    badgeStyle: 'azure',
    title: 'Azure Administrator Associate',
    issuer: 'Microsoft',
    level: 'AZ-104',
  },
  {
    badge: 'MS',
    badgeStyle: 'azure',
    title: 'Azure Fundamentals',
    issuer: 'Microsoft',
    level: 'AZ-900',
  },
  {
    badge: 'MS',
    badgeStyle: 'azure',
    title: 'Copilot and Agent Administration Fundamentals',
    issuer: 'Microsoft 365',
    level: 'AB-900',
  },
  {
    badge: 'CTTC',
    badgeStyle: 'gold',
    title: 'PLC & SCADA',
    issuer: 'MSME, Govt. of India',
    level: 'CTTC',
  },
];

const OFF_SCREEN: BentoMediaItem[] = [
  {
    id: 1,
    type: 'image',
    title: 'FPS Games',
    desc: 'Headshots over handshakes. Valorant, CS2, and anything with a recoil pattern.',
    url: '/off-screen/fps-games.jpg',
    span: 'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2',
  },
  {
    id: 2,
    type: 'image',
    title: 'Slow Musics',
    desc: 'Lo-fi, instrumentals, and calm late-night playlists help me reset, think clearly, and stay grounded.',
    url: '/off-screen/slow-music.webp',
    span: 'md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2',
  },
  {
    id: 3,
    type: 'image',
    title: 'Exploring Cuisines',
    desc: "If the menu scares me, I'm ordering it. Street food to fine dining.",
    url: '/off-screen/exploring-cuisines.jpg',
    span: 'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2',
  },
  {
    id: 4,
    type: 'image',
    title: 'Cooking',
    desc: 'Turning random fridge ingredients into something surprisingly edible.',
    url: '/off-screen/cooking.jpg',
    span: 'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2',
  },
  {
    id: 5,
    type: 'image',
    title: 'Love Pets',
    desc: "Huskies, goldens, strays - if it has four legs, I'm already petting it.",
    url:
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
    span: 'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2',
  },
  {
    id: 6,
    type: 'image',
    title: 'Photography',
    desc: 'Chasing golden hour and pretending my phone is a DSLR.',
    url: '/off-screen/photography.jpg',
    span: 'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2',
  },
  {
    id: 7,
    type: 'image',
    title: 'Chess',
    desc: 'I like slow, strategic games that reward patience, planning, and seeing three moves ahead.',
    url:
      'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&w=1200&q=80',
    span: 'md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2',
  },
  {
    id: 8,
    type: 'image',
    title: 'Travelling',
    desc: 'New cities, new cultures. Collecting passport stamps and stories.',
    url: '/off-screen/travelling.jpg',
    mediaClassName: 'bg-black/30 object-contain p-2 sm:p-3',
    span: 'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2',
  },
];

const HERO_SIGNALS = [
  { value: 'Cloud & Systems', label: 'Azure, Windows Server, and Linux administration' },
  { value: 'Identity & Access', label: 'Entra ID, Active Directory, RBAC, SSO/MFA' },
  { value: 'QA Automation', label: 'Selenium, Playwright, and CI/CD pipelines' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-white/8 bg-white/[0.035] shadow-[0_24px_60px_-32px_rgba(0,0,0,0.7)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/14 hover:bg-white/[0.055] hover:shadow-[0_32px_75px_-28px_rgba(0,0,0,0.75)] ${className}`}
    >
      {children}
    </div>
  );
}

function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`relative px-6 py-20 md:px-10 lg:px-16 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <motion.div variants={fadeUp} className="mb-12 flex flex-col items-center text-center">
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300">
        <span className="h-1 w-1 rounded-full bg-amber-300" />
        {label}
      </span>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
        {title}
      </h2>
    </motion.div>
  );
}

function SectionHeadingStacked({
  label,
  titleLines,
}: {
  label: string;
  titleLines: string[];
}) {
  return (
    <motion.div variants={fadeUp} className="mb-12 flex flex-col items-center text-center">
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300">
        <span className="h-1 w-1 rounded-full bg-amber-300" />
        {label}
      </span>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
        {titleLines.map((line, index) => (
          <span key={`${label}-${line}`} className="block">
            <span className={index === titleLines.length - 1 ? 'text-white/30' : ''}>
              {line}
            </span>
          </span>
        ))}
      </h2>
    </motion.div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/8 bg-[#0b1120]/80 px-6 py-4 backdrop-blur-xl md:px-10"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 font-display text-sm font-bold text-slate-950">
            C
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-white">
            Chiranjib Samantaray
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm tracking-wide text-white/55 transition-colors duration-200 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <a
              href="#contact"
              className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors duration-200 hover:bg-amber-300"
            >
              Hire Me
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:text-white lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0b1120]/95 px-6 py-6 backdrop-blur-xl lg:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="border-b border-white/5 py-2 text-sm text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-amber-400 px-5 py-2 text-center text-sm font-semibold text-slate-950"
            >
              Hire Me
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-24 pt-40 md:px-10 lg:px-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-[30rem] w-[30rem] rounded-full bg-amber-400/10 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-rose-400/8 blur-[110px]"
      />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-amber-200"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
          Available for work
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-display text-5xl font-semibold leading-[1.04] tracking-tight text-white md:text-7xl"
        >
          Chiranjib <span className="text-amber-300">Samantaray</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg font-medium text-white/70 md:text-xl"
        >
          Automating systems. Securing identity.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-2xl text-base leading-relaxed text-white/55 md:text-lg"
        >
          Cybersecurity graduate student with nearly 5 years of enterprise
          experience across Windows Server &amp; Linux administration, Azure
          cloud infrastructure, identity &amp; access management, and QA
          automation for banking and financial services. Targeting Systems
          Engineer, Cloud Administrator, IAM Analyst/Engineer, and QA
          Automation Engineer roles.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-2 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#projects"
            className="rounded-full bg-amber-400 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 hover:bg-amber-300"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/15 px-8 py-3.5 text-sm font-semibold text-white/80 transition-all hover:-translate-y-0.5 hover:border-white/30 hover:text-white"
          >
            Get In Touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {HERO_SIGNALS.map((signal) => (
            <div
              key={signal.value}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left transition-colors duration-200 hover:border-amber-400/25"
            >
              <span className="font-display text-sm font-semibold text-amber-200">
                {signal.value}
              </span>
              <p className="mt-1 text-xs text-white/45">{signal.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const ABOUT_FOCUS_AREAS = [
  'Cloud & Systems Administration',
  'Identity & Access Management',
  'Infrastructure as Code',
  'QA Automation',
];

function About() {
  return (
    <Section id="about">
      <SectionHeading label="Who I Am" title="About Me" />

      <motion.div variants={fadeUp} className="mx-auto max-w-4xl">
        <Card className="p-8 md:p-12">
          <div className="flex flex-col gap-5">
            <p className="text-base leading-relaxed text-white/80 md:text-lg">
              I&apos;m a cybersecurity graduate student at The George Washington
              University (M.S., May 2026), building on nearly 5 years of
              enterprise experience at Cognizant in banking and financial
              services. I started in manual QA, grew into automation framework
              development, and along the way picked up a deep, hands-on
              familiarity with the systems that automation depends on: Windows
              Server and Active Directory, Linux, and the identity layer that
              ties enterprise access together.
            </p>

            <p className="text-base leading-relaxed text-white/60">
              That combination is what pulled me toward cloud and systems
              engineering. I&apos;m comfortable moving between provisioning
              Azure infrastructure with Terraform and Bicep, administering AD
              DS/DNS/GPO on Windows Server, hardening and scripting on Linux,
              and validating identity workflows &mdash; SSO, MFA, RBAC,
              joiner-mover-leaver &mdash; end to end. QA automation taught me
              to think in terms of evidence and repeatability, and that habit
              now shows up in how I document, test, and roll back
              infrastructure changes.
            </p>

            <p className="text-base leading-relaxed text-white/60">
              Outside of coursework, I run a home lab that mirrors the
              enterprise problems I care most about: a multi-VM Windows/Entra
              hybrid identity environment, Terraform-provisioned Azure
              infrastructure with CI/CD gating, Linux servers I administer and
              monitor myself, and automation frameworks built in Playwright
              and Selenium. It&apos;s where I test ideas before they show up
              on a resume.
            </p>

            <p className="text-base leading-relaxed text-white/60">
              I&apos;m currently targeting full-time Systems Engineer, Cloud
              Administrator, IAM Analyst/Engineer, and QA Automation Engineer
              roles &mdash; and genuinely enjoy the parts of the job most
              people skip: reading the logs, writing the runbook, and making
              sure the access someone has is exactly the access they should
              have.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {ABOUT_FOCUS_AREAS.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-amber-400/20 bg-amber-400/8 px-3.5 py-1.5 text-xs font-medium text-amber-200"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </Section>
  );
}

function Education() {
  return (
    <Section id="education">
      <SectionHeading label="Education" title="The foundation behind it all." />

      <motion.div
        variants={stagger}
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {EDUCATION.map((item) => (
          <motion.div key={`${item.degree}-${item.school}`} variants={fadeUp}>
            <Card className="h-full p-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-2xl font-medium text-white">{item.degree}</h3>
                  <p className="text-sm uppercase tracking-[0.24em] text-amber-300/80">
                    {item.school}
                  </p>
                  <p className="text-sm text-white/55">{item.meta}</p>
                </div>

                {item.details.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.details.map((detail) => (
                      <span
                        key={detail}
                        className="rounded-lg border border-white/8 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function CredentialBadge({
  badge,
  badgeStyle,
}: Pick<Credential, 'badge' | 'badgeStyle'>) {
  if (badgeStyle === 'azure') {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-2 gap-[3px]">
          <span className="h-3.5 w-3.5 bg-[#f25022]" />
          <span className="h-3.5 w-3.5 bg-[#7fba00]" />
          <span className="h-3.5 w-3.5 bg-[#00a4ef]" />
          <span className="h-3.5 w-3.5 bg-[#ffb900]" />
        </div>
      </div>
    );
  }

  if (badgeStyle === 'green') {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-teal-400/25 bg-teal-400/10 px-2 text-center text-sm font-semibold text-teal-300">
        {badge}
      </div>
    );
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/10 px-2 text-center text-sm font-semibold text-amber-300">
      {badge}
    </div>
  );
}

function Credentials() {
  return (
    <Section id="credentials">
      <motion.div variants={stagger} className="mx-auto flex max-w-6xl flex-col gap-12">
        <SectionHeadingStacked
          label="Credentials"
          titleLines={['Backed by', 'verified learning.']}
        />

        <motion.div variants={stagger} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CREDENTIALS.map((credential, index) => (
            <motion.div key={`${credential.title}-${credential.level ?? credential.issuer}`} variants={fadeUp}>
              <Card className="flex items-center gap-5 p-6">
                <span className="font-display hidden text-xs text-white/25 sm:block">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <CredentialBadge badge={credential.badge} badgeStyle={credential.badgeStyle} />

                <div className="flex min-w-0 flex-1 flex-col gap-1 text-left">
                  <h3 className="font-display text-lg font-medium leading-tight text-white sm:text-xl">
                    {credential.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/45">
                    {credential.level ? `${credential.level} — ` : ''}
                    {credential.issuer}
                    {credential.status ? ' — ' : ''}
                    {credential.status ? (
                      <span className="text-amber-300">{credential.status}</span>
                    ) : null}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}

function OffScreen() {
  return (
    <Section id="off-screen">
      <motion.div variants={stagger} className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionHeadingStacked
          label="Off Screen"
          titleLines={['When I step away', 'from the screen.']}
        />

        <motion.div variants={fadeUp}>
          <InteractiveBentoGallery mediaItems={OFF_SCREEN} enableInteractions={false} />
        </motion.div>
      </motion.div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience">
      <SectionHeading label="Journey" title="Where I got the opportunity." />

      <motion.div variants={stagger} className="mx-auto flex max-w-6xl flex-col">
        {EXPERIENCE.map((role, index) => (
          <motion.div
            key={`${role.title}-${role.period}`}
            variants={fadeUp}
            className="relative flex gap-5 pb-10 last:pb-0 md:gap-8"
          >
            <div className="relative flex w-6 shrink-0 flex-col items-center md:w-8">
              <span className="mt-2 flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-2 border-amber-300 bg-[#0b1120]">
                <span className="h-1 w-1 rounded-full bg-amber-300" />
              </span>
              {index < EXPERIENCE.length - 1 ? (
                <span className="mt-1 w-px flex-1 bg-gradient-to-b from-amber-300/40 via-white/10 to-transparent" />
              ) : null}
            </div>

            <Card className="w-full p-8">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-medium text-white">{role.title}</h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.24em] text-amber-300/80">
                      {role.organization}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-white/55">{role.period}</span>
                </div>

                <details className="group rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
                  <summary className="cursor-pointer list-none text-sm font-medium text-white/75 transition-colors group-open:text-white">
                    View details
                  </summary>

                  <div className="mt-4 flex flex-col gap-6">
                    <p className="max-w-4xl text-base leading-relaxed text-white/75">
                      {role.summary}
                    </p>

                    {role.highlights.length > 0 ? (
                      <div className="flex flex-col gap-6 pt-1">
                        {role.highlights.map((highlight) => (
                          <div
                            key={`${highlight.heading}-${highlight.period}`}
                            className="flex flex-col gap-3"
                          >
                            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                              <h4 className="font-display text-lg font-medium text-white">
                                {highlight.heading}
                              </h4>
                              <span className="text-sm text-white/45">{highlight.period}</span>
                            </div>
                            <ul className="space-y-3 text-sm leading-relaxed text-white/65">
                              {highlight.bullets.map((bullet) => (
                                <li key={bullet} className="flex gap-3">
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </details>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills">
      <SectionHeading label="Technical Skills" title="What I work with daily." />

      <motion.div
        variants={stagger}
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {SKILL_GROUPS.map(({ color, icon: Icon, skills, title }, index) => (
          <motion.div key={title} variants={fadeUp}>
            <Card className="flex h-full flex-col gap-5 p-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${ACCENT_STYLES[color].chip}`}>
                    <Icon className={`h-5 w-5 ${ACCENT_STYLES[color].icon}`} />
                  </div>
                  <h3 className="font-display text-lg font-medium text-white">{title}</h3>
                </div>
                <span className="font-display text-xs text-white/25">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-white/8 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-all duration-200 hover:border-white/20 hover:text-white"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function ProjectLinks({ github, live }: { github?: string; live?: string }) {
  if (!github && !live) {
    return null;
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      {github ? (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 transition-colors hover:text-white"
          aria-label="GitHub"
        >
          <FolderGit2 className="h-4 w-4" />
        </a>
      ) : null}
      {live ? (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 transition-colors hover:text-white"
          aria-label="Live demo"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  );
}

function Projects() {
  return (
    <Section id="projects">
      <SectionHeading label="Work" title="Featured Projects" />

      <motion.div
        variants={stagger}
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {PROJECTS.map((project, index) => {
          const Icon = project.icon;

          return (
            <motion.div key={project.title} variants={fadeUp}>
              <Card className="flex h-full flex-col gap-5 p-7">
                <div className="flex h-full flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${ACCENT_STYLES[project.color].chip}`}
                      >
                        <Icon className={`h-5 w-5 ${ACCENT_STYLES[project.color].icon}`} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-display text-[11px] text-white/30">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-display text-lg font-medium leading-snug text-white">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                    <ProjectLinks github={project.github} live={project.live} />
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-white/60">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-md border px-2.5 py-1 text-xs font-medium ${ACCENT_STYLES[project.color].tag}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}

function Contact() {
  const contactLinks = [
    {
      href: 'https://github.com/csam1997',
      icon: FolderGit2,
      label: 'GitHub',
    },
    {
      href: 'https://www.linkedin.com/in/chiranjib-samantaray',
      icon: Link2,
      label: 'LinkedIn',
    },
    {
      href: 'https://www.instagram.com/',
      icon: Camera,
      label: 'Instagram',
    },
    {
      href: 'mailto:samantaray.chiranjib97@gmail.com',
      icon: Mail,
      label: 'Email',
    },
  ];

  return (
    <Section id="contact" className="pb-24">
      <motion.div
        variants={fadeUp}
        className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-amber-400/20 bg-gradient-to-br from-amber-400/12 via-white/[0.02] to-transparent p-10 text-center md:p-16"
      >
        <SectionHeadingStacked label="Contact" titleLines={['Got a challenge?', "I'm all ears."]} />

        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60">
          I&apos;m currently open to new opportunities and collaborations. Whether
          you have a question, a project, or just want to say hi, my inbox is
          always open.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-3 text-lg text-white/70">
            <MapPin className="h-5 w-5 text-amber-300" />
            <span>Arlington, Virginia</span>
          </div>
          <a
            href="mailto:samantaray.chiranjib97@gmail.com"
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-amber-300"
          >
            <Mail className="h-4 w-4" />
            samantaray.chiranjib97@gmail.com
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {contactLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              aria-label={label}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/55 transition-all duration-200 hover:border-amber-400/30 hover:bg-amber-400/8 hover:text-amber-300"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={fadeIn}
        className="mx-auto mt-16 max-w-6xl border-t border-white/8 pt-8 text-center"
      >
        <p className="text-sm text-white/35">
          Designed &amp; Built by{' '}
          <span className="font-medium text-amber-300">Chiranjib Samantaray</span>
        </p>
        <p className="mt-3 text-xs tracking-[0.2em] text-white/18">
          (c) 2026 All rights reserved.
        </p>
      </motion.div>
    </Section>
  );
}

export default function PortfolioPage() {
  return (
    <main className="relative min-h-screen bg-[#0b1120] font-sans text-white">
      <ScrollProgressBar />
      <Navbar />
      <Hero />
      <About />
      <Education />
      <Credentials />
      <Experience />
      <Skills />
      <OffScreen />
      <Projects />
      <Contact />
    </main>
  );
}
