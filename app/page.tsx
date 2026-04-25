'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Bug,
  Camera,
  ChevronDown,
  ExternalLink,
  FileSearch,
  FolderGit2,
  Gamepad2,
  Link2,
  Lock,
  Mail,
  MapPin,
  Menu,
  Shield,
  Terminal,
  X,
} from 'lucide-react';

import InteractiveBentoGallery, {
  type BentoMediaItem,
} from '@/components/ui/interactive-bento-gallery';
import InteractiveNeuralVortexBackground from '@/components/ui/interactive-neural-vortex-background';
import { GlowCard } from '@/components/ui/spotlight-card';

type NavLink = {
  href: string;
  label: string;
};

type SkillGroup = {
  color: 'purple';
  icon: LucideIcon;
  skills: string[];
  title: string;
};

type Project = {
  color: 'purple';
  description: string;
  github?: string;
  icon: LucideIcon;
  live?: string;
  tags: string[];
  title: string;
};

type Credential = {
  badge: string;
  badgeStyle: 'azure' | 'green' | 'gold';
  issuer: string;
  level?: string;
  status?: string;
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

const STATS = [
  { value: '5+', label: 'Years Experience' },
  { value: '40+', label: 'Projects Shipped' },
  { value: '200+', label: 'Tests Automated' },
  { value: '8', label: 'Certifications' },
];

const SKILL_GROUPS: SkillGroup[] = [
  {
    icon: Bug,
    title: 'QA Automation & Testing',
    color: 'purple',
    skills: [
      'Selenium WebDriver',
      'Pytest',
      'TestNG',
      'JUnit',
      'BDD / Cucumber / Gherkin',
      'Functional Testing',
      'Regression Testing',
      'UAT Support',
      'Test Case Design',
      'Defect Lifecycle Management',
    ],
  },
  {
    icon: Activity,
    title: 'API & Delivery',
    color: 'purple',
    skills: [
      'Postman',
      'REST API Testing',
      'Payload Validation',
      'Authentication Testing',
      'Integration Testing',
      'Jenkins',
      'Git / GitHub',
      'Build Pipeline Validation',
      'JIRA',
      'Zephyr',
      'Agile / Scrum',
      'Defect Triage',
    ],
  },
  {
    icon: Shield,
    title: 'Identity & Access Security',
    color: 'purple',
    skills: [
      'IAM',
      'RBAC',
      'Active Directory',
      'Azure AD / Entra ID',
      'SSO',
      'MFA',
      'Provisioning / Deprovisioning',
      'Access Reviews',
      'Account Lifecycle Controls',
      'Least Privilege',
      'Authentication Flow Validation',
    ],
  },
  {
    icon: FileSearch,
    title: 'Security Operations & Analysis',
    color: 'purple',
    skills: [
      'Incident Triage',
      'Authentication Issue Investigation',
      'Escalation Management',
      'Root-Cause Documentation',
      'Audit Support',
      'Splunk',
      'Wireshark',
      'Nmap',
      'Vulnerability Scanning Fundamentals',
    ],
  },
  {
    icon: Terminal,
    title: 'Systems & Platforms',
    color: 'purple',
    skills: [
      'Windows Server',
      'Linux / Unix',
      'ServiceNow ITSM',
      'JIRA',
      'API Validation',
      'Python',
      'Bash',
    ],
  },
];

const PROJECTS: Project[] = [
  {
    icon: Lock,
    title: 'TrusLex',
    description:
      'An AI litigation dashboard that surfaces DAIL lawsuit data with state-level exploration, trend analysis, upload support, and filterable visualizations for faster legal research.',
    tags: ['Node.js', 'Express', 'XLSX', 'AI Litigation'],
    color: 'purple',
    github: 'https://github.com/csam1997/TrusLex',
    live: 'https://csam1997.github.io/TrusLex/',
  },
  {
    icon: Activity,
    title: 'Meals-on-Wheels',
    description:
      'An end-to-end automation framework built for parallel execution, visual regression checks, and reliable CI pipelines.',
    tags: ['Playwright', 'TypeScript', 'CI/CD', 'Docker'],
    color: 'purple',
  },
  {
    icon: FileSearch,
    title: 'AI Trip Planner',
    description:
      'A fully client-side travel planner with a 3-step wizard, Groq-powered itineraries, hotel and event recommendations, Google Maps and Flights links, exchange rates, and PNG trip export.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Groq API', 'html2canvas'],
    color: 'purple',
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
      'Progressed from manual QA into building automation frameworks, API regression suites, and IAM-related validation pipelines for enterprise banking applications.',
    highlights: [
      {
        heading: 'IAM & Access Validation',
        period: '2022-2024',
        bullets: [
          'Tested RBAC, provisioning, deprovisioning, and role-change workflows for enterprise banking applications, improving reliability across access lifecycle processes.',
          'Triaged ServiceNow tickets tied to access incidents and change requests, maintaining evidence, escalation notes, and SLA-aware documentation for cross-functional teams.',
          'Validated Active Directory integrations, user account states, group-based entitlements, and authentication behavior across Windows-based enterprise environments.',
          'Supported onboarding and offboarding validation by checking access assignments, deactivation behavior, and downstream permissions across enterprise systems.',
        ],
      },
      {
        heading: 'Automation & API Regression Testing',
        period: '2020-2022',
        bullets: [
          'Built and maintained Python- and Java-based Selenium automation using Page Object Model (POM), reducing repetitive manual effort by 45% and improving sprint-level test throughput.',
          'Implemented TestNG and JUnit runners to organize regression packs, manage parallel execution, and produce structured reports for stakeholder review.',
          'Authored BDD feature files using Cucumber and Gherkin to align test scenarios with business requirements and improve collaboration across QA, engineering, and business teams.',
          'Integrated Selenium regression suites into Jenkins CI pipelines, enabling automated regression on each build and reducing post-deployment defect leakage.',
          'Developed Postman API test suites to validate REST endpoints, payload integrity, authentication responses, and negative scenarios across QA and pre-production environments.',
          'Managed test cases and execution cycles in Zephyr, maintaining structured coverage matrices and retest evidence tied to JIRA defect records.',
          'Maintained detailed defect logs, retest evidence, and reusable automation assets that improved defect turnaround and QA handoffs.',
        ],
      },
      {
        heading: 'Manual QA & Defect Validation',
        period: '2019-2020',
        bullets: [
          'Executed manual functional, smoke, and sanity testing for enterprise web applications and authentication portals, documenting reproducible defects and release-readiness risks in JIRA.',
          'Translated user stories and business requirements into structured test cases, negative scenarios, and defect evidence that helped developers resolve issues earlier in the cycle.',
          'Supported end-to-end validation of access-related workflows, helping teams catch UI, data, and permission defects before production handoff.',
          'Partnered with developers and business teams during defect triage and retesting, helping move validated fixes back into the release cycle faster.',
        ],
      },
    ],
  },
];

