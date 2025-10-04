import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import ArticleForm, { type ArticleFormData } from "../components/ArticleForm";
import ArticleFormHeader from "../components/ArticleFormHeader";
import { fetchArticle } from "../utils/articleUtils";
import MarkdownGuide from "../components/MarkdownGuide";
import type { CreateArticleRequest } from "@lafineequipe/types";
import { useArticle, useEditArticle } from "../hooks/ArticleHooks";

const EditArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: article, error, isLoading: loading } = useArticle(slug || "");

  const editArticle = useEditArticle();

  const handleSubmit = async (formData: CreateArticleRequest) => {
    setIsSubmitting(true);
    try {
      await editArticle.mutateAsync({
        id: article.id,
        articleData: {
          title: formData.title,
          date: formData.date,
          content: formData.content,
          author: formData.author,
          tagsId: formData.tagsId,
        },
      });
      navigate(`/article/${slug}`);
    } catch (error) {
      console.error("Failed to edit article:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-base-200">
      {/* Header */}
      <ArticleFormHeader
        title="Modifier l'Article"
        subtitle="Modifiez votre article et partagez vos slugées avec La Fine Équipe"
        icon={<FaEdit className="w-10 h-10" />}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              to={`/article/${slug}`}
              className="btn btn-outline btn-primary hover:btn-primary transition-all duration-300 flex items-center gap-2 w-fit"
            >
              <FaArrowLeft className="w-4 h-4" />
              Retour à l'article
            </Link>
            <Link
              to="/article"
              className="btn btn-outline btn-secondary hover:btn-secondary transition-all duration-300 flex items-center gap-2 w-fit"
            >
              Voir tous les articles
            </Link>
          </div>

          {/* Article Form */}
          <ArticleForm
            initialData={article}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Sauvegarder les modifications"
            submitButtonLoadingText="Modification en cours..."
          />

          {/* Help Card */}
          <MarkdownGuide />
        </div>
      </div>
    </div>
  );
};

export default EditArticlePage;
