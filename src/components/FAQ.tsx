import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Comment fonctionne la génération de design par IA ?",
    answer:
      "Il vous suffit de prendre une photo de votre pièce. Notre algorithme d'IA analyse l'espace, la lumière et la disposition, puis génère automatiquement plusieurs propositions de design adaptées à votre style et budget.",
  },
  {
    question: "L'application est-elle gratuite ?",
    answer:
      "L'application propose une version gratuite avec des fonctionnalités de base. Un abonnement premium débloque l'accès illimité à tous les styles, la visualisation AR avancée et les recommandations personnalisées.",
  },
  {
    question: "Sur quelles plateformes est disponible RoomAI ?",
    answer:
      "RoomAI est disponible sur Android et iOS. L'application est développée avec Flutter pour garantir une expérience fluide sur les deux plateformes.",
  },
  {
    question: "La réalité augmentée fonctionne-t-elle sur tous les téléphones ?",
    answer:
      "La fonctionnalité AR nécessite un appareil compatible ARCore (Android) ou ARKit (iOS). La plupart des smartphones récents supportent cette technologie.",
  },
  {
    question: "Mes photos sont-elles stockées de manière sécurisée ?",
    answer:
      "Oui, toutes vos données sont chiffrées et stockées de manière sécurisée via Firebase. Vous pouvez supprimer vos photos à tout moment depuis votre profil.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tout ce que vous devez savoir sur RoomAI.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6"
              >
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
