import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/20 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-sm">R</span>
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">RoomAI</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">
              Transformez votre intérieur grâce à l'intelligence artificielle et la réalité augmentée.
              Projet de Fin d'Études.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#features" className="hover:text-foreground transition-colors">Fonctionnalités</a></li>
              <li><a href="/#gallery" className="hover:text-foreground transition-colors">Galerie</a></li>
              <li><a href="/#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><Link to="/about" className="hover:text-foreground transition-colors">À propos</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Mentions légales</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Conditions d'utilisation</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center text-sm text-muted-foreground">
          © 2025 RoomAI — Projet de Fin d'Études. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
