import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // زدنا useNavigate
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios"; // جبنا Axios

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // باش نديرو الـ Loading فـ Button
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // هنا الربط الحقيقي مع Laravel
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        nom: name,          // Laravel كيتسنى 'nom'
        email: email,       // Laravel كيتسنى 'email'
        motDePasse: password // Laravel كيتسنى 'motDePasse'
      }, {
        headers: {
          "Accept": "application/json"
        }
      });

      // إلا نجح التسجيل
      console.log("Success:", response.data);
      localStorage.setItem("ACCESS_TOKEN", response.data.access_token);
      toast.success("Compte créé avec succès !");
      
      // صيفطو لـ Login أو Dashboard
      navigate("/login");

    } catch (error: any) {
      console.error("Error:", error.response?.data);
      // كيبين لينا شنو المشكل (مثلا الايميل ديجا كاين)
      const message = error.response?.data?.message || "Erreur lors de l'inscription";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-sm">R</span>
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">RoomAI</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-foreground">Inscription</h1>
          <p className="text-muted-foreground text-sm mt-2">Créez votre compte RoomAI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Créer mon compte"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;