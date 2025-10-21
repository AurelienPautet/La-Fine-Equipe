import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

import HomePage from "./pages/HomePage";
import ArticlesPage from "./pages/ArticlesPage";
import OurTeamPage from "./pages/OurTeamPage";
import ArticlePage from "./pages/ArticlePage";
import CreateArticlePage from "./pages/CreateArticlePage";
import EditArticlePage from "./pages/EditArticlePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ActPage from "./pages/ActPage";
import JoinUsPage from "./pages/JoinUsPage";

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
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
              <Route path="/article" element={<ArticlesPage />} />
              <Route path="/article/create" element={<CreateArticlePage />} />
              <Route path="/article/edit/:slug" element={<EditArticlePage />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/act" element={<ActPage />} />
              <Route path="/join" element={<JoinUsPage />} />
              <Route path="/about" element={<OurTeamPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
