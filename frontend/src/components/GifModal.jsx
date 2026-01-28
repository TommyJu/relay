import React, { useState, useEffect } from "react";
import { useChatStore } from "../store/chat/useChatStore";
import { Loader } from "lucide-react";

const GifModal = () => {
  const { modalGifUrls, isGifsLoading, searchForGifs } = useChatStore();
  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm) {
      searchForGifs(debouncedTerm);
    }
  }, [debouncedTerm, searchForGifs]);


  return (
    <dialog id="gif_modal" className="modal">
      <div className="modal-box py-12 max-w-full pt-0 h-[96%]">
        <div className="sticky top-0 bg-base-100 z-10 w-full flex items-center gap-4">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search GIFs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-sm w-full my-4"
          />
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {modalGifUrls.map((gifUrl) => (
            <div
              key={gifUrl}
              className="aspect-square overflow-hidden rounded-md hover:opacity-70"
            >
              <video
                src={gifUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        {/* No GIFs found message */}
        {modalGifUrls.length === 0 && !isGifsLoading && "No GIFs Found :("}

        {/* GIFs loading spinner */}
        {isGifsLoading && (
          <div className="flex justify-center py-2">
            <Loader className="size-6 animate-spin opacity-50" />
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default GifModal;
