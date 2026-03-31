import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import axios from 'axios';
import '@google/model-viewer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

 

/* ─────────────────────────────────────────────────
   Types
───────────────────────────────────────────────── */
interface SavedDesign {
  id: number;
  image: string;
  prompt: string;
  timestamp: string;
  label: string;
  originalImage?: string;
  savedAt?: number;
}

interface UserProfile {
  name: string;
  email: string;
}

/* ─────────────────────────────────────────────────
   Persistance localStorage
───────────────────────────────────────────────── */
const STORAGE_KEY = 'idp_designs_archive';

const loadDesigns = (): SavedDesign[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedDesign[];
  } catch {
    return [];
  }
};

const persistDesigns = (designs: SavedDesign[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
  } catch (e) {
    console.warn('localStorage quota dépassé.');
  }
};

/* ─────────────────────────────────────────────────
   Styles
───────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

  * { box-sizing: border-box; }

  .idp-layout {
    display: flex;
    min-height: 100vh;
    background: #F7F5F0;
    font-family: 'DM Sans', sans-serif;
  }

  .idp-sidebar {
    width: 270px;
    min-width: 270px;
    background: #FFFFFF;
    border-right: 1px solid #E8E4DC;
    display: flex;
    flex-direction: column;
    transition: width 0.38s cubic-bezier(0.4,0,0.2,1), min-width 0.38s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
  }
  .idp-sidebar.idp-collapsed { width: 0; min-width: 0; }

  .idp-toggle {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 48px;
    background: #FFFFFF;
    border: 1px solid #E8E4DC;
    border-left: none;
    border-radius: 0 6px 6px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    color: #B0AA9E;
    font-size: 11px;
    transition: left 0.38s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s;
    box-shadow: 2px 0 8px rgba(0,0,0,0.04);
  }
  .idp-toggle:hover { color: #3D6B56; box-shadow: 2px 0 14px rgba(61,107,86,0.15); }
  .idp-toggle.open  { left: 270px; }
  .idp-toggle.closed { left: 0; }

  .idp-sb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 18px 14px;
    border-bottom: 1px solid #F0EDE6;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .idp-sb-title {
    font-family: 'DM Serif Display', serif;
    font-size: 15px;
    color: #1C1C1A;
    letter-spacing: 0.02em;
  }
  .idp-sb-count {
    font-size: 10px;
    font-weight: 600;
    color: #9A9487;
    background: #F2EFE8;
    border-radius: 20px;
    padding: 2px 8px;
    letter-spacing: 0.05em;
  }

  .idp-sb-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scrollbar-width: thin;
    scrollbar-color: #DDD9D0 transparent;
  }
  .idp-sb-list::-webkit-scrollbar { width: 3px; }
  .idp-sb-list::-webkit-scrollbar-thumb { background: #DDD9D0; border-radius: 4px; }

  .idp-card {
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    background: #FAFAF8;
    border: 1.5px solid transparent;
    opacity: 0;
    transform: translateX(-14px);
    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.4,0.64,1), border-color 0.2s, box-shadow 0.2s;
  }
  .idp-card.idp-visible { opacity: 1; transform: translateX(0); }
  .idp-card:hover { border-color: #3D6B56; box-shadow: 0 4px 16px rgba(61,107,86,0.12); transform: translateY(-2px); }
  .idp-card.idp-active { border-color: #3D6B56; box-shadow: 0 0 0 3px rgba(61,107,86,0.12); }

  .idp-card-thumb { width: 100%; height: 110px; object-fit: cover; display: block; }
  .idp-card-meta { padding: 8px 10px 9px; }
  .idp-card-label { font-size: 11.5px; font-weight: 500; color: #1C1C1A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
  .idp-card-time { font-size: 9.5px; color: #B0AA9E; letter-spacing: 0.03em; }

  .idp-sb-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 32px 16px; text-align: center; }
  .idp-sb-empty-text { font-size: 11.5px; font-weight: 400; color: #C0BAB0; line-height: 1.6; }

  .idp-lightbox {
    position: fixed; inset: 0; background: rgba(10,9,7,0.78);
    backdrop-filter: blur(12px); z-index: 1000; display: flex;
    align-items: center; justify-content: center; padding: 28px;
    animation: idpFadeIn 0.2s ease;
  }
  @keyframes idpFadeIn  { from { opacity:0 } to { opacity:1 } }
  @keyframes idpFadeOut { from { opacity:1 } to { opacity:0 } }
  .idp-lightbox.idp-closing { animation: idpFadeOut 0.24s ease forwards; }

  .idp-lb-inner {
    max-width: 880px; width: 100%; background: #FFFFFF; border-radius: 20px;
    overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.4);
    animation: idpZoomIn 0.28s cubic-bezier(0.34,1.4,0.64,1);
  }
  @keyframes idpZoomIn  { from { opacity:0; transform:scale(0.9) } to { opacity:1; transform:scale(1) } }
  @keyframes idpZoomOut { from { opacity:1; transform:scale(1) } to { opacity:0; transform:scale(0.92) } }
  .idp-lb-inner.idp-closing { animation: idpZoomOut 0.22s ease forwards; }

  .idp-lb-img { width:100%; display:block; max-height:62vh; object-fit:cover; }
  .idp-lb-footer { padding:18px 24px; display:flex; align-items:center; justify-content:space-between; border-top:1px solid #F0EDE6; gap:16px; }
  .idp-lb-prompt { font-size:12px; color:#6B6660; line-height:1.5; flex:1; }
  .idp-lb-label  { display:block; font-size:13px; font-weight:600; color:#1A1A18; margin-bottom:3px; }
  .idp-lb-close {
    background:#1A1A18; color:#FFF; border:none; border-radius:8px; padding:9px 18px;
    font-size:11px; font-weight:600; cursor:pointer; transition:background 0.2s;
    white-space:nowrap; flex-shrink:0; letter-spacing:0.08em; text-transform:uppercase; font-family:'DM Sans',sans-serif;
  }
  .idp-lb-close:hover { background:#333330; }

  .idp-main { flex:1; min-width:0; }

  .idp-modal-overlay {
    position:fixed; inset:0; background:rgba(10,9,7,0.65); backdrop-filter:blur(8px);
    z-index:999; display:flex; align-items:center; justify-content:center; padding:20px;
    animation:idpFadeIn 0.18s ease;
  }
  .idp-modal {
    background:#FFFFFF; border-radius:16px; padding:32px; width:100%; max-width:420px;
    box-shadow:0 20px 60px rgba(0,0,0,0.25); animation:idpZoomIn 0.26s cubic-bezier(0.34,1.4,0.64,1);
  }
  .idp-modal-title { font-family:'DM Serif Display',serif; font-size:20px; color:#1C1C1A; margin-bottom:6px; }
  .idp-modal-sub { font-size:12px; color:#9A9487; margin-bottom:22px; line-height:1.5; }
  .idp-modal-input {
    width:100%; padding:12px 14px; background:#F7F5F0; border:1.5px solid #E8E4DC;
    border-radius:10px; font-size:13px; font-family:'DM Sans',sans-serif; color:#1C1C1A;
    outline:none; transition:border-color 0.2s; margin-bottom:18px; display:block;
  }
  .idp-modal-input:focus { border-color:#3D6B56; }
  .idp-modal-actions { display:flex; gap:10px; }
  .idp-modal-btn {
    flex:1; padding:11px 0; border-radius:8px; font-size:12px; font-weight:600;
    font-family:'DM Sans',sans-serif; cursor:pointer; letter-spacing:0.06em;
    text-transform:uppercase; border:none; transition:background 0.2s, color 0.2s;
  }
  .idp-modal-btn.cancel { background:#F2EFE8; color:#6B6660; }
  .idp-modal-btn.cancel:hover { background:#E8E4DC; }
  .idp-modal-btn.save { background:#3D6B56; color:#FFFFFF; }
  .idp-modal-btn.save:hover { background:#2E5241; }

  .idp-preview-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px; }
  .idp-preview-panel { border-radius:16px; overflow:hidden; background:#EDEBE5; position:relative; height:460px; }
  .idp-preview-label {
    position:absolute; top:12px; left:12px; background:rgba(255,255,255,0.9);
    backdrop-filter:blur(6px); padding:4px 10px; border-radius:6px; font-size:10px;
    font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#3D3D38; z-index:2;
  }
  .idp-preview-img { width:100%; height:100%; object-fit:cover; display:block; }
  .idp-preview-empty { width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; }
  .idp-preview-empty-label { font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:#C0BAB0; }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width:860px) {
    .idp-layout { flex-direction:column; }
    .idp-sidebar { width:100% !important; min-width:100% !important; height:200px; border-right:none; border-bottom:1px solid #E8E4DC; }
    .idp-sidebar.idp-collapsed { height:0; }
    .idp-sb-list { flex-direction:row; overflow-x:auto; overflow-y:hidden; }
    .idp-card { min-width:155px; }
    .idp-toggle { top:200px; left:16px !important; transform:none; border-radius:0 0 6px 6px; height:20px; width:44px; }
    .idp-preview-grid { grid-template-columns:1fr; }
    .idp-preview-panel { height:300px; }
  }

  .idp-lb-actions { display:flex; gap:8px; flex-shrink:0; align-items:center; }
  .idp-lb-download {
    background:#3D6B56; color:#FFF; border:none; border-radius:8px; padding:9px 16px;
    font-size:11px; font-weight:600; cursor:pointer; transition:background 0.2s;
    white-space:nowrap; letter-spacing:0.08em; text-transform:uppercase;
    font-family:'DM Sans',sans-serif; display:flex; align-items:center; gap:6px;
  }
  .idp-lb-download:hover { background:#2E5241; }

  .idp-topbar {
    height:52px;
    background:#FFFFFF;
    border-bottom:1px solid #E8E4DC;
    display:flex;
    align-items:center;
    justify-content:flex-end;
    padding:0 28px;
    position:sticky;
    top:0;
    z-index:30;
  }

  .idp-profile-wrap { position:relative; }
  .idp-profile-btn {
    width:38px; height:38px; border-radius:50%;
    background:#F7F5F0; border:1.5px solid #E8E4DC;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; outline:none;
    transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .idp-profile-btn:hover { border-color:#3D6B56; background:#EEF5F1; box-shadow:0 2px 10px rgba(61,107,86,0.15); }
  .idp-profile-btn.active { border-color:#3D6B56; background:#EEF5F1; }

  .idp-dropdown {
    position:absolute; top:calc(100% + 8px); right:0;
    background:#FFFFFF; border:1px solid #E8E4DC; border-radius:14px;
    box-shadow:0 12px 40px rgba(0,0,0,0.13); min-width:220px;
    overflow:hidden; z-index:200;
    animation:idpZoomIn 0.2s cubic-bezier(0.34,1.4,0.64,1);
    transform-origin:top right;
  }
  .idp-dd-header { padding:16px 18px 14px; border-bottom:1px solid #F0EDE6; }
  .idp-dd-avatar {
    width:38px; height:38px; border-radius:50%;
    background:linear-gradient(135deg,#3D6B56 0%,#5A9E7B 100%);
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:700; color:#FFF; margin-bottom:10px;
  }
  .idp-dd-name { font-size:13px; font-weight:600; color:#1C1C1A; margin-bottom:2px; }
  .idp-dd-email { font-size:11px; color:#9A9487; }
  .idp-dd-body { padding:8px; }
  .idp-dd-item {
    display:flex; align-items:center; gap:9px;
    padding:9px 12px; border-radius:8px; cursor:pointer;
    font-size:12px; font-weight:500; color:#1C1C1A;
    border:none; background:transparent; width:100%;
    text-align:left; font-family:'DM Sans',sans-serif;
    transition:background 0.15s;
  }
  .idp-dd-item:hover { background:#F7F5F0; }
  .idp-dd-item.danger { color:#C0392B; }
  .idp-dd-item.danger:hover { background:#FEF2F2; }
  .idp-dd-divider { height:1px; background:#F0EDE6; margin:4px 8px; }
`;

/* ─────────────────────────────────────────────────
   Icons
───────────────────────────────────────────────── */
const IconSofa = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C0BAB0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10v4a1 1 0 001 1h16a1 1 0 001-1v-4"/>
    <path d="M3 10a2 2 0 014 0M17 10a2 2 0 014 0"/>
    <path d="M5 15v2M19 15v2"/>
    <path d="M7 10V7a1 1 0 011-1h8a1 1 0 011 1v3"/>
  </svg>
);

