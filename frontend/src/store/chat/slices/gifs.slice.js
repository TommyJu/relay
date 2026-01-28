import { handleToastErrorMessage } from "../../../lib/utils";

const createGifsSlice = (set, get) => ({
    isGifsLoading: false,
    modalGifUrls: [ "https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/90/e3/RjM9NoIYWXbJTtRMCRrO.mp4",
    "https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/0a/81/R8n9A9iJgkm4OdF1i.mp4",
    "https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/fb/3e/EsoR5ojuKcxHDfHV.mp4",
    "https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/a5/14/dXIvAQlj4zsb.mp4",
    "https://static.klipy.com/ii/c3a19a0b747a76e98651f2b9a3cca5ff/df/52/MG9FLfor7BMqZhzBU.mp4"],
    modalPage: 1


});

export default createGifsSlice;