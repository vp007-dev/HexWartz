import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { 
  Sparkles, 
  Zap, 
  Menu, 
  X, 
  Award, 
  ShieldAlert, 
  Eye, 
  FlaskConical, 
  Wand2, 
  Coins, 
  Flame, 
  ChevronRight,
  ChevronDown,
  Volume2,
  VolumeX,
  Clock,
  Copy,
  Check,
  Compass,
  Scroll,
  Footprints,
  Lock,
  Unlock,
  Moon,
  Sun,
  Terminal,
  BookOpen,
  Feather,
  Download,
  Share2,
  Users,
  Trophy,
  MapPin,
  Calendar,
  Coffee
} from 'lucide-react';
import { sounds } from './sound';
import './styles.css';

// The four official Castle Crucible Sanctums at Sharda University, Agra
const CASTLE_SANCTUMS = [
  {
    id: 'arena',
    title: 'THE GREAT HALL',
    subtitle: 'MAIN HACKING CRUCIBLE',
    badge: 'STAGE & COMMITS',
    location: 'Central Innovation Auditorium',
    time: '24/7 NON-STOP',
    iconType: 'terminal',
    tag: 'Primary Arena',
    desc: 'The central collaborative arena where all fellowships build. Furnished with high-speed leylines, dual-surge power docks, and live tournament status monitors.',
    amenities: [
      'Gigabit LAN & high-capacity Wi-Fi leylines',
      'Dual power sockets at every fellowship bench',
      'Continuous stage checkpoints & mentor announcements',
      'Hardware helpdesk & live leaderboard displays'
    ]
  },
  {
    id: 'feasts',
    title: 'THE POTIONS REFECTORY',
    subtitle: 'FEASTS & HYDRATION',
    badge: 'FUEL & BUFFET',
    location: 'Campus Dining Pavilion',
    time: 'ROUND-THE-CLOCK',
    iconType: 'coffee',
    tag: 'Complimentary',
    desc: 'Round-the-clock nourishment and refreshment keeping wizard coders energized through the midnight sprint. Four full catered meals plus endless snacks.',
    amenities: [
      '4 Full Catered Meals (Lunch, Dinner, Midnight Fuel, Breakfast)',
      'Bottomless coffee, spiced chai & herbal elixirs',
      'Midnight pizza deliveries & energy snacks',
      'Pure vegetarian & dietary-conscious dining accommodations'
    ]
  },
  {
    id: 'mentors',
    title: 'THE ROOM OF REQUIREMENT',
    subtitle: 'MENTORSHIP SANCTUM',
    badge: 'OFFICE HOURS',
    location: 'Faculty Innovation Labs',
    time: 'SCHEDULED & WALK-IN',
    iconType: 'wand',
    tag: '1-on-1 Guidance',
    desc: 'A quiet consultation haven for technical architecture reviews, stubborn bug triage, and pitch deck refinement with senior industry wizards.',
    amenities: [
      'Senior software engineers & AI research mentors',
      'Mid-sprint architectural reviews & code triage',
      '3-Minute pitch polishing & demonstration clinics',
      'Direct domain consultation across all 4 House tracks'
    ]
  },
  {
    id: 'dorms',
    title: 'THE SANCTUARY DORMS',
    subtitle: 'REST & RECHARGE',
    badge: 'SAFE HAVEN',
    location: 'Secured Campus Residences',
    time: 'ACCESSIBLE 24H',
    iconType: 'moon',
    tag: 'Separated Wings',
    desc: 'Peaceful, climate-controlled sanctuaries allowing hackers to sleep, shower, and refresh in complete safety with 24/7 university campus security.',
    amenities: [
      'Dedicated separated sleeping lounges for male & female hackers',
      'Clean modern washrooms & hot shower facilities',
      'Monitored personal belongings storage',
      '24/7 Security personnel & medical emergency first-aid'
    ]
  }
];

// The four official Houses and their corresponding problem tracks.
const GRIMOIRE_TRACKS = [
  {
    id: 'gryffindor', title: 'Gryffindor', category: 'AI & MACHINE LEARNING', bounty: '₹25,000 BOUNTY', sprite: '/assets/sprites/crystal_ball_glowing.png', banner: '/assets/sprites/banner_real_gryffindor.png', difficulty: 'Courage & Chivalry', mentor: 'Track 01 · Neural Sorcery',
    desc: 'Engineer bold, autonomous intelligence models, cognitive agents, and predictive machine learning architectures.', tags: ['PyTorch / TensorFlow', 'LLM Agents', 'Computer Vision', 'Predictive ML'],
    challenge: 'Build intelligent systems that learn and adapt. From multimodal diagnostics to autonomous agent swarms, wield machine learning to solve tangible societal problems.'
  },
  {
    id: 'ravenclaw', title: 'Ravenclaw', category: 'HEALTHCARE & BIOTECH', bounty: '₹25,000 BOUNTY', sprite: '/assets/sprites/potion_flask_blue.png', banner: '/assets/sprites/banner_real_ravenclaw.png', difficulty: 'Wit & Wisdom', mentor: 'Track 02 · Elixirs of Health',
    desc: 'Craft clinical diagnostics, accessible assistive interfaces, emergency response tools, and mental wellness platforms.', tags: ['FHIR / Health APIs', 'Diagnostics', 'Mental Health', 'Assistive Tech'],
    challenge: 'Harness technology to heal and preserve life. Architect software that streamlines patient outcomes, breaks accessibility barriers, or democratizes emergency care.'
  },
  {
    id: 'hufflepuff', title: 'Hufflepuff', category: 'SDG & SUSTAINABLE TECH', bounty: '₹25,000 BOUNTY', sprite: '/assets/sprites/lantern_brass.png', banner: '/assets/sprites/banner_real_hufflepuff.png', difficulty: 'Patience & Loyalty', mentor: 'Track 03 · Perpetual Flame',
    desc: 'Engineer solutions directly mapped to the UN Sustainable Development Goals — clean energy, education, and equality.', tags: ['Clean Energy', 'EdTech Access', 'Climate Tech', 'Resource Allocation'],
    challenge: 'Build for the enduring future of humanity. Prototype systems addressing carbon accountability, decentralized solar grids, civic accessibility, or open-source education.'
  },
  {
    id: 'slytherin', title: 'Slytherin', category: 'FINTECH & OPEN INNOVATION', bounty: '₹25,000 BOUNTY', sprite: '/assets/sprites/deathly_hallows_gold.png', banner: '/assets/sprites/banner_real_slytherin.png', difficulty: 'Ambition & Resourcefulness', mentor: 'Track 04 · Unbound Sorcery',
    desc: 'Unleash radical financial primitives, secure cryptographic protocols, or audacious wildcard breakthroughs across any tech domain.', tags: ['FinTech Primitives', 'Zero Knowledge', 'Decentralized Networks', 'Wildcard Tech'],
    challenge: 'Zero boundaries, absolute ingenuity. If your concept is daring, structurally complex, and poised to disrupt industry monoliths, your allegiance belongs here.'
  }
];


// The Sorting Hat & Howler FAQ Missives
const FAQ_DATA = [
  {
    q: 'WHO CAN ENTER THE GATES OF HEXWARTZ?',
    a: 'HexWartz is open to undergraduate and postgraduate collegiate wizards across all recognized institutions globally. Cross-college and cross-specialization alliances are strongly championed. Bring your official student guild credentials for on-campus verification.'
  },
  {
    q: 'WHAT ARE THE EXACT FELLOWSHIP REQUIREMENTS?',
    a: 'Each fellowship must assemble precisely 4 to 6 collegiate builders. Solo participants will be forged into squads during the preliminary discord sorting. Each wizard may commit allegiance to exactly one fellowship.'
  },
  {
    q: 'HOW DO THE TWO TOURNAMENT PHASES OPERATE?',
    a: 'Phase 1 is a 100% free online PPT & architecture deck submission hosted on Unstop. The Ministry reviews all scrolls and shortlists the top fellowships. Shortlisted squads advance to Phase 2: the 36-hour offline crucible at Sharda University, Agra on 13–14 November 2026.'
  },
  {
    q: 'IS THERE A REGISTRATION FEE FOR PARTICIPANTS?',
    a: 'Phase 1 (The Online Owl Post) is completely FREE with zero galleons required. A nominal commitment fee of ₹250 per squad member is payable ONLY upon official shortlisting for the final offline crucible to guarantee your on-campus accommodations, dorms, and 24/7 feasts.'
  },
  {
    q: 'WHAT ARE THE LAWS OF CODE ORIGINALITY?',
    a: 'All prototype source code must be authored during the 36-hour physical hackathon. Open-source libraries, frameworks, public APIs, and declared generative AI assistants are permitted. Unattributed plagiarism triggers instant tribunal disqualification.'
  }
];


// Official judging criteria, retained in the existing editorial card layout.
const ALL_SPEAKERS = [
  {
    id: 1,
    name: 'INNOVATION & ORIGINALITY', role: 'THE FRESH IDEA', weight: '30% WEIGHTAGE', icon: Sparkles, house: 'Innovation', wand: '',
    topic: 'Does the spell weave unprecedented magic or copy ancient charms? How unique is the approach to the House challenge?'
  },
  {
    id: 2,
    name: 'TECHNICAL IMPLEMENTATION', role: 'THE WORKING SPELL', weight: '30% WEIGHTAGE', icon: Terminal, house: 'Implementation', wand: '',
    topic: 'Is the spellcraft structurally robust? Does the prototype execute without fatal runtime crashes under live testing?'
  },
  {
    id: 3,
    name: 'IMPACT & SCALABILITY', role: 'THE REAL-WORLD EFFECT', weight: '25% WEIGHTAGE', icon: Compass, house: 'Impact', wand: '',
    topic: 'Can this enchanted artifact scale beyond the castle walls to empower millions of real-world users reliably?'
  },
  {
    id: 4,
    name: 'PITCH & LIVE DEMONSTRATION', role: 'THE FINAL REVEAL', weight: '15% WEIGHTAGE', icon: Trophy, house: 'Pitch', wand: '',
    topic: 'Is the demonstration charismatic, coherent, and executed within the strict 5-minute tribunal hourglass countdown?'
  }
];

// Official finalist support, shown through the existing sponsor-card treatment.
const SPONSORS_DATA = [
  { 
    name: 'FOOD', desc: 'FINAL OFFLINE ROUND', bounty: 'Food is provided for participants of the final offline round.', icon: FlaskConical
  },
  { 
    name: 'ACCOMMODATION', desc: 'FINAL OFFLINE ROUND', bounty: 'Accommodation is provided for participants of the final offline round.', icon: Moon
  },
  { 
    name: 'GOODIES', desc: 'FOR ALL PARTICIPANTS', bounty: 'Every participant receives HexWartz goodies.', icon: Sparkles
  },
  { 
    name: 'CERTIFICATES', desc: 'FOR EVERY PARTICIPANT', bounty: 'Every participant receives a certificate.', icon: Award
  }
];

// Decoupled, GPU-accelerated Scroll Progress Bar (ScaleX on compositor thread, zero React tree re-renders)
function ScrollProgressBar({ lenisRef, lenisInstance }) {
  const barRef = useRef(null);

  useEffect(() => {
    const update = (e) => {
      if (!barRef.current) return;
      let p = 0;
      if (e && typeof e.progress === 'number') {
        p = e.progress;
      } else {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        p = total > 0 ? window.scrollY / total : 0;
      }
      const clamped = Math.min(1, Math.max(0, p));
      barRef.current.style.transform = `scaleX(${clamped})`;
    };

    const activeLenis = lenisInstance || lenisRef?.current;
    if (activeLenis) {
      activeLenis.on('scroll', update);
      return () => {
        if (activeLenis.off) activeLenis.off('scroll', update);
      };
    } else {
      window.addEventListener('scroll', update, { passive: true });
      return () => window.removeEventListener('scroll', update);
    }
  }, [lenisRef, lenisInstance]);

  return <div ref={barRef} className="scroll-progress-bar" aria-hidden="true" />;
}

