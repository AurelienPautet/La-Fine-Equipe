import React, { useEffect, useState } from "react";
import { FaBook, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";

const BlogPage: React.FC = () => {
  const [postSlugs, setPostSlugs] = useState<string[]>([]);

  useEffect(() => {
    const fetchMarkdownPosts = async () => {
      const modules = import.meta.glob("../posts/*.md", { as: "raw" });
      console.log("BlogPage: import.meta.glob modules:", modules);
      const slugs: string[] = [];

      for (const path in modules) {
        const slug = path.split("/").pop()?.replace(".md", "") || "";
        if (slug) {
          slugs.push(slug);
        }
      }

      console.log("BlogPage: All post slugs:", slugs);
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
            Notre Blog
          </h1>
          <p className="text-xl text-primary-content/90 max-w-2xl mx-auto drop-shadow-md">
            Découvrez nos derniers articles, événements et aventures de La Fine
            Équipe
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6 rounded-full"></div>

          {/* Create Article Button */}
          <div className="mt-8">
            <Link
              to="/article/create"
              className="btn btn-accent btn-lg text-accent-content shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <FaPlus className="w-5 h-5" />
              Créer un article
            </Link>
          </div>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="container mx-auto px-4 py-16">
        {postSlugs.length === 0 ? (
          <div className="text-center py-20">
            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
            <p className="text-xl text-base-content">
              Chargement des articles...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-secondary mb-4">
                Tous nos articles
              </h2>
              <p className="text-lg text-base-content">
                {postSlugs.length} article{postSlugs.length > 1 ? "s" : ""}{" "}
                disponible{postSlugs.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {postSlugs.map((slug) => (
                <div
                  key={slug}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <ArticleCard slug={slug} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
