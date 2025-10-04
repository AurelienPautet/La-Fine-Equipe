import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBook, FaGem } from "react-icons/fa";
import ArticleCard from "../components/ArticleCard";
import MemberCard from "../components/MemberCard";

interface Member {
  id: number;
  name: string;
  role: string;
  photo: string;
  instagram?: string;
}

const HomePage: React.FC = () => {
  const [students, setMembers] = useState<Member[]>([]);
  const [latestPostSlug, setLatestPostSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/members.json")
      .then((response) => response.json())
      .then((data) => setMembers(data))
      .catch((error) => console.error("Error fetching students:", error));
    const fetchMarkdownPosts = async () => {
      const modules = import.meta.glob("../posts/*.md", { as: "raw" });
      const slugs: string[] = [];
      for (const path in modules) {
        const slug = path.split("/").pop()?.replace(".md", "") || "";
        if (slug) {
          slugs.push(slug);
        }
      }
      setLatestPostSlug(slugs[0] || null);
    };

    fetchMarkdownPosts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[80vh] bg-gradient-to-br from-primary to-primary-focus relative overflow-hidden">
        <div className="hero-content text-center text-primary-content relative z-10">
          <div className="max-w-4xl">
            <div className="flex justify-center mb-8">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring ring-accent ring-offset-base-800 ring-offset-1 shadow-2xl">
                  <img
                    src="/logo.png"
                    alt="La Fine Équipe"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-6 drop-shadow-lg flex items-center justify-center gap-4">
              <FaGem className="w-12 h-12 text-accent" />

              <span className="hidden lg:visible bold bg-red-900">
                La Fine Équipe
              </span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Bienvenue sur le site de La Fine Équipe ! Nous sommes un groupe
              passionné et dévoué, travaillant ensemble pour atteindre nos
              objectifs. Découvrez notre univers unique et nos aventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/about"
                className="btn btn-accent btn-lg text-accent-content shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <FaUsers className="w-5 h-5" />
                Découvrir l'équipe
              </Link>
              <Link
                to="/blog"
                className="btn btn-outline btn-lg border-2 border-accent text-accent hover:bg-accent hover:text-accent-content shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <FaBook className="w-5 h-5" />
                Lire nos articles
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-secondary rounded-full"></div>
          <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-accent rounded-full"></div>
        </div>
      </div>

      {/* Latest Article Section */}
      {latestPostSlug && (
        <section className="py-20 bg-base-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-secondary mb-4 flex items-center justify-center gap-4">
                <FaBook className="w-10 h-10" />
                Dernier Article
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="flex justify-center">
              <div className="max-w-lg">
                <ArticleCard slug={latestPostSlug} />
              </div>
            </div>
            <div className="text-center mt-8">
              <Link
                to="/blog"
                className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <FaBook className="w-5 h-5" />
                Voir tous nos articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Team Members Section */}
      <section className="py-20 bg-gradient-to-br from-accent to-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-secondary mb-4 flex items-center justify-center gap-4">
              <FaUsers className="w-10 h-10" />
              Nos Membres
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-base-content max-w-2xl mx-auto">
              Rencontrez les membres passionnés qui composent La Fine Équipe
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {students.map((student) => (
              <MemberCard
                key={student.id}
                student={student}
                size="medium"
                showSocial={true}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
