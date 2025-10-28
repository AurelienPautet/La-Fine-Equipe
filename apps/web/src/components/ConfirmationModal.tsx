import React from "react";

interface ConfirmationModalProps {
  title: string;
  message: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  open,
  setOpen,
}) => {
  React.useEffect(() => {
    const dialog = document.getElementById(
      "confirmation_modal_" + title
    ) as HTMLDialogElement | null;
    if (dialog) {
      if (open) {
        dialog.showModal();
        const handleClose = setTimeout(() => {
          setOpen(false);
        }, 3000);
        return () => clearTimeout(handleClose);
      } else {
        dialog.close();
      }
    }
  }, [open]);

  return (
    <dialog id={"confirmation_modal_" + title} className="modal">
      <div className="modal-box">
        <h2 className="font-bold text-lg">{title}</h2>
        <div className="modal-action">
          <div className="alert alert-success my-4">
            <p>{message}</p>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ConfirmationModal;
