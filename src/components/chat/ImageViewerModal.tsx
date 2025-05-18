import React from "react";

type Props = {
  imageUrl: string|null;
  alt?: string;
  onClose: () => void;
};

const ImageViewerModal: React.FC<Props> = ({ imageUrl, alt, onClose }) => {
  if (!imageUrl) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
      style={{ cursor: "zoom-out" }}
    >
      <img
        src={imageUrl}
        alt={alt || "Image"}
        className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
        onClick={e => e.stopPropagation()}
        style={{ cursor: "default" }}
      />
      <button
        className="absolute top-4 right-4 text-white text-3xl font-bold"
        onClick={onClose}
        aria-label="Close"
        style={{ background: "rgba(0,0,0,0.3)", border: 0, borderRadius: "50%", width: 40, height: 40 }}
      >
        ×
      </button>
    </div>
  );
};

export default ImageViewerModal;
