import React, { useEffect, useState, useRef } from 'react';
import './index.css';

const AmbientBackground = () => (
  <div className="ambient">
    <div className="drift" style={{ top: '18%', left: '22%', width: '5px', height: '5px' }}></div>
    <div className="drift" style={{ top: '62%', left: '78%', width: '4px', height: '4px' }}></div>
    <div className="drift" style={{ top: '40%', left: '85%' }}></div>
  </div>
);

const useDecipherText = (text) => {
  const [displayText, setDisplayText] = useState(text);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((char, index) => {
        if(index < iterations || char === ' ') return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if(iterations >= text.length) clearInterval(interval);
      iterations += 1/2;
    }, 30);
    return () => clearInterval(interval);
  }, [isInView, text]);

  return { ref, displayText };
};

const DecipherHeader = ({ text, Tag = "h2" }) => {
  const { ref, displayText } = useDecipherText(text);
  return <Tag ref={ref}>{displayText}</Tag>;
};

const NAV_LINKS = [
  { label: 'CAPABILITIES', href: '#capabilities',   id: 'capabilities' },
  { label: 'APPROACH',     href: '#block-approach', id: 'block-approach' },
  { label: 'WORK',         href: '#projects-intro', id: 'projects-intro' },
  { label: 'EXPERTISE',   href: '#expertise',      id: 'expertise' },
  { label: 'CONTACT',     href: '#contact',        id: 'contact' },
];

const Header = ({ currentBlock }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 50); setMenuOpen(false); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map(l => l.id);
    const observers = [];
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header id="siteHeader" className={scrolled ? 'scrolled' : ''}>
      <div className="inner" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <a href="#block-0" className="mark" onClick={e => handleNav(e, '#block-0')}>TOLU<span>·</span>KING</a>
        <nav className="header-nav">
          {NAV_LINKS.map(l => (
            <a
              key={l.label}
              href={l.href}
              className={`nav-link${activeId === l.id ? ' active' : ''}`}
              onClick={e => handleNav(e, l.href)}
            >{l.label}</a>
          ))}
        </nav>
        <button className="nav-hamburger" aria-label="Menu" onClick={() => setMenuOpen(o => !o)}>
          <span /><span /><span />
        </button>
        <div id="blockCounter">BLOCK 000{currentBlock} / 0006</div>
      </div>
      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className={`mobile-link${activeId === l.id ? ' active' : ''}`} onClick={e => handleNav(e, l.href)}>{l.label}</a>
          ))}
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  const [tickerText, setTickerText] = useState("");
  const fullText = "SYSTEMS ONLINE. ALL NODES NOMINAL. READY TO SCALE.";
  const heroRef = useRef(null);

  useEffect(() => {
    let i = 0;
    let timeoutId;
    const typeWriter = () => {
      if (i < fullText.length) {
        setTickerText(fullText.substring(0, i + 1));
        i++;
        timeoutId = setTimeout(typeWriter, 50);
      }
    };
    timeoutId = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const moveX = (e.clientX - window.innerWidth / 2) / 60;
    const moveY = (e.clientY - window.innerHeight / 2) / 60;
    heroRef.current.style.setProperty('--px', `${moveX}px`);
    heroRef.current.style.setProperty('--py', `${moveY}px`);
  };

  return (
    <section className="hero block" id="block-0" ref={heroRef} onMouseMove={handleMouseMove}>
      <div className="inner">
        <div style={{ transform: 'translate(calc(var(--px,0) * -1), calc(var(--py,0) * -1))', transition: 'transform 0.1s ease-out' }}>
          <div className="eyebrow">BLOCK 0000 · GENESIS</div>
          <div className="name-tag">Tolu King — <b>Systems Engineer & Infrastructure Architect</b></div>
          <h1>I design and build <br /><em>scalable systems</em><br />that power modern businesses.</h1>
          <p className="sub">
            My work spans fintech infrastructure, enterprise platforms, workflow automation, CRM systems, Web3 infrastructure, and distributed applications. I focus on translating complex business requirements into resilient, secure, and scalable software systems.
          </p>
          <div className="ticker-wrap"><span id="tickerText">{tickerText}</span><span className="cursor">▌</span></div>
          <div className="cta-row">
            <a href="#capabilities" className="btn primary">View Capabilities</a>
            <a href="#contact" className="btn ghost">Get in Touch</a>
          </div>
        </div>
        <div className="photo-frame" style={{ transform: 'translate(calc(var(--px,0) * 1.5), calc(var(--py,0) * 1.5))', transition: 'transform 0.1s ease-out' }}>
          <div className="frame-corners"></div>
          <img src="/assets/profile1.jpg" alt="Tolu King" onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzODAiIGhlaWdodD0iNDc1IiBmaWxsPSIjMEYxMzIwIiBvcGFjaXR5PSIwLjUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iIzhCOTNBNyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBsZWNlaG9sZGVyOiBJbnNlcnQgcHJvZmlsZTEuanBnPC90ZXh0Pjwvc3ZnPg=='} />
          <div className="frame-overlay"></div>
          <div className="frame-badge">ID: SYS-ARCH-001</div>
          <div className="frame-status"><span className="status-dot"></span>IDENTITY VERIFIED</div>
        </div>
      </div>
    </section>
  );
};

