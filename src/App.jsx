import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabaseClient';
import confetti from 'canvas-confetti';

const DJ_SOCIALS = {
  instagram: "https://www.instagram.com/djrolak/",
  tiktok: "https://tiktok.com/@djrolak",
  soundcloud: "https://soundcloud.com/maciej-karolak-301990172"
};

const COLORS = {
  bg: '#121212', bgCard: '#1a1a1a', bgElevated: '#1e1e1e', bgInput: '#2a2a2a', bgInputDisabled: '#333',
  border: '#444', borderSubtle: '#333', borderInput: '#555', gold: '#ffd700', blue: '#007bff', green: '#28a745', red: '#dc3545',
  redBanner: '#ff0000', redBannerDark: '#cc0000', textPrimary: '#fff', textSecondary: '#ccc', textMuted: '#aaa', textDisabled: '#888', textDim: '#555',
  voteRed: '#ff6b6b', earningsGreenBg: '#1b4332', earningsGreenBorder: '#2d6a4f', earningsGreenValue: '#b7ffda',
  insta1: '#f09433', insta3: '#dc2743', tiktok1: '#ff0050', tiktok2: '#00f2fe',
};

const STYLES = {
  page: { background: 'radial-gradient(circle at 50% 0%, #1a1a2e 0%, #121212 60%, #0a0a0a 100%)', minHeight: '100vh', color: COLORS.textPrimary, fontFamily: "'Outfit', sans-serif" },
  container: { maxWidth: '600px', margin: '0 auto' },
  containerWide: { maxWidth: '800px', margin: '0 auto' },
  card: { background: 'rgba(30, 30, 30, 0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' },
  input: { padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(42, 42, 42, 0.6)', color: COLORS.textPrimary, fontSize: '1.1rem', width: '100%', boxSizing: 'border-box', outline: 'none', backdropFilter: 'blur(4px)' },
  btnPrimary: { backgroundColor: COLORS.gold, color: 'black', border: 'none', padding: '15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '1.05rem', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.2)' },
  btnSecondary: { background: 'rgba(42, 42, 42, 0.6)', color: COLORS.textPrimary, border: '1px solid rgba(255, 255, 255, 0.1)', padding: '15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', transition: 'all 0.3s ease', backdropFilter: 'blur(4px)' },
  btnDisabled: { opacity: 0.5, cursor: 'not-allowed', transform: 'none' },
  btnGhost: { backgroundColor: 'transparent', color: COLORS.textDisabled, border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.2s' },
  btnAccept: { backgroundColor: COLORS.green, color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnReject: { backgroundColor: COLORS.red, color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnReason: { backgroundColor: 'rgba(51, 51, 51, 0.8)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', transition: '0.2s', backdropFilter: 'blur(4px)' },
  sectionTitle: { fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', fontWeight: '800' },
  okladka: { width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' },
  okladkaPlaceholder: { width: '50px', height: '50px', borderRadius: '8px', background: 'rgba(51, 51, 51, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', backdropFilter: 'blur(4px)' },
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
    h1, h2, h3, h4, p, span, div, textarea, input { color: inherit; font-family: 'Outfit', sans-serif; } 
    h1, h2, h3, h4 { color: #ffffff; letter-spacing: -0.5px; }
    input:focus, textarea:focus { border-color: rgba(255, 215, 0, 0.5) !important; box-shadow: 0 0 10px rgba(255, 215, 0, 0.1); }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }

    @keyframes shake { 10%, 90% { transform: translate3d(-2px, 0, 0); } 20%, 80% { transform: translate3d(4px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-8px, 0, 0); } 40%, 60% { transform: translate3d(8px, 0, 0); } }
    @keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes spinPulse { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.2); } 100% { transform: rotate(360deg) scale(1); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.98); filter: blur(4px); } to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
    @keyframes vipPulse { 0% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(255,215,0,0.4)); } 50% { transform: scale(1.15); filter: drop-shadow(0 0 8px rgba(255,215,0,0.8)); } 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(255,215,0,0.4)); } }
    @keyframes vipBtnGlow { 0% { box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2), 0 0 0 0px rgba(255, 215, 0, 0.4); } 50% { box-shadow: 0 6px 25px rgba(255, 215, 0, 0.4), 0 0 0 6px rgba(255, 215, 0, 0); } 100% { box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2), 0 0 0 0px rgba(255, 215, 0, 0.4); } }
    @keyframes skeleton-loading {
      0% { background-color: rgba(255, 255, 255, 0.05); }
      50% { background-color: rgba(255, 255, 255, 0.12); }
      100% { background-color: rgba(255, 255, 255, 0.05); }
    }
    .skeleton { animation: skeleton-loading 1.5s infinite ease-in-out; border-radius: 8px; }
    .smooth-transition { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important; }
    .smooth-transition:hover { transform: translateY(-2px); background: rgba(55, 55, 55, 0.5) !important; border-color: rgba(255, 255, 255, 0.15) !important; }
    .smooth-transition-vip:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 8px 25px rgba(255, 215, 0, 0.15) !important; border-color: rgba(255, 215, 0, 0.5) !important; }
    .vip-button-premium { animation: vipBtnGlow 2.5s infinite ease-in-out; }
    .vip-button-premium:hover:not(:disabled) { transform: translateY(-2px) scale(1.02); filter: brightness(1.1); }
    .vip-button-premium:active:not(:disabled) { transform: translateY(1px) scale(0.99); }
    .free-button-premium:hover:not(:disabled) { transform: translateY(-2px); background: rgba(55, 55, 55, 0.8) !important; border-color: rgba(255, 255, 255, 0.2) !important; }
    .search-results-box { animation: fadeIn 0.25s ease-out both; }
    .search-item { transition: all 0.2s ease; }
    .search-item:hover { background: rgba(255, 255, 255, 0.08) !important; }
  `}</style>
);

const SocialLinks = () => (
  <div style={{ marginTop: '50px', marginBottom: '30px', textAlign: 'center', padding: '20px', backgroundColor: COLORS.bgCard, borderRadius: '12px', border: `1px solid ${COLORS.borderSubtle}` }}>
    <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Bawisz się dobrze? Śledź mnie! 📸</h3>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
      <a href={DJ_SOCIALS.instagram} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: 'none', background: `linear-gradient(45deg, ${COLORS.insta1}, ${COLORS.insta3})`, color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Instagram</a>
      <a href={DJ_SOCIALS.tiktok} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: 'none', backgroundColor: '#000', color: 'white', border: `1px solid ${COLORS.border}`, padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: `-2px 2px 0 ${COLORS.tiktok2}, 2px -2px 0 ${COLORS.tiktok1}` }}>TikTok</a>
      <a href={DJ_SOCIALS.soundcloud} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: 'none', backgroundColor: '#ff5500', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>DJ Sety</a>
    </div>
  </div>
);

const WyskakujacePowiadomienie = ({ powiadomienie }) => {
  if (!powiadomienie) return null;
  return (
    <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: powiadomienie.typ === 'success' ? COLORS.green : COLORS.red, color: 'white', padding: '15px 25px', borderRadius: '50px', zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.6)', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center', width: 'max-content', maxWidth: '90%', animation: 'slideDown 0.3s ease-out' }}>
      {powiadomienie.tekst}
    </div>
  );
};

const OknoRegulaminu = ({ pokazRegulamin, setPokazRegulamin }) => {
  if (!pokazRegulamin) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
      <div style={{ backgroundColor: COLORS.bgElevated, padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '100%', border: `1px solid ${COLORS.border}`, color: '#ddd' }}>
        <h2 style={{ color: 'white', marginTop: 0, borderBottom: `1px solid ${COLORS.borderSubtle}`, paddingBottom: '10px' }}>Regulamin usługi VIP 👑</h2>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '10px' }}><strong>1. Selekcja:</strong> DJ ma pełne prawo odrzucić utwór (np. psuje klimat imprezy lub dedykacja jest wulgarna).</p>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '10px' }}><strong>2. Priorytet, nie szafa grająca:</strong> Twój utwór trafia na sam szczyt kolejki, ale daj DJ-owi chwilę na płynne wmixowanie go w seta.</p>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '10px' }}><strong>3. Gwarancja zwrotu:</strong> Jeśli utwór zostanie odrzucony, system automatycznie zleca zwrot 100% środków. Zaksięgowanie pieniędzy z powrotem zależy od Twojego banku (zazwyczaj 1-3 dni robocze).</p>
        <button onClick={() => setPokazRegulamin(false)} style={{ ...STYLES.btnPrimary, width: '100%', marginTop: '20px', backgroundColor: COLORS.blue }}>Rozumiem</button>
      </div>
    </div>
  );
};

const PasekOgloszen = ({ tekstOgloszenia }) => {
  if (!tekstOgloszenia) return null;
  return (
    <div style={{ backgroundColor: COLORS.redBanner, color: 'white', padding: '8px 0', overflow: 'hidden', whiteSpace: 'nowrap', position: 'sticky', top: 0, zIndex: 100, fontWeight: 'bold', fontSize: '1rem', borderBottom: `2px solid ${COLORS.redBannerDark}` }}>
      <div style={{ display: 'inline-block', paddingLeft: '100%', animation: 'marquee 20s linear infinite' }}>{tekstOgloszenia}</div>
    </div>
  );
};

const Okladka = ({ src, size = 50 }) => {
  const s = { ...STYLES.okladka, width: `${size}px`, height: `${size}px` };
  if (src) return <img src={src} alt="Okładka" style={s} />;
  return <div style={{ ...STYLES.okladkaPlaceholder, width: `${size}px`, height: `${size}px` }}>🎵</div>;
};

const ElementKolejki = ({ piosenka, index, czyGlosowal, onPodbij }) => {
  const isTop1 = index === 0 && !piosenka.platna;
  return (
    <div className={piosenka.platna ? "smooth-transition-vip" : "smooth-transition"} style={{ background: piosenka.platna ? 'linear-gradient(145deg, rgba(40,35,10,0.7) 0%, rgba(255,215,0,0.05) 50%, rgba(30,30,30,0.6) 100%)' : 'rgba(42, 42, 42, 0.3)', backdropFilter: 'blur(8px)', padding: '12px 15px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: piosenka.platna ? `1px solid rgba(255, 215, 0, 0.25)` : `1px solid rgba(255, 255, 255, 0.05)`, borderLeft: piosenka.platna ? `4px solid ${COLORS.gold}` : (isTop1 ? `4px solid ${COLORS.blue}` : `4px solid transparent`), marginBottom: '12px', boxShadow: piosenka.platna ? '0 4px 15px rgba(255, 215, 0, 0.08)' : '0 4px 10px rgba(0,0,0,0.15)', animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both', animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flex: 1 }}>
        <div style={{ fontSize: '1.4rem', fontWeight: '800', minWidth: '25px', textAlign: 'center', color: piosenka.platna ? COLORS.gold : (isTop1 ? COLORS.blue : COLORS.textDim) }}>{index + 1}</div>
        <Okladka src={piosenka.okladka} size={45} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: '600', letterSpacing: '-0.3px' }}>{piosenka.tytul}</div>
          {piosenka.wiadomosc && <div style={{ fontSize: '0.85rem', color: COLORS.textMuted, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}><span>💌</span> {piosenka.wiadomosc}</div>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '75px' }}>
        {piosenka.platna ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.3rem', animation: 'vipPulse 2s infinite ease-in-out' }}>👑</span>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>VIP</span>
          </div>
        ) : (
          <>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: COLORS.voteRed }}>{piosenka.glosy || 0}</span>
            <button onClick={() => onPodbij(piosenka)} disabled={czyGlosowal} style={{ background: czyGlosowal ? 'rgba(255,255,255,0.05)' : 'rgba(255, 107, 107, 0.15)', border: czyGlosowal ? '1px solid rgba(255,255,255,0.1)' : `1px solid rgba(255, 107, 107, 0.3)`, color: czyGlosowal ? COLORS.textDisabled : COLORS.voteRed, padding: '6px 12px', borderRadius: '20px', cursor: czyGlosowal ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s ease' }}>
              {czyGlosowal ? '✓ Głos' : '🔥 Podbij'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const SkeletonKolejki = () => (
  <div style={{ background: 'rgba(42, 42, 42, 0.3)', backdropFilter: 'blur(8px)', padding: '12px 15px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '12px' }}>
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flex: 1 }}>
      <div className="skeleton" style={{ width: '25px', height: '25px', borderRadius: '4px' }}></div>
      <div className="skeleton" style={{ width: '45px', height: '45px', borderRadius: '8px' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div className="skeleton" style={{ width: '60%', height: '14px' }}></div>
        <div className="skeleton" style={{ width: '40%', height: '10px' }}></div>
      </div>
    </div>
    <div className="skeleton" style={{ width: '60px', height: '28px', borderRadius: '20px' }}></div>
  </div>
);

const PasekCooldownu = ({ czasBlokady, maxCzas = 60 }) => {
  if (czasBlokady <= 0) return null;
  return (
    <div style={{ backgroundColor: COLORS.bgInput, borderRadius: '8px', padding: '12px', marginBottom: '15px', textAlign: 'center' }}>
      <div style={{ color: COLORS.textMuted, fontSize: '0.85rem', marginBottom: '8px' }}>Poczekaj chwilę 🎵 (nie dotyczy VIP)</div>
      <div style={{ width: '100%', height: '6px', backgroundColor: COLORS.borderSubtle, borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(czasBlokady / maxCzas) * 100}%`, backgroundColor: COLORS.blue, transition: 'width 1s linear' }} />
      </div>
      <div style={{ color: COLORS.textDisabled, fontSize: '0.8rem', marginTop: '5px' }}>{czasBlokady}s</div>
    </div>
  );
};

