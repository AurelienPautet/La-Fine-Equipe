import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ArticlesPage from "./pages/ArticlesPage";
import AboutPage from "./pages/AboutPage";
import ArticlePage from "./pages/ArticlePage";
import CreateArticlePage from "./pages/CreateArticlePage";
import EditArticlePage from "./pages/EditArticlePage";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div
        data-theme="lafine"
        className="min-h-screen bg-gradient-to-br from-accent to-base-100"
      >
        {/* Header/Navigation */}
        <Header />

        {/* Main Content */}
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<ArticlesPage />} />
            <Route path="/blog/create" element={<CreateArticlePage />} />
            <Route path="/blog/edit/:id" element={<EditArticlePage />} />
            <Route path="/blog/:id" element={<ArticlePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