const Capabilities = () => {
  return (
    <>
      <section id="capabilities" className="layer-intro block" id="block-intro">
        <div className="inner">
          <DecipherHeader text="What I Do" />
          <p>Rather than simply building applications, I engineer the underlying systems that enable organizations to operate efficiently, process transactions reliably, manage customers effectively, and scale with confidence.</p>
        </div>
      </section>

      <section>
        <div className="inner chain-wrap">
          <div className="chain-packet"></div>
          <div className="chain-fill" id="chainFill"></div>

          <div className="block" id="block-1">
            <div className="node"></div>
            <div>
              <div className="block-head">
                <div className="block-num">BLOCK 0001</div>
                <h3>Systems Architecture</h3>
              </div>
              <p>Designing robust software architectures, service boundaries, data flows, and communication patterns for high-growth products and enterprise platforms.</p>
            </div>
          </div>

          <div className="block cloud" id="block-2">
            <div className="node"></div>
            <div>
              <div className="block-head">
                <div className="block-num">BLOCK 0002</div>
                <h3>Fintech Infrastructure</h3>
              </div>
              <p>Building payment systems, digital wallets, transaction processing platforms, settlement workflows, reconciliation systems, and financial ledgers.</p>
            </div>
          </div>

          <div className="block" id="block-3">
            <div className="node"></div>
            <div>
              <div className="block-head">
                <div className="block-num">BLOCK 0003</div>
                <h3>Enterprise Systems & Workflow</h3>
              </div>
              <p>Developing CRM solutions, workflow automation platforms, customer onboarding systems, and operational software tailored to business needs.</p>
            </div>
          </div>

          <div className="block cloud" id="block-4">
            <div className="node"></div>
            <div>
              <div className="block-head">
                <div className="block-num">BLOCK 0004</div>
                <h3>Web3 Infrastructure</h3>
              </div>
              <p>Architecting blockchain integrations, wallet infrastructure, digital asset platforms, smart contract systems, and decentralized applications.</p>
            </div>
          </div>

          <div className="block" id="block-5">
            <div className="node"></div>
            <div>
              <div className="block-head">
                <div className="block-num">BLOCK 0005</div>
                <h3>Platform Engineering</h3>
              </div>
              <p>Designing scalable APIs, microservice ecosystems, event-driven architectures, and cloud-native platforms that support long-term growth.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const Approach = () => {
  return (
    <>
      <section className="layer-intro block" id="block-approach">
        <div className="inner">
          <DecipherHeader text="My Approach" />
          <p>Every system begins with understanding the business. Technology is selected based on business outcomes—not trends.</p>
        </div>
      </section>

      <section>
        <div className="inner chain-wrap">
          <div className="block" id="block-6">
            <div className="about-grid">
              <div>
                <div className="block-head">
                  <div className="block-num">BEFORE WRITING CODE</div>
                  <h3>I focus on:</h3>
                </div>
                <div className="tags" style={{ marginBottom: '30px' }}>
                  <span className="tag">Business capabilities</span>
                  <span className="tag">User workflows</span>
                  <span className="tag">Data models</span>
                  <span className="tag">System reliability</span>
                  <span className="tag">Scalability requirements</span>
                  <span className="tag">Security considerations</span>
                  <span className="tag">Operational efficiency</span>
                </div>

                <div className="block-head">
                  <div className="block-num">CORE PRINCIPLES</div>
                  <h3>Engineering Philosophy</h3>
                </div>
                <p>I believe the best systems are not only technically sound but also aligned with the goals of the organizations they serve.</p>

                <div className="hash-row" style={{ flexWrap: 'wrap', marginTop: '15px' }}>
                  <span className="hash">Reliability over complexity</span> <span className="confirm-tick">✓</span>
                  <span className="hash">Scalability by design</span> <span className="confirm-tick">✓</span>
                  <span className="hash">Security as a foundation</span> <span className="confirm-tick">✓</span>
                  <span className="hash">Maintainability over shortcuts</span> <span className="confirm-tick">✓</span>
                  <span className="hash">Business-first engineering</span> <span className="confirm-tick">✓</span>
                </div>
              </div>
              <div className="photo-frame small treated">
                <img src="/assets/profile2.jpg" alt="Tolu King" onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMEYxMzIwIiBvcGFjaXR5PSIwLjUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iIzhCOTNBNyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBsZWNlaG9sZGVyOiBJbnNlcnQgcHJvZmlsZTIuanBnPC90ZXh0Pjwvc3ZnPg=='} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const PROJECTS = [
  {
    id: 'DEPLOY-001',
    title: 'AsterDex — APEX Protocol',
    desc: 'Autonomous DeFi yield protocol on BNB Chain with an on-chain "APEXBrain" regime engine that dynamically splits capital across staking and buffer strategies to hedge impermanent loss.',
    tags: ['Solidity', 'Next.js 14', 'The Graph', 'Wagmi v2', 'ERC-4626'],
    domain: 'DEFI · BNB CHAIN',
    cobalt: false,
  },
  {
    id: 'DEPLOY-002',
    title: 'OPoll Social',
    desc: 'Web3 social prediction platform with binary and multi-outcome markets, real-time order books, live video streaming, and embedded wallet authentication via Privy.',
    tags: ['Next.js 14', 'Privy Auth', 'Socket.io', 'Wagmi v2', 'Zustand'],
    domain: 'WEB3 · SOCIAL',
    cobalt: true,
  },
  {
    id: 'DEPLOY-003',
    title: 'Summit Building Products',
    desc: 'Enterprise Salesforce implementation spanning Loyalty Management, Rebate Management, Warranty Lifecycle, and an Experience Cloud contractor portal with role-based access control.',
    tags: ['Salesforce SFDX', 'Apex', 'LWC', 'DPE', 'DocuSign API'],
    domain: 'ENTERPRISE · CRM',
    cobalt: false,
  },
  {
    id: 'DEPLOY-004',
    title: 'Aster Circuit',
    desc: 'Production-grade multi-chain token system using LayerZero V2 cross-chain messaging, OFT standards, and UUPS upgradeable proxy patterns deployed across BSC, Base, Ethereum, Sonic, and Polygon.',
    tags: ['Solidity', 'Foundry', 'LayerZero V2', 'OpenZeppelin', 'CREATE2'],
    domain: 'WEB3 · MULTI-CHAIN',
    cobalt: true,
  },
  {
    id: 'DEPLOY-005',
    title: 'Limiance Launchpad',
    desc: 'Web3 IDO token launchpad on Binance Smart Chain with smart contract-gated presale pools, vesting schedules, multi-tier whitelisting, and a Next.js investor dashboard.',
    tags: ['Next.js 14', 'Solidity', 'BSC', 'Wagmi v2', 'Hardhat'],
    domain: 'WEB3 · LAUNCHPAD',
    cobalt: false,
  },
];

const Projects = () => {
  const cardsRef = useRef([]);

  const handleMouseMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-in'); }),
      { threshold: 0.12 }
    );
    cardsRef.current.forEach(card => card && observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="layer-intro block" id="projects-intro">
        <div className="inner">
          <DecipherHeader text="Recent Deployments" />
          <p>A selection of systems I've architected and built — spanning DeFi infrastructure, enterprise platforms, Web3 protocols, and social applications.</p>
        </div>
      </section>
      <section className="projects">
        <div className="inner">
          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                className={`project-card${p.cobalt ? ' cobalt' : ''}`}
                ref={el => cardsRef.current[i] = el}
                onMouseMove={handleMouseMove}
              >
                <div className="proj-title">{p.title}</div>
                <p className="proj-desc">{p.desc}</p>
                <div className="proj-tags">
                  {p.tags.map(t => <span key={t} className="proj-tag">{t}</span>)}
                </div>
                <div className="proj-footer">
                  <span className="proj-domain">{p.domain}</span>
                  <span className="proj-btn">&gt;_ VIEW ARCHITECTURE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const Expertise = () => {
  const handleMouseMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section className="balance block" id="expertise">
      <div className="inner">
        <div className="balance-grid">
          <div className="balance-col" onMouseMove={handleMouseMove}>
            <h4>SELECTED AREAS OF EXPERTISE - I</h4>
            <div className="balance-row"><span>Distributed Systems</span><span>Architecture</span></div>
            <div className="balance-row"><span>Event-Driven Architecture</span><span>Design</span></div>
            <div className="balance-row"><span>API Design</span><span>Development</span></div>
            <div className="balance-row"><span>Microservices</span><span>Architecture</span></div>
            <div className="balance-row"><span>Cloud Infrastructure</span><span>Deployment</span></div>
            <div className="balance-row"><span>System Design</span><span>Architecture</span></div>
          </div>
          <div className="balance-col cloud" onMouseMove={handleMouseMove}>
            <h4>SELECTED AREAS OF EXPERTISE - II</h4>
            <div className="balance-row"><span>Fintech Platforms</span><span>Domain</span></div>
            <div className="balance-row"><span>Enterprise Software</span><span>Domain</span></div>
            <div className="balance-row"><span>Workflow Automation</span><span>Domain</span></div>
            <div className="balance-row"><span>CRM Systems</span><span>Domain</span></div>
            <div className="balance-row"><span>Web3 Infrastructure</span><span>Domain</span></div>
            <div className="balance-row"><span>Data Architecture</span><span>Design</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [showMsg, setShowMsg] = useState(false);

  return (
    <section className="contact block" id="contact">
      <div className="inner contact-grid">
        <div>
          <h2>I build systems that solve real business problems and create lasting operational advantages.</h2>
          <p>Let's discuss how we can scale your infrastructure.</p>
          <div className="contact-links">
            <a href="mailto:hello@toluking.com">hello@toluking.com</a>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
          </div>
        </div>
        <form id="contactForm" onSubmit={(e) => { e.preventDefault(); setShowMsg(true); }}>
          <div className="field">
            <label>SYSTEM QUERY / MESSAGE</label>
            <textarea rows="4" placeholder="How can I help you scale?"></textarea>
          </div>
          <div className="field">
            <label>CONTACT PACKET (EMAIL)</label>
            <input type="email" placeholder="your@email.com" />
          </div>
          <button type="submit" className="submit-btn">INITIALIZE HANDSHAKE</button>
          <div className={`confirm-msg ${showMsg ? 'show' : ''}`}>PACKET TRANSMITTED. EXPECT A RESPONSE SHORTLY.</div>
        </form>
      </div>
      <footer>
        <div className="inner">
          STATUS: ONLINE &nbsp;|&nbsp; LOCATION: GLOBAL &nbsp;|&nbsp; © {new Date().getFullYear()} TOLU KING
        </div>
      </footer>
    </section>
  );
};

function App() {
  const [currentBlock, setCurrentBlock] = useState(0);

  useEffect(() => {
    // Intersection Observer for animations and block counting
    const blocks = document.querySelectorAll('.block');
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const blockObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          const blockId = entry.target.id;
          if (blockId && blockId.startsWith('block-')) {
            const blockNum = parseInt(blockId.split('-')[1]);
            if (!isNaN(blockNum) && blockNum <= 6) {
              setCurrentBlock(blockNum);
            }
          }
        }
      });
    }, observerOptions);

    blocks.forEach(block => blockObserver.observe(block));

    // Chain Fill Scroll Effect
    const handleScroll = () => {
      const chainFill = document.getElementById('chainFill');
      const chainWrap = document.querySelector('.chain-wrap');
      
      if (chainFill && chainWrap) {
        const rect = chainWrap.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const startScroll = rect.top - (windowHeight / 2);
        const totalHeight = rect.height;
        let fillPercentage = 0;
        
        if (startScroll < 0) {
          fillPercentage = Math.abs(startScroll) / totalHeight * 100;
          fillPercentage = Math.min(100, Math.max(0, fillPercentage));
        }
        chainFill.style.height = `${fillPercentage}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      blockObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <AmbientBackground />
      <Header currentBlock={currentBlock} />
      <Hero />
      <Capabilities />
      <Approach />
      <Projects />
      <Expertise />
      <Contact />
    </>
  );
}

export default App;