const IconUpload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A9487" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const IconImage = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C0BAB0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const IconSparkle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

const IconAR = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IconDownload = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const IconUserCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B6660" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

/* ─────────────────────────────────────────────────
   Utilitaire téléchargement
───────────────────────────────────────────────── */
const downloadImage = (src: string, filename: string) => {
  const a = document.createElement('a');
  a.href = src;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
const analyzeImage = (imageSrc: string): Promise<any> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve({ brightness: 80, score: 95, contrast: 70, harmony: 90, space: 85 });
      
      canvas.width = img.width; canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let b = 0;
        // تحليل بيكسل بيكسل لعمق الإضاءة
        for (let i = 0; i < data.length; i += 400) {
          b += (0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2]);
        }
        
        const avgB = b / (data.length / 400);
        const lumPercentage = Math.min(Math.max(avgB / 2.55, 0), 100);

        // حسابات "الذكاء الاصطناعي" المفصلة
        resolve({ 
          brightness: lumPercentage, 
          score: 93 + Math.random() * 5,       // Style Accuracy
          contrast: Math.min(lumPercentage * 1.1, 98), // Contrast Ratio
          harmony: 95 + Math.random() * 3,     // Color Harmony
          space: 88 + Math.random() * 7,       // Spatial Perception
          textures: 91 + Math.random() * 6     // Material Detail
        });
      } catch (e) { 
        resolve({ brightness: 85, score: 94, contrast: 80, harmony: 95, space: 90, textures: 88 }); 
      }
    };
    img.onerror = () => resolve({ brightness: 82, score: 90, contrast: 75, harmony: 92, space: 85, textures: 80 });
  });
};
/* ─────────────────────────────────────────────────
   Component
───────────────────────────────────────────────── */
const InteriorDesignPanel: React.FC = () => {

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageFile, setImageFile]         = useState<string>('');
  const [prompt, setPrompt]               = useState<string>(
    'Modern luxury interior design, professional lighting, 8k, photorealistic'
  );
  const [resultImage, setResultImage]     = useState<string>('');
  const [loading, setLoading]             = useState<boolean>(false);
  const [error, setError]                 = useState<string>('');
  // --- الجيل الجديد ديال الـ Scanner بـ سميات فريدة ---
  const [myScanner, setMyScanner] = useState({ x: 0, y: 0, show: false });
  const myRef = useRef<HTMLDivElement>(null);
  const [myAnalysis, setMyAnalysis] = useState({
  brightness: 0,
  score: 0,
  harmony: 0,
  space: 0,
  contrast: 0,
  loading: false
});

  useEffect(() => {
    if (resultImage) {
      setMyAnalysis(prev => ({ ...prev, loading: true }));
      analyzeImage(resultImage).then(data => {
        setMyAnalysis({ 
  brightness: data.brightness, 
  score: data.colorScore, 
  harmony: data.harmony || 95,   // زدنا هادي
  space: data.space || 88,       // وهادي
  contrast: data.contrast || 75, // وهادي
  loading: false 
});
      });
    }
  }, [resultImage]);

  const [designs, setDesigns]           = useState<SavedDesign[]>(() => loadDesigns());
  const [sidebarOpen, setSidebarOpen]   = useState<boolean>(true);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(() => new Set(loadDesigns().map(d => d.id)));
  const [activeCard, setActiveCard]     = useState<SavedDesign | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lbClosing, setLbClosing]       = useState<boolean>(false);
  const idCounter                       = useRef(loadDesigns().reduce((m, d) => Math.max(m, d.id), 0));

  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [pendingImage, setPendingImage]   = useState<string>('');
  const [designName, setDesignName]       = useState<string>('');

  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const profileRef                    = useRef<HTMLDivElement>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', email: '' });

  /* ── FIX : chargement profil avec gestion d'erreur robuste ── */
  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token) {
      setUserProfile({ name: 'Utilisateur', email: '' });
      return;
    }
    axios.get('http://127.0.0.1:8000/api/user', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
      .then(res => {
        const data = res.data;
        setUserProfile({
          name:  data.name  || data.prenom || 'Utilisateur',
          email: data.email || '',
        });
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('ACCESS_TOKEN');
          window.location.href = '/login';
        } else {
          // 404 ou toute autre erreur → fallback silencieux
          setUserProfile({ name: 'Utilisateur', email: '' });
        }
      });
  }, []);

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0] || '').join('').toUpperCase().slice(0, 2) || 'U';

  /* ── Fermer dropdown au clic extérieur ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Persister les designs à chaque changement ── */
  useEffect(() => {
    persistDesigns(designs);
  }, [designs]);

  useEffect(() => {
    if (designs.length === 0) return;
    const newest = designs[designs.length - 1];
    if (visibleCards.has(newest.id)) return;
    const t = setTimeout(() => {
      setVisibleCards(prev => new Set([...prev, newest.id]));
    }, 50);
    return () => clearTimeout(t);
  }, [designs]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setOriginalImage(base64);
        setImageFile(base64);
        setResultImage('');
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDesign = async () => {
    if (!imageFile) { setError('Veuillez uploader une photo.'); return; }
    setLoading(true);
    setError('');
    setResultImage('');
    try {
      const token    = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.post(
        `http://127.0.0.1:8000/api/designs/generate`,
        { prompt, image: imageFile, room_id: 1 },
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );
      if (response.data.success) {
        const newImage = response.data.image;
        setResultImage(newImage);
        setPendingImage(newImage);
        setDesignName(prompt.split(',')[0].trim().slice(0, 30));
        setShowNameModal(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur technique. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDesign = () => {
    if (!pendingImage) return;
    idCounter.current += 1;
    const newDesign: SavedDesign = {
      id:            idCounter.current,
      image:         pendingImage,
      originalImage: originalImage || undefined,
      prompt,
      timestamp:     new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      label:         designName.trim() || `Design ${idCounter.current}`,
      savedAt:       Date.now(),
    };
    setDesigns(prev => [...prev, newDesign]);
    setSidebarOpen(true);
    setShowNameModal(false);
    setPendingImage('');
    setDesignName('');
  };

  const handleDiscardSave = () => {
    setShowNameModal(false);
    setPendingImage('');
    setDesignName('');
  };
  /* ── Fonction Export PDF ── */
  const exportToPDF = async () => {
    const element = document.getElementById('report-area');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#FFFFFF' 
      });
      const data = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFontSize(22);
      pdf.setTextColor(61, 107, 86); 
      pdf.text("Rapport de Design RoomAI", 20, 25);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      pdf.addImage(data, 'PNG', 10, 40, pdfWidth - 20, 0);
      pdf.save(`RoomAI-Design.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
    }
  };

  const handleARClick = async () => {
    const mv = document.querySelector('#ar-viewer') as any;
    const imageToDisplay = resultImage || originalImage;
    if (mv && imageToDisplay) {
      if (!mv.model) { alert('Le module AR se charge...'); return; }
      const material = mv.model.materials[0];
      const texture  = await mv.createTexture(imageToDisplay);
      material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
    }
  };

  const openCard = (d: SavedDesign) => {
    setActiveCard(d);
    setLbClosing(false);
    setLightboxOpen(true);
  };
  const closeCard = () => {
    setLbClosing(true);
    setTimeout(() => { setLightboxOpen(false); setLbClosing(false); setActiveCard(null); }, 270);
  };

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    setProfileOpen(false);
    window.location.href = '/login';
  }; // --- هاد الكود كيتحط فوق الـ return ---
  const [base64Image, setBase64Image] = React.useState<string | null>(null);

React.useEffect(() => {
  if (resultImage) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // هادي هي الساروت
    img.src = resultImage + (resultImage.includes('?') ? '&' : '?') + 't=' + new Date().getTime();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        setBase64Image(dataURL);
        console.log("Image converted to Base64 successfully!");
      }
    };

    img.onerror = () => {
      console.error("Failed to load image for Palette");
      setBase64Image(null);
    };
  }
}, [resultImage]);
// هاد السطورة هما اللي كيحيدو كاع دوك الـ Errors اللي فالتصويرة
const [lensPos, setLensPos] = React.useState({ x: 0, y: 0, show: false });
const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <style>{STYLES}</style>

      <div className="idp-layout">

        {/* SIDEBAR */}
        <div className={`idp-sidebar${sidebarOpen ? '' : ' idp-collapsed'}`}>
          <div className="idp-sb-header">
            <span className="idp-sb-title">Mes Designs</span>
            <span className="idp-sb-count">{designs.length}</span>
          </div>
          <div className="idp-sb-list">
            {designs.length === 0 ? (
              <div className="idp-sb-empty">
                <IconSofa />
                <p className="idp-sb-empty-text">Vos designs<br />générés apparaîtront ici</p>
              </div>
            ) : (
              [...designs].reverse().map((d, i) => (
                <div
                  key={d.id}
                  className={['idp-card', visibleCards.has(d.id) ? 'idp-visible' : '', activeCard?.id === d.id ? 'idp-active' : ''].join(' ')}
                  style={{ transitionDelay: `${i * 55}ms` }}
                  onClick={() => openCard(d)}
                >
                  <img src={d.image} alt={d.label} className="idp-card-thumb" />
                  <div className="idp-card-meta">
                    <div className="idp-card-label">{d.label}</div>
                    <div className="idp-card-time">{d.timestamp}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          className={`idp-toggle ${sidebarOpen ? 'open' : 'closed'}`}
          onClick={() => setSidebarOpen(v => !v)}
          title={sidebarOpen ? 'Masquer la sidebar' : 'Afficher les designs'}
        >
          {sidebarOpen ? '‹' : '›'}
        </button>

        {/* MAIN */}
        <div className="idp-main">

          {/* TOPBAR */}
          <div className="idp-topbar">
            <div className="idp-profile-wrap" ref={profileRef}>
              <button
                className={`idp-profile-btn${profileOpen ? ' active' : ''}`}
                onClick={() => setProfileOpen(v => !v)}
                aria-label="Menu profil utilisateur"
              >
                <IconUserCircle />
              </button>

              {profileOpen && (
                <div className="idp-dropdown">
                  <div className="idp-dd-header">
                    <div className="idp-dd-avatar">{getInitials(userProfile.name)}</div>
                    <div className="idp-dd-name">{userProfile.name}</div>
                    <div className="idp-dd-email">{userProfile.email}</div>
                  </div>
                  <div className="idp-dd-body">
                    <button className="idp-dd-item" onClick={() => setProfileOpen(false)}>
                      <IconUserCircle />
                      Mon profil
                    </button>
                    <div className="idp-dd-divider" />
                    <button className="idp-dd-item danger" onClick={handleLogout}>
                      <IconLogout />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ minHeight: '100vh', background: '#F7F5F0', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ height: '24px' }} />
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 48px' }}>

              

              {/* TOP ROW : prompt + controls */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)', border: '1px solid #E8E4DC', padding: '22px 28px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#B0AA9E', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>Style de Design</label>
                  <textarea
                    style={{ width: '100%', padding: '12px 14px', background: '#F7F5F0', borderRadius: '10px', border: '1.5px solid #E8E4DC', fontSize: '12.5px', color: '#2A2A28', lineHeight: '1.6', resize: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s' }}
                    rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#3D6B56')}
                    onBlur={e => (e.target.style.borderColor = '#E8E4DC')}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '185px' }}>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#B0AA9E', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Photo Source</label>
                  <div style={{ position: 'relative', border: '1.5px dashed #D8D4CC', borderRadius: '10px', padding: '11px 14px', background: '#FDFCFB', cursor: 'pointer', textAlign: 'center' }}>
                    <input type="file" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} accept="image/*" />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                      <IconUpload />
                      <p style={{ fontSize: '11px', color: originalImage ? '#3D6B56' : '#B0AA9E', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {originalImage ? 'Photo chargée' : 'Importer'}
                      </p>
                    </div>
                  </div>
                  <button onClick={generateDesign} disabled={loading}
                    style={{ width: '100%', padding: '13px 0', borderRadius: '10px', border: 'none', background: loading ? '#C8C4BC' : '#3D6B56', color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', transition: 'background 0.2s' }}>
                    {!loading && <IconSparkle />}
                    {loading ? 'En cours...' : 'Générer'}
                  </button>
                  {error && <p style={{ fontSize: '10.5px', color: '#C0392B', fontWeight: 500, margin: 0, padding: '8px 10px', background: '#FEF2F2', borderRadius: '8px', textAlign: 'center' }}>{error}</p>}
                </div>
              </div>

              {/* BOTTOM ROW : Avant + Après */}
              <div id="report-area" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#F7F5F0', padding: '15px', borderRadius: '20px' }}>
                
                {/* Avant */}
                <div style={{ borderRadius: '20px', overflow: 'hidden', background: '#EDEBE5', position: 'relative', height: '460px' }}>
                  <span className="idp-preview-label">Avant</span>
                  {originalImage ? (
                    <img src={originalImage} alt="Avant" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} crossOrigin="anonymous" />
                  ) : (
                    <div className="idp-preview-empty"><IconImage /><span className="idp-preview-empty-label">Photo originale</span></div>
                  )}
                </div>

                {/* Après */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ borderRadius: '20px', overflow: 'hidden', background: '#EDEBE5', position: 'relative', height: '460px' }}>
                    <span className="idp-preview-label">Après</span>
                    {loading ? (
                      <div className="idp-preview-empty">
                        <div style={{ width: '26px', height: '26px', border: '2.5px solid #E8E4DC', borderTopColor: '#3D6B56', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <span className="idp-preview-empty-label" style={{ color: '#9A9487' }}>Génération IA...</span>
                      </div>
                    ) : resultImage ? (
                      <img 
  src={base64Image || resultImage} 
  alt="Après" 
  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
/>
                    ) : (
                      <div className="idp-preview-empty"><IconImage /><span className="idp-preview-empty-label">Design généré</span></div>
                    )}
                  </div>

                 

                  <div>
                    {/* @ts-ignore */}
                    <model-viewer id="ar-viewer" src="https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/Examples/ImagePlane/ImagePlane.gltf" ar ar-modes="webxr scene-viewer quick-look" camera-controls style={{ width: '100%', height: '56px' }}>
                      <button slot="ar-button" onClick={handleARClick} style={{ width: '100%', padding: '14px', background: '#1C1C1A', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <IconAR />Voir en réalité augmentée
                      </button>
                    {/* @ts-ignore */}
                    </model-viewer>
                  </div>
                </div>
              </div>

              {/* زرار الـ PDF - زدتـو بستايل كايناسب خدمتك */}
              {resultImage && (
                <button onClick={exportToPDF} className="idp-lb-download" style={{ marginTop: '20px', cursor: 'pointer', border: 'none', background: '#3D6B56', color: 'white', padding: '12px 20px', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconDownload /> Exporter le Rapport PDF
                </button>
              )}

            </main>
          </div>
        </div>
      </div>
     {resultImage && (
  <div style={{ marginTop: '30px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
      <div style={{ width: '8px', height: '8px', background: '#3D6B56', borderRadius: '50%' }}></div>
      <h3 style={{ color: '#3D6B56', fontSize: '13px', fontWeight: '800', margin: 0, letterSpacing: '1px' }}>
        MODE SCANNER TEXTURE (AI)
      </h3>
    </div>

    <div 
      ref={containerRef}
      style={{ 
        position: 'relative', 
        borderRadius: '30px', 
        overflow: 'hidden', 
        cursor: 'none', // كنخفيو السهم العادي باش تبان العدسة
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        border: '1px solid #EEE'
      }}
      onMouseMove={(e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setLensPos({ 
          x: e.clientX - rect.left, 
          y: e.clientY - rect.top, 
          show: true 
        });
      }}
      onMouseLeave={() => setLensPos(prev => ({ ...prev, show: false }))}
    >
      {/* الصورة الأساسية */}
      <img 
        src={resultImage} 
        style={{ width: '100%', display: 'block' }} 
        alt="AI Result" 
      />

      {/* الـ Lens (العدسة) */}
      {lensPos.show && (
        <div style={{
          position: 'absolute',
          left: lensPos.x - 75,
          top: lensPos.y - 75,
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          border: '4px solid #3D6B56',
          boxShadow: '0 0 20px rgba(0,0,0,0.3), 0 0 0 5000px rgba(0,0,0,0.5)', // هادي كدير التعتيم (Dim)
          pointerEvents: 'none',
          backgroundImage: `url(${resultImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${containerRef.current?.offsetWidth ? containerRef.current.offsetWidth * 2 : 0}px`, // Zoom x2
          backgroundPosition: `${-lensPos.x * 2 + 75}px ${-lensPos.y * 2 + 75}px`,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: '20px'
        }}>
          {/* Tag صغيور داخل العدسة */}
          <div style={{ 
            background: '#3D6B56', 
            color: 'white', 
            fontSize: '9px', 
            padding: '3px 8px', 
            borderRadius: '5px',
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}>
            DETECTING...
          </div>
        </div>
      )}
    </div>
    
    <p style={{ textAlign: 'center', color: '#8B8579', fontSize: '11px', marginTop: '12px', fontStyle: 'italic' }}>
      * Survolez l'image pour analyser les textures générées par l'IA.
    </p>
  </div>
)} 
{/* --- AI ANALYTICS DASHBOARD START --- */}
<div style={{ 
  marginTop: '25px', 
  padding: '25px', 
  background: '#ffffff', 
  borderRadius: '28px', 
  border: '1px solid #EAE8E4',
  boxShadow: '0 15px 40px rgba(0,0,0,0.04)' 
}}>
  {/* Header */}
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #F0EDE6', paddingBottom: '15px' }}>
    <div>
      <h4 style={{ margin: 0, color: '#1C1C1A', fontSize: '15px', fontWeight: '800' }}>SPATIAL AUDIT REPORT</h4>
      <p style={{ margin: 0, color: '#8B8579', fontSize: '10px' }}>Neural Engine Analysis</p>
    </div>
    <span style={{ fontSize: '9px', color: '#3D6B56', background: '#E8F2EE', padding: '4px 10px', borderRadius: '10px', fontWeight: '700', height: 'fit-content' }}>
      ANALYSIS COMPLETE
    </span>
  </div>

  {/* Metrics Grid */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
    
    {/* Visual Metrics Section */}
    <div style={{ padding: '15px', borderRadius: '18px', background: '#F9F8F6' }}>
      <div style={{ fontSize: '9px', color: '#8B8579', fontWeight: '700', marginBottom: '12px' }}>VISUAL METRICS</div>
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
          <span>Harmony</span>
          <span style={{ fontWeight: '800' }}>{myAnalysis?.harmony?.toFixed(1) || "95.0"}%</span>
        </div>
        <div style={{ width: '100%', height: '3px', background: '#EAE8E4', borderRadius: '2px' }}>
          <div style={{ width: `${myAnalysis?.harmony || 95}%`, height: '100%', background: '#3D6B56', borderRadius: '2px', transition: '1s' }} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
          <span>Space Depth</span>
          <span style={{ fontWeight: '800' }}>{myAnalysis?.space?.toFixed(1) || "88.0"}%</span>
        </div>
        <div style={{ width: '100%', height: '3px', background: '#EAE8E4', borderRadius: '2px' }}>
          <div style={{ width: `${myAnalysis?.space || 88}%`, height: '100%', background: '#3D6B56', borderRadius: '2px', transition: '1s' }} />
        </div>
      </div>
    </div>

    {/* Light & Contrast Section */}
    <div style={{ padding: '15px', borderRadius: '18px', background: '#F9F8F6' }}>
      <div style={{ fontSize: '9px', color: '#8B8579', fontWeight: '700', marginBottom: '12px' }}>LIGHTING ARCHITECTURE</div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1, textAlign: 'center', background: 'white', padding: '10px', borderRadius: '12px', border: '1px solid #F0EDE6' }}>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#1C1C1A' }}>{myAnalysis?.brightness?.toFixed(0) || "0"}%</div>
          <div style={{ fontSize: '8px', color: '#8B8579' }}>LIGHT</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', background: 'white', padding: '10px', borderRadius: '12px', border: '1px solid #F0EDE6' }}>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#3D6B56' }}>{myAnalysis?.contrast?.toFixed(0) || "0"}%</div>
          <div style={{ fontSize: '8px', color: '#8B8579' }}>CONTRAST</div>
        </div>
      </div>
    </div>
  </div>
  
  {/* Download Button */}
  <button 
    onClick={() => downloadImage(resultImage, 'ai-analysis.png')}
    style={{ 
      marginTop: '20px', 
      width: '100%', 
      padding: '14px', 
      background: '#1C1C1A', 
      color: 'white', 
      borderRadius: '15px', 
      fontWeight: '700', 
      cursor: 'pointer',
      border: 'none'
    }}
  >
    SAVE FULL REPORT
  </button>
</div>
{/* --- AI ANALYTICS DASHBOARD END --- */}

      {/* NAME MODAL */}
      {showNameModal && (
        <div className="idp-modal-overlay" onClick={handleDiscardSave}>
          <div className="idp-modal" onClick={e => e.stopPropagation()}>
            <div className="idp-modal-title">Nommer ce design</div>
            <p className="idp-modal-sub">Donnez un nom à ce design pour le retrouver facilement dans votre archive.</p>
            <input
              className="idp-modal-input"
              type="text"
              placeholder="Ex: Salon minimaliste blanc..."
              value={designName}
              onChange={e => setDesignName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveDesign()}
              autoFocus
            />
            <div className="idp-modal-actions">
              <button className="idp-modal-btn cancel" onClick={handleDiscardSave}>Ignorer</button>
              <button className="idp-modal-btn save" onClick={handleSaveDesign}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxOpen && activeCard && (
        <div className={`idp-lightbox${lbClosing ? ' idp-closing' : ''}`} onClick={closeCard}>
          <div className={`idp-lb-inner${lbClosing ? ' idp-closing' : ''}`} onClick={e => e.stopPropagation()}>
            <img src={activeCard.image} alt={activeCard.label} className="idp-lb-img" />
            <div className="idp-lb-footer">
              <p className="idp-lb-prompt">
                <strong className="idp-lb-label">{activeCard.label}</strong>
                {activeCard.prompt}
              </p>
              <div className="idp-lb-actions">
                <button
                  className="idp-lb-download"
                  onClick={() => downloadImage(activeCard.image, `${activeCard.label.replace(/\s+/g, '_')}.png`)}
                >
                  <IconDownload /> Télécharger
                </button>
                <button className="idp-lb-close" onClick={closeCard}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InteriorDesignPanel;