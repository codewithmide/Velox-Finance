import { StaticImageData } from "next/image";

export interface CoinTypes {
    name: string;
    mint: string;
    symbol: string;
    decimals: number;
    image: string | StaticImageData;
}