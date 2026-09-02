'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useScroll, useSpring } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowUpRight,
  Camera,
  Cloud,
  Compass,
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
  Workflow,
  X,
} from 'lucide-react';

import InteractiveBentoGallery, {
  type BentoMediaItem,
} from '@/components/ui/interactive-bento-gallery';

type NavLink = {
  href: string;
  label: string;
};

type SkillGroup = {
  icon: LucideIcon;
  skills: string[];
  title: string;
};

type Project = {
  description: string;
  github?: string;
  icon: LucideIcon;
  live?: string;
  tags: string[];
  title: string;
};

type Credential = {
  badge: string;
  badgeStyle: 'azure' | 'default';
  issuer: string;
  level?: string;
  title: string;
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
    skills: [
      'Windows Server 2022',
      'Active Directory (AD DS)',
      'DNS / DHCP',
      'Group Policy (GPO)',
      'OUs, Users & Groups',
      'File Services & NTFS Permissions',
      'Hyper-V / VirtualBox',
      'Windows 10/11',
    ],
  },
  {
    icon: Server,
    title: 'Linux Administration',
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
    skills: [
      'Azure VMs, VNets & NSGs',
      'Azure RBAC & Storage Accounts',
      'Load Balancer & Key Vault',
      'Managed Identities & Azure Policy',
      'Terraform (Modules, Remote State)',
      'Bicep & ARM Templates',
      'Azure CLI',
      'GitHub Actions / Azure DevOps CI-CD',
    ],
  },
  {
    icon: Shield,
    title: 'Identity & Access Management',
    skills: [
      'Microsoft Entra ID & Entra Connect Sync',
      'Active Directory & Group-Based Access',
      'SSO, MFA & Conditional Access',
      'SAML 2.0 / OAuth 2.0 / OIDC',
      'Joiner-Mover-Leaver Lifecycle',
      'Provisioning & Deprovisioning',
      'Access Recertification & Least Privilege',
      'Okta (Federation Projects)',
    ],
  },
  {
    icon: Workflow,
    title: 'Automation & Scripting',
    skills: [
      'PowerShell & Microsoft Graph PowerShell',
      'Python',
      'Bash',
      'SQL Server (SSMS)',
      'IIS & SharePoint',
      'LLM API Automation (Claude, Groq, Gemini)',
      'Prompt Engineering',
    ],
  },
  {
    icon: Activity,
    title: 'Monitoring, ITSM & Support',
    skills: [
      'Azure Monitor & Log Analytics (KQL)',
      'ServiceNow (Incident / Change / Problem)',
      'SLA-Driven Ticket Queues & Escalation',
      'Patch & Vulnerability Remediation Tracking',
      'Azure Backup & Update Manager',
      'Runbooks & Change Documentation',
      'ITIL',
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
  },
  {
    icon: Cloud,
    title: 'Multi-Environment Azure IaC with Terraform',
    description:
      'Reusable Terraform modules for resource groups, networking, VMs, storage, and Key Vault, deployed across dev/prod via workspaces with a remote backend, an OIDC-authenticated GitHub Actions pipeline, and Entra-based RBAC.',
    tags: ['Terraform', 'Azure', 'GitHub Actions', 'OIDC', 'Key Vault'],
  },
  {
    icon: Shield,
    title: 'Enterprise IAM Operations & Access Governance Lab',
    description:
      '10+ modeled identities with joiner-mover-leaver, contractor-expiration, and urgent-offboarding workflows validated through ServiceNow approvals, Microsoft Graph PowerShell automation, and Azure RBAC access recertification.',
    tags: ['Microsoft Entra ID', 'ServiceNow PDI', 'Graph PowerShell', 'Azure RBAC'],
  },
  {
    icon: Activity,
    title: 'Azure Administration, Monitoring & Cost Ops Lab',
    description:
      'A Bicep + PowerShell deployment of a tagged, locked Azure environment with Log Analytics alerting, KQL queries for RBAC/NSG changes and sign-in failures, and Azure Backup / Update Manager operations.',
    tags: ['Bicep', 'PowerShell', 'Azure Monitor', 'KQL', 'Azure Backup'],
  },
  {
    icon: Server,
    title: 'Linux Server Administration & Automation Lab',
    description:
      'Ubuntu servers administered end to end — users, sudo, SSH keys, systemd services, UFW, Nginx, and cron — with Bash health checks and documented incident recovery for CPU, memory, disk, and service conditions.',
    tags: ['Ubuntu Server', 'SSH', 'systemd', 'Bash', 'UFW / Nginx'],
  },
  {
    icon: Lock,
    title: 'SSO & Federation Integration Lab',
    description:
      'Applications integrated via OIDC/OAuth 2.0 and SAML SSO with group/app-role assignment and MFA, with redirect URI, claims, and token issues troubleshot and documented in a reproducible support runbook.',
    tags: ['Okta', 'OIDC / OAuth 2.0', 'SAML 2.0', 'Postman'],
  },
  {
    icon: Workflow,
    title: 'AI-Assisted Workflow Automation (VOYAGER)',
    description:
      'A full-stack tool that wires LLM APIs — Anthropic Claude, Groq, and Gemini — into a live app, applying prompt engineering and AI automation to streamline repetitive workflows.',
    tags: ['Anthropic Claude API', 'Groq', 'Gemini', 'Prompt Engineering', 'Full-Stack'],
  },
  {
    icon: FileSearch,
    title: 'TrusLex',
    description:
      'An AI litigation dashboard that surfaces DAIL lawsuit data with state-level exploration, trend analysis, upload support, and filterable visualizations for faster legal research.',
    tags: ['Node.js', 'Express', 'XLSX', 'AI Litigation'],
    github: 'https://github.com/csam1997/TrusLex',
    live: 'https://csam1997.github.io/TrusLex/',
  },
  {
    icon: MapPin,
    title: 'Meals-on-Wheels',
    description:
      'A Reboot the Earth hackathon prototype that maps nearby food distribution points, community kitchens, and meal providers on an interactive Leaflet.js map to improve food access in underserved neighborhoods.',
    tags: ['HTML / CSS', 'JavaScript', 'Leaflet.js', 'Hackathon'],
    github: 'https://github.com/csam1997/Meals-on-Wheels',
  },
  {
    icon: Compass,
    title: 'AI Trip Planner',
    description:
      'A fully client-side travel planner with a 3-step wizard, Groq-powered itineraries, hotel and event recommendations, Google Maps and Flights links, exchange rates, and PNG trip export.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Groq API', 'html2canvas'],
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
    title: 'Systems Engineer',
    organization: 'Cognizant Technology Solutions - US Insurance Client, India',
    period: '2021 – 2024',
    summary:
      'Administered and supported Windows Server, Linux, and Azure infrastructure for a leading US-based insurance client — owning patch deployment, environment maintenance, identity operations, monitoring, and change management in an SLA-driven production environment.',
    highlights: [
      {
        heading: 'Infrastructure, Cloud & Operations',
        period: '',
        bullets: [
          'Administered hybrid Windows Server and Linux infrastructure across on-premises and Azure environments — owning patch deployment, environment maintenance, and day-to-day production operations against defined SLAs.',
          'Provisioned Azure resources (VMs, Storage, VNets/NSGs, Key Vault, Azure Policy) with Terraform and Bicep, delivering changes through version-controlled pipelines (Azure DevOps / GitHub Actions) under ITIL change management.',
          'Monitored production health with Azure Monitor and Log Analytics (KQL) alongside on-prem tooling; triaged alerts, performed root-cause analysis, and served as Tier 2/3 escalation point for complex Windows, Linux, connectivity, and access issues.',
          'Authored runbooks, change records, and troubleshooting guides in ServiceNow and the knowledge base; coordinated maintenance windows and rollouts with security, application engineering, and client infrastructure teams to harden configurations and remediate vulnerabilities.',
        ],
      },
      {
        heading: 'Identity & Automation',
        period: '',
        bullets: [
          'Managed identity infrastructure across Active Directory (AD DS, OUs, Group Policy) and Entra ID via Entra Connect sync: joiner/mover/leaver provisioning and deprovisioning, RBAC and group assignments, SSO/MFA (SAML 2.0, OIDC), and access recertification under least-privilege policy.',
          'Built and maintained PowerShell (incl. Microsoft Graph) and Python automations for patch-compliance reporting, server health checks, bulk account provisioning, and backup verification, reducing manual effort and repeat tickets.',
        ],
      },
    ],
  },
  {
    title: 'L1 Support Engineer',
    organization: 'Cognizant Technology Solutions - Banking & Financial Services Client, India',
    period: '2019 – 2021',
    summary:
      'First-line support for Windows, application, and access issues in an SLA-driven ServiceNow queue, with hands-on ownership of the Windows application stack behind enterprise banking services.',
    highlights: [
      {
        heading: 'Support & Troubleshooting',
        period: '',
        bullets: [
          'Triaged and resolved incoming ServiceNow tickets against strict SLAs, providing first-line troubleshooting for Windows, application, and access issues, and escalating complex cases to L2/L3 per defined procedures.',
          'Supported Windows-based application infrastructure — IIS web servers, SQL Server (SSMS) databases, and SharePoint — performing routine health checks, access resets, and guided troubleshooting.',
          'Documented ticket resolutions and contributed to the knowledge base to reduce repeat issues; trained new team members on ticket intake and escalation as Offshore Lead.',
        ],
      },
    ],
  },
];

