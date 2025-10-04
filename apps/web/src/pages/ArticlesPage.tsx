import React, { useEffect, useState } from "react";
import { FaBook, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";

const ArticlesPage: React.FC = () => {
  const [postSlugs, setPostSlugs] = useState<string[]>([]);

  useEffect(() => {
    const fetchMarkdownPosts = async () => {
      const modules = import.meta.glob("../posts/*.md", { as: "raw" });
      console.log("ArticlesPage: import.meta.glob modules:", modules);
      const slugs: string[] = [];

      for (const path in modules) {
        const slug = path.split("/").pop()?.replace(".md", "") || "";
        if (slug) {
          slugs.push(slug);
        }
      }

      console.log("ArticlesPage: All post slugs:", slugs);
      setPostSlugs(slugs);
    };

    fetchMarkdownPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-base-200">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary-focus py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold text-primary-content mb-6 drop-shadow-lg flex items-center justify-center gap-4">
            <FaBook className="w-12 h-12" />
            Nos Articles
          </h1>
          <p className="text-xl text-primary-content/90 max-w-2xl mx-auto drop-shadow-md">
            Découvrez nos derniers articles, événements et aventures de La Fine
            Équipe
          </p>

          {/* Create New Article Button */}
          <div className="mt-8">
            <Link
              to="/blog/create"
              className="btn btn-secondary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaPlus className="w-5 h-5" />
              Créer un nouvel article
            </Link>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-base-content">
            Tous nos articles
          </h2>

          {postSlugs.length === 0 ? (
            <div className="text-center">
              <div className="bg-base-100 rounded-xl p-12 shadow-lg">
                <FaBook className="w-16 h-16 mx-auto mb-6 text-primary/50" />
                <h3 className="text-2xl font-bold mb-4 text-base-content">
                  Aucun article pour le moment
                </h3>
                <p className="text-base-content/70 mb-8">
                  Soyez le premier à créer un article !
                </p>
                <Link
                  to="/blog/create"
                  className="btn btn-primary btn-lg gap-2"
                >
                  <FaPlus className="w-5 h-5" />
                  Créer le premier article
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postSlugs.map((slug) => (
                <div
                  key={slug}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <ArticleCard slug={slug} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
