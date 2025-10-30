import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaCalendarCheck,
  FaHandsHelping,
  FaHome,
  FaScroll,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";

import LoginModal from "./LoginModal";
import { useAuth } from "./AuthProvider";

const Header: React.FC = () => {
  const [logoClicked, setLogoClicked] = useState(0);
  const { logout, isAuthenticated } = useAuth();

  const handleLogoClick = () => {
    setLogoClicked(logoClicked + 1);
    if (logoClicked >= 5) {
      setLogoClicked(0);
    }
  };

  return (
    <div className="navbar h-10 bg-primary shadow-xl border-b-4 border-primary sticky top-0 z-[1000] px-4">
      <div className="flex-1">
        <Link
          to="/"
          className="flex items-center normal-case text-2xl font-bold text-secondary hover:text-primary-content transition-colors"
          onClick={handleLogoClick}
        >
          <div className="avatar">
            <div className="w-12 h-12 rounded-full ">
              <img
                src="/logo.png"
                alt="La Fine Équipe Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <span className="ml-3 hidden md:block">La Fine Équipe</span>
          {isAuthenticated && (
            <button
              className="btn btn-sm btn-secondary ml-4 normal-case"
              onClick={logout}
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="hidden lg:block">Déconnexion</span>
            </button>
          )}
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 text-lg font-semibold">
          <li className="group relative">
            <Link
              to="/"
              className="hover:bg-primary hover:text-primary-content transition-all duration-300 rounded-lg mx-1 flex items-center gap-2"
            >
              <FaHome className="w-4 h-4" />
              <span className="md:block overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap md:max-w-none">
                Accueil
              </span>
            </Link>
          </li>
          <li className="group relative">
            <Link
              to="/join"
              className="hover:bg-primary hover:text-primary-content transition-all duration-300 rounded-lg mx-1 flex items-center gap-2"
            >
              <FaHandsHelping className="w-4 h-4" />
              <span className="md:block overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap md:max-w-none">
                Nous rejoindre
              </span>
            </Link>
          </li>
          <li className="group relative">
            <Link
              to="/about"
              className="hover:bg-primary hover:text-primary-content transition-all duration-300 rounded-lg mx-1 flex items-center gap-2"
            >
              <FaUsers className="w-4 h-4" />
              <span className="md:block overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap md:max-w-none">
                Notre Équipe
              </span>
            </Link>
          </li>
          <li className="group relative">
            <Link
              to="/events"
              className="hover:bg-primary hover:text-primary-content transition-all duration-300 rounded-lg mx-1 flex items-center gap-2"
            >
              <FaCalendarCheck className="w-4 h-4" />
              <span className="md:block overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap md:max-w-none">
                Événements
              </span>
            </Link>
          </li>
          <li className="group relative">
            <Link
              to="/regulations"
              className="hover:bg-primary hover:text-primary-content transition-all duration-300 rounded-lg mx-1 flex items-center gap-2"
            >
              <FaScroll className="w-4 h-4" />
              <span className="md:block overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap md:max-w-none">
                Règlements
              </span>
            </Link>
          </li>
        </ul>
      </div>
      <LoginModal
        isOpen={logoClicked >= 5 && !isAuthenticated}
        onClose={() => {
          setLogoClicked(0);
        }}
      />
    </div>
  );
};

export default Header;
