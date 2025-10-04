import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import ArticleForm, { type ArticleFormData } from "../components/ArticleForm";
import ArticleFormHeader from "../components/ArticleFormHeader";
import { fetchArticle } from "../utils/articleUtils";
import MarkdownGuide from "../components/MarkdownGuide";

const EditArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialFormData, setInitialFormData] = useState<ArticleFormData>({
    title: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
    content: "",
  });

  // Load existing article data
  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) return;

      try {
        const article = await fetchArticle(slug);
        setInitialFormData({
          title: article.metadata.title,
          author: article.metadata.author,
          date: article.metadata.date,
          tags: article.metadata.tags,
          content: article.content,
        });
      } catch (error) {
        console.error("Error loading article for editing:", error);
        alert("Erreur lors du chargement de l'article.");
        navigate("/article");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug, navigate]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim();
  };

  const handleSubmit = async (formData: ArticleFormData) => {
    setIsSubmitting(true);

    try {
      // Generate slug from title
      const slug = generateSlug(formData.title);

      // Create frontmatter
      const frontmatter = `---
title: ${formData.title}
author: ${formData.author}
date: ${formData.date}
tags: ${formData.tags}
---

`;

      // Combine frontmatter with content
      const fullContent = frontmatter + formData.content;

      // In a real application, you would send this to your backend
      // For now, we'll simulate saving and show a success message
      console.log("Article to update:", {
        originalslug: slug,
        newSlug: slug,
        content: fullContent,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message and redirect
      alert("Article modifié avec succès !");
      navigate(`/article/${slug}`);
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Erreur lors de la modification de l'article. Veuillez réessayer.");
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
            initialData={initialFormData}
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
