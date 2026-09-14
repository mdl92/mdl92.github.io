import React, { useState, useRef, useEffect } from 'react';

const SECTION_ALIASES = {
  'sobre-mi':   ['sobre-mi', 'sobremi', 'about', 'about-me'],
  experiencia:  ['experiencia', 'experience'],
  proyectos:    ['proyectos', 'projects'],
  educacion:    ['educacion', 'education'],
  contacto:     ['contacto', 'contact'],
};

const COMMANDS = ['help', 'whoami', 'skills', 'experience', 'projects', 'education', 'contact', 'open', 'theme', 'lang', 'ls', 'date', 'clear'];

function resolveSection(arg) {
  const needle = arg.trim().toLowerCase();
  return Object.keys(SECTION_ALIASES).find((id) => SECTION_ALIASES[id].includes(needle)) || null;
}

export default function Terminal({
  t, isDark, scrollToSection, setTheme, changeLanguage,
  technologies, experience, projects,
  contactEmail, contactPhone, linkedinUrl,
}) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [cmdLog, setCmdLog] = useState([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  const print = (lines) => {
    const arr = (Array.isArray(lines) ? lines : [lines]).map((text) => ({ type: 'output', text }));
    setHistory((h) => [...h, ...arr]);
  };

  const runCommand = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setHistory((h) => [...h, { type: 'input', text: trimmed }]);
    setCmdLog((h) => [...h, trimmed]);
    setCmdIndex(-1);

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(' ');
    const lower = cmd.toLowerCase();

    switch (lower) {
      case 'help':
        print([
          t('terminal.help'),
          `  help                — ${t('terminal.cmdHelp')}`,
          `  whoami              — ${t('terminal.cmdWhoami')}`,
          `  skills              — ${t('terminal.cmdSkills')}`,
          `  experience          — ${t('terminal.cmdExperience')}`,
          `  projects            — ${t('terminal.cmdProjects')}`,
          `  education           — ${t('terminal.cmdEducation')}`,
          `  contact             — ${t('terminal.cmdContact')}`,
          `  open <sección>      — ${t('terminal.cmdOpen')}`,
          `  theme <dark|light>  — ${t('terminal.cmdTheme')}`,
          `  lang <es|en|fr>     — ${t('terminal.cmdLang')}`,
          `  ls                  — ${t('terminal.cmdLs')}`,
          `  date                — ${t('terminal.cmdDate')}`,
          `  clear               — ${t('terminal.cmdClear')}`,
        ]);
        break;

      case 'whoami':
      case 'about':
        print([t('about.p1'), t('about.p2')]);
        break;

      case 'skills':
      case 'stack':
        print([t('terminal.skillsIntro'), technologies.join(', ')]);
        break;

      case 'experience':
        print([
          t('terminal.experienceIntro'),
          ...experience.map((exp) => `• ${t(exp.titleKey)} @ ${t(exp.companyKey)} (${t(exp.periodKey)})`),
        ]);
        break;

      case 'projects':
        print([
          t('terminal.projectsIntro'),
          ...projects.map((p) => `${p.icon} ${t(p.titleKey)} — ${p.tags.join(', ')}`),
        ]);
        break;

      case 'education':
        print([
          t('terminal.educationIntro'),
          `• ${t('education.degree')} (${t('education.degreeSpec')})`,
          ...[1, 2, 3, 4].map((n) => `• ${t(`education.lang${n}Name`)}: ${t(`education.lang${n}Level`)}`),
        ]);
        break;

      case 'contact':
        print([
          t('terminal.contactIntro'),
          `email: ${contactEmail}`,
          `tel:   ${contactPhone}`,
          `linkedin: ${linkedinUrl}`,
        ]);
        break;

      case 'ls':
        print(Object.keys(SECTION_ALIASES).join('   '));
        break;

      case 'date':
        print(new Date().toLocaleString());
        break;

      case 'open':
      case 'cd': {
        if (!arg) { print(t('terminal.openUsage')); break; }
        const section = resolveSection(arg);
        if (section) {
          print(t('terminal.openSuccess', { section }));
          scrollToSection(section);
        } else {
          print(t('terminal.openNotFound', { section: arg }));
        }
        break;
      }

      case 'theme': {
        const next = arg === 'dark' || arg === 'light' ? arg : (isDark ? 'light' : 'dark');
        setTheme(next);
        print(t('terminal.themeSet', { theme: next }));
        break;
      }

      case 'lang':
        if (['es', 'en', 'fr'].includes(arg)) {
          changeLanguage(arg);
          print(t('terminal.langSet', { lang: arg }));
        } else {
          print(t('terminal.langUsage'));
        }
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'sudo':
        print(t('terminal.sudoJoke'));
        break;

      default:
        print(t('terminal.notFound', { cmd }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!cmdLog.length) return;
      const idx = cmdIndex < 0 ? cmdLog.length - 1 : Math.max(0, cmdIndex - 1);
      setCmdIndex(idx);
      setInput(cmdLog[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex < 0) return;
      const idx = cmdIndex + 1;
      if (idx >= cmdLog.length) { setCmdIndex(-1); setInput(''); }
      else { setCmdIndex(idx); setInput(cmdLog[idx]); }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match + ' ');
    }
  };

  return (
    <div className="terminal-window" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-titlebar">
        <span className="terminal-dot" style={{ background: 'var(--text-nav-active)' }} />
        <span className="terminal-dot" style={{ background: 'var(--accent)' }} />
        <span className="terminal-dot" style={{ background: 'var(--border-hover)' }} />
        <span className="mono terminal-title">miriam@portfolio — zsh</span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        <div className="terminal-line terminal-output">{t('terminal.welcome1')}</div>
        <div className="terminal-line terminal-output">{t('terminal.welcome2')}</div>
        {history.map((line, i) => (
          <div key={i} className="terminal-line">
            {line.type === 'input' ? (
              <span><span className="terminal-prompt">miriam@portfolio:~$</span> {line.text}</span>
            ) : (
              <span className="terminal-output">{line.text}</span>
            )}
          </div>
        ))}
        <div className="terminal-line terminal-input-line">
          <span className="terminal-prompt">miriam@portfolio:~$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input mono"
            placeholder={t('terminal.placeholder')}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            aria-label="terminal command input"
          />
        </div>
      </div>
    </div>
  );
}
