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
import JoinUsPage from "./pages/JoinUsPage";
import ScrollToTop from "./components/ScrollToTop";
import RegulationsPage from "./pages/RegulationsPage";
import RegulationPage from "./pages/RegulationPage";
import CreateRegulationPage from "./pages/CreateRegulationPage";
import EditRegulationPage from "./pages/EditRegulationPage";
import EventReservationsPage from "./pages/EventReservationsPage";

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
              <Route
                path="/events/:slug/reservations"
                element={<EventReservationsPage />}
              />
              <Route path="/regulations" element={<RegulationsPage />} />
              <Route
                path="/regulations/create"
                element={<CreateRegulationPage />}
              />
              <Route
                path="/regulations/edit/:slug"
                element={<EditRegulationPage />}
              />
              <Route path="/regulations/:slug" element={<RegulationPage />} />
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