// Decoupled 1-second Countdown Ticker (prevents full App re-render every 1,000ms)
function CountdownTicker() {
  const [timeLeft, setTimeLeft] = useState({ days: 17, hours: 14, mins: 32, secs: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        return { ...prev, secs: 59, mins: prev.mins > 0 ? prev.mins - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="ticker-countdown">
      {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.mins}M : {timeLeft.secs}S
    </span>
  );
}

export function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Interactive House Pledge
  const [pledgedHouse, setPledgedHouse] = useState('Gryffindor');
  const [housePoints, setHousePoints] = useState(480);

  // House Cup Hourglasses Points
  const [houseStandings, setHouseStandings] = useState({
    Gryffindor: 840,
    Ravenclaw: 790,
    Hufflepuff: 815,
    Slytherin: 830
  });

  const cheerHouse = (house) => {
    sounds.playPoints();
    setHouseStandings(prev => ({
      ...prev,
      [house]: prev[house] + 10
    }));
    setHousePoints(prev => prev + 10);
    setSpellBannerText(`💎 +10 GEMS AWARDED TO HOUSE ${house.toUpperCase()}!`);
    setTimeout(() => setSpellBannerText(''), 2500);
  };

  // Wand Spell Caster State
  const [activeSpell, setActiveSpell] = useState('lumos');
  const [spellBurstTrigger, setSpellBurstTrigger] = useState(0);
  const [spellBannerText, setSpellBannerText] = useState('');

  const castSpell = (spellKey) => {
    setSpellBurstTrigger(prev => prev + 1);
    if (spellKey === 'lumos') {
      setActiveSpell('lumos');
      sounds.playChime([523.25, 659.25, 783.99, 1046.5]);
      setHousePoints(prev => prev + 10);
      setSpellBannerText('✨ LUMOS CAST! Golden wand illumination active (+10 pts)');
    } else if (spellKey === 'incendio') {
      setActiveSpell('incendio');
      sounds.playIncendio();
      setHousePoints(prev => prev + 10);
      setSpellBannerText('🔥 INCENDIO CAST! Fiery ember spark trail ignited (+10 pts)');
    } else if (spellKey === 'patronus') {
      setActiveSpell('patronus');
      sounds.playPatronus();
      setHousePoints(prev => prev + 25);
      setSpellBannerText('🦌 EXPECTO PATRONUM! Ethereal guardian shields your code (+25 pts)');
    } else if (spellKey === 'alohomora') {
      sounds.playAlohomora();
      setHousePoints(prev => prev + 15);
      setVaultModalOpen(true);
      setSpellBannerText('🗝️ ALOHOMORA! Room of Requirement unlocked (+15 pts)');
    } else if (spellKey === 'nox') {
      setActiveSpell('nox');
      sounds.playWandHum();
      setSpellBannerText('🌙 NOX! Wand light extinguished.');
    }
    setTimeout(() => setSpellBannerText(''), 3200);
  };

  // Marauder's Map Radar State
  const [marauderOath, setMarauderOath] = useState(false);
  const [radarFilter, setRadarFilter] = useState('ALL');

  // Arcane Codex Tracks State
  const [expandedTrack, setExpandedTrack] = useState(null);

  // Daily Prophet Audio Quote State
  const [prophetPlaying, setProphetPlaying] = useState(false);

  const toggleProphetAudio = () => {
    sounds.playPatronus();
    setProphetPlaying(true);
    setTimeout(() => setProphetPlaying(false), 3800);
  };

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Secret Vault Modal State (Alohomora)
  const [vaultModalOpen, setVaultModalOpen] = useState(false);
  const [copiedCheatCode, setCopiedCheatCode] = useState(false);

  // Speaker Filtering & Pagination
  const [speakerFilter, setSpeakerFilter] = useState('ALL');
  const [activeDot, setActiveDot] = useState(0);
  const [showAllSpeakers, setShowAllSpeakers] = useState(false);

  // Interactive Schedule Accordion & Phase ('online' | 'offline')
  const [expandedDay, setExpandedDay] = useState(1);
  const [schedulePhase, setSchedulePhase] = useState('offline');

  // Interactive Spell Cast State in Hero
  const [spellCastActive, setSpellCastActive] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Lenis Gliding Momentum Smooth Scroll Reference & State
  const [lenisInstance, setLenisInstance] = useState(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08, // Gliding momentum physics (frictionless floating inertia)
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertiaExponent: 1.7,
      autoResize: true,
      autoRaf: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical'
    });

    lenisRef.current = lenis;
    window.lenis = lenis;
    setLenisInstance(lenis);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      window.lenis = null;
    };
  }, []);

  // Intersection Observer for scroll animations (unobserves once revealed for zero background overhead)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll(
      '.reveal-on-scroll, .swoosh-left, .swoosh-right, .swoosh-scale'
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Parallax scroll handler — Batched reads & writes to eliminate layout thrashing completely
  useEffect(() => {
    let ticking = false;
    const elements = Array.from(document.querySelectorAll('[data-parallax]')).map(el => ({
      el,
      speed: parseFloat(el.dataset.parallax) || 0.1
    }));

    if (elements.length === 0) return;

    const updateParallax = () => {
      const vh = window.innerHeight;
      // Read phase first (prevents forced synchronous reflow)
      const data = elements.map(item => {
        const rect = item.el.getBoundingClientRect();
        const inView = rect.top < vh + 150 && rect.bottom > -150;
        const shift = inView ? Math.round((rect.top + rect.height / 2 - vh / 2) * item.speed * -0.15) : 0;
        return { el: item.el, inView, shift };
      });
      // Write phase second
      data.forEach(({ el, inView, shift }) => {
        if (inView) {
          el.style.transform = `translate3d(0, ${shift}px, 0)`;
        }
      });
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    const activeLenis = lenisInstance || lenisRef.current;
    if (activeLenis) {
      activeLenis.on('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    handleScroll();

    return () => {
      if (activeLenis && activeLenis.off) {
        activeLenis.off('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [lenisInstance]);

  // Smooth gliding scroll helper using Lenis
  const scrollToSection = (e, targetId) => {
    if (e && e.preventDefault) e.preventDefault();
    sounds.playWandHum();
    setMobileMenuOpen(false);

    const activeLenis = lenisInstance || lenisRef.current;
    if (activeLenis) {
      activeLenis.scrollTo(targetId, {
        offset: -60,
        duration: 1.35,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 3D Card Hover Tilt Handlers with Cached Geometry (Zero Reflow on mouse move)
  const handleCardTilt = (e) => {
    const card = e.currentTarget;
    if (!card._cardRect) {
      card._cardRect = card.getBoundingClientRect();
    }
    const rect = card._cardRect;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
  };

  const handleCardTiltReset = (e) => {
    const card = e.currentTarget;
    card.style.transform = '';
    card._cardRect = null;
  };

  // Registration Form State
  const [formData, setFormData] = useState({
    wizardName: '',
    email: '',
    house: 'Gryffindor',
    wandType: 'Phoenix Feather',
    projectTrack: 'Grand Triwizard Cup'
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketCopied, setTicketCopied] = useState(false);

  const toggleSound = () => {
    const next = sounds.toggle();
    setSoundEnabled(next);
  };

  const handleHouseSwitch = (house) => {
    setPledgedHouse(house);
    setHousePoints(prev => prev + 50);
    sounds.playChime([523.25, 659.25, 783.99, 1046.5]);
  };

  const triggerSpellCast = (spellName) => {
    setSpellCastActive(true);
    sounds.playSpell();
    setTimeout(() => setSpellCastActive(false), 2400);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(
`const tournament = new HexWartzTournament({
  house: "${pledgedHouse}",
  track: "Triwizard Cup",
  runtime: "v4.2-arcane"
});
await tournament.cast("WIN_HACKATHON");`
    );
    setCopiedCode(true);
    sounds.playChime();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const filteredSpeakers = ALL_SPEAKERS.filter(s => {
    if (speakerFilter === 'ALL') return true;
    return s.house.toUpperCase() === speakerFilter.toUpperCase();
  });

  const displaySpeakers = showAllSpeakers ? filteredSpeakers : filteredSpeakers.slice(0, 4);

  const handleSubmit = (e) => {
    e.preventDefault();
    sounds.playChime([587.33, 739.99, 880, 1174.66]);
    setSubmitted(true);
  };

  return (
    <div className="site-wrapper">
      {/* GPU-composited Golden Scroll Progress Bar at the top of the viewport */}
      <ScrollProgressBar lenisRef={lenisRef} lenisInstance={lenisInstance} />

      {/* TOP COUNTDOWN & HOUSE SELECTOR BAR */}
      <div className="top-ticker">
        <div className="container">
          <div className="ticker-inner">
            
            <div className="ticker-left">
              <img src="/assets/sprites/hogwarts_express_train.png" alt="Hogwarts Express" style={{ height: '22px', width: 'auto', marginRight: '6px', verticalAlign: 'middle', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
              <Clock size={14} color="var(--accent-gold-bright)" />
              <span>THE FINAL OFFLINE ROUND BEGINS IN:</span>
              <CountdownTicker />
            </div>

            <div className="house-selector-strip">
              <span style={{ fontSize: '0.74rem', color: 'var(--fg-muted)' }}>PLEDGE HOUSE:</span>
              {['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'].map(h => (
                <button
                  key={h}
                  className={`house-pill-btn ${pledgedHouse === h ? 'active' : ''}`}
                  onClick={() => handleHouseSwitch(h)}
                  title={`Pledge for ${h} (+50 House Points)`}
                >
                  <img src={`/assets/sprites/banner_${h.toLowerCase()}.png`} className="house-crest-icon-mini" alt={h} />
                  <span>{h}</span>
                </button>
              ))}
            </div>

            <button 
              className={`sound-toggle-btn ${soundEnabled ? 'active' : ''}`}
              onClick={toggleSound}
              title={soundEnabled ? "Mute Enchanted Sounds" : "Enable Enchanted Sounds"}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{soundEnabled ? 'SPELLS ON' : 'SOUND'}</span>
            </button>

          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header className="navbar-wrapper">
        <div className="container">
          <nav className="navbar" aria-label="Main Navigation">
            <a 
              href="#top" 
              className="brand-link" 
              onClick={(e) => scrollToSection(e, '#top')} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <img 
                src="/assets/sprites/hexwartz_logo_castle.png" 
                alt="HexWartz Castle Logo" 
                className="brand-logo-img" 
              />
            </a>

            <ul className="nav-links">
              <li><a href="#top" className="nav-link" onClick={(e) => scrollToSection(e, '#top')}>Home</a></li>
              <li><a href="#journey" className="nav-link" onClick={(e) => scrollToSection(e, '#journey')}>Journey</a></li>
              <li><a href="#radar" className="nav-link" onClick={(e) => scrollToSection(e, '#radar')}>Fellowship</a></li>
              <li><a href="#standings" className="nav-link" onClick={(e) => scrollToSection(e, '#standings')}>Houses</a></li>
              <li><a href="#tracks" className="nav-link" onClick={(e) => scrollToSection(e, '#tracks')}>Tracks</a></li>
              <li><a href="#speakers" className="nav-link" onClick={(e) => scrollToSection(e, '#speakers')}>Judging</a></li>
              <li><a href="#prophet" className="nav-link" onClick={(e) => scrollToSection(e, '#prophet')}>About</a></li>
              <li><a href="#schedule" className="nav-link" onClick={(e) => scrollToSection(e, '#schedule')}>Schedule</a></li>
              <li><a href="#prizes" className="nav-link" onClick={(e) => scrollToSection(e, '#prizes')}>Prizes</a></li>
              <li><a href="#faq" className="nav-link" onClick={(e) => scrollToSection(e, '#faq')}>FAQ</a></li>
            </ul>

            <div className="nav-cta-wrapper">
              <img 
                src="/assets/sprites/owl_flying_letter.png" 
                alt="Hedwig Messenger Owl" 
                className="nav-owl-companion" 
              />
              <button 
                className="btn-primary-gold nav-cta-btn"
                onClick={() => {
                  sounds.playChime();
                  setModalOpen(true);
                }}
              >
                <Sparkles size={16} />
                <span>REGISTER TODAY</span>
              </button>
            </div>

            <button 
              className="mobile-menu-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </nav>
        </div>

        {/* Frosted Glass Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-nav-header">
                <img src="/assets/sprites/hexwartz_logo_castle.png" alt="HexWartz" style={{ height: '32px' }} />
                <button className="modal-close-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>
              <ul className="mobile-nav-links-list">
                {[
                  { id: '#top', label: 'Home' },
                  { id: '#journey', label: 'The Wizard\'s Journey' },
                  { id: '#radar', label: 'Your Fellowship' },
                  { id: '#standings', label: 'The Four Houses' },
                  { id: '#tracks', label: 'Problem Tracks' },
                  { id: '#speakers', label: 'Judging Criteria' },
                  { id: '#prophet', label: 'The Invitation' },
                  { id: '#schedule', label: 'Two Rounds' },
                  { id: '#prizes', label: 'Prizes & Perks' },
                  { id: '#faq', label: 'Enchanted FAQ' }
                ].map((item) => (
                  <li key={item.id}>
                    <a 
                      href={item.id} 
                      className="mobile-nav-link-item" 
                      onClick={(e) => scrollToSection(e, item.id)}
                    >
                      <Sparkles size={14} color="var(--accent-gold-bright)" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '20px' }}>
                <button 
                  className="btn-primary-gold" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    sounds.playChime();
                    setModalOpen(true);
                  }}
                >
                  <Sparkles size={16} />
                  <span>REGISTER TODAY</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* =========================================================================
            HERO SECTION (Frogtober Format Adapted for HexWartz)
            ========================================================================= */}
        <section className="hero-frogtober-layout">
          <div className="container">
            
            {/* Top Right Organizer Brand (matching Leapfrog Open Source) */}
            <div className="hero-organizer-row">
              <a 
                href="#top" 
                className="hero-organizer-brand"
                title="Hogwarts Open Arcane Initiative"
                onClick={() => sounds.playWandHum()}
              >
                <div className="organizer-icon-badge">
                  <Wand2 size={20} />
                </div>
                <div className="organizer-text">
                  <span className="organizer-name">HexWartz</span>
                  <span className="organizer-sub">Open Arcane</span>
                </div>
              </a>
            </div>

            <div className="hero-frogtober-grid">
              
              {/* LEFT COLUMN: Peeking Mascot + 3D Block Wordmark + Info */}
              <div className="hero-left-block swoosh-left">
                

                {/* Giant 3D Isometric Block Title with Character on the left */}
                <div className="hero-title-character-row">
                  <div className="hero-title-character-wrap">
                    <img 
                      src="/assets/sprites/harry_hedwig.png" 
                      alt="Harry Potter with Hedwig and Wand" 
                      className="hero-title-harry-img"
                      onClick={() => {
                        sounds.playSpell();
                        setHousePoints(prev => prev + 25);
                      }}
                      title="Click Harry & Hedwig (+25 House Points!)"
                    />
                  </div>

                  <div className="block-wordmark-container">
                    <span className="block-wordmark-top">HEXWARTZ</span>
                    <div className="block-wordmark-bottom-row">
                      <span className="block-wordmark-fest">HACK</span>
                      <div className="block-wordmark-year-stack">
                        <span className="block-year-digits">20</span>
                        <span className="block-year-digits">26</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtitle & Description */}
                <h2 className="hero-format-tagline">Embracing Arcane Code</h2>
                <p className="hero-format-desc">
                  A two-day Harry Potter-themed hackathon for students who want to build real solutions to real-world problems.
                </p>

                {/* Date Badge Pill */}
                <div 
                  className="hero-format-date-pill"
                  onClick={() => {
                    sounds.playChime();
                    setModalOpen(true);
                  }}
                  title="Click to register for HexWartz"
                >
                  <Clock size={18} color="var(--accent-gold-bright)" />
                  <span>13–14 November 2026 · Agra</span>
                </div>

                {/* College Hackathon Highlights Row */}
                <div className="hero-hackathon-pills-row">
                  <div className="hero-hackathon-pill">
                    <Award size={15} color="var(--accent-gold-bright)" />
                    <span>₹50,000+ PRIZE POOL</span>
                  </div>
                  <div className="hero-hackathon-pill">
                    <Zap size={15} color="var(--accent-gold-bright)" />
                    <span>2-DAY FINALE</span>
                  </div>
                  <div className="hero-hackathon-pill">
                    <BookOpen size={15} color="var(--accent-gold-bright)" />
                    <span>OPEN TO ALL COLLEGES</span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="hero-action-buttons-row">
                  <button 
                    className="hero-btn-unstop-primary font-display"
                    onClick={() => {
                      sounds.playChime();
                      setModalOpen(true);
                    }}
                  >
                    <span>REGISTER ON UNSTOP</span>
                    <ChevronRight size={17} />
                  </button>
                  <a 
                    href="#journey" 
                    className="hero-btn-explore-secondary font-display"
                    onClick={(e) => scrollToSection(e, '#journey')}
                  >
                    <span>EXPLORE JOURNEY</span>
                  </a>
                </div>

              </div>

              {/* RIGHT COLUMN: Completely Unconfined Arcane Hogwarts Gateway Portal */}
              <div className="hero-right-portal-col swoosh-right stagger-2">
                <div 
                  className="unconfined-portal-wrapper"
                  onClick={() => {
                    sounds.playPatronus();
                    setHousePoints(prev => prev + 25);
                    setSpellBannerText('⚡ THE PORTAL AWAKENS! Gateway to HexWartz 2026 activated (+25 pts)');
                    setTimeout(() => setSpellBannerText(''), 3000);
                  }}
                  title="Click to awaken the Portal (+25 House Points!)"
                >
                  {/* Free-standing organic portal graphic */}
                  <img 
                    src="/assets/portal_hero.jpg" 
                    alt="Arcane Hogwarts Gateway Portal" 
                    className="unconfined-portal-img"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        <div className="section-divider-glow" aria-hidden="true" />

        {/* =========================================================================
            THE WIZARD'S JOURNEY: STAGGERED 4-CARD FLOW (Register, Build, Connect, Grow)
            ========================================================================= */}
        <section className="cards-flow-section swoosh-left" id="journey">
          <div className="container">
            
            <div className="cards-flow-header-lockup">
              <div className="cards-flow-character-wrap">
                <img 
                  src="/assets/sprites/hermione_wand.png" 
                  alt="Hermione Granger casting a spell" 
                  className="cards-flow-hermione-img"
                  onClick={() => {
                    sounds.playPatronus();
                    setHousePoints(prev => prev + 25);
                    setSpellBannerText('💖 HERMIONE CASTS ALOHOMORA! Arcane wisdom unlocked (+25 pts)');
                    setTimeout(() => setSpellBannerText(''), 3000);
                  }}
                  title="Click Hermione (+25 House Points!)"
                />
              </div>

              <div className="section-unified-header">
                <div className="section-unified-eyebrow font-arcane">
                  <Sparkles size={14} className="gold-spark" />
                  <span>THE PATHWAY TO GLORY · STAGE DECK</span>
                  <Sparkles size={14} className="gold-spark" />
                </div>
                <h2 className="section-block-title font-display">
                  <span className="title-gold">THE WIZARD'S</span>
                  <span className="title-white">JOURNEY</span>
                </h2>
                <p className="section-unified-subtitle">
                  From preliminary owl post submission to the grand offline podium at Sharda University, Agra. Master each trial to claim the Triwizard Cup.
                </p>
              </div>
            </div>

            {/* Awwwards Sticky Stacking Cards Container */}
            <div className="cards-stack-container">
              
              {/* Stack Card 1: ASSEMBLE */}
              <article 
                className="stack-journey-card"
                style={{ '--index': 1 }}
                onClick={() => {
                  sounds.playWandHum();
                  setModalOpen(true);
                }}
              >
                {/* Left Visual Chamber */}
                <div className="stack-card-visual-chamber">
                  <div className="stack-card-stage-pill font-display">PHASE 01</div>
                  <div className="stack-card-emblem-wrap">
                    <img 
                      src="/assets/sprites/sorting_hat.png" 
                      alt="The Sorting Hat Emblem" 
                      className="stack-emblem-sprite"
                    />
                    <div className="stack-emblem-glow" aria-hidden="true" />
                  </div>
                  <span className="stack-card-meta-tag font-arcane">UNSTOP · REGISTRATION</span>
                </div>

                {/* Right Content Chamber */}
                <div className="stack-card-content-chamber">
                  <div className="stack-card-header-row">
                    <div>
                      <span className="stack-card-phase-label font-arcane">STAGE I PROTOCOL</span>
                      <h3 className="stack-card-title font-display">ASSEMBLE</h3>
                    </div>
                    <span className="stack-card-watermark font-display" aria-hidden="true">01</span>
                  </div>

                  <h4 className="stack-card-subheading font-arcane">Form The Fellowship of 4–6 Wizards</h4>
                  <p className="stack-card-description">
                    Gather your guild across colleges and specializations. Combine frontend enchanters, backend arithmancers, smart contract alchemists, and AI whisperers under one unified house banner.
                  </p>

                  <div className="stack-card-chips-grid">
                    <div className="stack-chip">
                      <Users size={13} className="chip-icon" />
                      <span>4–6 Wizards per Fellowship</span>
                    </div>
                    <div className="stack-chip">
                      <Sparkles size={13} className="chip-icon" />
                      <span>Inter-College Squads Allowed</span>
                    </div>
                    <div className="stack-chip">
                      <Zap size={13} className="chip-icon" />
                      <span>Zero Registration Fees</span>
                    </div>
                  </div>

                  <div className="stack-card-footer-row">
                    <span className="stack-footer-milestone">STATUS: REGISTRATION ACTIVE</span>
                    <button 
                      className="stack-card-cta-btn font-display"
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playChime();
                        setModalOpen(true);
                      }}
                    >
                      <span>REGISTER FELLOWSHIP</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </article>

              {/* Stack Card 2: SUBMIT */}
              <article 
                className="stack-journey-card"
                style={{ '--index': 2 }}
                onClick={() => {
                  sounds.playSpell();
                  setModalOpen(true);
                }}
              >
                {/* Left Visual Chamber */}
                <div className="stack-card-visual-chamber">
                  <div className="stack-card-stage-pill font-display">PHASE 02</div>
                  <div className="stack-card-emblem-wrap">
                    <img 
                      src="/assets/sprites/owl_flying_letter.png" 
                      alt="Owl Post Scroll Emblem" 
                      className="stack-emblem-sprite"
                    />
                    <div className="stack-emblem-glow" aria-hidden="true" />
                  </div>
                  <span className="stack-card-meta-tag font-arcane">ONLINE · SCREENING</span>
                </div>

                {/* Right Content Chamber */}
                <div className="stack-card-content-chamber">
                  <div className="stack-card-header-row">
                    <div>
                      <span className="stack-card-phase-label font-arcane">STAGE II PROTOCOL</span>
                      <h3 className="stack-card-title font-display">SUBMIT</h3>
                    </div>
                    <span className="stack-card-watermark font-display" aria-hidden="true">02</span>
                  </div>

                  <h4 className="stack-card-subheading font-arcane">Online Idea PPT & Architecture Deck</h4>
                  <p className="stack-card-description">
                    Transcribe your innovation onto the official Unstop tournament parchment. Detail the core problem, system architecture, selected tech stack, and anticipated collegiate impact.
                  </p>

                  <div className="stack-card-chips-grid">
                    <div className="stack-chip">
                      <Scroll size={13} className="chip-icon" />
                      <span>Standard PPT Template on Unstop</span>
                    </div>
                    <div className="stack-chip">
                      <Award size={13} className="chip-icon" />
                      <span>Blind Jury Review by Experts</span>
                    </div>
                    <div className="stack-chip">
                      <Flame size={13} className="chip-icon" />
                      <span>Top 50 Squads Invited to Agra</span>
                    </div>
                  </div>

                  <div className="stack-card-footer-row">
                    <span className="stack-footer-milestone">FORMAT: ONLINE VIA UNSTOP</span>
                    <button 
                      className="stack-card-cta-btn font-display"
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playChime();
                        setModalOpen(true);
                      }}
                    >
                      <span>VIEW PPT GUIDELINES</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </article>

              {/* Stack Card 3: CREATE */}
              <article 
                className="stack-journey-card"
                style={{ '--index': 3 }}
                onClick={() => {
                  sounds.playWandHum();
                }}
              >
                {/* Left Visual Chamber */}
                <div className="stack-card-visual-chamber">
                  <div className="stack-card-stage-pill font-display">PHASE 03</div>
                  <div className="stack-card-emblem-wrap">
                    <img 
                      src="/assets/sprites/cauldron_bubbling_green.png" 
                      alt="The Bubbling Cauldron Crucible" 
                      className="stack-emblem-sprite"
                    />
                    <div className="stack-emblem-glow" aria-hidden="true" />
                  </div>
                  <span className="stack-card-meta-tag font-arcane">36-HR · ON-CAMPUS</span>
                </div>

                {/* Right Content Chamber */}
                <div className="stack-card-content-chamber">
                  <div className="stack-card-header-row">
                    <div>
                      <span className="stack-card-phase-label font-arcane">STAGE III PROTOCOL</span>
                      <h3 className="stack-card-title font-display">CREATE</h3>
                    </div>
                    <span className="stack-card-watermark font-display" aria-hidden="true">03</span>
                  </div>

                  <h4 className="stack-card-subheading font-arcane">The 36-Hour Prototype Crucible at Sharda Agra</h4>
                  <p className="stack-card-description">
                    Selected fellowships converge at Sharda University, Agra for 36 relentless hours of prototyping. Fuel up on midnight feasts and brew working software with 24/7 mentor checkpoints.
                  </p>

                  <div className="stack-card-chips-grid">
                    <div className="stack-chip">
                      <MapPin size={13} className="chip-icon" />
                      <span>Sharda University, Agra Campus</span>
                    </div>
                    <div className="stack-chip">
                      <Clock size={13} className="chip-icon" />
                      <span>36-Hour Non-Stop Build</span>
                    </div>
                    <div className="stack-chip">
                      <Coffee size={13} className="chip-icon" />
                      <span>24/7 Meals, Snacks & Leylines</span>
                    </div>
                  </div>

                  <div className="stack-card-footer-row">
                    <span className="stack-footer-milestone">DATES: 13–14 NOVEMBER 2026</span>
                    <a 
                      href="#map" 
                      className="stack-card-cta-btn font-display"
                      onClick={(e) => scrollToSection(e, '#map')}
                    >
                      <span>INSPECT VENUE SANCTUMS</span>
                      <ChevronRight size={15} />
                    </a>
                  </div>
                </div>
              </article>

              {/* Stack Card 4: PITCH */}
              <article 
                className="stack-journey-card"
                style={{ '--index': 4 }}
                onClick={() => {
                  sounds.playChime([523.25, 659.25, 783.99, 1046.5]);
                }}
              >
                {/* Left Visual Chamber */}
                <div className="stack-card-visual-chamber">
                  <div className="stack-card-stage-pill font-display">PHASE 04</div>
                  <div className="stack-card-emblem-wrap">
                    <img 
                      src="/assets/sprites/golden_triwizard_trophy.png" 
                      alt="The Golden Triwizard Trophy" 
                      className="stack-emblem-sprite"
                    />
                    <div className="stack-emblem-glow" aria-hidden="true" />
                  </div>
                  <span className="stack-card-meta-tag font-arcane">FINALE · HOUSE CUP</span>
                </div>

                {/* Right Content Chamber */}
                <div className="stack-card-content-chamber">
                  <div className="stack-card-header-row">
                    <div>
                      <span className="stack-card-phase-label font-arcane">STAGE IV PROTOCOL</span>
                      <h3 className="stack-card-title font-display">PITCH</h3>
                    </div>
                    <span className="stack-card-watermark font-display" aria-hidden="true">04</span>
                  </div>

                  <h4 className="stack-card-subheading font-arcane">Great Hall Demo & ₹1,00,000+ House Cup</h4>
                  <p className="stack-card-description">
                    Take the main stage in the Great Hall before the judging tribunal. Present your working live prototype, survive the rapid-fire architectural Q&A, and lift the grand House Cup bounty.
                  </p>

                  <div className="stack-card-chips-grid">
                    <div className="stack-chip">
                      <Trophy size={13} className="chip-icon" />
                      <span>₹1,00,000+ Prize Bounty Pool</span>
                    </div>
                    <div className="stack-chip">
                      <Zap size={13} className="chip-icon" />
                      <span>5-Min Live Demo & Q&A Defense</span>
                    </div>
                    <div className="stack-chip">
                      <Award size={13} className="chip-icon" />
                      <span>Hogwarts House Cup Glory</span>
                    </div>
                  </div>

                  <div className="stack-card-footer-row">
                    <span className="stack-footer-milestone">BOUNTY: ₹1,00,000+ AWARDS</span>
                    <a 
                      href="#prizes" 
                      className="stack-card-cta-btn font-display"
                      onClick={(e) => scrollToSection(e, '#prizes')}
                    >
                      <span>VIEW BOUNTY BREAKDOWN</span>
                      <ChevronRight size={15} />
                    </a>
                  </div>
                </div>
              </article>

            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 3: THE TOURNAMENT CODEX (Simplified, Sleek, Clean & Harry Potter Themed)
            ========================================================================= */}
        <div className="section-divider-glow" aria-hidden="true" />
        <section className="tournament-codex-section swoosh-scale" id="codex">
          <div className="container">
            
            {/* Heraldic Header */}
            <div className="section-unified-header">
              <div className="section-unified-eyebrow font-arcane">
                <Sparkles size={14} className="gold-spark" />
                <span>MINISTRY DECREE NO. 36 · OFFICIAL PROTOCOLS</span>
                <Sparkles size={14} className="gold-spark" />
              </div>
              <h2 className="section-block-title font-display">
                <span className="title-gold">TOURNAMENT</span>
                <span className="title-white">CODEX</span>
              </h2>
              <p className="section-unified-subtitle">
                Clear directives and essential logistics for witches, wizards, and collegiate builders before entering the Great Hall at Sharda University, Agra.
              </p>
            </div>

            {/* 4 Sleek Telemetry Capsules */}
            <div className="codex-pills-bar">
              <div className="codex-pill-item">
                <div className="codex-pill-icon">
                  <Users size={18} />
                </div>
                <div className="codex-pill-info">
                  <span className="codex-pill-label">THE FELLOWSHIP</span>
                  <span className="codex-pill-val font-display">4–6 WIZARDS</span>
                  <span className="codex-pill-sub">Inter-college squads welcome</span>
                </div>
              </div>

              <div className="codex-pill-item">
                <div className="codex-pill-icon">
                  <Calendar size={18} />
                </div>
                <div className="codex-pill-info">
                  <span className="codex-pill-label">CRUCIBLE DATES</span>
                  <span className="codex-pill-val font-display">13–14 NOV 2026</span>
                  <span className="codex-pill-sub">36-Hour on-campus build</span>
                </div>
              </div>

              <div className="codex-pill-item">
                <div className="codex-pill-icon">
                  <MapPin size={18} />
                </div>
                <div className="codex-pill-info">
                  <span className="codex-pill-label">SANCTUARY VENUE</span>
                  <span className="codex-pill-val font-display">SHARDA UNIV, AGRA</span>
                  <span className="codex-pill-sub">Full campus accommodation</span>
                </div>
              </div>

              <div className="codex-pill-item">
                <div className="codex-pill-icon">
                  <Award size={18} />
                </div>
                <div className="codex-pill-info">
                  <span className="codex-pill-label">REGISTRATION</span>
                  <span className="codex-pill-val font-display">100% FREE ENTRY</span>
                  <span className="codex-pill-sub">Zero galleons required</span>
                </div>
              </div>
            </div>

            {/* 3 Master Directives Panels */}
            <div className="codex-grid">

              {/* Panel 1: Eligibility & Fellowship */}
              <div 
                className="codex-card"
                onMouseMove={handleCardTilt}
                onMouseLeave={handleCardTiltReset}
                onClick={() => sounds.playWandHum()}
              >
                <div className="codex-card-corner-tl" aria-hidden="true" />
                <div className="codex-card-corner-br" aria-hidden="true" />
                
                <div className="codex-card-header">
                  <div className="codex-card-meta">
                    <span className="codex-directive-badge font-arcane">DIRECTIVE 01</span>
                    <span className="codex-num font-display">§ 01</span>
                  </div>
                  <h3 className="codex-card-title font-arcane">ADMISSION & ELIGIBILITY</h3>
                  <p className="codex-card-tagline">The law governing fellowship formation and campus admittance.</p>
                </div>

                <ul className="codex-list">
                  <li className="codex-list-item">
                    <span className="codex-bullet-pip">✦</span>
                    <div>
                      <strong>Squad Composition (4–6 Members):</strong> Solo wizards are not permitted. Every squad must register with 4 to 6 members.
                    </div>
                  </li>
                  <li className="codex-list-item">
                    <span className="codex-bullet-pip">✦</span>
                    <div>
                      <strong>Cross-Guild Synergy:</strong> Teammates can be from different colleges, graduation years, and disciplines (Tech, Design, Business).
                    </div>
                  </li>
                  <li className="codex-list-item">
                    <span className="codex-bullet-pip">✦</span>
                    <div>
                      <strong>Eligible Scholars:</strong> Open to all enrolled undergraduate & postgraduate students from any recognized university.
                    </div>
                  </li>
                  <li className="codex-list-item">
                    <span className="codex-bullet-pip">✦</span>
                    <div>
                      <strong>Photo Identification:</strong> Every wizard must present their physical student ID card during campus gate clearance.
                    </div>
                  </li>
                </ul>

                <div className="codex-card-footer">
                  <span className="codex-footer-badge">✓ Zero Entry Cost</span>
                  <span className="codex-footer-note">Beginners & Veterans</span>
                </div>
              </div>

              {/* Panel 2: The Two Trials (Modality) */}
              <div 
                className="codex-card"
                onMouseMove={handleCardTilt}
                onMouseLeave={handleCardTiltReset}
                onClick={() => sounds.playSpell()}
              >
                <div className="codex-card-corner-tl" aria-hidden="true" />
                <div className="codex-card-corner-br" aria-hidden="true" />

                <div className="codex-card-header">
                  <div className="codex-card-meta">
                    <span className="codex-directive-badge font-arcane">DIRECTIVE 02</span>
                    <span className="codex-num font-display">§ 02</span>
                  </div>
                  <h3 className="codex-card-title font-arcane">THE TWO TRIALS</h3>
                  <p className="codex-card-tagline">From online proposal to on-campus 36-hour prototype build.</p>
                </div>

                <ul className="codex-list">
                  <li className="codex-list-item">
                    <span className="codex-bullet-pip">✦</span>
                    <div>
                      <strong>Round 1 (Virtual PPT Screening):</strong> Submit a 5–8 slide PPT on Unstop detailing your chosen House problem, tech stack, and impact.
                    </div>
                  </li>
                  <li className="codex-list-item">
                    <span className="codex-bullet-pip">✦</span>
                    <div>
                      <strong>No Upfront Code:</strong> Round 1 tests vision, feasibility, and originality. No working code submission required for Round 1.
                    </div>
                  </li>
                  <li className="codex-list-item">
                    <span className="codex-bullet-pip">✦</span>
                    <div>
                      <strong>Round 2 (36H Offline Finale):</strong> Shortlisted squads assemble at Sharda University, Agra on 13–14 Nov to build functional software.
                    </div>
                  </li>
                  <li className="codex-list-item">
                    <span className="codex-bullet-pip">✦</span>
                    <div>
                      <strong>Final Stage Demonstration:</strong> 3-minute live prototype demo + 2-minute Q&A in front of industry judges and mentors.
                    </div>
                  </li>
                </ul>

                <div className="codex-card-footer">
                  <span className="codex-footer-badge">✓ 13–14 Nov 2026</span>
                  <span className="codex-footer-note">Unstop Evaluation</span>
                </div>
              </div>

              {/* Panel 3: Castle Hospitality & Spoils */}
              <div 
                className="codex-card"
                onMouseMove={handleCardTilt}
                onMouseLeave={handleCardTiltReset}
                onClick={() => sounds.playChime([523.25, 659.25, 783.99, 1046.5])}
              >
                <div className="codex-card-corner-tl" aria-hidden="true" />
                <div className="codex-card-corner-br" aria-hidden="true" />

                <div className="codex-card-header">
                  <div className="codex-card-meta">
                    <span className="codex-directive-badge font-arcane">DIRECTIVE 03</span>
                    <span className="codex-num font-display">§ 03</span>
                  </div>
                  <h3 className="codex-card-title font-arcane">PROVISIONS & SPOILS</h3>
                  <p className="codex-card-tagline">Complimentary campus hospitality and bounty distribution.</p>
                </div>

                <ul className="codex-list">
                  <li className="codex-list-item">
                    <span className="codex-bullet-pip">✦</span>
                    <div>
                      <strong>24/7 Great Hall Feasts:</strong> Complimentary hot meals (breakfast, lunch, dinner), midnight snacks, and unlimited tea & coffee.
                    </div>
                  </li>
                  <li className="codex-list-item">
                    <span className="codex-bullet-pip">✦</span>
                    <div>
                      <strong>High-Speed Leylines:</strong> Dedicated gigabit Wi-Fi, Ethernet lanes, and power strips provided at every squad desk.
                    </div>
                  </li>
                  <li className="codex-list-item">
                    <span className="codex-bullet-pip">✦</span>
                    <div>
                      <strong>Resting Sanctuaries:</strong> Safe, separated sleeping and quiet resting dorms for male and female hackers with campus security.
                    </div>
                  </li>
                  <li className="codex-list-item">
                    <span className="codex-bullet-pip">✦</span>
                    <div>
                      <strong>₹50,000+ Prize Treasury:</strong> Direct cash bounties for House champions, official House Cup trophies, merch kits & certificates.
                    </div>
                  </li>
                </ul>

                <div className="codex-card-footer">
                  <span className="codex-footer-badge">✓ Meals & Stay Free</span>
                  <span className="codex-footer-note">Cash + Perks</span>
                </div>
              </div>

            </div>

            {/* Bottom Action Ribbon */}
            <div className="codex-action-strip">
              <div className="codex-strip-left">
                <div className="codex-strip-icon-box">
                  <Sparkles size={20} color="var(--accent-gold-bright)" />
                </div>
                <div className="codex-strip-text">
                  <span className="codex-strip-heading font-arcane">THE SORTING HAT AWAITS YOUR FELLOWSHIP</span>
                  <span className="codex-strip-sub">Round 1 idea submissions are 100% free on Unstop. No entry fees at any stage.</span>
                </div>
              </div>

              <div className="codex-strip-actions">
                <button 
                  className="codex-btn-primary"
                  onClick={() => {
                    sounds.playChime();
                    setModalOpen(true);
                  }}
                >
                  <span>REGISTER ON UNSTOP</span>
                  <ChevronRight size={16} />
                </button>
                <a 
                  href="#tracks" 
                  className="codex-btn-secondary"
                  onClick={(e) => scrollToSection(e, '#tracks')}
                >
                  <span>EXPLORE TRACKS</span>
                </a>
                <a 
                  href="#faq" 
                  className="codex-btn-tertiary"
                  onClick={(e) => scrollToSection(e, '#faq')}
                >
                  <span>RULES FAQ</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 4: THE MARAUDER'S MAP (CAMPUS CRUCIBLE & SANCTUMS)
            ========================================================================= */}
        <div className="section-divider-glow" aria-hidden="true" />
        <section id="radar" className="marauders-map-section swoosh-right">
          <div className="container">
            <div className="marauders-parchment-frame">
              <span className="marauder-corner-stamp marauder-corner-top-left font-arcane">HOGWARTS ARCHIVES</span>
              <span className="marauder-corner-stamp marauder-corner-top-right font-arcane">CAMPUS CRUCIBLE</span>
              <span className="marauder-corner-stamp marauder-corner-bottom-left font-arcane">SHARDA UNIV, AGRA</span>
              <span className="marauder-corner-stamp marauder-corner-bottom-right font-arcane">HEXWARTZ 2026</span>

              {/* Marauder Header */}
              <div className="section-unified-header">
                <div className="section-unified-eyebrow font-arcane">
                  <Sparkles size={14} className="gold-spark" />
                  <span>MESSRS MOONY, WORMTAIL, PADFOOT &amp; PRONGS PRESENT</span>
                  <Sparkles size={14} className="gold-spark" />
                </div>
                <h2 className="section-block-title font-display">
                  <span className="title-gold">THE MARAUDER’S</span>
                  <span className="title-white">MAP</span>
                </h2>
                <p className="section-unified-subtitle">
                  The official interactive guide to the offline crucible grounds at Sharda University, Agra — revealing hacking arenas, 24/7 feasts, mentor sanctums, and rest dormitories.
                </p>

                {/* The Legendary Oath Button */}
                <div className="marauder-oath-bar">
                  <button 
                    className={`marauder-oath-btn ${marauderOath ? 'active' : ''}`}
                    onClick={() => {
                      if (!marauderOath) {
                        sounds.playAlohomora();
                        setMarauderOath(true);
                        setHousePoints(prev => prev + 20);
                        setSpellBannerText('🐾 "I solemnly swear that I am up to no good!" (+20 pts)');
                      } else {
                        sounds.playWandHum();
                        setMarauderOath(false);
                        setSpellBannerText('📜 "Mischief Managed."');
                      }
                      setTimeout(() => setSpellBannerText(''), 3000);
                    }}
                  >
                    <Footprints size={17} />
                    <span>
                      {marauderOath 
                        ? '📜 "MISCHIEF MANAGED" (FOLD SECRET RULES)' 
                        : '🐾 "I SOLEMNLY SWEAR THAT I AM UP TO NO GOOD"'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Sleek Golden Footsteps Trail Separator */}
              <div className={`footsteps-trail ${marauderOath ? 'trail-active' : ''}`} aria-hidden="true">
                {[1, 2, 3, 4, 5, 6].map(step => (
                  <div key={step} className="footstep-pair">
                    <Footprints size={16} />
                  </div>
                ))}
              </div>

              {/* Filter Tabs */}
              <div className="radar-tabs-strip">
                {[
                  { id: 'ALL', label: 'ALL SANCTUMS (4)' },
                  { id: 'arena', label: 'HACKING ARENA' },
                  { id: 'feasts', label: 'FEASTS & FUEL' },
                  { id: 'mentors', label: 'MENTOR SANCTUM' },
                  { id: 'dorms', label: 'REST DORMS' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`radar-tab-btn ${radarFilter === tab.id ? 'active' : ''}`}
                    onClick={() => {
                      sounds.playWandHum();
                      setRadarFilter(tab.id);
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 4 Castle Crucible Sanctum Cards */}
              <div className="radar-activity-grid">
                {CASTLE_SANCTUMS
                  .filter(sanctum => radarFilter === 'ALL' || sanctum.id === radarFilter)
                  .map(sanctum => (
                    <div 
                      key={sanctum.id} 
                      className="radar-activity-card"
                      onMouseMove={handleCardTilt}
                      onMouseLeave={handleCardTiltReset}
                      onClick={() => sounds.playWandHum()}
                    >
                      <div className="radar-card-corner-tl" aria-hidden="true" />
                      <div className="radar-card-corner-br" aria-hidden="true" />

                      <div className="radar-activity-top">
                        <div className="radar-sanctum-badge-group">
                          <div className="radar-sanctum-icon-box">
                            {sanctum.iconType === 'terminal' && <Terminal size={18} />}
                            {sanctum.iconType === 'coffee' && <Coffee size={18} />}
                            {sanctum.iconType === 'wand' && <Wand2 size={18} />}
                            {sanctum.iconType === 'moon' && <Moon size={18} />}
                          </div>
                          <div>
                            <span className="radar-sanctum-tagline">{sanctum.subtitle}</span>
                            <h3 className="radar-sanctum-title font-arcane">{sanctum.title}</h3>
                          </div>
                        </div>
                        <span className="radar-time-tag font-display">{sanctum.time}</span>
                      </div>

                      <p className="radar-action-text">{sanctum.desc}</p>

                      <div className="radar-amenities-list">
                        {sanctum.amenities.map((item, idx) => (
                          <div key={idx} className="radar-amenity-item">
                            <span className="amenity-pip">✦</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="radar-card-bottom">
                        <div className="radar-action-location">
                          <MapPin size={13} color="var(--accent-gold-bright)" />
                          <span>{sanctum.location}</span>
                        </div>
                        <span className="radar-highlight-pill">{sanctum.tag}</span>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Unlocked Secret Passage Drawer (When Oath is Active) */}
              {marauderOath && (
                <div className="secret-passage-box">
                  <div className="secret-passage-header">
                    <Sparkles size={16} className="gold-spark" />
                    <h4 className="secret-passage-title font-arcane">
                      THE RESTRICTED SECTION · 4 BYLAWS OF THE CRUCIBLE
                    </h4>
                    <Sparkles size={16} className="gold-spark" />
                  </div>
                  
                  <div className="secret-rules-grid">
                    <div className="secret-rule-item">
                      <span className="secret-rule-num font-display">01</span>
                      <div className="secret-rule-content">
                        <strong>Code Originality:</strong> 100% of functional prototype code must be authored during the 36 hours. Open-source packages, public APIs, and declared generative AI tools are permitted.
                      </div>
                    </div>

                    <div className="secret-rule-item">
                      <span className="secret-rule-num font-display">02</span>
                      <div className="secret-rule-content">
                        <strong>House Track Allegiance:</strong> Each fellowship commits to exactly one House problem track and builds a solution tailored to that domain challenge.
                      </div>
                    </div>

                    <div className="secret-rule-item">
                      <span className="secret-rule-num font-display">03</span>
                      <div className="secret-rule-content">
                        <strong>Arcane Scoring Matrix:</strong> Innovation &amp; Novelty (30%) · Technical Depth &amp; Execution (30%) · Viability &amp; Impact (25%) · Final Stage Pitch &amp; Q&amp;A (15%).
                      </div>
                    </div>

                    <div className="secret-rule-item">
                      <span className="secret-rule-num font-display">04</span>
                      <div className="secret-rule-content">
                        <strong>Fellowship Conduct:</strong> Mutual respect and academic integrity across all houses. Unattributed plagiarism or disruptive dark magic results in immediate disqualification.
                      </div>
                    </div>
                  </div>

                  <div className="secret-passage-actions">
                    <button 
                      className="codex-btn-primary"
                      onClick={() => {
                        sounds.playAlohomora();
                        setVaultModalOpen(true);
                      }}
                    >
                      <Unlock size={15} />
                      <span>OPEN ROOM OF REQUIREMENT VAULT</span>
                    </button>
                    <a 
                      href="#faq"
                      className="codex-btn-secondary"
                      onClick={(e) => scrollToSection(e, '#faq')}
                    >
                      <span>VIEW PARTICIPATION FAQ</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Bottom Coordinates & Access Ribbon */}
              <div className="marauders-coords-ribbon">
                <div className="coords-item">
                  <Compass size={14} color="var(--accent-gold-bright)" />
                  <span>27.1767° N, 78.0081° E · Sharda University Campus, Agra</span>
                </div>
                <div className="coords-divider" />
                <div className="coords-item">
                  <Award size={14} color="var(--accent-gold-bright)" />
                  <span>Campus Facilities 100% Complimentary For Admitted Fellowships</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: HOGWARTS HOUSE CUP STANDINGS & THE FOUR HOURGLASSES
            ========================================================================= */}
        <div className="section-divider-glow" aria-hidden="true" />
        <section id="standings" className="house-cup-standings-section swoosh-left">
          <div className="container">
            <div className="section-unified-header">
              <div className="section-unified-eyebrow font-arcane">
                <Sparkles size={14} className="gold-spark" />
                <span>GREAT HALL ENCHANTMENT · LIVE HOUSE STANDINGS</span>
                <Sparkles size={14} className="gold-spark" />
              </div>
              <h2 className="section-block-title font-display">
                <span className="title-gold">THE HOUSE CUP</span>
                <span className="title-white">HOURGLASSES</span>
              </h2>
              <p className="section-unified-subtitle">
                Four towering glass hourglasses stand in the Great Hall. Shimmering rubies, sapphires, topaz, and emeralds record every fellowship commit, architectural victory, and tribunal point. Choose your House and add to its tally.
              </p>
            </div>

            <div className="hourglass-row">
              {[
                { 
                  house: 'Gryffindor', 
                  track: 'TRACK 01',
                  field: 'AI & Machine Learning',
                  motto: 'Courage & Chivalry',
                  gemName: 'Rubies',
                  gemColor: 'ruby',
                  banner: '/assets/sprites/banner_real_gryffindor.png', 
                  color: 'gryffindor',
                  trackId: 0
                },
                { 
                  house: 'Ravenclaw', 
                  track: 'TRACK 02',
                  field: 'Healthcare & Biotech',
                  motto: 'Wit & Wisdom',
                  gemName: 'Sapphires',
                  gemColor: 'sapphire',
                  banner: '/assets/sprites/banner_real_ravenclaw.png', 
                  color: 'ravenclaw',
                  trackId: 1
                },
                { 
                  house: 'Hufflepuff', 
                  track: 'TRACK 03',
                  field: 'SDG & Sustainable Tech',
                  motto: 'Patience & Loyalty',
                  gemName: 'Topaz',
                  gemColor: 'topaz',
                  banner: '/assets/sprites/banner_real_hufflepuff.png', 
                  color: 'hufflepuff',
                  trackId: 2
                },
                { 
                  house: 'Slytherin', 
                  track: 'TRACK 04',
                  field: 'FinTech & Open Innovation',
                  motto: 'Ambition & Resourcefulness',
                  gemName: 'Emeralds',
                  gemColor: 'emerald',
                  banner: '/assets/sprites/banner_real_slytherin.png', 
                  color: 'slytherin',
                  trackId: 3
                }
              ].map(item => {
                const currentGems = houseStandings[item.house] || 800;
                const fillPercent = Math.min(94, Math.max(30, Math.round(((currentGems - 700) / 250) * 100)));

                return (
                  <div 
                    key={item.house} 
                    className={`hourglass-col ${item.color}`}
                    onMouseMove={handleCardTilt}
                    onMouseLeave={handleCardTiltReset}
                  >
                    {/* Real Heraldic House Banner */}
                    <div className="house-track-banner-wrapper">
                      <img 
                        src={item.banner} 
                        alt={`${item.house} House Banner`} 
                        className="house-track-real-banner" 
                      />
                    </div>

                    <div className="house-motto-tag font-arcane">{item.motto}</div>
                    <div className="house-track-pill">{item.track}: {item.field}</div>

                    {/* 3D Glass Hourglass Chamber */}
                    <div className="hourglass-chamber-wrap">
                      <div className="hourglass-brass-top" aria-hidden="true" />
                      <div className="hourglass-glass-cylinder">
                        <div className="hourglass-reflection-line" aria-hidden="true" />
                        
                        {/* Dynamic Gem Fluid Level */}
                        <div 
                          className={`hourglass-gem-reservoir ${item.gemColor}`} 
                          style={{ height: `${fillPercent}%` }}
                        >
                          <div className="gem-surface-sparkle" />
                          <div className="gem-bubbles">
                            <span className="bubble-gem b1" />
                            <span className="bubble-gem b2" />
                            <span className="bubble-gem b3" />
                            <span className="bubble-gem b4" />
                          </div>
                        </div>
                      </div>
                      <div className="hourglass-brass-base" aria-hidden="true" />
                    </div>

                    <div className="hourglass-points-val font-display">{currentGems}</div>
                    <div className="hourglass-points-label font-arcane">{item.gemName.toUpperCase()} RECORDED</div>

                    {/* Dual Action Controls */}
                    <div className="hourglass-actions-row">
                      <button 
                        className="hourglass-cheer-btn font-arcane"
                        onClick={() => cheerHouse(item.house)}
                        title={`Award +10 gems to ${item.house}!`}
                      >
                        <Sparkles size={13} />
                        <span>+10 GEMS</span>
                      </button>

                      <a 
                        href="#tracks"
                        className="hourglass-explore-link font-arcane"
                        onClick={(e) => {
                          scrollToSection(e, '#tracks');
                          setExpandedTrack(item.trackId);
                        }}
                      >
                        <span>CHALLENGE BRIEF →</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: ARCANE CODEX (4 DEDICATED TOURNAMENT TRACKS)
            ========================================================================= */}
        <div className="section-divider-glow" aria-hidden="true" />
        <section id="tracks" className="tracks-grimoire-section swoosh-scale">
          <div className="container">
            <div className="section-unified-header">
              <div className="section-unified-eyebrow font-arcane">
                <Sparkles size={14} className="gold-spark" />
                <span>ARCANE CODEX · 4 PROBLEM STATEMENT TRACKS</span>
                <Sparkles size={14} className="gold-spark" />
              </div>
              <h2 className="section-block-title font-display">
                <span className="title-gold">THE FOUR</span>
                <span className="title-white">HOUSES</span>
              </h2>
              <p className="section-unified-subtitle">
                Four ancient disciplines. Choose one House track with your fellowship, unravel its societal challenge, and architect a functional production prototype within 36 hours.
              </p>
            </div>

            <div className="grimoire-tracks-grid">
              {GRIMOIRE_TRACKS.map((track, idx) => {
                const isExpanded = expandedTrack === idx;

                return (
                  <article 
                    key={track.id} 
                    className={`grimoire-track-card grimoire-tome-${track.id}`}
                    onMouseMove={handleCardTilt}
                    onMouseLeave={handleCardTiltReset}
                    onClick={() => sounds.playWandHum()}
                  >
                    {/* Leather Book Spine Aesthetic Accent */}
                    <div className="grimoire-spine-strip" aria-hidden="true">
                      <span className="spine-rib" />
                      <span className="spine-rib" />
                      <span className="spine-rib" />
                      <span className="spine-rib" />
                    </div>

                    <div className="grimoire-tome-inner">
                      <div className="track-card-top">
                        <div className="track-icon-badge">
                          <img src={track.sprite} alt={track.title} className="track-card-sprite" />
                        </div>
                        <span className="track-bounty-pill font-arcane">{track.bounty}</span>
                      </div>

                      <div className="track-card-header-info">
                        <span className="track-house-spirit font-arcane">{track.difficulty}</span>
                        <h3 className="track-card-title font-display">{track.title}</h3>
                        <p className="track-category-label font-arcane">
                          {track.category} · {track.mentor}
                        </p>
                      </div>

                      <p className="track-card-desc">{track.desc}</p>

                      <div className="track-tech-tags">
                        {track.tags.map(t => (
                          <span key={t} className="tech-tag font-mono">{t}</span>
                        ))}
                      </div>

                      <button 
                        className="track-drawer-toggle font-arcane"
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playWandHum();
                          setExpandedTrack(isExpanded ? null : idx);
                        }}
                      >
                        <span>{isExpanded ? 'SEAL GRIMOIRE BRIEF ▲' : 'UNROLL CHALLENGE SPECIFICATION ▼'}</span>
                      </button>

                      {isExpanded && (
                        <div className="track-drawer-content">
                          <div className="drawer-prompt-box">
                            <strong style={{ color: 'var(--accent-gold-bright)', display: 'block', marginBottom: '4px' }}>
                              ⚔️ THE CORE CHALLENGE:
                            </strong> 
                            {track.challenge}
                          </div>
                          
                          <div className="drawer-meta-row">
                            <div className="drawer-meta-item">
                              <span className="drawer-meta-label">DISCIPLINE</span>
                              <span className="drawer-meta-val">{track.category}</span>
                            </div>
                            <div className="drawer-meta-item">
                              <span className="drawer-meta-label">BOUNTY</span>
                              <span className="drawer-meta-val" style={{ color: 'var(--accent-gold-bright)' }}>{track.bounty}</span>
                            </div>
                          </div>

                          <button 
                            className="btn-pledge-house font-arcane"
                            onClick={(e) => {
                              e.stopPropagation();
                              sounds.playAlohomora();
                              setPledgedHouse(track.title);
                              setHousePoints(prev => prev + 30);
                              setSpellBannerText(`🦁 ALLEGIANCE PLEDGED TO HOUSE ${track.title.toUpperCase()}! (+30 pts)`);
                              setTimeout(() => setSpellBannerText(''), 3000);
                              setModalOpen(true);
                            }}
                          >
                            <Sparkles size={14} />
                            <span>PLEDGE ALLEGIANCE TO {track.title.toUpperCase()}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: THE GRAND TRIBUNAL · ARCH-MAGE EVALUATION BENCH
            ========================================================================= */}
        <div className="section-divider-glow" aria-hidden="true" />
        <section id="speakers" className="speakers-section swoosh-right">
          <div className="container">
            
            {/* Header: Official evaluation criteria */}
            <div className="section-unified-header">
              <div className="section-unified-eyebrow font-arcane">
                <Sparkles size={14} className="gold-spark" />
                <span>OFFICIAL EVALUATION BENCH · THE HIGH TABLE</span>
                <Sparkles size={14} className="gold-spark" />
              </div>
              <h2 className="section-block-title font-display">
                <span className="title-gold">THE GRAND</span>
                <span className="title-white">TRIBUNAL</span>
              </h2>
              <p className="section-unified-subtitle">
                The Arch-Mages and industry judges evaluate every project against four foundational pillars. Each criterion carries strict, transparent weightage during the 5-minute final stage defense.
              </p>

              <div className="speaker-filter-tabs">
                {['ALL', 'Innovation', 'Implementation', 'Impact', 'Pitch'].map(cat => (
                  <button
                    key={cat}
                    className={`speaker-filter-btn ${speakerFilter === cat ? 'active' : ''}`}
                    onClick={() => {
                      sounds.playWandHum();
                      setSpeakerFilter(cat);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Criteria Grid */}
            <div className="speakers-grid">
              {displaySpeakers.map((speaker) => {
                const IconComponent = speaker.icon || Sparkles;
                return (
                  <article 
                    key={speaker.id} 
                    className="speaker-card tribunal-portrait-card"
                    onMouseMove={handleCardTilt}
                    onMouseLeave={handleCardTiltReset}
                    onClick={() => sounds.playWandHum()}
                  >
                    <div className="speaker-card-top-row">
                      <span className="speaker-house-badge font-arcane">
                        {speaker.house.toUpperCase()}
                      </span>
                      <span className="tribunal-weight-badge font-mono">
                        {speaker.weight || '25% WEIGHTAGE'}
                      </span>
                    </div>

                    <div className="tribunal-medallion-wrap">
                      <div className="tribunal-medallion">
                        <IconComponent size={34} color="var(--accent-gold-bright)" />
                      </div>
                    </div>

                    <div className="speaker-info">
                      <h3 className="speaker-name font-display">{speaker.name}</h3>
                      <p className="speaker-role font-arcane">{speaker.role}</p>
                      
                      <div className="speaker-keynote-snippet">
                        <span className="tribunal-ask-tag font-arcane">JUDGES INQUIRE:</span>
                        <p className="tribunal-ask-text">{speaker.topic}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Compact interaction controls */}
            <div className="speakers-footer">
              <div className="carousel-dots" role="tablist" aria-label="Speaker navigation">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <button 
                    key={idx} 
                    className={`dot ${activeDot === idx ? 'active' : ''}`}
                    onClick={() => {
                      sounds.playWandHum();
                      setActiveDot(idx);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                className="btn-primary-gold font-arcane"
                onClick={() => {
                  sounds.playChime();
                  setShowAllSpeakers(!showAllSpeakers);
                }}
              >
                {showAllSpeakers ? 'SHOW CORE CRITERIA' : 'VIEW ALL PROTOCOLS'}
              </button>
            </div>

          </div>
        </section>

        {/* =========================================================================
            KEY STATS STRIP (Interactive Lore Hover)
            ========================================================================= */}
        <section className="stats-section swoosh-left">
          <div className="container">
            <div className="stats-grid">
              
              <div className="stat-item" onMouseEnter={() => sounds.playWandHum()}>
                <span className="stat-num">4</span>
                <span className="stat-label">HOUSES</span>
                <span className="stat-sub">One problem statement track per House</span>
              </div>

              <div className="stat-item" onMouseEnter={() => sounds.playWandHum()}>
                <span className="stat-num">2</span>
                <span className="stat-label">ROUNDS</span>
                <span className="stat-sub">Online PPT shortlisting, then offline final</span>
              </div>

              <div className="stat-item" onMouseEnter={() => sounds.playWandHum()}>
                <span className="stat-num">4–6</span>
                <span className="stat-label">TEAM MEMBERS</span>
                <span className="stat-sub">Inter-college and inter-specialization teams allowed</span>
              </div>

              <div className="stat-item" onMouseEnter={() => sounds.playWandHum()}>
                <span className="stat-num">₹50K+</span>
                <span className="stat-label">PRIZE POOL</span>
                <span className="stat-sub">Certificates, goodies, food and accommodation too</span>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: THE DAILY PROPHET (INTERACTIVE WIZARDING GAZETTE)
            ========================================================================= */}
        <div className="section-divider-glow" aria-hidden="true" />
        <section id="prophet" className="daily-prophet-section swoosh-scale">
          <div className="container">
            <div className="daily-prophet-broadsheet">
              
              {/* Ornate Newspaper Masthead */}
              <div className="prophet-masthead">
                <div className="prophet-issue-row font-arcane">
                  <span>SPECIAL TOURNAMENT EDITION</span>
                  <span>PRICE: 1 KNUT</span>
                  <span>ISSUE NO. 777</span>
                  <span>SHARDA UNIVERSITY AGRA</span>
                </div>
                <h2 className="prophet-logo-text font-display">THE DAILY PROPHET</h2>
                <div className="prophet-sub-bar font-arcane">
                  <span>MINISTRY GAZETTE</span>
                  <span>WEATHER: 24°C · HIGH CREATIVITY WINDS</span>
                  <span>HOUSE ODDS: GRYFFINDOR 2-1 · SLYTHERIN 5-2</span>
                  <span>CIRCULATION: 50,000</span>
                </div>
              </div>

              {/* Newspaper Content Layout */}
              <div className="daily-prophet-layout">
                
                {/* Left: Bewitched Moving Picture Frame */}
                <div className="prophet-moving-photo-frame">
                  <div className="moving-photo-inner">
                    <img 
                      src="/assets/sprites/harry_hedwig.png" 
                      alt="Bewitched moving photograph of Harry Potter and Hedwig" 
                      className="prophet-moving-photo"
                    />
                    <div className="moving-photo-halftone" aria-hidden="true" />
                  </div>
                  <div className="prophet-photo-caption font-arcane">
                    ▲ A student fellowship dispatching their architecture scroll via owl post ahead of the 36-hour physical hackathon.
                  </div>
                </div>

                {/* Right: Lead Article & Interactive Audio Quote */}
                <div className="prophet-article-body">
                  <div className="event-date-tag" style={{ marginBottom: '10px' }}>
                    <Scroll size={14} />
                    <span>OFFICIAL MINISTRY DISPATCH · NOVEMBER 2026</span>
                  </div>

                  <h3 className="prophet-headline font-display">
                    FOUR HOUSES ASSEMBLE: 36-HOUR PHYSICAL CRUCIBLE SANCTIONED AT SHARDA UNIVERSITY
                  </h3>

                  <div className="prophet-columns-dual">
                    <p className="prophet-para">
                      The Ministry of Magical Innovation has formally authorized the 2026 HexWartz Hackathon at Sharda University, Agra. Over 450 collegiate builders across India will converge for 36 non-stop hours to solve foundational challenges across Artificial Intelligence, Healthcare, Sustainable Development, and FinTech.
                    </p>
                    <p className="prophet-para">
                      "This is not a theoretical symposium," declared the Grand Tribunal. "Every fellowship must deploy functional production code, interface with live leylines, and defend their working artifact during a 5-minute live tribunal interrogation."
                    </p>
                  </div>

                  <div className="prophet-quote-box font-arcane">
                    “Choose your House. Form your fellowship. Build your working prototype before the final sand falls.”
                    <div style={{ marginTop: '6px', fontWeight: 'bold', color: 'var(--accent-gold-bright)' }}>
                      — The Official HexWartz Proclamation
                    </div>
                  </div>

                  <div className="prophet-action-strip">
                    <button 
                      className={`btn-primary-gold font-arcane ${prophetPlaying ? 'active' : ''}`}
                      onClick={toggleProphetAudio}
                    >
                      <Volume2 size={16} />
                      <span>{prophetPlaying ? 'OWL CALL CHIME RESONATING...' : 'HEAR THE INVITATION CHIME'}</span>
                    </button>

                    <a 
                      href="#tracks" 
                      className="btn-white font-arcane"
                      onClick={(e) => scrollToSection(e, '#tracks')}
                    >
                      <span>EXPLORE THE 4 HOUSES →</span>
                    </a>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: THE 36-HOUR CHRONICLE · DUAL-ROUND TOURNAMENT SCHEDULE
            ========================================================================= */}
        <div className="section-divider-glow" aria-hidden="true" />
        <section id="schedule" className="schedule-section swoosh-right">
          <div className="container">
            
            <div className="section-unified-header">
              <div className="section-unified-eyebrow font-arcane">
                <Clock size={14} className="gold-spark" />
                <span>CHRONICLE OF EVENTS · DUAL-PHASE ITINERARY</span>
                <Clock size={14} className="gold-spark" />
              </div>
              <h2 className="section-block-title font-display">
                <span className="title-gold">THE 36-HOUR</span>
                <span className="title-white">CHRONICLE</span>
              </h2>
              <p className="section-unified-subtitle">
                From preliminary owl post submission to the final Triwizard podium presentation. Switch phases below to inspect the detailed checkpoint itinerary.
              </p>

              {/* Phase Switcher Tabs */}
              <div className="schedule-phase-tabs">
                <button
                  className={`schedule-phase-btn font-arcane ${schedulePhase === 'online' ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playWandHum();
                    setSchedulePhase('online');
                  }}
                >
                  <Scroll size={16} />
                  <span>PHASE 1: THE OWL POST (ONLINE PPT)</span>
                </button>

                <button
                  className={`schedule-phase-btn font-arcane ${schedulePhase === 'offline' ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playWandHum();
                    setSchedulePhase('offline');
                  }}
                >
                  <Flame size={16} />
                  <span>PHASE 2: THE 36H CRUCIBLE (OFFLINE IN AGRA)</span>
                </button>
              </div>
            </div>

            {/* Phase 1: Online Owl Post Timeline */}
            {schedulePhase === 'online' && (
              <div className="schedule-phase-content schedule-fade-in">
                <div className="schedule-timeline-grid">
                  {[
                    { step: '01', title: 'Assemble Fellowship', desc: 'Form a squad of 4 to 6 collegiate builders across any department or institution.', badge: 'STAGE 1 · RECRUITMENT', sprite: '/assets/sprites/sorting_hat.png' },
                    { step: '02', title: 'Commit House Allegiance', desc: 'Select one of the 4 problem tracks: AI & ML, Healthcare, SDG, or FinTech.', badge: 'STAGE 2 · TRACK COMMIT', sprite: '/assets/sprites/crystal_ball_glowing.png' },
                    { step: '03', title: 'Author Architecture Deck', desc: 'Draft your solution architecture, technical feasibility, and societal impact scroll.', badge: 'STAGE 3 · SCROLL DRAFT', sprite: '/assets/sprites/owl_flying_letter.png' },
                    { step: '04', title: 'Free Unstop Submission', desc: 'Upload your deck to Unstop with zero galleons required. Ministry shortlists top squads.', badge: 'STAGE 4 · SHORTLISTING', sprite: '/assets/sprites/platform_934_ticket.png' }
                  ].map((item, idx) => (
                    <div key={idx} className="timeline-checkpoint-card" onMouseMove={handleCardTilt} onMouseLeave={handleCardTiltReset}>
                      <div className="checkpoint-top-bar">
                        <span className="checkpoint-num font-display">{item.step}</span>
                        <span className="checkpoint-badge font-arcane">{item.badge}</span>
                      </div>
                      <div className="checkpoint-header-row">
                        <img src={item.sprite} alt="" className="checkpoint-sprite" />
                        <h3 className="checkpoint-title font-display">{item.title}</h3>
                      </div>
                      <p className="checkpoint-desc">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Phase 2: Offline 36-Hour Final Timeline */}
            {schedulePhase === 'offline' && (
              <div className="schedule-phase-content schedule-fade-in">
                <div className="schedule-timeline-grid">
                  {[
                    { step: '09:00', title: 'Platform 9¾ Check-In', desc: 'Check in at Sharda University, receive on-campus dorm keys, custom robes, and wizard badges.', badge: 'DAY 1 · 13 NOV', sprite: '/assets/sprites/platform_934_ticket.png' },
                    { step: '11:00', title: 'The Sorting Ceremony', desc: 'Keynote opening in the Great Hall, track briefings by industry mentors, and socket allocation.', badge: 'DAY 1 · 13 NOV', sprite: '/assets/sprites/sorting_hat.png' },
                    { step: '13:00', title: 'Crucible Inception (Hacking Begins)', desc: '36 hours of live hacking commence. First commits pushed to verified repository leylines.', badge: 'DAY 1 · 13 NOV', sprite: '/assets/sprites/cauldron_bubbling_green.png' },
                    { step: '20:00', title: 'Feast & Mentor Round 1', desc: 'Lavish dinner banquet in the Great Hall + architectural review with 20+ specialized tech mentors.', badge: 'DAY 1 · 13 NOV', sprite: '/assets/sprites/lit_candles_floating.png' },
                    { step: '00:00', title: 'Midnight Butterbeer & Red Bull', desc: 'Midnight pizza, energy elixirs, and mini-games to recharge fellowship focus through the night.', badge: 'NIGHT · 14 NOV', sprite: '/assets/sprites/potion_flask_blue.png' },
                    { step: '09:00', title: 'Breakfast & Mentor Round 2', desc: 'Morning breakfast banquet + final prototype debugging and polish review before code freeze.', badge: 'DAY 2 · 14 NOV', sprite: '/assets/sprites/lantern_brass.png' },
                    { step: '13:00', title: 'Code Freeze · Wands Down', desc: 'All git repositories locked. Final executable builds uploaded to tribunal inspection terminals.', badge: 'DAY 2 · 14 NOV', sprite: '/assets/sprites/deathly_hallows_gold.png' },
                    { step: '14:00', title: 'The Grand Tribunal Pitches', desc: '5-minute live stage presentations and interrogation before the Arch-Mage judging panel.', badge: 'DAY 2 · 14 NOV', sprite: '/assets/sprites/golden_triwizard_trophy.png' },
                    { step: '17:00', title: 'Triwizard Cup Ceremony', desc: 'House Cup crowning, ₹1,40,000+ bounty distribution, incubator admissions, and farewell.', badge: 'DAY 2 · 14 NOV', sprite: '/assets/sprites/gold_laurel_wreath.png' }
                  ].map((item, idx) => (
                    <div key={idx} className="timeline-checkpoint-card" onMouseMove={handleCardTilt} onMouseLeave={handleCardTiltReset}>
                      <div className="checkpoint-top-bar">
                        <span className="checkpoint-num font-display">{item.step}</span>
                        <span className="checkpoint-badge font-arcane">{item.badge}</span>
                      </div>
                      <div className="checkpoint-header-row">
                        <img src={item.sprite} alt="" className="checkpoint-sprite" />
                        <h3 className="checkpoint-title font-display">{item.title}</h3>
                      </div>
                      <p className="checkpoint-desc">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Floating Catchable Golden Snitch Bonus */}
            <div className="snitch-interactive-container">
              <div 
                className="snitch-floating-badge" 
                title="Catch the Golden Snitch (+150 House Points)!"
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playChime([783.99, 987.77, 1174.66, 1567.98]);
                  setHousePoints(prev => prev + 150);
                  setSpellBannerText('✨ GOLDEN SNITCH CAUGHT! +150 House Points awarded to your House!');
                  setTimeout(() => setSpellBannerText(''), 3000);
                }}
              >
                <img src="/assets/sprites/golden_snitch_flying.png" alt="Golden Snitch badge" className="snitch-interactive-sprite" />
                <span className="snitch-catch-hint font-arcane">CLICK TO CATCH (+150 PTS)</span>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 10: THE FINALIST'S PRIVILEGES · GUILD PROVISIONS
            ========================================================================= */}
        <div className="section-divider-glow" aria-hidden="true" />
        <section id="sponsors" className="sponsors-section swoosh-left">
          <div className="container">
            <div className="section-unified-header">
              <div className="section-unified-eyebrow font-arcane">
                <Sparkles size={14} className="gold-spark" />
                <span>ALL-INCLUSIVE SANCTUARY · CAMPUS PROVISIONS</span>
                <Sparkles size={14} className="gold-spark" />
              </div>
              <h2 className="section-block-title font-display">
                <span className="title-gold">FINALIST</span>
                <span className="title-white">PRIVILEGES</span>
              </h2>
              <p className="section-unified-subtitle">
                Every collegiate fellowship shortlisted for the offline final receives comprehensive on-campus hospitality at Sharda University, Agra. Focus entirely on authoring world-class software.
              </p>
            </div>
            
            <div className="sponsors-grid">
              {[
                { name: 'CAMPUS ACCOMMODATION', desc: 'FINAL OFFLINE ROUND', bounty: 'Dedicated secure dormitory rooms and resting pods provided at Sharda University throughout the 36 hours.', icon: Moon },
                { name: '24/7 GOURMET FEASTS', desc: 'FINAL OFFLINE ROUND', bounty: 'Continuous meals, midnight pizza, hot beverages, Red Bull elixirs, and snacks provided completely free of charge.', icon: Coffee },
                { name: 'HEXWARTZ GUILD KIT', desc: 'FOR ALL FINALISTS', bounty: 'Customized Hogwarts tournament robes, physical wands, collectible badges, laptop decals, and stickers.', icon: Sparkles },
                { name: 'VERIFIED CERTIFICATES', desc: 'FOR EVERY PARTICIPANT', bounty: 'Official Ministry of Magic Verified Certificate of Achievement validating your 36-hour production hack.', icon: Award }
              ].map((s, idx) => {
                const IconComponent = s.icon;
                return (
                  <div 
                    key={idx} 
                    className="sponsor-card-box privilege-card"
                    onMouseMove={handleCardTilt}
                    onMouseLeave={handleCardTiltReset}
                    onClick={() => sounds.playWandHum()}
                  >
                    <div className="sponsor-header-row">
                      <div className="privilege-icon-wrap">
                        <IconComponent size={22} className="sponsor-box-icon" />
                      </div>
                      <div>
                        <span className="privilege-tag font-arcane">{s.desc}</span>
                        <h4 className="sponsor-box-name font-display">{s.name}</h4>
                      </div>
                    </div>
                    <p className="sponsor-box-bounty">{s.bounty}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 11: THE TRIWIZARD TREASURES · BOUNTY POOL PODIUM
            ========================================================================= */}
        <div className="section-divider-glow" aria-hidden="true" />
        <section id="prizes" className="prizes-section swoosh-scale">
          <div className="container">
            
            <div className="section-unified-header">
              <div className="section-unified-eyebrow font-arcane">
                <Trophy size={14} className="gold-spark" />
                <span>HONORS & BOUNTIES · ₹1,40,000+ TOTAL REWARD POOL</span>
                <Trophy size={14} className="gold-spark" />
              </div>
              <h2 className="section-block-title font-display">
                <span className="title-gold">TRIWIZARD</span>
                <span className="title-white">TREASURES</span>
              </h2>
              <p className="section-unified-subtitle">
                Forge a revolutionary production prototype to claim cash bounties, incubator fast-track admission, exclusive laurels, and the coveted Golden Triwizard Trophy.
              </p>
            </div>

            {/* Grand Podium Showcase */}
            <div className="prizes-podium-row">
              
              {/* 2nd Place Podium */}
              <div 
                className="podium-card podium-rank-2"
                onMouseMove={handleCardTilt}
                onMouseLeave={handleCardTiltReset}
                onClick={() => sounds.playWandHum()}
              >
                <span className="podium-rank-ribbon font-arcane">2ND PLACE</span>
                <div className="podium-medal-icon font-display">II</div>
                <h3 className="podium-title font-display">ORDER OF MERLIN</h3>
                <span className="podium-sub font-arcane">2ND CLASS CHAMPION</span>
                <div className="podium-cash-val font-display">₹30,000</div>
                <ul className="podium-perks-list">
                  <li>✦ ₹30,000 Direct Cash Bounty</li>
                  <li>✦ Silver Laurel of Distinction</li>
                  <li>✦ Sponsor API Credits & Swag</li>
                </ul>
              </div>

              {/* 1st Place Champion Centerpiece */}
              <div 
                className="podium-card podium-rank-1 featured-podium-card"
                onMouseMove={handleCardTilt}
                onMouseLeave={handleCardTiltReset}
                onClick={() => sounds.playChime([523.25, 659.25, 783.99, 1046.5])}
              >
                <div className="podium-radiance-glow" aria-hidden="true" />
                <span className="podium-rank-ribbon font-arcane">🏆 GRAND CHAMPION</span>
                
                <div className="podium-trophy-spotlight">
                  <img 
                    src="/assets/sprites/golden_triwizard_trophy.png" 
                    alt="The Golden Triwizard Cup" 
                    className="podium-triwizard-sprite" 
                  />
                  <img 
                    src="/assets/sprites/golden_laurel_wreath.png" 
                    alt="" 
                    className="podium-laurel-wreath" 
                  />
                </div>

                <h3 className="podium-title font-display">THE TRIWIZARD CUP</h3>
                <span className="podium-sub font-arcane">HEXWARTZ OVERALL CHAMPIONS</span>
                <div className="podium-cash-val font-display gold-cash">₹50,000</div>
                
                <ul className="podium-perks-list">
                  <li>✦ ₹50,000 Direct Cash Prize</li>
                  <li>✦ Physical Golden Triwizard Cup Trophy</li>
                  <li>✦ Direct Fast-Track Incubator Admission</li>
                  <li>✦ Lifetime House Glory in Hogwarts Annals</li>
                </ul>
              </div>

              {/* 3rd Place Podium */}
              <div 
                className="podium-card podium-rank-3"
                onMouseMove={handleCardTilt}
                onMouseLeave={handleCardTiltReset}
                onClick={() => sounds.playWandHum()}
              >
                <span className="podium-rank-ribbon font-arcane">3RD PLACE</span>
                <div className="podium-medal-icon font-display">III</div>
                <h3 className="podium-title font-display">ORDER OF MERLIN</h3>
                <span className="podium-sub font-arcane">3RD CLASS CHAMPION</span>
                <div className="podium-cash-val font-display">₹20,000</div>
                <ul className="podium-perks-list">
                  <li>✦ ₹20,000 Direct Cash Bounty</li>
                  <li>✦ Bronze Laurel of Merit</li>
                  <li>✦ Developer Tooling Subscriptions</li>
                </ul>
              </div>

            </div>

            {/* 4 Track Specific Bounties Grid */}
            <div className="track-bounties-banner">
              <h4 className="track-bounties-title font-arcane">
                <span>✦ 4 HOUSE TRACK BOUNTIES · ₹10,000 EACH (₹40,000 TOTAL) ✦</span>
              </h4>
              <div className="track-bounties-grid">
                <div className="track-bounty-item">
                  <span className="track-bounty-house font-arcane">GRYFFINDOR</span>
                  <span className="track-bounty-role font-display">BEST AI / ML</span>
                  <span className="track-bounty-amt font-mono">₹10,000</span>
                </div>
                <div className="track-bounty-item">
                  <span className="track-bounty-house font-arcane">RAVENCLAW</span>
                  <span className="track-bounty-role font-display">BEST HEALTHCARE</span>
                  <span className="track-bounty-amt font-mono">₹10,000</span>
                </div>
                <div className="track-bounty-item">
                  <span className="track-bounty-house font-arcane">HUFFLEPUFF</span>
                  <span className="track-bounty-role font-display">BEST SDG PROTOTYPE</span>
                  <span className="track-bounty-amt font-mono">₹10,000</span>
                </div>
                <div className="track-bounty-item">
                  <span className="track-bounty-house font-arcane">SLYTHERIN</span>
                  <span className="track-bounty-role font-display">BEST OPEN INNOVATION</span>
                  <span className="track-bounty-amt font-mono">₹10,000</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 12: THE RESTRICTED SECTION · ENCHANTED FAQ
            ========================================================================= */}
        <div className="section-divider-glow" aria-hidden="true" />
        <section id="faq" className="faq-section swoosh-right">
          <div className="container">
            <div className="section-unified-header">
              <div className="section-unified-eyebrow font-arcane">
                <BookOpen size={14} className="gold-spark" />
                <span>HOGWARTS LIBRARY ARCHIVES · RESTRICTED REPOSITORIES</span>
                <BookOpen size={14} className="gold-spark" />
              </div>
              <h2 className="section-block-title font-display">
                <span className="title-gold">RESTRICTED SECTION</span>
                <span className="title-white">FAQ</span>
              </h2>
              <p className="section-unified-subtitle">
                Essential knowledge for every collegiate fellowship preparing to cross the threshold of HexWartz. Click any question parchment to unroll its answers.
              </p>
            </div>

            <div className="faq-list">
              {FAQ_DATA.map((faq, idx) => {
                const isOpen = expandedFaq === idx;

                return (
                  <div 
                    key={idx} 
                    className={`faq-card ${isOpen ? 'open' : ''}`}
                  >
                    <button 
                      className="faq-question-btn font-arcane"
                      onClick={() => {
                        sounds.playWandHum();
                        setExpandedFaq(isOpen ? null : idx);
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Scroll size={18} color="var(--accent-gold-bright)" />
                        <span>{faq.q}</span>
                      </span>
                      <ChevronDown 
                        size={20} 
                        style={{ 
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s ease',
                          color: 'var(--accent-gold-bright)',
                          flexShrink: 0
                        }} 
                      />
                    </button>

                    {isOpen && (
                      <div className="faq-answer-pane">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      </main>

      {/* =========================================================================
          SECTION 13: THE MARAUDER'S FOOTER
          ========================================================================= */}
      <footer className="footer-section reveal-on-scroll">
        <div className="container">
          <div className="footer-inner">
            <a 
              href="#top" 
              className="brand-link" 
              onClick={(e) => scrollToSection(e, '#top')} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}
            >
              <img 
                src="/assets/sprites/hexwartz_logo_castle.png" 
                alt="HexWartz Castle Logo" 
                className="brand-logo-img" 
                style={{ height: '52px', filter: 'drop-shadow(0 0 16px rgba(242, 190, 66, 0.4))' }} 
              />
            </a>

            <div className="footer-coordinates font-arcane">
              <Compass size={14} color="var(--accent-gold-bright)" />
              <span>27.1767° N, 78.0081° E · Sharda University Campus, Agra, Uttar Pradesh</span>
            </div>

            <p className="footer-motto font-arcane">
              "Where code meets magic. Choose your House. Build your spell."
            </p>

            <div className="footer-oath font-display">
              "🐾 I SOLEMNLY SWEAR THAT I WAS UP TO NO GOOD · MISCHIEF MANAGED."
            </div>

            <p className="footer-copy font-mono">
              © 2026 HEXWARTZ HACKATHON · ALL WIZARDING RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>

      {/* REGISTRATION MODAL (The Sorting Hat Experience) */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <img src="/assets/sprites/hexwartz_logo_crest.png" alt="HexWartz Tournament Crest" style={{ height: '68px', margin: '0 auto 12px', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(242, 190, 66, 0.5))' }} />
            <h3 className="modal-title font-display">ACCEPT YOUR INVITATION</h3>
            <p className="modal-sub">HEXWARTZ · SHARDA UNIVERSITY AGRA · 13–14 NOV 2026</p>

            {/* Sorting Hat Dialogue */}
            <div className="sorting-dialogue-box">
              <Scroll size={24} className="sorting-dialogue-icon" />
              <p className="sorting-dialogue-text">
                "Choose your House, form a team of 4–6, and begin with the free online PPT round on Unstop. Shortlisted teams are invited to the offline final in Agra."
              </p>
            </div>

            {submitted ? (
              <div style={{ padding: '16px 0', textAlign: 'center' }}>
                <Sparkles size={48} color="var(--accent-gold-bright)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--accent-gold-bright)', lineHeight: 1 }}>
                  OWL EN ROUTE TO {formData.wizardName.toUpperCase() || 'WIZARD'}!
                </h4>
                <p style={{ color: 'var(--fg-base)', marginTop: '8px', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  Your official Hogwarts Acceptance Parchment & Express Pass have been issued.
                </p>

                {/* 3D HexWartz Express Ticket Pass */}
                <div className="ticket-pass-card">
                  <div className="ticket-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src="/assets/sprites/hogwarts_express_train.png" alt="Hogwarts Express" className="ticket-express-sprite" />
                      <div>
                        <span className="ticket-field-label">ORIGIN & PLATFORM</span>
                        <div className="ticket-platform-tag">PLATFORM 9¾ · KINGS CROSS</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="ticket-field-label">DESTINATION</span>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--fg-bright)' }}>
                        HOGWARTS CASTLE
                      </div>
                    </div>
                  </div>

                  <div className="ticket-body-grid">
                    <div>
                      <span className="ticket-field-label">PASSENGER / WIZARD</span>
                      <div className="ticket-field-val">{formData.wizardName.toUpperCase() || 'HARRY POTTER'}</div>
                    </div>
                    <div>
                      <span className="ticket-field-label">ALLOCATED HOUSE</span>
                      <div className="ticket-field-val" style={{ color: 'var(--accent-gold-bright)' }}>
                        {formData.house.toUpperCase()}
                      </div>
                    </div>

                    <div>
                      <span className="ticket-field-label">CHOSEN TRACK</span>
                      <div style={{ fontSize: '0.92rem', color: 'var(--fg-base)', marginTop: '2px' }}>
                        {formData.projectTrack}
                      </div>
                    </div>
                    <div>
                      <span className="ticket-field-label">WAND CORE</span>
                      <div style={{ fontSize: '0.88rem', color: 'var(--fg-base)', marginTop: '2px' }}>
                        {formData.wandType}
                      </div>
                    </div>
                  </div>

                  {/* Barcode & Token */}
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="ticket-field-label">SECURITY HASH</span>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-gold-bright)' }}>
                        #HEX-9742-WIZ-2026
                      </div>
                    </div>

                    <div className="ticket-barcode" aria-hidden="true">
                      {[4, 2, 6, 3, 5, 2, 4, 6, 2, 5, 3, 4, 6, 2, 4].map((h, i) => (
                        <div key={i} className="barcode-bar" style={{ width: `${(i % 3) + 2}px`, height: `${h * 7}px` }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                  <button 
                    className="btn-primary-gold"
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                    onClick={() => {
                      navigator.clipboard?.writeText(`HEXWARTZ-PASS: ${formData.wizardName} | House: ${formData.house} | Token: #HEX-9742-WIZ-2026`);
                      setTicketCopied(true);
                      sounds.playChime();
                      setTimeout(() => setTicketCopied(false), 2400);
                    }}
                  >
                    {ticketCopied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{ticketCopied ? 'TICKET COPIED!' : 'COPY TICKET PASS'}</span>
                  </button>

                  <button 
                    className="btn-white"
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                    onClick={() => {
                      setSubmitted(false);
                      setModalOpen(false);
                    }}
                  >
                    RETURN TO GROUNDS
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">WIZARD NAME</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Harry Potter"
                    className="form-input"
                    value={formData.wizardName}
                    onChange={(e) => setFormData({ ...formData, wizardName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">OWL POST (EMAIL)</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="harry@hexwartz.edu"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CHOOSE YOUR HOUSE</label>
                  <select 
                    className="form-select"
                    value={formData.house}
                    onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                  >
                    <option value="Gryffindor">🦁 Gryffindor (Courage & Audacity)</option>
                    <option value="Ravenclaw">🦅 Ravenclaw (Wisdom & Algorithmic Wit)</option>
                    <option value="Slytherin">🐍 Slytherin (Ambition & Resourcefulness)</option>
                    <option value="Hufflepuff">🦡 Hufflepuff (Loyalty & Dedication)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">WAND CORE</label>
                  <select 
                    className="form-select"
                    value={formData.wandType}
                    onChange={(e) => setFormData({ ...formData, wandType: e.target.value })}
                  >
                    <option value="Phoenix Feather">Phoenix Feather (Rare & Powerful Initiative)</option>
                    <option value="Dragon Heartstring">Dragon Heartstring (High Energy & Speed)</option>
                    <option value="Unicorn Hair">Unicorn Hair (Consistent & Reliable Output)</option>
                    <option value="Thestral Hair">Thestral Hair (Spatial & Unconventional Genius)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">CHOSEN TRACK</label>
                  <select 
                    className="form-select"
                    value={formData.projectTrack}
                    onChange={(e) => setFormData({ ...formData, projectTrack: e.target.value })}
                  >
                    <option value="Grand Triwizard Cup">🏆 Grand Triwizard Cup (Overall Best Hack)</option>
                    <option value="Defense Against Dark Arts">🛡️ Defense Against Dark Arts (Cybersecurity)</option>
                    <option value="UI Charms">✨ Charms & UI Magic (Frontend/Creative)</option>
                    <option value="Potions Backend">🧪 Potions & Backend Alchemy</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary-gold" style={{ width: '100%', marginTop: '12px' }}>
                  ENROLL FOR TOURNAMENT
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          THE ROOM OF REQUIREMENT (SECRET VAULT MODAL)
          ========================================================================= */}
      {vaultModalOpen && (
        <div className="secret-vault-modal" onClick={() => setVaultModalOpen(false)}>
          <div className="secret-vault-box" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn"
              onClick={() => setVaultModalOpen(false)}
              aria-label="Close Vault"
            >
              <X size={24} />
            </button>

            <img src="/assets/sprites/flying_key_golden.png" alt="Golden Flying Key" style={{ height: '48px', margin: '0 auto 10px', display: 'block', filter: 'drop-shadow(0 0 12px rgba(242, 190, 66, 0.7))' }} />
            <Unlock size={44} color="var(--accent-gold-bright)" style={{ margin: '0 auto 12px' }} />
            <h3 className="secret-vault-title">THE ROOM OF REQUIREMENT</h3>
            <p className="secret-vault-desc">
              You have cast <em>Alohomora</em> and breached the inner sanctuary of HexWartz. 
              Here lie the ancient developer cheat codes, hidden easter eggs, and arcane CLI keys.
            </p>

            <div 
              className="secret-code-pill"
              onClick={() => {
                navigator.clipboard?.writeText('HEXWARTZ_500_GALLEONS');
                setCopiedCheatCode(true);
                sounds.playPoints();
                setHousePoints(prev => prev + 500);
                setTimeout(() => setCopiedCheatCode(false), 2500);
              }}
              title="Click to copy secret cheat code & claim +500 House Points!"
            >
              {copiedCheatCode ? '✓ REDEEMED +500 POINTS!' : 'CODE: HEXWARTZ_500_GALLEONS (CLICK TO REDEEM)'}
            </div>

            <div style={{ textAlign: 'left', background: 'var(--bg-dark)', padding: '16px', borderRadius: '6px', fontSize: '0.86rem', color: 'var(--fg-base)', lineHeight: 1.6, border: '1px solid var(--border-stone)' }}>
              <div>🪄 <strong>Wand Cursor:</strong> Move your wand over the page to guide ambient Lumos stardust.</div>
              <div>⚡ <strong>Snitch Hunter:</strong> Locate the 3D Golden Snitch on Day 3 of the schedule for +150 bonus points.</div>
              <div>🐾 <strong>Marauder Telemetry:</strong> Keep the map open to watch real-time Hogwarts commit activity.</div>
              <div>⌨️ <strong>Terminal Access:</strong> Press <code>Ctrl + Shift + H</code> in the CRT monitor to view repo branches.</div>
            </div>

            <button 
              className="btn-primary-gold" 
              style={{ marginTop: '20px', padding: '10px 24px' }}
              onClick={() => setVaultModalOpen(false)}
            >
              CONCEAL ROOM & RETURN
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          FLOATING WAND SPELL CASTER DOCK (BOTTOM CENTER)
          ========================================================================= */}
      <div className="spell-caster-dock">
        {spellBannerText && (
          <div className="spell-banner">
            <Sparkles size={16} />
            <span>{spellBannerText}</span>
          </div>
        )}

        <div className="spell-dock-inner">
          <div className="spell-dock-title">
            <Wand2 size={15} color="var(--accent-gold-bright)" />
            <span>CAST SPELL</span>
          </div>

          <button 
            className={`spell-btn ${activeSpell === 'lumos' ? 'active' : ''}`}
            onClick={() => castSpell('lumos')}
            title="Lumos: Illuminate & summon golden aura (+10 pts)"
          >
            <Sun size={15} />
            <span className="spell-btn-label">LUMOS</span>
          </button>

          <button 
            className={`spell-btn incendio ${activeSpell === 'incendio' ? 'active' : ''}`}
            onClick={() => castSpell('incendio')}
            title="Incendio: Ignite fiery spark trail (+10 pts)"
          >
            <Flame size={15} />
            <span className="spell-btn-label">INCENDIO</span>
          </button>

          <button 
            className={`spell-btn patronus ${activeSpell === 'patronus' ? 'active' : ''}`}
            onClick={() => castSpell('patronus')}
            title="Expecto Patronum: Ethereal silver-cyan guardian wave (+25 pts)"
          >
            <Sparkles size={15} />
            <span className="spell-btn-label">PATRONUS</span>
          </button>

          <button 
            className="spell-btn"
            onClick={() => castSpell('alohomora')}
            title="Alohomora: Unlock Room of Requirement secret vault (+15 pts)"
          >
            <Unlock size={15} />
            <span className="spell-btn-label">ALOHOMORA</span>
          </button>

          <button 
            className={`spell-btn ${activeSpell === 'nox' ? 'active' : ''}`}
            onClick={() => castSpell('nox')}
            title="Nox: Extinguish wand light"
          >
            <Moon size={15} />
            <span className="spell-btn-label">NOX</span>
          </button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
