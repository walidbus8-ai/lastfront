import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Code2, Palette, Brain, Smartphone, Database } from "lucide-react";

const teamMembers = [
  { name: "Membre 1", role: "Développeur Mobile (Flutter)", avatar: "M1" },
  { name: "Membre 2", role: "Développeur IA (Python)", avatar: "M2" },
  { name: "Membre 3", role: "Designer UI/UX", avatar: "M3" },
  { name: "Membre 4", role: "Développeur Backend", avatar: "M4" },
];

const technologies = [
  { name: "Flutter", description: "Application mobile cross-platform", icon: Smartphone },
  { name: "Python", description: "Backend & Intelligence Artificielle", icon: Code2 },
  { name: "TensorFlow", description: "Modèles de Deep Learning", icon: Brain },
  { name: "OpenCV", description: "Analyse et traitement d'images", icon: Palette },
  { name: "Firebase", description: "Base de données & Stockage", icon: Database },
  { name: "ARCore / ARKit", description: "Réalité Augmentée", icon: Smartphone },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              À propos de RoomAI
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              RoomAI est un Projet de Fin d'Études qui combine l'intelligence artificielle
              et la réalité augmentée pour révolutionner le design d'intérieur.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Context */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                Contexte du Projet
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Ce projet de fin d'études vise à développer une application mobile innovante
                  qui aide les utilisateurs à réaménager leurs espaces de vie à l'aide de
                  technologies de pointe.
                </p>
                <p>
                  L'utilisateur prend simplement une photo de sa pièce, et l'application génère
                  automatiquement des propositions de design complètes — incluant les murs, le sol
                  et le mobilier — dans plusieurs styles (Moderne, Classique, Scandinave, etc.).
                </p>
                <p>
                  Grâce à la réalité augmentée, le résultat peut être visualisé directement
                  dans l'espace réel, offrant une expérience immersive unique avant tout changement.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Notre Équipe
            </h2>
            <p className="text-muted-foreground">Les esprits derrière RoomAI.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{member.name}</h3>
                <p className="text-muted-foreground text-xs mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Technologies Utilisées
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-card border border-border rounded-xl p-6 text-center"
              >
                <tech.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground text-sm">{tech.name}</h3>
                <p className="text-muted-foreground text-xs mt-1">{tech.description}</p>
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
