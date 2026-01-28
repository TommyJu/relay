import React, { Component } from "react";
import { useChatStore } from "../store/chat/useChatStore";
import { Loader } from "lucide-react";

const GifModal = () => {
  const { modalGifUrls, isGifsLoading } = useChatStore();

  return (
    <dialog id="gif_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        {/* No GIFs found message */}
        {modalGifUrls.length === 0 && !isGifsLoading && "No GIFs Found :("}

        {/* GIFs loading spinner */}
        {isGifsLoading && (
          <div className="flex justify-center py-2">
            <Loader className="size-6 animate-spin opacity-50" />
          </div>
        )}

        {modalGifUrls.map((gifUrl) => (
          <div key={gifUrl} className="p-2">
            <video
              src={gifUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-md"
            />
          </div>
        ))}
      </div>
    </dialog>
  );
};

export default GifModal;
