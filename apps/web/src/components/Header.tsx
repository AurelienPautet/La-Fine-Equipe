import { Link } from "react-router-dom";
import {
  FaHandsHelping,
  FaHome,
  FaNewspaper,
  FaScroll,
  FaUsers,
} from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <div className="navbar h-10 bg-primary shadow-xl border-b-4 border-primary sticky top-0 z-50">
      <div className="flex-1">
        <Link
          to="/"
          className="flex items-center normal-case text-2xl font-bold text-secondary hover:text-primary-content transition-colors"
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
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 text-lg font-semibold">
          <li className="group relative">
            <Link
              to="/"
              className="hover:bg-primary hover:text-primary-content transition-all duration-600 rounded-lg mx-1 flex items-center gap-2"
            >
              <FaHome className="w-4 h-4" />
              <span className="md:block overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-600 ease-in-out whitespace-nowrap md:max-w-none">
                Accueil
              </span>
            </Link>
          </li>
          <li className="group relative">
            <Link
              to="/join"
              className="hover:bg-primary hover:text-primary-content transition-all duration-600 rounded-lg mx-1 flex items-center gap-2"
            >
              <FaHandsHelping className="w-4 h-4" />
              <span className="md:block overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-600 ease-in-out whitespace-nowrap md:max-w-none">
                Nous rejoindre
              </span>
            </Link>
          </li>
          <li className="group relative">
            <Link
              to="/about"
              className="hover:bg-primary hover:text-primary-content transition-all duration-600 rounded-lg mx-1 flex items-center gap-2"
            >
              <FaUsers className="w-4 h-4" />
              <span className="md:block overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-600 ease-in-out whitespace-nowrap md:max-w-none">
                Notre Équipe
              </span>
            </Link>
          </li>
          <li className="group relative">
            <Link
              to="/article"
              className="hover:bg-primary hover:text-primary-content transition-all duration-600 rounded-lg mx-1 flex items-center gap-2"
            >
              <FaNewspaper className="w-4 h-4" />
              <span className="md:block overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-600 ease-in-out whitespace-nowrap md:max-w-none">
                Articles
              </span>
            </Link>
          </li>
          <li className="group relative">
            <Link
              to="/act"
              className="hover:bg-primary hover:text-primary-content transition-all duration-600 rounded-lg mx-1 flex items-center gap-2"
            >
              <FaScroll className="w-4 h-4" />
              <span className="md:block overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-600 ease-in-out whitespace-nowrap md:max-w-none">
                Règlementations
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