const EDUCATION = [
  {
    degree: 'MS, Computer Science (Cybersecurity)',
    school: 'The George Washington University, SEAS',
    meta: '2024 – 2026 - Washington, DC - GPA 3.63',
    details: [
      'Computer Security',
      'Network Security',
      'Computer Network Defense',
      'Cloud Computing',
      'E-Commerce Security',
      'Unix Systems Administration',
      'Computer System Architecture',
      'Management of Information & Systems Security',
    ],
  },
  {
    degree: 'BTech, Electrical & Computer Engineering',
    school: 'Indira Gandhi Institute of Technology',
    meta: '2015 – 2019 - India - GPA 7.62/10',
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
    badgeStyle: 'default',
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

const HERO_STATUS: { label: string; value: string }[] = [
  { label: 'role', value: 'Systems Engineer' },
  { label: 'stack', value: 'Azure · Windows Server · Linux' },
  { label: 'focus', value: 'Identity & Access Mgmt' },
  { label: 'location', value: 'Arlington, VA' },
];

const ABOUT_FOCUS_AREAS = [
  'Cloud & Systems Administration',
  'Identity & Access Management',
  'Infrastructure as Code',
  'Automation & Scripting',
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/[0.025] transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.04] ${className}`}
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
      className={`relative mx-auto max-w-6xl px-6 py-20 md:px-10 lg:px-16 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div variants={fadeUp} className="mb-10 flex max-w-2xl flex-col gap-3 text-left">
      <span className="flex items-center gap-2 font-mono text-xs tracking-wide text-sky-300/80">
        <span className="h-1.5 w-1.5 rounded-[2px] bg-sky-400" aria-hidden="true" />
        {kicker}
      </span>
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
      {description ? (
        <p className="text-[15px] leading-relaxed text-white/55">{description}</p>
      ) : null}
    </motion.div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/8 bg-[#0a0f14]/85 px-6 py-4 backdrop-blur-md md:px-10"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-[2px] bg-sky-400" aria-hidden="true" />
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Chiranjib Samantaray
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3.5 py-2 text-sm text-white/55 transition-colors duration-200 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <a
              href="#contact"
              className="rounded-md border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200 transition-colors duration-200 hover:border-sky-400/50 hover:bg-sky-400/15"
            >
              Contact
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:text-white lg:hidden"
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
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="mt-4 flex flex-col gap-1 rounded-xl border border-white/10 bg-[#0a0f14]/95 px-4 py-4 backdrop-blur-xl lg:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="mt-1 rounded-md border border-sky-400/30 bg-sky-400/10 px-3 py-2.5 text-center text-sm font-medium text-sky-200"
            >
              Contact
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
      className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-200"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-24 pt-40 md:px-10 lg:px-16">
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-start gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col items-start gap-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 font-mono text-xs text-amber-300/90"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            available for work
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl xl:text-7xl"
          >
            Chiranjib Samantaray
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5 }}
            className="text-lg font-medium text-sky-200/90 md:text-xl"
          >
            Systems Engineer — Windows, Linux &amp; Azure Administration
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.5 }}
            className="max-w-xl text-base leading-relaxed text-white/55"
          >
            4.5 years administering hybrid Windows Server, Linux, and Azure
            production environments for financial services and insurance
            clients, plus an M.S. in Computer Science (Cybersecurity) from
            The George Washington University. Targeting Systems Engineer,
            Cloud Administrator, and IAM Engineer roles.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="mt-2 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-1.5 rounded-md bg-sky-400 px-6 py-3 text-sm font-semibold text-[#0a0f14] transition-colors hover:bg-sky-300"
            >
              View my work
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="rounded-md border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-white/30 hover:text-white"
            >
              Get in touch
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.55 }}
          className="w-full"
        >
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] font-mono text-[13px]">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="ml-2 text-white/35">status</span>
            </div>
            <dl className="flex flex-col divide-y divide-white/8">
              {HERO_STATUS.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3.5">
                  <dt className="text-white/35">{row.label}</dt>
                  <dd className="text-right text-white/85">{row.value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                <dt className="text-white/35">availability</dt>
                <dd className="flex items-center gap-1.5 text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  open to offers
                </dd>
              </div>
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about">
      <SectionHeading kicker="who i am" title="About me" />

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]"
      >
        <div className="flex flex-col gap-5">
          <p className="text-base leading-relaxed text-white/80">
            I&apos;m a Systems Engineer with 4.5 years at Cognizant supporting
            production environments for financial services and insurance
            clients, and a 2026 M.S. in Computer Science (Cybersecurity) from
            The George Washington University. I started on the L1 support
            desk &mdash; SLA-driven tickets, Windows and access issues,
            IIS/SQL Server/SharePoint health checks &mdash; and moved into
            systems engineering: administering Windows Server and Linux
            infrastructure, patching and change management, and the identity
            layer that ties enterprise access together.
          </p>

          <p className="text-base leading-relaxed text-white/60">
            That combination is what pulled me toward cloud and identity
            work. I&apos;m comfortable moving between provisioning Azure
            infrastructure with Terraform and Bicep, administering AD
            DS/DNS/GPO on Windows Server, hardening and scripting on Linux,
            and running identity workflows &mdash; SSO, MFA, RBAC,
            joiner-mover-leaver &mdash; end to end. Years in an SLA-driven
            queue taught me to think in terms of evidence and repeatability,
            and that habit shows up in how I document, test, and roll back
            infrastructure changes.
          </p>

          <p className="text-base leading-relaxed text-white/60">
            Outside of work, I run a home lab that mirrors the enterprise
            problems I care most about: a multi-VM Windows/Entra hybrid
            identity environment, Terraform-provisioned Azure infrastructure
            with CI/CD gating, Linux servers I administer and monitor
            myself, and PowerShell and Python automation for the repetitive
            parts. It&apos;s where I test ideas before they show up on a
            resume.
          </p>

          <p className="text-base leading-relaxed text-white/60">
            I&apos;m currently targeting full-time Systems Engineer, Cloud
            Administrator, and IAM Engineer roles &mdash; and enjoy the
            parts of the job most people skip: reading the logs, writing the
            runbook, and making sure the access someone has is exactly the
            access they should have.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {ABOUT_FOCUS_AREAS.map((area) => (
            <div
              key={area}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3.5"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-[2px] bg-sky-400" />
              <span className="text-sm text-white/75">{area}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

function Education() {
  return (
    <Section id="education">
      <SectionHeading kicker="education" title="Academic background" />

      <motion.div variants={stagger} className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {EDUCATION.map((item) => (
          <motion.div key={`${item.degree}-${item.school}`} variants={fadeUp}>
            <Card className="flex h-full flex-col gap-4 p-7">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-medium text-white">{item.degree}</h3>
                <p className="text-sm text-sky-300/80">{item.school}</p>
                <p className="font-mono text-xs text-white/40">{item.meta}</p>
              </div>

              {item.details.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 border-t border-white/8 pt-4">
                  {item.details.map((detail) => (
                    <span
                      key={detail}
                      className="rounded-md border border-white/8 px-2.5 py-1 font-mono text-[11px] text-white/55"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              ) : null}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function CredentialBadge({ badge, badgeStyle }: Pick<Credential, 'badge' | 'badgeStyle'>) {
  if (badgeStyle === 'azure') {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
        <div className="grid grid-cols-2 gap-[3px]">
          <span className="h-3 w-3 bg-[#f25022]" />
          <span className="h-3 w-3 bg-[#7fba00]" />
          <span className="h-3 w-3 bg-[#00a4ef]" />
          <span className="h-3 w-3 bg-[#ffb900]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] font-mono text-[11px] font-semibold text-sky-300">
      {badge}
    </div>
  );
}

function Credentials() {
  return (
    <Section id="credentials">
      <SectionHeading kicker="credentials" title="Certifications & training" />

      <motion.div variants={stagger} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CREDENTIALS.map((credential) => (
          <motion.div key={`${credential.title}-${credential.level ?? credential.issuer}`} variants={fadeUp}>
            <Card className="flex items-center gap-4 p-5">
              <CredentialBadge badge={credential.badge} badgeStyle={credential.badgeStyle} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                <h3 className="text-[15px] font-medium leading-tight text-white">
                  {credential.title}
                </h3>
                <p className="font-mono text-xs text-white/40">
                  {credential.level ? `${credential.level} — ` : ''}
                  {credential.issuer}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function OffScreen() {
  return (
    <Section id="off-screen">
      <SectionHeading kicker="off screen" title="Outside of work" />
      <motion.div variants={fadeUp}>
        <InteractiveBentoGallery mediaItems={OFF_SCREEN} enableInteractions={false} />
      </motion.div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience">
      <SectionHeading kicker="journey" title="Where I've worked" />

      <motion.div variants={stagger} className="flex flex-col">
        {EXPERIENCE.map((role, index) => (
          <motion.div
            key={`${role.title}-${role.period}`}
            variants={fadeUp}
            className="relative flex gap-6 pb-10 last:pb-0"
          >
            <div className="relative flex w-4 shrink-0 flex-col items-center pt-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm border-2 border-sky-400 bg-[#0a0f14]" />
              {index < EXPERIENCE.length - 1 ? (
                <span className="mt-1 w-px flex-1 bg-white/10" />
              ) : null}
            </div>

            <Card className="w-full p-7">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-medium text-white">{role.title}</h3>
                    <p className="mt-0.5 text-sm text-sky-300/80">{role.organization}</p>
                  </div>
                  <span className="font-mono text-xs text-white/40">{role.period}</span>
                </div>

                <p className="max-w-3xl text-[15px] leading-relaxed text-white/65">
                  {role.summary}
                </p>

                {role.highlights.length > 0 ? (
                  <details className="group rounded-lg border border-white/10 bg-white/[0.02] px-5 py-4 open:bg-white/[0.03]">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-white/70 transition-colors group-open:text-white">
                      Role details
                      <span className="font-mono text-xs text-white/30 group-open:hidden">+</span>
                      <span className="hidden font-mono text-xs text-white/30 group-open:inline">
                        −
                      </span>
                    </summary>

                    <div className="mt-4 flex flex-col gap-6">
                      {role.highlights.map((highlight) => (
                        <div
                          key={`${highlight.heading}-${highlight.period}`}
                          className="flex flex-col gap-3"
                        >
                          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                            <h4 className="text-[15px] font-medium text-white">
                              {highlight.heading}
                            </h4>
                            {highlight.period ? (
                              <span className="font-mono text-xs text-white/35">
                                {highlight.period}
                              </span>
                            ) : null}
                          </div>
                          <ul className="space-y-2.5 text-sm leading-relaxed text-white/65">
                            {highlight.bullets.map((bullet) => (
                              <li key={bullet} className="flex gap-3">
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-[1px] bg-sky-400/70" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                ) : null}
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
      <SectionHeading kicker="technical skills" title="What I work with" />

      <motion.div
        variants={stagger}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {SKILL_GROUPS.map(({ icon: Icon, skills, title }) => (
          <motion.div key={title} variants={fadeUp}>
            <Card className="flex h-full flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                  <Icon className="h-4 w-4 text-sky-300" />
                </div>
                <h3 className="text-[15px] font-medium text-white">{title}</h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-white/8 px-2.5 py-1 font-mono text-[11px] text-white/60 transition-colors duration-200 hover:border-white/20 hover:text-white/90"
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
    <div className="flex shrink-0 items-center gap-3">
      {github ? (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/35 transition-colors hover:text-white"
          aria-label="GitHub repository"
        >
          <FolderGit2 className="h-4 w-4" />
        </a>
      ) : null}
      {live ? (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/35 transition-colors hover:text-white"
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
      <SectionHeading kicker="work" title="Featured projects" />

      <motion.div
        variants={stagger}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {PROJECTS.map((project) => {
          const Icon = project.icon;

          return (
            <motion.div key={project.title} variants={fadeUp}>
              <Card className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                    <Icon className="h-4 w-4 text-sky-300" />
                  </div>
                  <ProjectLinks github={project.github} live={project.live} />
                </div>

                <h3 className="text-[15px] font-medium leading-snug text-white">
                  {project.title}
                </h3>

                <p className="flex-1 text-sm leading-relaxed text-white/55">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 border-t border-white/8 pt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/8 px-2 py-0.5 font-mono text-[10.5px] text-white/50"
                    >
                      {tag}
                    </span>
                  ))}
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
      href: 'https://www.instagram.com/chiranjib_samantaray_97/',
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
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 md:p-14"
      >
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-2 font-mono text-xs tracking-wide text-sky-300/80">
            <span className="h-1.5 w-1.5 rounded-[2px] bg-sky-400" />
            contact
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Let&apos;s talk
          </h2>
          <p className="max-w-xl text-[15px] leading-relaxed text-white/55">
            I&apos;m currently open to new opportunities and collaborations.
            Whether you have a question, a role in mind, or just want to say
            hi, my inbox is always open.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="mailto:samantaray.chiranjib97@gmail.com"
            className="inline-flex items-center gap-2 rounded-md bg-sky-400 px-6 py-3 text-sm font-semibold text-[#0a0f14] transition-colors hover:bg-sky-300"
          >
            <Mail className="h-4 w-4" />
            samantaray.chiranjib97@gmail.com
          </a>
          <div className="flex items-center gap-2 font-mono text-sm text-white/50">
            <MapPin className="h-4 w-4 text-white/35" />
            Arlington, Virginia
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/8 pt-8">
          {contactLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.02] text-white/55 transition-colors duration-200 hover:border-sky-400/30 hover:text-sky-300"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="mt-14 border-t border-white/8 pt-8 text-center">
        <p className="font-mono text-xs text-white/35">
          Designed &amp; built by{' '}
          <span className="text-sky-300/80">Chiranjib Samantaray</span>
        </p>
        <p className="mt-2 font-mono text-[10px] tracking-wide text-white/18">
          © 2026 all rights reserved.
        </p>
      </motion.div>
    </Section>
  );
}

export default function PortfolioPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0f14] font-sans text-white">
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
