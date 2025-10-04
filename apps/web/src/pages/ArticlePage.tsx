import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaEdit, FaPen } from "react-icons/fa";
import ArticleDisplay from "../components/ArticleDisplay";
import { fetchArticle } from "../utils/articleUtils";

interface PostMetadata {
  title: string;
  date: string;
  author?: string;
  tags?: string;
}

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [markdownContent, setMarkdownContent] = useState("");
  const [postMetadata, setPostMetadata] = useState<PostMetadata | null>(null);
  const [contentWithoutFrontmatter, setContentWithoutFrontmatter] =
    useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;

      try {
        const article = await fetchArticle(id);
        setPostMetadata({
          title: article.metadata.title,
          date: article.metadata.date,
          author: article.metadata.author,
          tags: article.metadata.tags,
        });
        setContentWithoutFrontmatter(article.content);
        setMarkdownContent(article.fullContent);
      } catch (error) {
        console.error("Error loading article:", error);
        setMarkdownContent(""); // This will trigger the "not found" UI
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent to-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-xl text-base-content">
            Chargement de l'article...
          </p>
        </div>
      </div>
    );
  }

  if (!markdownContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent to-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Article non trouvé
          </h1>
          <p className="text-lg text-base-content mb-8">
            Désolé, nous n'avons pas pu trouver cet article.
          </p>
          <Link to="/article" className="btn btn-primary btn-lg">
            ← Retour aux articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-base-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-focus py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-primary-content">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg flex items-center justify-center gap-4">
              <FaEdit className="w-10 h-10" />
              Article
            </h1>
            <p className="text-xl opacity-90">
              Découvrez les dernières nouvelles de La Fine Équipe
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              to="/article"
              className="btn btn-outline btn-primary hover:btn-primary transition-all duration-300"
            >
              ← Retour aux articles
            </Link>

            {/* Edit Button */}
            {id && (
              <Link
                to={`/article/edit/${id}`}
                className="btn btn-secondary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <FaPen className="w-4 h-4" />
                Modifier l'article
              </Link>
            )}
          </div>

          {/* Article Content */}
          <article className="card bg-base-100 shadow-2xl border-2 border-primary/20">
            <div className="card-body p-8 lg:p-12">
              {postMetadata && (
                <ArticleDisplay
                  metadata={{
                    title: postMetadata.title,
                    author: postMetadata.author || "",
                    date: postMetadata.date,
                    tags: postMetadata.tags || "",
                  }}
                  content={contentWithoutFrontmatter}
                  isPreview={false}
                />
              )}
            </div>
          </article>

          {/* Navigation Footer */}
          <div className="text-center mt-12">
            <Link
              to="/article"
              className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Voir plus d'articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
