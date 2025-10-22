import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import ArticleForm from "../components/ArticleForm";
import PageHeader from "../components/PageHeader";
import MarkdownGuide from "../components/MarkdownGuide";
import { usePostArticle } from "../hooks/ArticleHooks";

const CreateArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postArticle = usePostArticle();

  const initialFormData: any = {
    title: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
    content: "",
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    postArticle.mutate(
      {
        title: formData.title,
        content: formData.content,
        author: formData.author,
        date: new Date(formData.date),
        tags: formData.tags,
      },
      {
        onSuccess: () => {
          navigate("/article");
        },
        onError: (error) => {
          console.error("Error creating article:", error);
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-base-200">
      {/* Header */}
      <PageHeader
        title="Créer un Article"
        subtitle="Partagez vos idées et expériences avec La Fine Équipe"
        icon={<FaEdit className="w-10 h-10" />}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link
              to="/article"
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
