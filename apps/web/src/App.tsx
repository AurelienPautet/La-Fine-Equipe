import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import OurTeamPage from "./pages/OurTeamPage";
import EventPage from "./pages/EventPage";
import CreateEventsPage from "./pages/CreateEventPage";
import EditEventsPage from "./pages/EditEventPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ActPage from "./pages/ActPage";
import JoinUsPage from "./pages/JoinUsPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/create" element={<CreateEventsPage />} />
              <Route path="/events/edit/:slug" element={<EditEventsPage />} />
              <Route path="/events/:slug" element={<EventPage />} />
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
