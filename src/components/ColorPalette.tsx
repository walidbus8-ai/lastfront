import { useEffect, useState, useRef } from 'react';
// حيدنا الـ Import القديم اللي كان داير Error 500

const ColorPalette = ({ imageUrl }: { imageUrl: string }) => {
  const [colors, setColors] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "Anonymous"; // ضروري باش مايتبلوكاش السيت
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // هنا كنجبدو بيكسيلات من الصورة باش نخرجو الألوان بلا مكتبة خارجية
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorMap: { [key: string]: number } = {};

      // كنختارو نقط عشوائية من الصورة باش نكونو سراع
      for (let i = 0; i < imageData.length; i += 4000) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }

      // كنرتبو الألوان الأكثر ظهورا
      const sortedColors = Object.keys(colorMap)
        .sort((a, b) => colorMap[b] - colorMap[a])
        .slice(0, 5);

      setColors(sortedColors.length > 0 ? sortedColors : ['#3D6B56', '#EDEBE5', '#9A9487', '#D1C7B7', '#555555']);
    };
  }, [imageUrl]);

  return (
    <div className="mt-6 p-5 bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-200 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
          Palette de Couleurs IA
        </p>
        <span className="text-[9px] px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">Smart Extract</span>
      </div>

      <div className="flex gap-3">
        {colors.length > 0 ? (
          colors.map((color, index) => (
            <div key={index} className="flex-1 group cursor-pointer" onClick={() => navigator.clipboard.writeText(color)}>
              <div 
                className="h-14 rounded-xl shadow-md border border-white transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1" 
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] font-mono mt-2 block text-center text-stone-600 font-bold opacity-80">
                {color}
              </span>
            </div>
          ))
        ) : (
          <div className="w-full text-center text-stone-400 py-4 text-xs italic">
            Analyse des couleurs...
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPalette;