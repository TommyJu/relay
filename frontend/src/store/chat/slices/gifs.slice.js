import { handleToastErrorMessage } from "../../../lib/utils";
import { chatService } from "../../../services/chatService";

const createGifsSlice = (set, get) => ({
    isGifsLoading: false,
    modalGifUrls: [],
    modalPage: 1,
    searchForGifs: async (query) => {
        set({isGifsLoading: true});
        const response = await chatService.searchForGifs(query);
        const newGifUrls = response.data;
        set({modalGifUrls: newGifUrls});
        set({isGifsLoading: false});
    },


});

export default createGifsSlice;