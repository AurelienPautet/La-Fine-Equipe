import React from "react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

const Footer: React.FC = () => {
  return (
    <footer className="footer footer-center p-5 bg-secondary text-secondary-content relative">
      <img
        src="/LFE_lézard_nu_2.png"
        alt=""
        className="absolute -top-11 left-10 w-15 object-cover transition-all duration-100 hover:animate-bounce"
      />
      <aside>
        <div className="avatar">
          <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
            <img src="/logo.png" alt="Logo" />
          </div>
        </div>
        <p className="font-bold text-xl">La Fine Équipe</p>
        <p className="text-lg opacity-90">
          Une équipe passionnée et déterminée
        </p>
        <p className="opacity-75">Copyright © 2025 - Tous droits réservés</p>
        <div className="flex flex-row gap-3">
          <a
            href="https://www.instagram.com/lafineequipe_lyon3/"
            target="_blank"
            className="flex items-center gap-1 "
          >
            <FaInstagram className="w-6 h-6 hover:text-primary transition-colors" />
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/la-fine-%C3%A9quipe-lyon3/posts/?feedView=all"
            target="_blank"
            className="flex items-center gap-1 "
          >
            <FaLinkedin className="w-6 h-6 hover:text-primary transition-colors" />
            LinkedIn
          </a>
          <a
            href="mailto:lafineequipe.lyon3@gmail.com"
            className="flex items-center gap-1 "
          >
            <IoIosMail className="w-6 h-6 hover:text-primary transition-colors" />
            lafineequipe.lyon3@gmail.com
          </a>
        </div>
      </aside>
    </footer>
  );
};

export default Footer;
