import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { FaLock, FaSpinner } from "react-icons/fa";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const res = await login(password);
    setPassword("");
    if (res) {
      onClose();
    } else {
      setError("Échec de la connexion. Veuillez vérifier le  mot de passe.");
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaLock className="text-primary" />
          Connexion Admin
        </h3>

        <form onSubmit={handleSubmit}>
          <label className="input">
            <span className="label">Mot de passe</span>
            <input
              type="password"
              placeholder="Entrez le mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </label>

          {error && (
            <div className="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default LoginModal;
