import './portfolio.css';
import './i18n';
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Linkedin, Mail, ExternalLink, Code2, Zap, Sun, Moon, Terminal, Cpu } from 'lucide-react';

export default function Portfolio() {
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  // ── THEME ──────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const isDark = theme === 'dark';

  // ── LANG ───────────────────────────────────────────────
  const languageOptions = [
    { code: "es", name: "Español", flag: "https://flagcdn.com/w40/es.png" },
    { code: "en", name: "English", flag: "https://flagcdn.com/w40/gb.png" },
    { code: "fr", name: "Français", flag: "https://flagcdn.com/w40/fr.png" },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    setLangOpen(false);
  };

  const { t } = useTranslation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('sobre-mi');
  const canvasRef = useRef(null);

  const sections = ["sobre-mi", "experiencia", "proyectos", "educacion", "contacto"];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const useReveal = () => {
    useEffect(() => {
      const elements = document.querySelectorAll(".reveal");
      const observer = new IntersectionObserver(
        (entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("reveal-visible");
        }),
        { threshold: 0.08 }
      );
      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, []);
  };
  useReveal();

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.2 + 0.3,
      opacity: Math.random() * 0.35 + 0.08,
    }));

    let rafId;
    const animate = () => {
      ctx.fillStyle = isDark ? 'rgba(8,6,18,0.12)' : 'rgba(250,248,255,0.14)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const [r, g, b] = isDark ? [196, 181, 253] : [139, 92, 246];
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x > canvas.width || p.x < 0) p.vx *= -1;
        if (p.y > canvas.height || p.y < 0) p.vy *= -1;
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', handleResize); };
  }, [isDark]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── DATA ───────────────────────────────────────────────

  const menu = [
    { labelKey: "nav.about",      id: "sobre-mi" },
    { labelKey: "nav.experience", id: "experiencia" },
    { labelKey: "nav.projects",   id: "proyectos" },
    { labelKey: "nav.education",  id: "educacion" },
    { labelKey: "nav.contact",    id: "contacto" },
  ];

  const technologies = [
    'React', 'Vue', 'JavaScript', 'TypeScript', 'Python', 'Java',
    'C#', 'C++', 'C', 'Node.js', 'SQL', '.NET', 'Go', 'Unity', 'ROS2', 'Kafka',
  ];

  const experience = [
    {
      titleKey:   "experience.job1Title",
      companyKey: "experience.job1Company",
      periodKey:  "experience.job1Period",
      pointKeys:  ["experience.job1p1", "experience.job1p2", "experience.job1p3", "experience.job1p4"],
    },
    {
      titleKey:   "experience.job2Title",
      companyKey: "experience.job2Company",
      periodKey:  "experience.job2Period",
      pointKeys:  ["experience.job2p1", "experience.job2p2", "experience.job2p3", "experience.job2p4"],
    },
    {
      titleKey:   "experience.job3Title",
      companyKey: "experience.job3Company",
      periodKey:  "experience.job3Period",
      pointKeys:  ["experience.job3p1", "experience.job3p2", "experience.job3p3", "experience.job3p4"],
    },
  ];

  const projects = [
    { titleKey: "projects.p1Title", descKey: "projects.p1Desc", tags: ['ROS2', 'C++', 'Performance', 'Distributed Systems'], icon: '🤖' },
    { titleKey: "projects.p2Title", descKey: "projects.p2Desc", tags: ['Unity', 'C#', 'Gamedev', 'Teamwork'],               icon: '🎮' },
    { titleKey: "projects.p3Title", descKey: "projects.p3Desc", tags: ['Kafka', 'Distributed Systems', 'Architecture'],      icon: '🚁' },
    { titleKey: "projects.p4Title", descKey: "projects.p4Desc", tags: ['Go', 'Security', 'Encryption', 'HTTPS'],             icon: '🔐' },
    { titleKey: "projects.p5Title", descKey: "projects.p5Desc", tags: ['JavaScript', 'PHP', 'HTML', 'Web App'],              icon: '🌐' },
    { titleKey: "projects.p6Title", descKey: "projects.p6Desc", tags: ['React', 'Web Design', 'Frontend'],    ongoing: true, icon: '⚽' },
    { titleKey: "projects.p7Title", descKey: "projects.p7Desc", tags: [t("projects.tagAutomation"), 'APIs', 'Scripting'], ongoing: true, icon: '⚙️' },
    { titleKey: "projects.p8Title", descKey: "projects.p8Desc", tags: ['Linux', 'Self-hosting', 'DevOps'],    ongoing: true, icon: '🖥️' },
  ];

  const educationCards = [
    {
      labelKey: "education.trainingLabel",
      content: (
        <div style={{ borderLeft: '1px solid var(--text-pink)', paddingLeft: '1rem', opacity: 0.8 }}>
          <p className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{t("education.degree")}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t("education.degreeSpec")}</p>
        </div>
      ),
    },
    {
      labelKey: "education.languagesLabel",
      content: (
        <ul className="space-y-3">
          {[1,2,3,4].map(n => (
            <li key={n} className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t(`education.lang${n}Name`)}</span>
              <span className="mono text-xs" style={{ color: 'var(--text-pink)' }}>{t(`education.lang${n}Level`)}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      labelKey: "education.skillsLabel",
      content: (
        <ul className="space-y-2.5">
          {[1,2,3,4,5].map(n => (
            <li key={n} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--text-pink)' }} />
              {t(`education.skill${n}`)}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  const stats = [
    { value: '8+',  labelKey: 'hero.statProjects' },
    { value: '16+', labelKey: 'hero.statTech' },
    { value: '3+',  labelKey: 'hero.statYears' },
  ];

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: 'var(--bg)', color: 'var(--text-primary)', transition: 'background 0.4s ease, color 0.4s ease' }}>

      <canvas ref={canvasRef} className="fixed inset-0" />

      <div className="glow-effect" style={{
        width: '380px', height: '380px',
        left: mousePosition.x - 190, top: mousePosition.y - 190,
        background: 'radial-gradient(circle, var(--glow-primary) 0%, var(--glow-secondary) 60%, transparent 100%)',
        transition: 'left 0.18s ease-out, top 0.18s ease-out',
      }} />

      <div className="content">

        {/* ── NAVBAR ─────────────────────────────────────────── */}
        <nav className="fixed top-0 left-0 right-0 z-50" style={{
          backdropFilter: 'blur(20px)',
          background: 'var(--bg-nav)',
          borderBottom: '1px solid var(--border-nav)',
          transition: 'background 0.4s ease',
        }}>
          <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
            <div className="mono text-sm font-medium text-transparent bg-clip-text" style={{
              backgroundImage: isDark ? 'linear-gradient(120deg,#ddd6fe,#fbcfe8)' : 'linear-gradient(120deg,#7c3aed,#db2777)',
              letterSpacing: '0.2em',
            }}>MDL</div>

            {/* Desktop */}
            <div className="hidden md:flex gap-10">
              {menu.map((item) => (
                <div key={item.id} onClick={() => scrollToSection(item.id)} className="nav-item transition"
                  style={{ color: activeSection === item.id ? 'var(--text-nav-active)' : 'var(--text-nav-inactive)' }}>
                  {t(item.labelKey)}
                </div>
              ))}
            </div>

            {/* Mobile */}
            <div className="md:hidden relative w-full overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10"
                style={{ background: 'linear-gradient(to right, var(--fade-edge), transparent)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10"
                style={{ background: 'linear-gradient(to left, var(--fade-edge), transparent)' }} />
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-6 min-w-max px-6 whitespace-nowrap">
                  {menu.map((item) => (
                    <span key={item.id} onClick={() => scrollToSection(item.id)} className="nav-item cursor-pointer transition"
                      style={{ color: activeSection === item.id ? 'var(--text-nav-active)' : 'var(--text-nav-inactive)' }}>
                      {t(item.labelKey)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* ── HERO ───────────────────────────────────────────── */}
        <section className="min-h-screen flex items-center px-6 pt-20">

          {/* Theme + Lang controls */}
          <div className="absolute top-24 right-8 z-50 flex items-center gap-3">
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div ref={langRef}>
              <button onClick={() => setLangOpen(!langOpen)}
                className="relative w-9 h-9 rounded-full overflow-hidden transition hover:scale-110"
                style={{ border: '1px solid var(--border-hover)' }}>
                <img src={languageOptions.find(l => l.code === i18n.language)?.flag} alt="language" className="w-full h-full object-cover" />
              </button>
              <div className={`absolute right-0 mt-3 flex flex-col gap-1 p-2 rounded-xl transition-all duration-300 origin-top ${langOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                style={{ background: isDark ? 'rgba(15,12,26,0.92)' : 'rgba(250,248,255,0.96)', backdropFilter: 'blur(16px)', border: '1px solid var(--border)' }}>
                {languageOptions.map((lang) => (
                  <button key={lang.code} onClick={() => changeLanguage(lang.code)}
                    className="group flex items-center gap-3 px-3 py-2 rounded-lg transition"
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div className="w-7 h-7 rounded-full overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                      <img src={lang.flag} alt={lang.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs transition" style={{ letterSpacing: '0.04em', color: 'var(--text-muted)' }}>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto w-full">
            <div className="animate-slide-left">
              <p className="mono text-xs tracking-widest mb-6" style={{ color: 'var(--text-faint)' }}>{t("hero.welcome")}</p>
              <h1 className="serif animate-glow leading-none"
                style={{ fontSize: 'clamp(3.5rem,9vw,7rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-primary)' }}>
                {t("hero.hello")}{' '}
                <span className="text-gradient not-italic" style={{ fontWeight: 400 }}>Míriam</span>
              </h1>
              <div className="mt-8 mb-8" style={{ width: '48px', height: '1px', background: isDark ? 'linear-gradient(90deg,#c4b5fd,#f9a8d4)' : 'linear-gradient(90deg,#7c3aed,#db2777)', opacity: 0.5 }} />
            </div>

            <div className="animate-slide-right">
              <p className="text-lg font-light leading-relaxed max-w-xl" style={{ color: 'var(--text-muted)', letterSpacing: '0.01em' }}>
                {t("hero.description")}
              </p>
            </div>

            {/* ── STATS ── */}
            <div className="flex gap-10 mt-12 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              {stats.map(({ value, labelKey }) => (
                <div key={labelKey} className="stat-item">
                  <p className="serif text-4xl font-light text-gradient" style={{ fontStyle: 'italic', lineHeight: 1 }}>{value}</p>
                  <p className="mono text-xs mt-2" style={{ color: 'var(--text-faint)', letterSpacing: '0.1em' }}>{t(labelKey)}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-12 animate-fade-up" style={{ animationDelay: '0.25s' }}>
              <button onClick={() => scrollToSection("proyectos")} className="px-7 py-3 rounded transition hover:scale-105"
                style={{ background: isDark ? 'linear-gradient(135deg,rgba(167,139,250,0.2),rgba(249,168,212,0.15))' : 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(219,39,119,0.08))', border: '1px solid var(--border-hover)', letterSpacing: '0.06em', color: 'var(--text-nav-active)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                {t("hero.viewWork")}
              </button>
              <button className="px-7 py-3 rounded transition"
                style={{ border: '1px solid var(--border)', letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-nav-active)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                {t("hero.downloadCV")}
              </button>
            </div>

            <div className="mt-16 animate-float">
              <ChevronDown className="w-5 h-5 animate-bounce" style={{ color: 'var(--text-faint)' }} />
            </div>
          </div>
        </section>

        {/* ── SOBRE MÍ ───────────────────────────────────────── */}
        <section id="sobre-mi" className="min-h-screen flex items-center px-6 py-24 reveal">
          <div className="max-w-5xl mx-auto w-full">
            <p className="mono text-xs tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>01 —</p>
            <h2 className="serif text-5xl font-light italic mb-2 text-gradient">{t("about.title")}</h2>
            <div className="section-divider" />

            {/* Texto + Cards */}
            <div className="grid md:grid-cols-2 gap-16 mt-4">

              {/* Texto izquierda */}
              <div className="animate-slide-left space-y-5">
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>{t("about.p1")}</p>
                <p className="leading-relaxed" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t("about.p2")}</p>

                {/* Quote decorativa */}
                <blockquote className="mt-8 pl-5 py-1" style={{ borderLeft: '2px solid var(--text-pink)' }}>
                  <p className="serif text-lg font-light italic" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                    {t("about.quote")}
                  </p>
                </blockquote>
              </div>

              {/* Cards derecha — ahora verticales, bien proporcionadas */}
              <div className="animate-slide-right flex flex-col gap-4">

                {/* Card Desarrollo */}
                <div className="skill-card rounded-sm transition"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '1.75rem' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-11 h-11 rounded-sm flex items-center justify-center"
                      style={{ background: isDark ? 'rgba(196,181,253,0.08)' : 'rgba(124,58,237,0.07)', border: '1px solid var(--border)' }}>
                      <Code2 className="w-5 h-5" style={{ color: 'var(--text-nav-active)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-2 tracking-wide" style={{ color: 'var(--text-primary)' }}>
                        {t("about.cardDev")}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {t("about.cardDevDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 h-px" style={{ background: 'linear-gradient(90deg, var(--border-hover), transparent)' }} />
                </div>

                {/* Card Performance */}
                <div className="skill-card rounded-sm transition"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '1.75rem', animationDelay: '0.5s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-11 h-11 rounded-sm flex items-center justify-center"
                      style={{ background: isDark ? 'rgba(249,168,212,0.07)' : 'rgba(219,39,119,0.06)', border: '1px solid var(--border)' }}>
                      <Zap className="w-5 h-5" style={{ color: 'var(--text-pink)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-2 tracking-wide" style={{ color: 'var(--text-primary)' }}>
                        {t("about.cardPerf")}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {t("about.cardPerfDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,168,212,0.3), transparent)' }} />
                </div>

                {/* Card extra — sistemas */}
                <div className="skill-card rounded-sm transition"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '1.75rem', animationDelay: '1s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-11 h-11 rounded-sm flex items-center justify-center"
                      style={{ background: isDark ? 'rgba(196,181,253,0.05)' : 'rgba(124,58,237,0.05)', border: '1px solid var(--border)' }}>
                      <Cpu className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-2 tracking-wide" style={{ color: 'var(--text-primary)' }}>
                        {t("about.cardSys")}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {t("about.cardSysDesc")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 h-px" style={{ background: 'linear-gradient(90deg, var(--border), transparent)' }} />
                </div>

              </div>
            </div>

            {/* Stack de tecnologías */}
            <div className="mt-20">
              <p className="mono text-xs tracking-widest mb-8" style={{ color: 'var(--text-faint)' }}>{t("about.stack")}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {technologies.map((tech, i) => (
                  <div key={tech} className="tech-card px-3 py-2.5 rounded-sm text-center" style={{ animationDelay: `${i * 0.04}s` }}>{tech}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPERIENCIA ────────────────────────────────────── */}
        <section id="experiencia" className="min-h-screen flex items-center px-6 py-24 reveal">
          <div className="max-w-4xl mx-auto w-full">
            <p className="mono text-xs tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>02 —</p>
            <h2 className="serif text-5xl font-light italic mb-2 text-gradient">{t("experience.title")}</h2>
            <div className="section-divider" />

            <div className="space-y-6 mt-4">
              {experience.map((exp, i) => (
                <div key={i} className="experience-line p-6 rounded-sm transition"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                    <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{t(exp.titleKey)}</h3>
                    <span className="mono text-xs px-2.5 py-1 rounded-sm flex-shrink-0"
                      style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>
                      {t(exp.periodKey)}
                    </span>
                  </div>
                  <p className="text-sm mb-5" style={{ color: 'var(--text-pink)' }}>{t(exp.companyKey)}</p>
                  <ul className="space-y-2">
                    {exp.pointKeys.map((key, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--text-pink)' }} />
                        {t(key)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROYECTOS ──────────────────────────────────────── */}
        <section id="proyectos" className="min-h-screen flex items-center px-6 py-24 reveal">
          <div className="max-w-5xl mx-auto w-full">
            <p className="mono text-xs tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>03 —</p>
            <h2 className="serif text-5xl font-light italic mb-2 text-gradient">{t("projects.title")}</h2>
            <div className="section-divider" />

            <div className="grid md:grid-cols-2 gap-5 mt-4">
              {projects.map((project, i) => (
                <div key={i} className="project-card p-7 rounded-sm" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="text-3xl opacity-80">{project.icon}</div>
                    {project.ongoing && (
                      <span className="mono text-xs px-2 py-1 rounded-sm" style={{ background: 'rgba(249,168,212,0.08)', border: '1px solid rgba(249,168,212,0.25)', color: 'var(--text-pink)', letterSpacing: '0.08em' }}>
                        {t("projects.ongoing")}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>{t(project.titleKey)}</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>{t(project.descKey)}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag, j) => (
                      <span key={j} className="px-2.5 py-1 text-xs rounded-sm"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--tech-color)', letterSpacing: '0.04em' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs" style={{ letterSpacing: '0.06em' }}>
                    {['GitHub', 'Demo'].map((label) => (
                      <a key={label} href="#" className="flex items-center gap-1.5 transition"
                        style={{ color: 'var(--text-faint)', textTransform: 'uppercase' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-pink)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}>
                        {label} <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EDUCACIÓN & IDIOMAS ────────────────────────────── */}
        <section id="educacion" className="min-h-screen flex items-center px-6 py-24 reveal">
          <div className="max-w-4xl mx-auto w-full">
            <p className="mono text-xs tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>04 —</p>
            <h2 className="serif text-5xl font-light italic mb-2 text-gradient">{t("education.title")}</h2>
            <div className="section-divider" />

            <div className="grid md:grid-cols-3 gap-5 mt-4">
              {educationCards.map(({ labelKey, content }) => (
                <div key={labelKey} className="p-6 rounded-sm transition"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <p className="mono text-xs tracking-widest mb-5" style={{ color: 'var(--text-faint)' }}>{t(labelKey)}</p>
                  {content}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACTO ───────────────────────────────────────── */}
        <section id="contacto" className="min-h-screen flex items-center px-6 py-24 reveal">
          <div className="max-w-4xl mx-auto w-full text-center">
            <p className="mono text-xs tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>05 —</p>
            <h2 className="serif text-5xl font-light italic mb-2 text-gradient">{t("contact.title")}</h2>
            <div className="section-divider mx-auto" />

            {/* Availability badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm mb-8 mt-4"
              style={{ background: 'rgba(134,239,172,0.05)', border: '1px solid rgba(134,239,172,0.18)' }}>
              <span className="availability-dot" />
              <span className="mono text-xs" style={{ color: 'rgba(134,239,172,0.7)', letterSpacing: '0.08em' }}>
                {t("contact.available")}
              </span>
            </div>

            <p className="text-base font-light mb-14 max-w-md mx-auto" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              {t("contact.description")}
            </p>

            <div className="flex flex-wrap justify-center gap-5 mb-16">
              <a href="mailto:miriamdomlop@gmail.com" className="flex items-center gap-3 px-6 py-3 rounded-sm transition text-sm"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', letterSpacing: '0.03em' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-nav-active)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                <Mail className="w-4 h-4" />
                miriamdomlop@gmail.com
              </a>
              <a href="https://linkedin.com/in/[TU_LINKEDIN]" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 rounded-sm transition text-sm"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-pink)', letterSpacing: '0.03em' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>

            <div className="inline-block px-10 py-8 rounded-sm animate-pulse-glow"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="mono text-xs tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>{t("contact.call")}</p>
              <p className="mono text-2xl" style={{ color: 'var(--text-primary)', letterSpacing: '0.2em', fontWeight: 400 }}>673 257 028</p>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <footer className="py-8 px-6 text-center" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="mono text-xs" style={{ color: 'var(--text-faint)', letterSpacing: '0.08em' }}>{t("footer")}</p>
        </footer>

      </div>
    </div>
  );
}