// ─── DJ Panel: BPM + Key badge ────────────────────────────────────────────────
const BpmKeyBadge = ({ bpm, keyCamelot, status }) => {
  if (status === 'pending') {
    return (
      <div style={{ marginTop: '6px' }}>
        <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: COLORS.textMuted, padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
          ⏳ Pobieranie BPM...
        </span>
      </div>
    );
  }
  if (status === 'not_found' || (!bpm && !keyCamelot)) {
    return (
      <div style={{ marginTop: '6px' }}>
        <span style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: COLORS.textDisabled, padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem' }}>
          ❔ Brak danych BPM
        </span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
      {bpm && (
        <span style={{ background: 'rgba(0, 123, 255, 0.15)', border: '1px solid rgba(0, 123, 255, 0.35)', color: '#7ab8ff', padding: '2px 8px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.5px' }}>
          🥁 {Math.round(bpm)} BPM
        </span>
      )}
      {keyCamelot && (
        <span style={{ background: 'rgba(40, 167, 69, 0.12)', border: '1px solid rgba(40, 167, 69, 0.3)', color: '#6edd8a', padding: '2px 8px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>
          🔗 {keyCamelot}
        </span>
      )}
    </div>
  );
};

function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return useCallback((...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callbackRef.current(...args), delay);
  }, [delay]);
}

const COOLDOWN_SECONDS = 180;

// Wczytanie pozostałego cooldownu z localStorage
const wczytajPoczatkowyCooldown = () => {
  const koniec = localStorage.getItem('koniecBlokadyCzas');
  if (!koniec) return 0;
  const pozostaleMs = parseInt(koniec, 10) - Date.now();
  if (pozostaleMs <= 0) {
    localStorage.removeItem('koniecBlokadyCzas');
    return 0;
  }
  return Math.ceil(pozostaleMs / 1000);
};

const EkranOstrzezeniaVip = ({ naAkceptacje, naOdrzucenie }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s' }}>
    <div style={{ backgroundColor: '#1a1a1a', border: '3px solid #dc3545', borderRadius: '15px', padding: '25px', textAlign: 'center', maxWidth: '400px' }}>
      <h2 style={{ color: '#dc3545', margin: '0 0 15px 0', fontSize: '1.8rem', textTransform: 'uppercase' }}>⚠️ Zanim zapłacisz!</h2>
      <p style={{ fontSize: '1.1rem', marginBottom: '15px', lineHeight: '1.5' }}>DJ ma pełne prawo <strong>odrzucić</strong> Twój utwór, jeśli całkowicie psuje klimat obecnej imprezy.</p>
      <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '25px', lineHeight: '1.4' }}>Jeśli utwór zostanie odrzucony, Twoje pieniądze zostaną <strong style={{ color: '#4ade80', fontSize: '1.1rem', textDecoration: 'underline', textUnderlineOffset: '3px' }}>automatycznie zwrócone</strong> (czas zaksięgowania zależy od Twojego banku).</p>
      <button onClick={naAkceptacje} style={{ backgroundColor: '#dc3545', color: 'white', padding: '15px', width: '100%', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px', cursor: 'pointer', textTransform: 'uppercase' }}>Rozumiem, idę do kasy</button>
      <button onClick={naOdrzucenie} style={{ backgroundColor: 'transparent', color: '#888', border: '1px solid #444', padding: '12px', width: '100%', borderRadius: '8px', cursor: 'pointer' }}>Rozmyśliłem się</button>
    </div>
  </div>
);

export default function App() {
  const [widok, setWidok] = useState('start');
  const [pin, setPin] = useState('');
  const [bladPinu, setBladPinu] = useState(false);
  const [piosenki, setPiosenki] = useState([]);
  const [pokazOstrzezenieVip, setPokazOstrzezenieVip] = useState(false);
  const [pierwszeLadowanie, setPierwszeLadowanie] = useState(true);
  const [tekstOgloszenia, setTekstOgloszenia] = useState("Witaj na imprezie! Zamów piosenkę VIP! 🚀");
  const [cenaVip, setCenaVip] = useState(10);
  const [nowaPiosenka, setNowaPiosenka] = useState("");
  const [nowaWiadomosc, setNowaWiadomosc] = useState("");
  const [wynikiWyszukiwania, setWynikiWyszukiwania] = useState([]);
  const [czasBlokady, setCzasBlokady] = useState(wczytajPoczatkowyCooldown);
  const [wybranaOkladka, setWybranaOkladka] = useState("");
  const [trwaPlatnosc, setTrwaPlatnosc] = useState(false);
  const [trwaNapiwek, setTrwaNapiwek] = useState(false);
  const [czyWybranoZListy, setCzyWybranoZListy] = useState(false);
  const [zgodaRegulamin, setZgodaRegulamin] = useState(false);
  const [pokazRegulamin, setPokazRegulamin] = useState(false);
  const [zaakceptowane, setZaakceptowane] = useState(() => {
    const z = localStorage.getItem('historiaWplywow');
    return z ? JSON.parse(z) : [];
  });
  const [idOdrzucanej, setIdOdrzucanej] = useState(null);
  const [powiadomienie, setPowiadomienie] = useState(null);
  const [kanalImpreza, setKanalImpreza] = useState(null);
  const [trzesieSie, setTrzesieSie] = useState(false);
  const [pokazQR, setPokazQR] = useState(false);
  const [dzwiekWlaczony, setDzwiekWlaczony] = useState(true);
  const dzwiekRef = useRef(true);
  const [idAkceptowanej, setIdAkceptowanej] = useState(null);

  const spotifyTokenRef = useRef("");
  const spotifyTokenExpiryRef = useRef(0);
  const [wybranySpotifyId, setWybranySpotifyId] = useState("");
  const [wybranyArtysta, setWybranyArtysta] = useState("");
  const [wybranyTytul, setWybranyTytul] = useState("");

  const [oddaneGlosy, setOddaneGlosy] = useState(() => {
    const z = localStorage.getItem('mojeGlosy');
    return z ? JSON.parse(z) : [];
  });

  useEffect(() => { dzwiekRef.current = dzwiekWlaczony; }, [dzwiekWlaczony]);

  const pokazPowiadomienie = useCallback((tekst, typ = 'success', czas = 4000) => {
    setPowiadomienie({ tekst, typ });
    setTimeout(() => setPowiadomienie(null), czas);
  }, []);

  const pobierzTokenSpotify = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('spotify-token');
      if (error) throw error;
      if (data?.access_token) {
        spotifyTokenRef.current = data.access_token;
        spotifyTokenExpiryRef.current = Date.now() + (data.expires_in - 300) * 1000;
        return data.access_token;
      }
    } catch (e) {
      console.error("Błąd autoryzacji Spotify:", e);
    }
    return null;
  }, []);

  const zlecPobraniBpm = useCallback(async (piosenka_id, spotify_track_id, artysta, tytul) => {
    if (!piosenka_id || !artysta || !tytul) return;
    try {
      await supabase.functions.invoke('pobierz-bpm', {
        body: { piosenka_id, spotify_track_id, artysta, tytul }
      });
    } catch (e) {
      console.error("Błąd pobierania BPM:", e);
    }
  }, []);

  useEffect(() => {
    const pobierzKonfiguracje = async () => {
      const { data: dPasek } = await supabase.from('konfiguracja').select('*').eq('id', 'pasek_tekst').single();
      if (dPasek) setTekstOgloszenia(dPasek.wartosc);
      const { data: dAnkieta } = await supabase.from('konfiguracja').select('*').eq('id', 'aktywna_ankieta').single();
      if (dAnkieta && dAnkieta.wartosc) setAnkieta(JSON.parse(dAnkieta.wartosc));
      const { data: dCena } = await supabase.from('konfiguracja').select('*').eq('id', 'cena_vip').single();
      if (dCena && dCena.wartosc) setCenaVip(Number(dCena.wartosc));
    };
    pobierzKonfiguracje();

    const subskrypcja = supabase.channel('zmiany_konfiguracji')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'konfiguracja' }, payload => {
        if (payload.new.id === 'pasek_tekst') setTekstOgloszenia(payload.new.wartosc);
        if (payload.new.id === 'aktywna_ankieta') setAnkieta(JSON.parse(payload.new.wartosc));
        if (payload.new.id === 'cena_vip') setCenaVip(Number(payload.new.wartosc));
      }).subscribe();
    return () => { supabase.removeChannel(subskrypcja); };
  }, []);

  // ─── CZYSTY REDIRECT PO PŁATNOŚCI (Zero zapytań do weryfikacji!) ─────────
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    
    if (query.get("success")) {
      const isNapiwek = query.get("napiwek");

      // Bez litości usuwamy śmieci z telefonu. Webhook już ogarnia bazę.
      localStorage.removeItem('vipTytul');
      localStorage.removeItem('vipWiadomosc');
      localStorage.removeItem('vipOkladka');
      localStorage.removeItem('vipSpotifyId');
      localStorage.removeItem('vipArtysta');
      localStorage.removeItem('vipCzystyTytul');

      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 600]);
      setTrzesieSie(true); setTimeout(() => setTrzesieSie(false), 800);
      confetti({ particleCount: 250, spread: 120, startVelocity: 45, origin: { y: 0.8 }, colors: ['#ffd700', '#ffaa00', '#ffffff', '#ffcc00'], zIndex: 10000 });
      
      if (isNapiwek) pokazPowiadomienie("Piwo postawione! DJ dziękuje! 🍻", 'success', 6000);
      else pokazPowiadomienie("Jesteś VIP! Twój utwór wpadł do DJ-a! 🚀", 'success', 6000);
      
      window.history.replaceState(null, '', window.location.pathname);
    }
    
    if (query.get("canceled")) {
      localStorage.removeItem('vipTytul');
      localStorage.removeItem('vipWiadomosc');
      localStorage.removeItem('vipOkladka');
      localStorage.removeItem('vipSpotifyId');
      localStorage.removeItem('vipArtysta');
      localStorage.removeItem('vipCzystyTytul');
      
      pokazPowiadomienie("Płatność została anulowana.", 'error');
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [pokazPowiadomienie]);

  useEffect(() => {
    const sortuj = (lista) => [...lista].sort((a, b) => {
  // 1. VIPy zawsze przed darmowymi
  if (a.platna !== b.platna) return a.platna ? -1 : 1;
  // 2. VIPy między sobą: starszy pierwszy (kolejność płacenia)
  if (a.platna && b.platna) return new Date(a.created_at) - new Date(b.created_at);
  // 3. Darmowe: po głosach malejąco
  if ((b.glosy || 0) !== (a.glosy || 0)) return (b.glosy || 0) - (a.glosy || 0);
  // 4. Przy równych głosach: starszy pierwszy
  return new Date(a.created_at) - new Date(b.created_at);
});

    const pobierzPiosenki = async () => {
      const { data, error } = await supabase
        .from('piosenki')
        .select('*')
        .order('platna', { ascending: false })
.order('glosy', { ascending: false })
.order('created_at', { ascending: true });
      if (error) pokazPowiadomienie("Błąd pobierania kolejki.", 'error');
      else setPiosenki(data || []);
      setPierwszeLadowanie(false);
    };

    pobierzPiosenki();
    pobierzTokenSpotify();

    const kanal = supabase.channel('wirtualny-klub');
    kanal.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'piosenki' }, (payload) => {
      if (payload.new.platna === true && dzwiekRef.current) {
        const dzwiekVip = new Audio('https://actions.google.com/sounds/v1/alarms/positive_alerts.ogg');
        dzwiekVip.volume = 0.8;
        dzwiekVip.play().catch(err => console.log("Przeglądarka zablokowała dźwięk:", err));
      }
      setPiosenki((stare) => sortuj([...stare.filter(p => p.id !== payload.new.id), payload.new]));
    });
    kanal.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'piosenki' }, (payload) => {
      setPiosenki((stare) => {
        const istnieje = stare.some(p => p.id === payload.new.id);
        if (istnieje) {
          return sortuj(stare.map(p => p.id === payload.new.id ? payload.new : p));
        }
        // Race condition: UPDATE doszedł przed INSERT → dodaj na siłę
        return sortuj([...stare, payload.new]);
      });
    });
    kanal.on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'piosenki' }, (payload) => {
      setPiosenki((stare) => stare.filter(p => p.id !== payload.old.id));
    });
    kanal.subscribe((status) => { if (status === 'SUBSCRIBED') setKanalImpreza(kanal); });

    return () => { supabase.removeChannel(kanal); };
  }, [pokazPowiadomienie, pobierzTokenSpotify]);

  useEffect(() => {
    let timer;
    if (czasBlokady > 0) timer = setTimeout(() => setCzasBlokady(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [czasBlokady]);

  useEffect(() => {
    if (nowaPiosenka.trim().length < 3 || czyWybranoZListy) {
      setWynikiWyszukiwania([]);
      return;
    }

    const opoznienie = setTimeout(async () => {
      let token = spotifyTokenRef.current;
      if (!token || Date.now() > spotifyTokenExpiryRef.current) token = await pobierzTokenSpotify();
      if (!token) return;

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(nowaPiosenka)}&type=track&limit=8&market=PL`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const data = await response.json();
        if (data.tracks?.items) setWynikiWyszukiwania(data.tracks.items);
      } catch (error) {
        console.error("Błąd wyszukiwania Spotify:", error);
      }
    }, 400);

    return () => clearTimeout(opoznienie);
  }, [nowaPiosenka, czyWybranoZListy, pobierzTokenSpotify]);

  const wybierzZeSpotify = useCallback((track) => {
    setCzyWybranoZListy(true);
    setNowaPiosenka(`${track.artists[0].name} - ${track.name}`);
    setWybranaOkladka(track.album.images[2]?.url || "");
    setWybranySpotifyId(track.id);
    setWybranyArtysta(track.artists[0].name);
    setWybranyTytul(track.name);
    setWynikiWyszukiwania([]);
  }, []);

  const dodajPiosenke = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (nowaPiosenka.trim() === "" || czasBlokady > 0) return;
    if (piosenki.some(p => p.tytul.toLowerCase() === nowaPiosenka.trim().toLowerCase())) {
      pokazPowiadomienie("Ta nuta już jest w kolejce! Podbij ją głosując! 🔥", 'error');
      return;
    }
    const { data: inserted, error } = await supabase
      .from('piosenki')
      .insert([{
        tytul: nowaPiosenka,
        wiadomosc: nowaWiadomosc,
        glosy: 0, platna: false, kwota: 0,
        okladka: wybranaOkladka,
        spotify_track_id: wybranySpotifyId || null,
        bpm_status: 'pending'
      }])
      .select()
      .single();

    if (error) { pokazPowiadomienie("Nie udało się dodać piosenki.", 'error'); return; }

    pokazPowiadomienie("Dodano do kolejki! 🎶", 'success', 3000);

    if (inserted?.id && wybranySpotifyId && wybranyArtysta && wybranyTytul) {
      zlecPobraniBpm(inserted.id, wybranySpotifyId, wybranyArtysta, wybranyTytul);
    }

    setNowaPiosenka(""); setNowaWiadomosc(""); setWybranaOkladka("");
    setWybranySpotifyId(""); setWybranyArtysta(""); setWybranyTytul("");
    setWynikiWyszukiwania([]);

    const koniecBlokady = Date.now() + COOLDOWN_SECONDS * 1000;
    localStorage.setItem('koniecBlokadyCzas', koniecBlokady.toString());
    setCzasBlokady(COOLDOWN_SECONDS);
    setCzyWybranoZListy(false); setZgodaRegulamin(false);
  }, [nowaPiosenka, nowaWiadomosc, wybranaOkladka, czasBlokady, piosenki, pokazPowiadomienie, wybranySpotifyId, wybranyArtysta, wybranyTytul, zlecPobraniBpm]);

  const zaplacVip = useCallback(async () => {
    if (nowaPiosenka.trim() === "") return;
    setTrwaPlatnosc(true);
    try {
      localStorage.setItem('vipTytul', nowaPiosenka);
      localStorage.setItem('vipWiadomosc', nowaWiadomosc);
      localStorage.setItem('vipOkladka', wybranaOkladka);
      localStorage.setItem('vipSpotifyId', wybranySpotifyId);
      localStorage.setItem('vipArtysta', wybranyArtysta);
      localStorage.setItem('vipCzystyTytul', wybranyTytul);
      const { data, error } = await supabase.functions.invoke('platnosc-vip', {
        body: {
          tytul: nowaPiosenka,
          wiadomosc: nowaWiadomosc,
          kwota: Number(cenaVip),
          okladka: wybranaOkladka,
          spotify_track_id: wybranySpotifyId,
          artysta: wybranyArtysta,
          czysty_tytul: wybranyTytul
        }
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      pokazPowiadomienie("Błąd bramki płatniczej.", 'error');
      setTrwaPlatnosc(false);
    }
  }, [nowaPiosenka, nowaWiadomosc, wybranaOkladka, cenaVip, pokazPowiadomienie, wybranySpotifyId, wybranyArtysta, wybranyTytul]);
  const zostawNapiwek = useCallback(async (kwota) => {
    setTrwaNapiwek(true);
    try {
      const { data, error } = await supabase.functions.invoke('platnosc-napiwek', { body: { kwota } });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
      else { pokazPowiadomienie("Błąd bramki.", 'error'); setTrwaNapiwek(false); }
    } catch (err) {
      pokazPowiadomienie("Błąd systemu napiwków! 🍺", 'error');
      setTrwaNapiwek(false);
    }
  }, [pokazPowiadomienie]);

  const podbijGlos = useCallback(async (piosenka) => {
    if (oddaneGlosy.includes(piosenka.id)) return;
    const noweOddaneGlosy = [...oddaneGlosy, piosenka.id];
    setOddaneGlosy(noweOddaneGlosy);
    localStorage.setItem('mojeGlosy', JSON.stringify(noweOddaneGlosy));
    const { error } = await supabase.rpc('podbij_glos', { piosenka_id: piosenka.id });
    if (error) {
      await supabase.from('piosenki').update({ glosy: (piosenka.glosy || 0) + 1 }).eq('id', piosenka.id);
    }
  }, [oddaneGlosy]);

  const akceptujPiosenke = useCallback(async (piosenka) => {
    setIdAkceptowanej(piosenka.id);
    if (kanalImpreza) kanalImpreza.send({ type: 'broadcast', event: 'decyzja-dj', payload: { tekst: `🔥 DJ zagra: ${piosenka.tytul}!`, typ: 'success' } });
    setZaakceptowane((stare) => {
      const nowe = [...stare, piosenka];
      localStorage.setItem('historiaWplywow', JSON.stringify(nowe));
      return nowe;
    });
    await supabase.from('piosenki').delete().eq('id', piosenka.id);
    setIdAkceptowanej(null);
  }, [kanalImpreza]);

  const odrzucPiosenke = useCallback(async (piosenka, powod) => {
    if (piosenka.platna && piosenka.session_id) {
      pokazPowiadomienie("Zlecam zwrot do banku...", 'success');
      try {
        await supabase.functions.invoke('zwrot-vip', { body: { sessionId: piosenka.session_id } });
        pokazPowiadomienie("💸 Pieniądze zwrócone!", 'success');
      } catch (error) {
        pokazPowiadomienie("⚠️ Błąd zwrotu! Sprawdź Stripe.", 'error');
      }
    }
    let tresc = piosenka.platna ? `❌ DJ odrzucił: ${piosenka.tytul}. Zwrot PLN zlecony! 💸` : `❌ DJ odrzucił: ${piosenka.tytul}`;
    if (powod) tresc += ` Powód: ${powod}`;
    if (kanalImpreza) kanalImpreza.send({ type: 'broadcast', event: 'decyzja-dj', payload: { tekst: tresc, typ: 'error' } });
    await supabase.from('piosenki').delete().eq('id', piosenka.id);
    setIdOdrzucanej(null);
  }, [kanalImpreza, pokazPowiadomienie]);

  const sprawdzPin = (e) => {
    e.preventDefault();
    if (pin === '2026') { setWidok('dj'); setPin(''); setBladPinu(false); }
    else setBladPinu(true);
  };

  const zapiszPasekDebounced = useDebounce(async (nowyTekst) => {
    await supabase.from('konfiguracja').update({ wartosc: nowyTekst }).eq('id', 'pasek_tekst');
  }, 500);
  const handleZmianaPaska = (e) => { setTekstOgloszenia(e.target.value); zapiszPasekDebounced(e.target.value); };

  const zapiszCeneDebounced = useDebounce(async (nowaCena) => {
    await supabase.from('konfiguracja').upsert({ id: 'cena_vip', wartosc: nowaCena.toString() });
  }, 500);
  const handleZmianaCeny = (e) => { setCenaVip(e.target.value); zapiszCeneDebounced(e.target.value); };

  if (widok === 'start') {
    return (
      <div style={{ ...STYLES.page, position: 'relative', animation: trzesieSie ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none' }}>
        <GlobalStyles />
        <PasekOgloszen tekstOgloszenia={tekstOgloszenia} />
        <WyskakujacePowiadomienie powiadomienie={powiadomienie} />
        <div style={{ padding: '20px' }}>
          <button onClick={() => setWidok('logowanie-dj')} style={{ position: 'absolute', top: '50px', right: '15px', ...STYLES.btnGhost, color: '#222', fontSize: '1.2rem', zIndex: 10 }}>⚙️</button>
          <h1 style={{ textAlign: 'center', marginBottom: '30px', marginTop: '10px' }}>Witaj na imprezie! 🪩</h1>
          <div style={STYLES.container}>
            <button onClick={() => setWidok('gosc')} style={{ ...STYLES.btnPrimary, width: '100%', padding: '20px', borderRadius: '12px', fontSize: '1.3rem', marginBottom: '8px', boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)' }}>Zamów Piosenkę i dodaj dedykację 🎶</button>
            <div style={{ textAlign: 'center', color: COLORS.gold, fontSize: '0.9rem', marginBottom: '25px', fontWeight: 'bold' }}>👑 Kup VIP, aby wbić na sam szczyt listy!</div>
            <div style={{ ...STYLES.card, marginBottom: '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '0.9rem', color: '#bbb' }}>🍻 Doceniasz grę? Zafunduj DJ-owi drinka!</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[10, 15, 20].map((k) => (
                  <button key={k} onClick={() => zostawNapiwek(k)} disabled={trwaNapiwek} style={{ flex: 1, backgroundColor: COLORS.green, color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: trwaNapiwek ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem', opacity: trwaNapiwek ? 0.6 : 1 }}>
                    {k} PLN{k === 20 ? ' 🚀' : ''}
                  </button>
                ))}
              </div>
            </div>
            <h2 style={STYLES.sectionTitle}>🔥 Głosuj na kolejne numery ({piosenki.length})</h2>
            {pierwszeLadowanie ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}><SkeletonKolejki /><SkeletonKolejki /><SkeletonKolejki /></div>
            ) : piosenki.length === 0 ? (
              <p style={{ color: COLORS.textDisabled, fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>Lista jest pusta. Bądź pierwszy!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {piosenki.map((p, i) => <ElementKolejki key={p.id} piosenka={p} index={i} czyGlosowal={oddaneGlosy.includes(p.id)} onPodbij={podbijGlos} />)}
              </div>
            )}
            <SocialLinks />
          </div>
        </div>
      </div>
    );
  }

  if (widok === 'logowanie-dj') {
    return (
      <div style={{ ...STYLES.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <GlobalStyles />
        <h2>Dostęp do konsolety</h2>
        <form onSubmit={sprawdzPin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '300px', marginTop: '20px' }}>
          <input type="password" placeholder="Wprowadź PIN..." value={pin} onChange={(e) => setPin(e.target.value)} style={{ ...STYLES.input, fontSize: '1.5rem', textAlign: 'center' }} />
          {bladPinu && <p style={{ color: '#ff4444', textAlign: 'center', margin: 0 }}>Nieprawidłowy PIN!</p>}
          <button type="submit" style={{ ...STYLES.btnPrimary, backgroundColor: COLORS.green }}>Wejdź</button>
          <button type="button" onClick={() => { setWidok('start'); setPin(''); setBladPinu(false); }} style={{ ...STYLES.btnGhost, padding: '10px', marginTop: '10px' }}>← Wróć</button>
        </form>
      </div>
    );
  }

  if (widok === 'gosc') {
    const czyMaDedykacje = nowaWiadomosc.trim().length > 0;
    const brakPiosenki = nowaPiosenka.trim() === "";
    const czyDarmowyDisabled = czasBlokady > 0 || brakPiosenki || czyMaDedykacje || trwaPlatnosc;
    const czyVipDisabled = brakPiosenki || trwaPlatnosc || !zgodaRegulamin;

    return (
      <div style={{ ...STYLES.page, animation: trzesieSie ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none' }}>
        <GlobalStyles />
        <PasekOgloszen tekstOgloszenia={tekstOgloszenia} />
        <div style={{ padding: '20px' }}>
          <WyskakujacePowiadomienie powiadomienie={powiadomienie} />
          <OknoRegulaminu pokazRegulamin={pokazRegulamin} setPokazRegulamin={setPokazRegulamin} />
          {pokazOstrzezenieVip && <EkranOstrzezeniaVip naAkceptacje={() => { setPokazOstrzezenieVip(false); zaplacVip(); }} naOdrzucenie={() => setPokazOstrzezenieVip(false)} />}

          <button onClick={() => setWidok('start')} style={{ ...STYLES.btnGhost, marginBottom: '20px' }}>← Wyjście</button>
          <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Zamów Piosenkę 🎶</h1>

          <div style={STYLES.container}>
            <PasekCooldownu czasBlokady={czasBlokady} maxCzas={COOLDOWN_SECONDS} />

            <div style={{ ...STYLES.card, display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px', position: 'relative' }}>

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="🔍 Wyszukaj utwór lub wykonawcę..."
                  value={nowaPiosenka}
                  onChange={(e) => { setNowaPiosenka(e.target.value); setCzyWybranoZListy(false); }}
                  maxLength={150}
                  style={{ ...STYLES.input, backgroundColor: 'rgba(42, 42, 42, 0.5)', paddingLeft: '45px' }}
                />
                <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', opacity: 0.5, pointerEvents: 'none' }}>🎵</span>
              </div>

              {wybranaOkladka && czyWybranoZListy && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 215, 0, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.15)', animation: 'fadeIn 0.3s ease-out' }}>
                  <img src={wybranaOkladka} alt="Wybrana okładka" style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} />
                  <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: '600', color: '#fff' }}>{nowaPiosenka}</div>
                  <button onClick={() => { setNowaPiosenka(''); setWybranaOkladka(''); setWybranySpotifyId(''); setWybranyArtysta(''); setWybranyTytul(''); setCzyWybranoZListy(false); }} style={{ ...STYLES.btnGhost, color: COLORS.textMuted, fontSize: '1.2rem', padding: '5px' }}>✕</button>
                </div>
              )}

              {wynikiWyszukiwania.length > 0 && (
                <div className="search-results-box" style={{ background: 'rgba(30, 30, 30, 0.95)', borderRadius: '14px', overflowY: 'auto', maxHeight: '260px', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', marginTop: '-5px' }}>
                  {wynikiWyszukiwania.map((track) => (
                    <div key={track.id} onClick={() => wybierzZeSpotify(track)} className="search-item" style={{ padding: '12px 15px', display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.03)', cursor: 'pointer' }}>
                      <img src={track.album.images[2]?.url} alt="Okładka" style={{ width: '42px', height: '42px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.name}</span>
                        <span style={{ color: COLORS.textMuted, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.artists[0].name}</span>
                      </div>
                      <span style={{ fontSize: '1.1rem', opacity: 0.3 }}>+</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <textarea placeholder="💌 Dodaj dedykację (opcjonalnie dla VIP)..." value={nowaWiadomosc} onChange={(e) => setNowaWiadomosc(e.target.value)} rows="2" maxLength={200} style={{ ...STYLES.input, fontSize: '1rem', resize: 'none', backgroundColor: 'rgba(42, 42, 42, 0.5)', paddingBottom: '30px' }} />
                <div style={{ position: 'absolute', bottom: '10px', right: '12px', fontSize: '0.75rem', fontWeight: 'bold', color: nowaWiadomosc.length >= 200 ? COLORS.red : COLORS.textMuted, opacity: 0.7 }}>{nowaWiadomosc.length}/200</div>
              </div>

              {czyMaDedykacje && <div style={{ fontSize: '0.8rem', color: COLORS.gold, textAlign: 'center', fontWeight: '600', animation: 'fadeIn 0.2s' }}>⚡ Dedykacja zostanie wysłana tylko z opcją VIP!</div>}
              <div style={{ textAlign: 'center', color: COLORS.gold, fontSize: '0.9rem', marginTop: '4px', fontWeight: 'bold', letterSpacing: '0.3px' }}>👑 Zamówienie VIP natychmiast omija całą kolejkę!</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <input type="checkbox" id="regulamin" checked={zgodaRegulamin} onChange={(e) => setZgodaRegulamin(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: COLORS.gold }} />
                <label htmlFor="regulamin" style={{ fontSize: '0.85rem', color: '#bbb', cursor: 'pointer', flex: 1, userSelect: 'none' }}>Akceptuję <span onClick={(e) => { e.preventDefault(); setPokazRegulamin(true); }} style={{ color: COLORS.blue, textDecoration: 'underline', fontWeight: '600' }}>regulamin i zasady zwrotów</span></label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button type="button" onClick={() => setPokazOstrzezenieVip(true)} disabled={czyVipDisabled} className="vip-button-premium smooth-transition" style={{ ...STYLES.btnPrimary, flex: 1, ...(czyVipDisabled ? STYLES.btnDisabled : {}), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {trwaPlatnosc ? '⏳ Ładowanie...' : (<><span>🚀</span><span>VIP ({cenaVip} PLN)</span></>)}
                </button>
                <button type="button" onClick={dodajPiosenke} disabled={czyDarmowyDisabled} className="free-button-premium smooth-transition" style={{ ...STYLES.btnSecondary, flex: 1, ...(czyDarmowyDisabled ? STYLES.btnDisabled : {}) }}>
                  {czasBlokady > 0 ? `⏳ Czekaj (${czasBlokady}s)` : (czyMaDedykacje ? '🔒 Tylko VIP' : '👋 Za darmo')}
                </button>
              </div>
            </div>

            <h2 style={STYLES.sectionTitle}>🔥 Kolejka ({piosenki.length})</h2>
            {pierwszeLadowanie ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}><SkeletonKolejki /><SkeletonKolejki /><SkeletonKolejki /></div>
            ) : piosenki.length === 0 ? (
              <p style={{ color: COLORS.textDisabled, fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>Lista jest pusta. Bądź pierwszy!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {piosenki.map((p, i) => <ElementKolejki key={p.id} piosenka={p} index={i} czyGlosowal={oddaneGlosy.includes(p.id)} onPodbij={podbijGlos} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (widok === 'dj') {
    const utargKolejka = piosenki.filter(p => p.platna).reduce((sum, p) => sum + (p.kwota || 10), 0);
    const utargZagrane = zaakceptowane.filter(p => p.platna).reduce((sum, p) => sum + (p.kwota || 10), 0);
    const utargVip = utargKolejka + utargZagrane;

    return (
      <div style={{ ...STYLES.page, padding: '20px' }}>
        <GlobalStyles />
        <WyskakujacePowiadomienie powiadomienie={powiadomienie} />

        {pokazQR && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 100000, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', animation: 'fadeIn 0.3s', backdropFilter: 'blur(10px)' }}>
            <h2 style={{ color: COLORS.gold, marginBottom: '30px', fontSize: '2.5rem', textAlign: 'center' }}>Skanuj i zamawiaj! 📲</h2>
            <div style={{ background: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 0 60px rgba(255,215,0,0.2)' }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(window.location.origin)}`} alt="QR Code" style={{ width: '100%', maxWidth: '350px', height: 'auto', display: 'block' }} />
            </div>
            <button onClick={() => setPokazQR(false)} style={{ ...STYLES.btnGhost, color: '#fff', fontSize: '1.2rem', marginTop: '40px', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 40px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)' }}>✕ Zamknij</button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => setWidok('start')} style={STYLES.btnGhost}>← Wyloguj</button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setDzwiekWlaczony(!dzwiekWlaczony)} style={{ background: dzwiekWlaczony ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)', color: dzwiekWlaczony ? COLORS.green : COLORS.red, border: `1px solid ${dzwiekWlaczony ? COLORS.green : COLORS.red}`, padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', backdropFilter: 'blur(5px)' }}>
              {dzwiekWlaczony ? '🔊 Powiadomienia ON' : '🔇 Wyciszone'}
            </button>
            <button onClick={() => setPokazQR(true)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', backdropFilter: 'blur(5px)' }}>
              📱 Pokaż QR
            </button>
          </div>
        </div>

        <h1 style={{ textAlign: 'center', marginBottom: '30px', marginTop: '-10px' }}>🎧 Konsoleta</h1>
        <div style={STYLES.containerWide}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: COLORS.earningsGreenBg, border: `1px solid ${COLORS.earningsGreenBorder}`, padding: '15px', borderRadius: '10px', flex: 1, minWidth: '150px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '5px', fontWeight: 'bold' }}>UTARG DZISIAJ (VIP)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: COLORS.earningsGreenValue, padding: '10px 0' }}>{utargVip} PLN</div>
              <button onClick={() => { if (window.confirm('Na pewno wyzerować utarg?')) { setZaakceptowane([]); localStorage.removeItem('historiaWplywow'); } }} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline', marginTop: '5px' }}>
                Zeruj utarg
              </button>
            </div>
            <div style={{ backgroundColor: COLORS.bgInput, border: `2px solid ${COLORS.gold}`, padding: '15px', borderRadius: '10px', flex: 1, minWidth: '150px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: COLORS.gold, marginBottom: '5px', fontWeight: 'bold' }}>CENA VIP (PLN)</div>
              <input type="number" min="10" value={cenaVip} onChange={handleZmianaCeny} style={{ ...STYLES.input, backgroundColor: COLORS.bg, fontSize: '1.5rem', padding: '10px', textAlign: 'center', fontWeight: 'bold', color: COLORS.gold }} />
            </div>
            <div style={{ backgroundColor: COLORS.bgInput, padding: '15px', borderRadius: '10px', flex: 2, minWidth: '250px' }}>
              <div style={{ fontSize: '0.8rem', color: COLORS.textMuted, marginBottom: '5px' }}>EDYCJA PASKA OGŁOSZEŃ</div>
              <input type="text" value={tekstOgloszenia} onChange={handleZmianaPaska} style={{ ...STYLES.input, backgroundColor: COLORS.bg, fontSize: '1rem', padding: '10px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.2rem', color: COLORS.blue, borderBottom: `1px solid ${COLORS.borderSubtle}`, paddingBottom: '10px' }}>📥 Oczekujące ({piosenki.length})</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', backgroundColor: COLORS.bgInput, padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', color: COLORS.textSecondary, alignItems: 'center', border: `1px solid ${COLORS.borderSubtle}` }}>
              <span style={{ fontWeight: 'bold', color: COLORS.textMuted }}>Powody odrzucenia:</span>
              <span>🎭 Inny klimat</span> | <span>⏳ Niedawno była</span> | <span>❓ Mało znana</span> | <span>🤬 Wulgarna dedykacja</span>
            </div>

            {pierwszeLadowanie ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}><SkeletonKolejki /><SkeletonKolejki /><SkeletonKolejki /></div>
            ) : piosenki.length === 0 ? (
              <p style={{ color: COLORS.textDisabled, fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>Brak zamówień — cisza przed burzą! 🌪️</p>
            ) : (
              piosenki.map((piosenka) => (
                <div key={piosenka.id} style={{ backgroundColor: COLORS.bgElevated, padding: '15px', marginBottom: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: piosenka.platna ? `5px solid ${COLORS.gold}` : `5px solid ${COLORS.blue}` }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, paddingRight: '10px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      {piosenka.okladka && <img src={piosenka.okladka} alt="Okładka" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />}
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{piosenka.tytul}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', marginTop: '2px', flexWrap: 'wrap' }}>
                      <span style={{ color: piosenka.platna ? COLORS.gold : COLORS.voteRed, fontWeight: 'bold' }}>
                        {piosenka.platna ? `💎 PRIORYTET` : `🔥 Głosy: ${piosenka.glosy || 0}`}
                      </span>
                      {piosenka.wiadomosc && <span style={{ color: COLORS.textMuted, fontStyle: 'italic' }}>💌 {piosenka.wiadomosc}</span>}
                    </div>
                    {/* BPM + Key z bazy (cache GetSongBPM) */}
                    <BpmKeyBadge bpm={piosenka.bpm} keyCamelot={piosenka.key_camelot} status={piosenka.bpm_status} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {idOdrzucanej === piosenka.id ? (
                      <div style={{ display: 'flex', gap: '5px', animation: 'fadeIn 0.2s' }}>
                        <button onClick={() => odrzucPiosenke(piosenka, "Inny klimat 🎭")} style={STYLES.btnReason}>🎭</button>
                        <button onClick={() => odrzucPiosenke(piosenka, "Niedawno była ⏳")} style={STYLES.btnReason}>⏳</button>
                        <button onClick={() => odrzucPiosenke(piosenka, "Mało znana ❓")} style={STYLES.btnReason}>❓</button>
                        <button onClick={() => odrzucPiosenke(piosenka, "Wulgarna dedykacja 🤬")} style={STYLES.btnReason}>🤬</button>
                        <button onClick={() => setIdOdrzucanej(null)} style={{ ...STYLES.btnReason, backgroundColor: '#555' }}>✕</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => akceptujPiosenke(piosenka)} disabled={idAkceptowanej === piosenka.id} style={{ ...STYLES.btnAccept, opacity: idAkceptowanej === piosenka.id ? 0.7 : 1, cursor: idAkceptowanej === piosenka.id ? 'wait' : 'pointer' }}>
                          {idAkceptowanej === piosenka.id ? '⏳ Trwa...' : '✓ Zagrane'}
                        </button>
                        <button onClick={() => setIdOdrzucanej(piosenka.id)} style={STYLES.btnReject}>✕</button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', color: COLORS.textDim }}>
            Dane BPM / Key: <a href="https://getsongbpm.com" target="_blank" rel="noreferrer" style={{ color: COLORS.textDisabled, textDecoration: 'underline' }}>GetSongBPM</a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}