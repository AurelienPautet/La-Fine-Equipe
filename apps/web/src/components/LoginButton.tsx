import React from "react";

import LoginModal from "./LoginModal";

const LoginButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <button className="btn btn-primary" onClick={openModal}>
        Se connecter
      </button>
      <LoginModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default LoginButton;
