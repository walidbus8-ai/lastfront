import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Rocket } from "lucide-react";

const teamMembers = [
  { 
    name: "Walid El Mansouri", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Walid&backgroundColor=b6e3f4&clothType=shirting&topType=shortHair" 
  },
  { 
    name: "Samira Ait Cheikh", 
    // دابا سميرة هي اللي عندها الـ Avatar بالـ Hijab
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Salma&backgroundColor=d1d4f9&clothType=blazer&topType=hijab" 
  },
  { 
    name: "Salma Sfar", 
    // وسلمى ولات عندها الـ Avatar بالـ Long Hair
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samira&backgroundColor=ffdfbf&clothType=overall&topType=longHair" 
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">
              À propos de <span className="text-primary">RoomAI</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed italic">
              "L'innovation au service de votre espace de vie."
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- VISION SECTION --- */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-foreground flex justify-center items-center gap-3">
              <Rocket className="text-primary h-8 w-8" /> Notre Vision
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              RoomAI est né d'une volonté de simplifier la rénovation et le design d'intérieur. 
              Grâce à la puissance de l'intelligence artificielle, nous offrons à chacun la possibilité 
              de visualiser son futur foyer en un instant. Notre plateforme analyse vos espaces pour 
              proposer des designs uniques, modernes et inspirants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">L'Équipe</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <div className="absolute inset-0 bg-primary/5 rounded-full scale-110 group-hover:bg-primary/10 transition-colors"></div>
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="relative z-10 w-full h-full rounded-full border-4 border-white shadow-sm bg-white"
                  />
                </div>
                <h3 className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;