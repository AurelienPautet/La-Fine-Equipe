import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ArticleForm, { type ArticleFormData } from "../components/ArticleForm";
import ArticleFormHeader from "../components/ArticleFormHeader";
import MarkdownGuide from "../components/MarkdownGuide";

const CreateArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData: ArticleFormData = {
    title: "",
    author: "",
    date: new Date().toISOString().split("T")[0], // Today's date
    tags: "",
    content: "",
  };

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
      console.log("Article to save:", {
        slug,
        content: fullContent,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message and redirect
      alert("Article créé avec succès !");
      navigate("/blog");
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Erreur lors de la création de l'article. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-base-200">
      {/* Header */}
      <ArticleFormHeader
        title="Créer un Article"
        subtitle="Partagez vos idées et expériences avec La Fine Équipe"
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link
              to="/blog"
              className="btn btn-outline btn-primary hover:btn-primary transition-all duration-300 flex items-center gap-2 w-fit"
            >
              <FaArrowLeft className="w-4 h-4" />
              Retour aux articles
            </Link>
          </div>

          {/* Article Form */}
          <ArticleForm
            initialData={initialFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Créer l'article"
            submitButtonLoadingText="Création en cours..."
          />

          {/* Help Card */}
          <MarkdownGuide />
        </div>
      </div>
    </div>
  );
};

export default CreateArticlePage;