const EDUCATION = [
  {
    degree: 'MS, Computer Science (Cybersecurity)',
    school: 'The George Washington University, SEAS',
    meta: 'Expected May 2026 · Washington, DC',
    details: [
      'Computer Security',
      'Network Security',
      'Computer Network Defense',
      'Cloud Computing',
      'E-Commerce Security',
      'Trustworthy AI',
      'Computer System Architecture',
    ],
  },
  {
    degree: 'BTech, Electrical & Computer Engineering',
    school: 'Indira Gandhi Institute of Technology',
    meta: '2019 · India',
    details: [],
  },
];

const CREDENTIALS: Credential[] = [
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
    title: 'Azure Administrator Associate',
    issuer: 'Microsoft',
    level: 'AZ-104',
    status: 'In Progress',
  },
  {
    badge: 'MS',
    badgeStyle: 'azure',
    title: 'Azure Security Engineer Associate',
    issuer: 'Microsoft',
    level: 'AZ-500',
    status: 'In Progress',
  },
  {
    badge: 'ISC2',
    badgeStyle: 'green',
    title: 'Certified in Cybersecurity',
    issuer: 'ISC2',
    level: 'CC',
    status: 'In Progress',
  },
  {
    badge: 'CTTC',
    badgeStyle: 'gold',
    title: 'MATLAB & Simulink',
    issuer: 'MSME, Govt. of India',
    level: 'CTTC',
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

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

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
      className={`relative z-10 px-6 py-28 md:px-12 lg:px-24 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <motion.div variants={fadeUp} className="mb-16 text-center">
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
        {label}
      </span>
      <h2 className="text-4xl font-light tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-fuchsia-500 to-cyan-400" />
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
    <motion.div variants={fadeUp} className="mb-16 text-center">
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
        {label}
      </span>
      <h2 className="text-4xl font-light tracking-tight text-white md:text-5xl">
        {titleLines.map((line, index) => (
          <span key={`${label}-${line}`} className="block">
            <span className={index === titleLines.length - 1 ? 'text-white/24' : ''}>
              {line}
            </span>
          </span>
        ))}
      </h2>
      <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-fuchsia-500 to-cyan-400" />
    </motion.div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/30 px-6 py-4 backdrop-blur-xl md:px-12"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-white">
            &lt;ChiranjibS /&gt;
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm tracking-wide text-white/60 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="rounded-lg border border-fuchsia-500/40 px-5 py-2 text-sm text-white transition-all duration-200 hover:border-fuchsia-400 hover:bg-fuchsia-500/10"
            >
              Hire Me
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:text-white md:hidden"
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
            className="mt-4 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/70 px-6 py-6 backdrop-blur-xl md:hidden"
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
              className="rounded-lg border border-fuchsia-500/40 px-5 py-2 text-center text-sm text-white"
            >
              Hire Me
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 180]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <motion.section
      id="top"
      style={{ opacity }}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center"
    >
      <motion.div style={{ y }} className="flex max-w-3xl flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-4 py-2 text-xs font-medium uppercase tracking-widest text-cyan-400"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
          Available for work
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
          }}
          className="text-5xl font-light leading-none tracking-tight text-white md:text-7xl lg:text-8xl"
        >
          Chiranjib
          <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            {' '}Samantaray
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-lg font-light uppercase tracking-widest text-white/60 md:text-xl"
        >
          Learning to secure the world.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="max-w-xl text-base leading-relaxed text-white/45 md:text-lg"
        >
          Cybersecurity graduate student with nearly 5 years of enterprise
          experience in IAM, cloud identity, and automation for banking and
          financial services. Targeting Quality Engineer, Cloud Security, Cloud
          Administration, and Cloud Engineering roles.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-2 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#projects"
            className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-opacity hover:opacity-90"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="rounded-xl border border-white/15 px-8 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:border-white/30 hover:text-white"
          >
            Get In Touch
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </motion.div>
    </motion.section>
  );
}

function About() {
  return (
    <Section id="about">
      <SectionHeading label="Who I Am" title="About Me" />

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
        <motion.div variants={fadeUp}>
          <GlowCard customSize glowColor="purple" className="h-auto w-full !aspect-auto p-8">
            <div className="relative z-10 flex flex-col gap-5">
              <p className="text-base leading-relaxed text-white/80">
                Cybersecurity graduate student at The George Washington University
                (M.S., May 2026) with nearly 5 years of enterprise experience at
                Cognizant, specializing in IAM, cloud identity, and automation for
                banking and financial services. Hands-on expertise with Microsoft
                Azure, Active Directory, privileged access management, RBAC, and
                ServiceNow ITSM.
              </p>

              <p className="text-base leading-relaxed text-white/60">
                Currently deepening my expertise in network defense, cloud
                security, penetration testing, and trustworthy AI — with the goal
                of transitioning into a full-time cybersecurity analyst role.
              </p>
            </div>
          </GlowCard>
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
          {STATS.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <GlowCard
                customSize
                glowColor="purple"
                className="flex h-full w-full !aspect-auto flex-col items-center justify-center p-6 text-center"
              >
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <span className="bg-gradient-to-b from-white to-fuchsia-300 bg-clip-text text-4xl font-light text-transparent">
                    {stat.value}
                  </span>
                  <span className="text-xs uppercase leading-tight tracking-wide text-white/50">
                    {stat.label}
                  </span>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

function Education() {
  return (
    <Section id="education">
      <SectionHeading label="Education" title="The foundation behind it all." />

      <motion.div
        variants={stagger}
        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1.4fr]"
      >
        <motion.div variants={fadeUp} className="flex items-start">
          <div className="max-w-md">
            <p className="text-4xl font-semibold leading-[0.95] tracking-tight text-white md:text-6xl">
              The foundation behind it all.
            </p>
          </div>
        </motion.div>

        <motion.div variants={stagger} className="flex flex-col gap-6">
          {EDUCATION.map((item) => (
            <motion.div key={`${item.degree}-${item.school}`} variants={fadeUp}>
              <GlowCard customSize glowColor="purple" className="w-full !aspect-auto p-8">
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-medium text-white">{item.degree}</h3>
                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">
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
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
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
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.75rem] border border-cyan-500/25 bg-cyan-500/8 sm:h-22 sm:w-22">
        <div className="grid grid-cols-2 gap-1">
          <span className="h-6 w-6 bg-[#f25022]" />
          <span className="h-6 w-6 bg-[#7fba00]" />
          <span className="h-6 w-6 bg-[#00a4ef]" />
          <span className="h-6 w-6 bg-[#ffb900]" />
        </div>
      </div>
    );
  }

  if (badgeStyle === 'green') {
    return (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.75rem] border border-emerald-500/30 bg-emerald-500/8 px-3 text-center text-2xl font-semibold text-emerald-300 sm:h-22 sm:w-22">
        {badge}
      </div>
    );
  }

  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.75rem] border border-amber-500/30 bg-amber-500/8 px-3 text-center text-2xl font-semibold text-amber-300 sm:h-22 sm:w-22">
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

        <motion.div
          variants={stagger}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {CREDENTIALS.map((credential) => (
            <motion.div
              key={`${credential.title}-${credential.level ?? credential.issuer}`}
              variants={fadeUp}
            >
              <GlowCard
                customSize
                glowColor="purple"
                className="w-full !aspect-auto rounded-[2rem] p-8"
              >
                <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <CredentialBadge
                    badge={credential.badge}
                    badgeStyle={credential.badgeStyle}
                  />

                  <div className="flex min-w-0 flex-col gap-2 text-left">
                    <h3 className="text-xl font-semibold leading-tight text-white sm:text-2xl md:text-3xl">
                      {credential.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/42 sm:text-base">
                      {credential.level ? `${credential.level} · ` : ''}
                      {credential.issuer}
                      {credential.status ? ' · ' : ''}
                      {credential.status ? (
                        <span className="text-cyan-300">{credential.status}</span>
                      ) : null}
                    </p>
                  </div>
                </div>
              </GlowCard>
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
      <motion.div variants={stagger} className="mx-auto flex max-w-6xl flex-col gap-12">
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

      <motion.div variants={stagger} className="mx-auto flex max-w-5xl flex-col gap-6">
        {EXPERIENCE.map((role) => (
          <motion.div key={`${role.title}-${role.period}`} variants={fadeUp}>
            <GlowCard customSize glowColor="purple" className="w-full !aspect-auto p-8">
              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-medium text-white">{role.title}</h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.24em] text-cyan-300/80">
                      {role.organization}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-white/55">{role.period}</span>
                </div>

                <details className="group rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
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
                              <h4 className="text-lg font-medium text-white">
                                {highlight.heading}
                              </h4>
                              <span className="text-sm text-white/45">
                                {highlight.period}
                              </span>
                            </div>
                            <ul className="space-y-3 text-sm leading-relaxed text-white/65">
                              {highlight.bullets.map((bullet) => (
                                <li key={bullet} className="flex gap-3">
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
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
            </GlowCard>
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
        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {SKILL_GROUPS.map(({ color, icon: Icon, skills, title }) => (
          <motion.div key={title} variants={fadeUp}>
            <GlowCard
              customSize
              glowColor={color}
              className="flex h-full w-full !aspect-auto flex-col gap-5 p-8"
            >
              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-600/40 to-cyan-600/40">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <h3 className="text-lg font-medium text-white">{title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-white/8 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-all duration-200 hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </GlowCard>
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
        className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2"
      >
        {PROJECTS.map((project) => {
          const Icon = project.icon;

          return (
            <motion.div key={project.title} variants={fadeUp}>
              <GlowCard
                customSize
                glowColor={project.color}
                className="flex h-full w-full !aspect-auto flex-col gap-5 p-7"
              >
                <div className="relative z-10 flex h-full flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-600/40 to-cyan-600/40">
                        <Icon className="h-5 w-5 text-cyan-300" />
                      </div>
                      <h3 className="text-lg font-medium leading-snug text-white">
                        {project.title}
                      </h3>
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
                        className="rounded-md border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-1 text-xs font-medium text-fuchsia-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </GlowCard>
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
      href: 'https://github.com/',
      icon: FolderGit2,
      label: 'GitHub',
    },
    {
      href: 'https://www.linkedin.com/',
      icon: Link2,
      label: 'LinkedIn',
    },
    {
      href: 'https://www.instagram.com/',
      icon: Camera,
      label: 'Instagram',
    },
    {
      href: 'mailto:chiranjib.samantaray@gwu.edu',
      icon: Mail,
      label: 'Email',
    },
  ];

  return (
    <Section id="contact" className="pb-16">
      <motion.div
        variants={stagger}
        className="mx-auto flex max-w-4xl flex-col items-center gap-10 text-center"
      >
        <SectionHeadingStacked
          label="Contact"
          titleLines={['Got a challenge?', "I'm all ears."]}
        />

        <motion.p
          variants={fadeUp}
          className="max-w-3xl text-lg leading-relaxed text-white/60"
        >
          I&apos;m currently open to new opportunities and collaborations. Whether
          you have a question, a project, or just want to say hi, my inbox is
          always open.
        </motion.p>

        <motion.div variants={stagger} className="flex flex-col items-center gap-4">
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-3 text-lg text-white/70"
          >
            <MapPin className="h-5 w-5 text-cyan-300" />
            <span>Arlington, Virginia</span>
          </motion.div>
          <motion.a
            variants={fadeUp}
            href="mailto:chiranjib.samantaray@gwu.edu"
            className="flex items-center justify-center gap-3 text-lg text-white/70 transition-colors hover:text-white"
          >
            <Mail className="h-5 w-5 text-cyan-300" />
            <span>chiranjib.samantaray@gwu.edu</span>
          </motion.a>
        </motion.div>

        <motion.div variants={stagger} className="flex flex-wrap items-center justify-center gap-4">
          {contactLinks.map(({ href, icon: Icon, label }) => (
            <motion.a
              key={label}
              variants={fadeUp}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              aria-label={label}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/55 transition-all duration-200 hover:border-cyan-400/30 hover:bg-cyan-400/8 hover:text-cyan-300"
            >
              <Icon className="h-5 w-5" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        variants={fadeIn}
        className="mx-auto mt-24 max-w-6xl border-t border-white/8 pt-8 text-center"
      >
        <p className="text-sm text-white/35">
          Designed & Built by{' '}
          <span className="font-medium text-cyan-300">Chiranjib Samantaray</span>
        </p>
        <p className="mt-3 text-xs tracking-[0.2em] text-white/18">
          © 2026 All rights reserved.
        </p>
      </motion.div>
    </Section>
  );
}

export default function PortfolioPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black font-sans text-white">
      <InteractiveNeuralVortexBackground />

      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, rgba(0, 0, 0, 0.68) 100%)',
        }}
      />

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
