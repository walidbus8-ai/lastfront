import React, { useEffect } from 'react';

// هاد السطر ضروري باش TypeScript ما يعطيكش خطأ فـ المكونات ديال Google
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ARViewerProps {
  src: string; // رابط ملف الـ 3D (غالباً .glb)
  poster: string; // صورة كتبان قبل ما يتيليشارجا الموديل
  alt: string;
}

const ARViewer: React.FC<ARViewerProps> = ({ src, poster, alt }) => {
  useEffect(() => {
    // استيراد المكتبة فقط فـ جهة الـ Client
    import('@google/model-viewer');
  }, []);

  return (
    <div className="ar-container" style={{ width: '100%', height: '500px' }}>
      <model-viewer
        src={src}
        poster={poster}
        alt={alt}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        touch-action="pan-y"
        style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }}
      >
        <button slot="ar-button" className="ar-button">
          عرض في غرفتك (AR) 📱
        </button>
      </model-viewer>
    </div>
  );
};

export default ARViewer;