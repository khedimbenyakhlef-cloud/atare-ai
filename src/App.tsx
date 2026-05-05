import React, { useState, useEffect, createContext, useContext } from 'react';
import { translations, LANGUAGES, LangKey } from './i18n/translations';

// ═══════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════
interface AppContextType {
  lang: LangKey;
  setLang: (l: LangKey) => void;
  t: typeof translations['fr'];
  dir: 'ltr' | 'rtl';
  user: any;
  setUser: (u: any) => void;
  token: string;
  setToken: (t: string) => void;
}
const AppContext = createContext<AppContextType>({} as AppContextType);
export const useApp = () => useContext(AppContext);

// ═══════════════════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════════════════
const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export async function apiCall(path: string, options: RequestInit = {}, token?: string) {
  const headers: any = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ═══════════════════════════════════════════════════════════
// LOGO SVG COMPONENT
// ═══════════════════════════════════════════════════════════
function Logo({ size = 48, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2d5a27" />
            <stop offset="100%" stopColor="#1a3a15" />
          </radialGradient>
          <radialGradient id="leaf" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#7ecb3e" />
            <stop offset="100%" stopColor="#3a8a1e" />
          </radialGradient>
        </defs>
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="url(#bg)" stroke="#c9a227" strokeWidth="2.5" />
        {/* Arabic calligraphy style crescent */}
        <path d="M 50 20 Q 30 25 26 50 Q 30 75 50 80 Q 38 70 36 50 Q 38 30 50 20 Z" fill="#c9a227" opacity="0.8" />
        {/* Main leaf */}
        <path d="M 52 15 Q 80 35 75 58 Q 68 75 52 82 Q 68 65 65 50 Q 62 35 52 15 Z" fill="url(#leaf)" />
        {/* Secondary leaf */}
        <path d="M 52 25 Q 40 40 42 58 Q 44 70 52 78 Q 44 62 46 50 Q 47 38 52 25 Z" fill="#5cb832" opacity="0.7" />
        {/* Stem */}
        <line x1="52" y1="82" x2="52" y2="92" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round" />
        {/* Roots */}
        <path d="M 52 92 Q 42 95 38 98" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 52 92 Q 62 95 66 98" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Star dot */}
        <circle cx="70" cy="30" r="3" fill="#c9a227" />
        <circle cx="28" cy="65" r="2" fill="#c9a227" opacity="0.6" />
      </svg>
      {withText && (
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontFamily: "'Cinzel', serif", color: '#c9a227', fontWeight: 700, fontSize: size * 0.35 }}>
            El 3atare
          </div>
          <div style={{ fontFamily: "'Amiri', serif", color: '#7ecb3e', fontSize: size * 0.28, direction: 'rtl' }}>
            العطار
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LANGUAGE SWITCHER
// ═══════════════════════════════════════════════════════════
function LangSwitcher() {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === lang)!;
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={styles.langBtn}>
        {current.flag} {current.label}
        <span style={{ marginLeft: 4, fontSize: 10 }}>▼</span>
      </button>
      {open && (
        <div style={styles.langDropdown}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
              style={{ ...styles.langOption, background: l.code === lang ? '#2d5a27' : 'transparent' }}>
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════
function Navbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const { t, user } = useApp();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav style={{ ...styles.navbar, background: scrolled ? 'rgba(15,30,12,0.98)' : 'rgba(15,30,12,0.85)', backdropFilter: 'blur(12px)' }}>
      <div style={styles.navInner}>
        <button onClick={() => setPage('home')} style={styles.navLogo}>
          <Logo size={36} withText />
        </button>
        <div style={styles.navLinks}>
          {['home','plants','chat','about'].map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ ...styles.navLink, color: page === p ? '#7ecb3e' : '#d4c9a8', borderBottom: page === p ? '2px solid #7ecb3e' : '2px solid transparent' }}>
              {(t.nav as any)[p]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <LangSwitcher />
          {user ? (
            <div style={styles.userBadge}>👤 {user.username}</div>
          ) : (
            <button onClick={() => setPage('login')} style={styles.loginBtn}>{t.nav.login}</button>
          )}
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════
function HomePage({ setPage }: { setPage: (p: string) => void }) {
  const { t, lang } = useApp();
  const [stats, setStats] = useState({ plants: 0, recipes: 0, languages: 6, certifications: 0 });
  const dir = LANGUAGES.find(l => l.code === lang)?.dir || 'ltr';

  useEffect(() => {
    apiCall('/plants/?limit=1').then(d => setStats(s => ({ ...s, plants: d.total || 20 }))).catch(() => {});
  }, []);

  const features = [
    { icon: '🌿', title: 'Plantes documentées', desc: 'Base de données exhaustive avec noms vernaculaires en 6 langues' },
    { icon: '🤖', title: 'IA Groq multi-modèles', desc: 'Rotation automatique entre les meilleurs LLMs pour maximiser les tokens' },
    { icon: '🔗', title: 'Blockchain Algorand', desc: 'Certification et traçabilité des plantes sur la blockchain' },
    { icon: '📖', title: 'Recettes ancestrales', desc: 'Dosages précis, contre-indications, modes de préparation traditionnels' },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px', direction: dir }}>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
            <Logo size={90} />
          </div>
          <h1 style={styles.heroTitle}>
            <span style={{ color: '#7ecb3e' }}>{t.hero.title}</span>
            <br />
            <span style={{ color: '#c9a227' }}>{t.hero.title2}</span>
          </h1>
          <p style={styles.heroDesc}>{t.hero.desc}</p>
          <div style={{ fontSize: 13, color: '#8dab6f', marginBottom: 32, fontStyle: 'italic' }}>
            {t.founder}
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setPage('chat')} style={styles.heroCta}>{t.hero.cta}</button>
            <button onClick={() => setPage('plants')} style={styles.heroCta2}>{t.hero.cta2}</button>
          </div>
        </div>
        {/* Decorative arabic calligraphy */}
        <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', color: 'rgba(201,162,39,0.15)', fontSize: 120, fontFamily: "'Amiri', serif", userSelect: 'none', zIndex: 1 }}>
          العطار
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { n: stats.plants, label: t.stats.plants },
          { n: 50, label: t.stats.recipes },
          { n: 6, label: t.stats.languages },
          { n: 0, label: t.stats.certifications },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statNum}>{s.n}+</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Notre Approche</h2>
        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Founder section */}
      <div style={styles.founderSection}>
        <div style={styles.founderInner}>
          <div style={styles.founderBadge}>👑</div>
          <h2 style={{ color: '#c9a227', fontFamily: "'Cinzel', serif", fontSize: 22, marginBottom: 12 }}>
            {t.about.founder}
          </h2>
          <p style={{ color: '#d4c9a8', maxWidth: 600, textAlign: 'center', lineHeight: 1.8 }}>
            {t.about.founderDesc}
          </p>
          <div style={{ marginTop: 16, color: '#7ecb3e', fontFamily: "'Cinzel', serif", fontSize: 18, letterSpacing: 2 }}>
            KHEDIM BENYAKHLEF • BENY-JOE
          </div>
        </div>
      </div>

      {/* CTA Chat */}
      <div style={styles.ctaSection}>
        <h2 style={{ color: '#7ecb3e', fontFamily: "'Cinzel', serif", fontSize: 28, marginBottom: 12 }}>
          Consultez El 3attar maintenant
        </h2>
        <p style={{ color: '#d4c9a8', marginBottom: 24 }}>
          Notre IA répond en darija, arabe, français, anglais, allemand et kabyle
        </p>
        <button onClick={() => setPage('chat')} style={{ ...styles.heroCta, fontSize: 18, padding: '14px 40px' }}>
          🌿 Ouvrir le Conseil IA
        </button>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <Logo size={30} withText />
        <div style={{ color: '#6a8a5a', fontSize: 13, marginTop: 16 }}>
          © {new Date().getFullYear()} El 3atare – KHEDIM BENYAKHLEF dit BENY-JOE
          <br />Tous droits réservés – Patrimoine médicinal algérien
        </div>
        <div style={{ color: '#4a6a3a', fontSize: 12, marginTop: 8, fontFamily: "'Amiri', serif", direction: 'rtl' }}>
          العطار – الصيدلية التقليدية الجزائرية
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CHAT PAGE
// ═══════════════════════════════════════════════════════════
interface Message { role: 'user' | 'assistant'; content: string; refs?: any[]; time: string; }

function ChatPage() {
  const { t, lang, token } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.chat.welcome, time: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const dir = LANGUAGES.find(l => l.code === lang)?.dir || 'ltr';

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input, time: new Date().toLocaleTimeString() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const data = await apiCall('/chat/', {
        method: 'POST',
        body: JSON.stringify({ message: input, language: lang })
      }, token);
      const botMsg: Message = {
        role: 'assistant',
        content: data.response,
        refs: data.references,
        time: new Date().toLocaleTimeString()
      };
      setMessages(m => [...m, botMsg]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: '❌ Erreur de connexion. Vérifiez que le backend est démarré.', time: new Date().toLocaleTimeString() }]);
    }
    setLoading(false);
  };

  const QUICK = [
    lang === 'dz' ? 'واش ينفع الشيح للكرش؟' : lang === 'ar' ? 'ما هي فوائد الحلبة؟' : 'Plantes pour les maux de ventre?',
    lang === 'dz' ? 'علاش تنفع حبة السوداء؟' : lang === 'ar' ? 'كيف أستخدم حبة البركة؟' : 'Remèdes pour insomnie?',
    lang === 'dz' ? 'شكون ينفع للزكمة؟' : lang === 'ar' ? 'ما علاج السعال الطبيعي؟' : 'Contre-indications du gingembre?',
  ];

  return (
    <div style={styles.chatPage} dir={dir}>
      {/* Header */}
      <div style={styles.chatHeader}>
        <Logo size={40} withText />
        <div style={{ color: '#8dab6f', fontSize: 13 }}>IA Phytothérapie • Groq Multi-Models</div>
      </div>

      {/* Quick suggestions */}
      {messages.length <= 1 && (
        <div style={styles.quickBtns}>
          {QUICK.map((q, i) => (
            <button key={i} onClick={() => setInput(q)} style={styles.quickBtn}>{q}</button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={styles.messagesArea}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 10, marginBottom: 16, alignItems: 'flex-start' }}>
            <div style={styles[msg.role === 'user' ? 'avatarUser' : 'avatarBot']}>
              {msg.role === 'user' ? '👤' : '🌿'}
            </div>
            <div style={{ maxWidth: '75%' }}>
              <div style={msg.role === 'user' ? styles.bubbleUser : styles.bubbleBot}>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{msg.content}</div>
              </div>
              {msg.refs && msg.refs.length > 0 && (
                <div style={styles.refsBox}>
                  <span style={{ color: '#7ecb3e', fontSize: 12 }}>🌿 {t.chat.references}: </span>
                  {msg.refs.map((r: any, ri: number) => (
                    <span key={ri} style={styles.refBadge}>{r.name}</span>
                  ))}
                </div>
              )}
              <div style={{ fontSize: 11, color: '#5a7a4a', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
            <div style={styles.avatarBot}>🌿</div>
            <div style={{ ...styles.bubbleBot, display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={styles.dot1} /><div style={styles.dot2} /><div style={styles.dot3} />
              <span style={{ color: '#7ecb3e', marginLeft: 8, fontSize: 13 }}>{t.chat.thinking}</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>{t.chat.disclaimer}</div>

      {/* Input */}
      <div style={styles.inputRow}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={t.chat.placeholder}
          rows={2}
          style={styles.chatInput}
          dir={dir}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={styles.sendBtn}>
          {loading ? '⏳' : '🌿'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PLANTS PAGE
// ═══════════════════════════════════════════════════════════
function PlantsPage() {
  const { t, lang } = useApp();
  const [plants, setPlants] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const dir = LANGUAGES.find(l => l.code === lang)?.dir || 'ltr';

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      params.append('limit', '24');
      const data = await apiCall(`/plants/?${params}`);
      setPlants(data.plants || []);
      setTotal(data.total || 0);
    } catch { setPlants([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [search, category]);

  const cats = ['', 'algerian', 'asian', 'mediterranean', 'european', 'tropical'];

  if (selected) return <PlantDetail plant={selected} onBack={() => setSelected(null)} />;

  return (
    <div style={styles.plantsPage} dir={dir}>
      <div style={styles.plantsHeader}>
        <h1 style={styles.plantsTitle}>🌿 {t.plants.search.replace('...', '')}</h1>
        <div style={{ color: '#8dab6f' }}>{total} plantes dans la base</div>
      </div>

      {/* Search & Filter */}
      <div style={styles.searchRow}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.plants.search}
          style={styles.searchInput}
          dir={dir}
        />
        <div style={styles.catButtons}>
          {cats.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ ...styles.catBtn, background: category === c ? '#2d5a27' : '#0f1e0c', borderColor: category === c ? '#7ecb3e' : '#2d5a27', color: category === c ? '#7ecb3e' : '#a0b890' }}>
              {c === '' ? (t.plants.all) : (t.plants as any)[c] || c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#7ecb3e' }}>🌿 Chargement...</div>
      ) : (
        <div style={styles.plantsGrid}>
          {plants.map((p: any) => (
            <PlantCard key={p._id} plant={p} onClick={() => setSelected(p)} />
          ))}
          {plants.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#5a7a4a', padding: 40 }}>
              🌿 Aucune plante trouvée. Essayez un autre terme.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlantCard({ plant, onClick }: { plant: any; onClick: () => void }) {
  const { lang } = useApp();
  const name = plant.common_names?.[lang] || plant.common_names?.dz_darija || plant.common_names?.fr || plant.scientific_name;
  const catColors: any = { algerian: '#2d5a27', asian: '#1a3a5a', mediterranean: '#5a2a1a', european: '#2a2a5a', tropical: '#5a4a0a' };

  return (
    <div onClick={onClick} style={styles.plantCard}>
      <div style={{ background: catColors[plant.category] || '#1a3a15', borderRadius: '8px 8px 0 0', padding: '16px', minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 40 }}>🌿</div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={styles.plantCardName}>{name}</div>
        <div style={styles.plantCardSci}>{plant.scientific_name}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
          {(plant.properties || []).slice(0, 3).map((p: string, i: number) => (
            <span key={i} style={styles.propBadge}>{p}</span>
          ))}
        </div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ ...styles.catBadge, background: catColors[plant.category] || '#1a2a15' }}>
            {plant.category}
          </span>
          {plant.rating > 0 && <span style={{ color: '#c9a227', fontSize: 12 }}>{'★'.repeat(Math.round(plant.rating))} {plant.rating.toFixed(1)}</span>}
        </div>
      </div>
    </div>
  );
}

function PlantDetail({ plant, onBack }: { plant: any; onBack: () => void }) {
  const { lang } = useApp();
  const name = plant.common_names?.[lang] || plant.common_names?.dz_darija || plant.common_names?.fr || plant.scientific_name;
  const dir = LANGUAGES.find(l => l.code === lang)?.dir || 'ltr';
  const usageKey = `usage_instructions_${lang}` as string;
  const usage = plant[usageKey] || plant.usage_instructions || '';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 20px 40px' }} dir={dir}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      <div style={styles.detailCard}>
        <div style={{ background: 'linear-gradient(135deg, #1a3a15, #0f2a0c)', padding: 32, borderRadius: '12px 12px 0 0' }}>
          <div style={{ fontSize: 60, textAlign: 'center', marginBottom: 8 }}>🌿</div>
          <h1 style={{ color: '#7ecb3e', fontFamily: "'Cinzel', serif", textAlign: 'center', fontSize: 28, margin: 0 }}>{name}</h1>
          <div style={{ color: '#8dab6f', textAlign: 'center', fontStyle: 'italic', marginTop: 6 }}>{plant.scientific_name}</div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Names in all languages */}
          <section style={styles.detailSection}>
            <h3 style={styles.detailSectionTitle}>🗣️ Noms dans toutes les langues</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {LANGUAGES.map(l => plant.common_names?.[l.code] && (
                <div key={l.code} style={styles.nameBadge}>
                  <span>{l.flag}</span>
                  <span style={{ color: '#c9a227', fontSize: 12 }}>{l.label}:</span>
                  <span style={{ color: '#d4c9a8', direction: l.dir }}>{plant.common_names[l.code]}</span>
                </div>
              ))}
              {plant.common_names?.latin && (
                <div style={styles.nameBadge}><span>🔬</span><span style={{ color: '#c9a227', fontSize: 12 }}>Latin:</span><span style={{ color: '#d4c9a8', fontStyle: 'italic' }}>{plant.common_names.latin}</span></div>
              )}
            </div>
          </section>

          {/* Properties */}
          <section style={styles.detailSection}>
            <h3 style={styles.detailSectionTitle}>✨ Propriétés</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(plant.properties || []).map((p: string, i: number) => (
                <span key={i} style={{ ...styles.propBadge, padding: '5px 12px', fontSize: 13 }}>{p}</span>
              ))}
            </div>
          </section>

          {/* Indications */}
          <section style={styles.detailSection}>
            <h3 style={styles.detailSectionTitle}>✅ Indications</h3>
            <ul style={styles.detailList}>
              {(plant.indications || []).map((ind: string, i: number) => (
                <li key={i} style={styles.detailListItem}>🌿 {ind}</li>
              ))}
            </ul>
          </section>

          {/* Contraindications */}
          {plant.contraindications?.length > 0 && (
            <section style={styles.detailSection}>
              <h3 style={{ ...styles.detailSectionTitle, color: '#e05555' }}>⚠️ Contre-indications</h3>
              <ul style={styles.detailList}>
                {plant.contraindications.map((c: string, i: number) => (
                  <li key={i} style={{ ...styles.detailListItem, color: '#e09090' }}>⛔ {c}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Dosage */}
          {plant.dosage && (
            <section style={styles.detailSection}>
              <h3 style={styles.detailSectionTitle}>💊 Dosage</h3>
              <div style={styles.dosageCard}>
                {plant.dosage.adult && <div><strong style={{ color: '#c9a227' }}>Adulte:</strong> <span style={{ color: '#d4c9a8' }}>{plant.dosage.adult}</span></div>}
                {plant.dosage.child && <div><strong style={{ color: '#c9a227' }}>Enfant:</strong> <span style={{ color: '#d4c9a8' }}>{plant.dosage.child}</span></div>}
                {plant.dosage.elderly && <div><strong style={{ color: '#c9a227' }}>Personnes âgées:</strong> <span style={{ color: '#d4c9a8' }}>{plant.dosage.elderly}</span></div>}
                {plant.dosage.max_duration && <div><strong style={{ color: '#e09050' }}>Durée max:</strong> <span style={{ color: '#d4c9a8' }}>{plant.dosage.max_duration}</span></div>}
                {plant.dosage.frequency && <div><strong style={{ color: '#c9a227' }}>Fréquence:</strong> <span style={{ color: '#d4c9a8' }}>{plant.dosage.frequency}</span></div>}
              </div>
            </section>
          )}

          {/* Usage Instructions */}
          {usage && (
            <section style={styles.detailSection}>
              <h3 style={styles.detailSectionTitle}>📋 Mode d'emploi</h3>
              <div style={styles.usageBox}>{usage}</div>
            </section>
          )}

          {/* Recipes */}
          {plant.recipes?.length > 0 && (
            <section style={styles.detailSection}>
              <h3 style={styles.detailSectionTitle}>🍵 Recettes Traditionnelles</h3>
              {plant.recipes.map((r: any, i: number) => (
                <div key={i} style={styles.recipeCard}>
                  <h4 style={{ color: '#c9a227', margin: '0 0 8px', fontSize: 16 }}>
                    {r.name_dz || r.name_ar || r.name}
                    {r.name_dz && r.name !== r.name_dz && <span style={{ color: '#7ecb3e', fontSize: 13, marginLeft: 8 }}>({r.name})</span>}
                  </h4>
                  <div style={{ color: '#8dab6f', fontSize: 13, marginBottom: 8 }}>
                    🎯 <em>{r.indication}</em>
                  </div>
                  <div style={{ color: '#c9a227', fontSize: 13, marginBottom: 4 }}>Ingrédients:</div>
                  <ul style={{ margin: '0 0 10px', paddingLeft: 20 }}>
                    {r.ingredients?.map((ing: string, ii: number) => (
                      <li key={ii} style={{ color: '#d4c9a8', fontSize: 13 }}>{ing}</li>
                    ))}
                  </ul>
                  <div style={{ color: '#c9a227', fontSize: 13, marginBottom: 4 }}>Préparation:</div>
                  <p style={{ color: '#d4c9a8', fontSize: 13, margin: '0 0 8px' }}>{r.preparation}</p>
                  {r.duration && <div style={{ color: '#7ecb3e', fontSize: 12 }}>⏱️ Durée: {r.duration}</div>}
                </div>
              ))}
            </section>
          )}

          {/* Drug interactions */}
          {plant.drug_interactions?.length > 0 && (
            <section style={styles.detailSection}>
              <h3 style={{ ...styles.detailSectionTitle, color: '#e09050' }}>💊 Interactions médicamenteuses</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {plant.drug_interactions.map((d: string, i: number) => (
                  <span key={i} style={{ background: '#3a1a0a', color: '#e09050', padding: '4px 10px', borderRadius: 6, fontSize: 13, border: '1px solid #5a2a0a' }}>{d}</span>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {plant.references?.length > 0 && (
            <section style={styles.detailSection}>
              <h3 style={styles.detailSectionTitle}>📚 Références scientifiques</h3>
              <ul style={styles.detailList}>
                {plant.references.map((r: string, i: number) => (
                  <li key={i} style={{ color: '#8dab6f', fontSize: 12, marginBottom: 4 }}>📄 {r}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════════════════
function AboutPage() {
  const { t } = useApp();
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '100px 20px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Logo size={80} />
        <h1 style={{ color: '#7ecb3e', fontFamily: "'Cinzel', serif", marginTop: 20 }}>El 3atare – العطار</h1>
        <div style={{ color: '#8dab6f', fontFamily: "'Amiri', serif", fontSize: 20, direction: 'rtl' }}>العطار – الصيدلية التقليدية الجزائرية</div>
      </div>

      <div style={styles.aboutCard}>
        <h2 style={styles.aboutTitle}>🌿 {t.about.title}</h2>
        <p style={styles.aboutText}>{t.about.desc}</p>
      </div>

      <div style={{ ...styles.aboutCard, borderColor: '#c9a227' }}>
        <h2 style={{ ...styles.aboutTitle, color: '#c9a227' }}>👑 {t.about.founder}</h2>
        <p style={styles.aboutText}>{t.about.founderDesc}</p>
        <div style={{ textAlign: 'center', marginTop: 20, padding: 16, background: '#0f1e0c', borderRadius: 8 }}>
          <div style={{ fontFamily: "'Cinzel', serif", color: '#c9a227', fontSize: 20, letterSpacing: 3 }}>KHEDIM BENYAKHLEF</div>
          <div style={{ color: '#7ecb3e', fontSize: 16, letterSpacing: 2 }}>dit BENY-JOE</div>
          <div style={{ color: '#5a7a4a', fontSize: 13, marginTop: 8 }}>Fondateur & Directeur du projet El 3atare</div>
        </div>
      </div>

      <div style={styles.aboutCard}>
        <h2 style={styles.aboutTitle}>🔗 Technologie</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            ['🐍 FastAPI', 'Backend Python haute performance'],
            ['🤖 Groq LLM', 'Rotation automatique multi-modèles'],
            ['🍃 MongoDB', 'Base de données NoSQL flexible'],
            ['🔗 Algorand', 'Blockchain certification plantes'],
            ['🔍 FAISS', 'Recherche vectorielle multilingue'],
            ['⚛️ React', 'Interface utilisateur moderne'],
          ].map(([tech, desc], i) => (
            <div key={i} style={{ background: '#0f1e0c', border: '1px solid #2d5a27', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ color: '#7ecb3e', fontWeight: 700, marginBottom: 4 }}>{tech}</div>
              <div style={{ color: '#8dab6f', fontSize: 13 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...styles.aboutCard, textAlign: 'center' }}>
        <h2 style={styles.aboutTitle}>🗣️ Langues supportées</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 12 }}>
          {LANGUAGES.map(l => (
            <div key={l.code} style={{ background: '#0f1e0c', border: '1px solid #2d5a27', borderRadius: 20, padding: '8px 18px', color: '#d4c9a8', direction: l.dir }}>
              {l.flag} {l.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════
function LoginPage({ setPage }: { setPage: (p: string) => void }) {
  const { t, setUser, setToken } = useApp();
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setErr('');
    try {
      const body = new URLSearchParams();
      body.append('username', form.username);
      body.append('password', form.password);
      const data = await fetch(`${API}/auth/token`, { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      if (!data.ok) throw new Error('Identifiants incorrects');
      const json = await data.json();
      localStorage.setItem('el3atare_token', json.access_token);
      setToken(json.access_token);
      setUser({ username: json.username });
      setPage('home');
    } catch (e: any) { setErr(e.message || 'Erreur'); }
    setLoading(false);
  };

  return (
    <div style={styles.authPage}>
      <div style={styles.authCard}>
        <Logo size={60} withText />
        <h2 style={{ color: '#7ecb3e', fontFamily: "'Cinzel', serif", marginTop: 20 }}>{t.nav.login}</h2>
        {err && <div style={styles.errMsg}>{err}</div>}
        <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          placeholder="Nom d'utilisateur" style={styles.authInput} />
        <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          placeholder="Mot de passe" style={styles.authInput} onKeyDown={e => e.key === 'Enter' && submit()} />
        <button onClick={submit} disabled={loading} style={styles.heroCta}>{loading ? '...' : t.nav.login}</button>
        <div style={{ color: '#5a7a4a', marginTop: 12, fontSize: 13 }}>
          Admin test: benyjoe / El3atare2024!
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════
const styles: Record<string, React.CSSProperties> = {
  navbar: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, borderBottom: '1px solid rgba(126,203,62,0.15)', transition: 'background 0.3s' },
  navInner: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLogo: { background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  navLinks: { display: 'flex', gap: 4 },
  navLink: { background: 'none', border: 'none', borderRadius: '4px 4px 0 0', cursor: 'pointer', padding: '8px 14px', fontFamily: "'Cinzel', serif", fontSize: 13, transition: 'color 0.2s', letterSpacing: 0.5 },
  langBtn: { background: 'rgba(45,90,39,0.4)', border: '1px solid #3a6a2a', color: '#a0c870', padding: '6px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 },
  langDropdown: { position: 'absolute', top: '110%', right: 0, background: '#0d1a0a', border: '1px solid #2d5a27', borderRadius: 8, overflow: 'hidden', zIndex: 200, minWidth: 140, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' },
  langOption: { display: 'block', width: '100%', border: 'none', cursor: 'pointer', padding: '9px 14px', color: '#d4c9a8', textAlign: 'left', fontSize: 13 },
  loginBtn: { background: 'rgba(126,203,62,0.15)', border: '1px solid #7ecb3e', color: '#7ecb3e', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13 },
  userBadge: { color: '#c9a227', background: 'rgba(201,162,39,0.1)', padding: '6px 14px', borderRadius: 20, fontSize: 13, border: '1px solid rgba(201,162,39,0.3)' },
  hero: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #050d04 0%, #0a1a07 50%, #050d04 100%)' },
  heroBg: { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(45,90,39,0.25) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(201,162,39,0.08) 0%, transparent 60%)', backgroundSize: '100%' },
  heroTitle: { fontFamily: "'Cinzel', serif", fontSize: 'clamp(32px, 5vw, 58px)', lineHeight: 1.2, marginBottom: 20, textShadow: '0 4px 20px rgba(0,0,0,0.8)' },
  heroDesc: { color: '#a0b890', fontSize: 'clamp(14px, 2vw, 18px)', maxWidth: 560, margin: '0 auto 20px', lineHeight: 1.8 },
  heroCta: { background: 'linear-gradient(135deg, #3a8a1e, #7ecb3e)', color: '#050d04', border: 'none', padding: '12px 28px', borderRadius: 30, cursor: 'pointer', fontSize: 15, fontFamily: "'Cinzel', serif", fontWeight: 700, letterSpacing: 0.5, boxShadow: '0 4px 20px rgba(126,203,62,0.3)', transition: 'transform 0.2s' },
  heroCta2: { background: 'transparent', color: '#c9a227', border: '2px solid #c9a227', padding: '12px 28px', borderRadius: 30, cursor: 'pointer', fontSize: 15, fontFamily: "'Cinzel', serif", fontWeight: 700 },
  statsRow: { display: 'flex', justifyContent: 'center', gap: 0, borderTop: '1px solid #1a3a15', borderBottom: '1px solid #1a3a15', background: '#080f06' },
  statCard: { flex: 1, maxWidth: 220, padding: '32px 20px', textAlign: 'center', borderRight: '1px solid #1a3a15' },
  statNum: { fontFamily: "'Cinzel', serif", fontSize: 42, color: '#c9a227', lineHeight: 1 },
  statLabel: { color: '#6a8a5a', fontSize: 13, marginTop: 8, letterSpacing: 0.5 },
  section: { maxWidth: 1100, margin: '0 auto', padding: '60px 24px' },
  sectionTitle: { fontFamily: "'Cinzel', serif", color: '#7ecb3e', fontSize: 28, textAlign: 'center', marginBottom: 40 },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 },
  featureCard: { background: 'linear-gradient(135deg, #0a1a07, #0d2009)', border: '1px solid #1a3a15', borderRadius: 12, padding: '28px 24px', textAlign: 'center', transition: 'border-color 0.3s' },
  featureIcon: { fontSize: 36, marginBottom: 16 },
  featureTitle: { color: '#c9a227', fontFamily: "'Cinzel', serif", fontSize: 16, marginBottom: 10 },
  featureDesc: { color: '#8dab6f', fontSize: 14, lineHeight: 1.7 },
  founderSection: { background: 'linear-gradient(135deg, #080f06, #0f1e0c)', borderTop: '1px solid rgba(201,162,39,0.2)', borderBottom: '1px solid rgba(201,162,39,0.2)' },
  founderInner: { maxWidth: 700, margin: '0 auto', padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  founderBadge: { fontSize: 48, marginBottom: 16 },
  ctaSection: { padding: '80px 24px', textAlign: 'center', background: '#050d04' },
  footer: { background: '#030a02', borderTop: '1px solid #1a3a15', padding: '40px 24px', textAlign: 'center' },
  chatPage: { maxWidth: 820, margin: '0 auto', padding: '74px 16px 0', height: '100vh', display: 'flex', flexDirection: 'column', gap: 0 },
  chatHeader: { padding: '12px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a3a15' },
  quickBtns: { display: 'flex', gap: 8, flexWrap: 'wrap', padding: '12px 0 4px' },
  quickBtn: { background: 'rgba(45,90,39,0.3)', border: '1px solid #2d5a27', color: '#a0c870', padding: '6px 14px', borderRadius: 16, cursor: 'pointer', fontSize: 13 },
  messagesArea: { flex: 1, overflowY: 'auto', padding: '12px 0', display: 'flex', flexDirection: 'column' },
  avatarUser: { width: 34, height: 34, background: '#1a3a5a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  avatarBot: { width: 34, height: 34, background: '#1a3a15', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  bubbleUser: { background: 'linear-gradient(135deg, #1a3a5a, #0f2040)', border: '1px solid #2a5a8a', borderRadius: '16px 4px 16px 16px', padding: '12px 16px', color: '#d4e8ff' },
  bubbleBot: { background: 'linear-gradient(135deg, #0d2009, #1a3a15)', border: '1px solid #2d5a27', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', color: '#d4c9a8' },
  refsBox: { marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' },
  refBadge: { background: '#1a3a15', border: '1px solid #3a7a2a', color: '#7ecb3e', padding: '2px 8px', borderRadius: 10, fontSize: 12 },
  disclaimer: { textAlign: 'center', color: '#4a6a3a', fontSize: 12, padding: '6px', borderTop: '1px solid #1a2a15' },
  inputRow: { display: 'flex', gap: 8, padding: '10px 0 16px', alignItems: 'flex-end' },
  chatInput: { flex: 1, background: '#0d1a0a', border: '1px solid #2d5a27', borderRadius: 12, color: '#d4c9a8', padding: '10px 14px', fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit' },
  sendBtn: { width: 48, height: 48, background: 'linear-gradient(135deg, #2d5a27, #7ecb3e)', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  dot1: { width: 8, height: 8, background: '#7ecb3e', borderRadius: '50%', animation: 'bounce 1s infinite 0s' },
  dot2: { width: 8, height: 8, background: '#7ecb3e', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' },
  dot3: { width: 8, height: 8, background: '#7ecb3e', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' },
  plantsPage: { maxWidth: 1200, margin: '0 auto', padding: '80px 20px 40px' },
  plantsHeader: { textAlign: 'center', marginBottom: 32 },
  plantsTitle: { fontFamily: "'Cinzel', serif", color: '#7ecb3e', fontSize: 32, margin: 0 },
  searchRow: { marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 },
  searchInput: { width: '100%', background: '#0d1a0a', border: '1px solid #2d5a27', borderRadius: 12, color: '#d4c9a8', padding: '12px 18px', fontSize: 15, outline: 'none', boxSizing: 'border-box' },
  catButtons: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  catBtn: { border: '1px solid', borderRadius: 20, padding: '6px 16px', cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' },
  plantsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 },
  plantCard: { background: '#0a1a07', border: '1px solid #1a3a15', borderRadius: 12, cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s' },
  plantCardName: { color: '#d4c9a8', fontWeight: 700, fontSize: 15, marginBottom: 4 },
  plantCardSci: { color: '#6a8a5a', fontSize: 12, fontStyle: 'italic', marginBottom: 4 },
  propBadge: { background: '#1a3a15', color: '#7ecb3e', padding: '2px 8px', borderRadius: 10, fontSize: 11 },
  catBadge: { color: '#a0c870', padding: '2px 8px', borderRadius: 10, fontSize: 11 },
  backBtn: { background: 'none', border: '1px solid #2d5a27', color: '#7ecb3e', padding: '8px 16px', borderRadius: 20, cursor: 'pointer', marginBottom: 20, fontSize: 14 },
  detailCard: { background: '#0a1a07', border: '1px solid #2d5a27', borderRadius: 14, overflow: 'hidden' },
  detailSection: { marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #1a2a15' },
  detailSectionTitle: { color: '#7ecb3e', fontFamily: "'Cinzel', serif", fontSize: 16, marginBottom: 12 },
  detailList: { listStyle: 'none', padding: 0, margin: 0 },
  detailListItem: { color: '#d4c9a8', padding: '4px 0', fontSize: 14 },
  nameBadge: { background: '#0f1e0c', border: '1px solid #1a3a15', borderRadius: 8, padding: '6px 12px', display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 },
  dosageCard: { background: '#0f1e0c', border: '1px solid #1a3a15', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 },
  usageBox: { background: '#0f1e0c', border: '1px solid #1a3a15', borderRadius: 10, padding: '16px 18px', color: '#d4c9a8', lineHeight: 1.8, fontSize: 14 },
  recipeCard: { background: '#0d1e0a', border: '1px solid #2d5a27', borderRadius: 10, padding: '16px 18px', marginBottom: 12 },
  aboutCard: { background: '#0a1a07', border: '1px solid #2d5a27', borderRadius: 12, padding: '24px 28px', marginBottom: 20 },
  aboutTitle: { color: '#7ecb3e', fontFamily: "'Cinzel', serif", fontSize: 20, marginBottom: 12 },
  aboutText: { color: '#a0b890', lineHeight: 1.8, fontSize: 15 },
  authPage: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  authCard: { background: '#0a1a07', border: '1px solid #2d5a27', borderRadius: 16, padding: '40px 32px', maxWidth: 380, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  authInput: { width: '100%', background: '#0f1e0c', border: '1px solid #2d5a27', borderRadius: 10, color: '#d4c9a8', padding: '12px 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box' },
  errMsg: { background: '#2a0a0a', border: '1px solid #7a2a2a', color: '#e09090', padding: '10px 14px', borderRadius: 8, fontSize: 13, width: '100%', textAlign: 'center' },
};

// ═══════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [lang, setLangState] = useState<LangKey>(() => {
    const saved = localStorage.getItem('el3atare_lang') as LangKey;
    return saved && translations[saved] ? saved : 'fr';
  });
  const [page, setPage] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [token, setTokenState] = useState(() => localStorage.getItem('el3atare_token') || '');

  const setLang = (l: LangKey) => { setLangState(l); localStorage.setItem('el3atare_lang', l); };
  const setToken = (t: string) => { setTokenState(t); localStorage.setItem('el3atare_token', t); };
  const t = translations[lang];
  const dir = LANGUAGES.find(l => l.code === lang)?.dir || 'ltr';

  useEffect(() => {
    document.title = 'El 3atare – العطار';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  useEffect(() => {
    if (token && !user) {
      apiCall('/auth/me', {}, token).then(u => setUser(u)).catch(() => { setToken(''); setUser(null); });
    }
  }, [token]);

  const pages: Record<string, JSX.Element> = {
    home: <HomePage setPage={setPage} />,
    plants: <PlantsPage />,
    chat: <ChatPage />,
    about: <AboutPage />,
    login: <LoginPage setPage={setPage} />,
  };

  return (
    <AppContext.Provider value={{ lang, setLang, t, dir, user, setUser, token, setToken }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Arabic:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #050d04; color: #d4c9a8; font-family: 'Segoe UI', system-ui, sans-serif; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #080f06; } ::-webkit-scrollbar-thumb { background: #2d5a27; border-radius: 3px; }
        button { font-family: inherit; }
      `}</style>
      <Navbar page={page} setPage={setPage} />
      {pages[page] || pages.home}
    </AppContext.Provider>
  );
}
// build Tue May  5 20:01:32     2026
