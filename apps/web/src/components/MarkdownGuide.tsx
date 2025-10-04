import React from "react";
import { FaEye } from "react-icons/fa";

const MarkdownGuide: React.FC = () => {
  return (
    <div className="mt-8">
      <div className="card bg-base-100 shadow-xl border-2 border-accent/30">
        <div className="card-body">
          <h3 className="card-title text-secondary flex items-center gap-2">
            <FaEye className="w-5 h-5" />
            Guide Markdown
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Formatage de base :</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-base-content/80">
                <li>
                  <code>**gras**</code> pour du <strong>texte en gras</strong>
                </li>
                <li>
                  <code>*italique*</code> pour du <em>texte en italique</em>
                </li>
                <li>
                  <code>`code`</code> pour du code inline
                </li>
                <li>
                  <code># Titre</code> pour les titres
                </li>
              </ul>
            </div>
            <div>
              <p>
                <strong>Éléments avancés :</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-base-content/80">
                <li>
                  <code>[lien](url)</code> pour les liens
                </li>
                <li>
                  <code>- élément</code> pour les listes
                </li>
                <li>
                  <code>&gt; citation</code> pour les citations
                </li>
                <li>
                  <code>![alt text](url)</code> pour les images
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-4 w-full text-sm text-base-content/70">
            Pour plus de détails, consultez{" "}
            <a
              href="https://www.markdownguide.org/basic-syntax/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              le guide Markdown
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarkdownGuide;
