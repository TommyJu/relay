import { handleToastErrorMessage } from "../../../lib/utils";

const createGifsSlice = (set, get) => ({
    isGifsLoading: false,
    modalGifUrls: ["https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/90/e3/RjM9NoIYWXbJTtRMCRrO.mp4",
    "https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/0a/81/R8n9A9iJgkm4OdF1i.mp4",
    "https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/fb/3e/EsoR5ojuKcxHDfHV.mp4",
    "https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/a5/14/dXIvAQlj4zsb.mp4",
    "https://static.klipy.com/ii/c3a19a0b747a76e98651f2b9a3cca5ff/df/52/MG9FLfor7BMqZhzBU.mp4",
    "https://static.klipy.com/ii/c3a19a0b747a76e98651f2b9a3cca5ff/bf/52/7hSXEwJjGJ06IhMiK.mp4",
    "https://static.klipy.com/ii/84b4c0b02782dda9051003f9e36484ec/f0/e4/V9o8qfhQHmi2T3xvqF.mp4",
    "https://static.klipy.com/ii/8ce8357c78ea940b9c2015daf05ce1a5/2c/ed/zDFDdoRMT2Iz.mp4",
    "https://static.klipy.com/ii/8ce8357c78ea940b9c2015daf05ce1a5/51/12/tbPOPjYotb0wiaIXH.mp4",
    "https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/63/5a/fD2c2PwJwd1FAwk.mp4",
    "https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/ab/24/Pj3olkjJvuskxS2RJ8O.mp4",
    "https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/e1/af/Byn2aRA663Wz.mp4",
    "https://static.klipy.com/ii/da290b156d64898341638f3c299e7478/7b/da/dXS6NOZQoDGpv.mp4",
    "https://static.klipy.com/ii/c3a19a0b747a76e98651f2b9a3cca5ff/3d/c4/QO7z4HTY9qvG0LjH3v.mp4",
    "https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/87/75/Ul63Pbryu5fVwCB4HtW.mp4",
    "https://static.klipy.com/ii/c3a19a0b747a76e98651f2b9a3cca5ff/65/35/Er7Fd2PG6pldtCO7.mp4",
    "https://static.klipy.com/ii/4e7bea9f7a3371424e6c16ebc93252fe/d3/7e/so3KD5H3Fz18cbd2.mp4",
    "https://static.klipy.com/ii/39f2394ae36df6e199be9eb7c9fa1012/66/95/CjCTiQ1qqLZjT9cukC.mp4",
    "https://static.klipy.com/ii/8ce8357c78ea940b9c2015daf05ce1a5/a4/cd/FxurCIi3SeTjyq.mp4",
    "https://static.klipy.com/ii/c3a19a0b747a76e98651f2b9a3cca5ff/c6/c7/mBzpJkqbNl2PQROf.mp4",
    "https://static.klipy.com/ii/c3a19a0b747a76e98651f2b9a3cca5ff/4d/c6/AB1Dg79uCB1iPyVH.mp4",
    "https://static.klipy.com/ii/40242aa776a8322b6e7934df737fa2a6/8a/73/ze2CDJ3X5tHjzPuK.mp4",
    "https://static.klipy.com/ii/d7aec6f6f171607374b2065c836f92f4/93/6d/9jeooV3TkEYCa.mp4",
    "https://static.klipy.com/ii/35ccce3d852f7995dd2da910f2abd795/6c/ac/76DyUqun.mp4"],
    modalPage: 1


});

export default createGifsSlice;