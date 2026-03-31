import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  // دالة الهبوط لسيكشن الغاليري بسلاسة
  const scrollToGallery = () => {
    const element = document.getElementById('gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white pt-20">
      {/* Background Decor - دوائر الضوء فـ الخلفية */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* الجانب الأيسر: النصوص والأزرار */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>L'IA au service de votre intérieur</span>
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-[1.1] mb-6 text-foreground">
            Rénovez votre espace <br />
            <span className="text-primary italic">en un clic</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
            Téléchargez une photo et laissez notre intelligence artificielle redéfinir votre décoration avec une précision incroyable.
          </p>

          <div className="flex flex-wrap gap-4">
            {/* زر البداية: كيدي لـ Login */}
            <Button 
              size="lg" 
              className="rounded-full px-8 h-14 text-lg gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
              onClick={() => navigate("/login")}
            >
              Commencer <ArrowRight className="w-5 h-5" />
            </Button>
            
            {/* زر الغاليري: كيهبط لتحت */}
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full px-8 h-14 text-lg border-2 hover:bg-secondary/50 transition-all"
              onClick={scrollToGallery}
            >
              Voir la galerie
            </Button>
          </div>
        </motion.div>

        {/* الجانب الأيمن: الصورة مع أنميشن السكانر (بدون البطاقة المزعجة) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative group"
        >
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white aspect-[4/5] bg-muted">
            {/* الصورة الاحترافية */}
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80" 
              alt="Design IA Showcase" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* خط السكانر الذكي (Scanning Line) */}
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_2px_rgba(var(--primary-rgb),0.8)] z-20"
            />
            
            {/* تأثير ضوئي خفيف كيتبع الخط */}
            <motion.div 
              animate={{ height: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 right-0 bg-primary/10 pointer-events-none"
            />
          </div>

          {/* توهج خلف الصورة كيعطي فخامة */}
          <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] -z-10 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;