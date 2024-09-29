import { CoinTypes } from "../types/cointTypes";
import WSol from "@/public/coins/wsol.webp";
import Jup from "@/public/coins/jup.webp";
import Pyth from "@/public/coins/pyth.webp";
import Worm from "@/public/coins/worm.webp";
import Usdc from "@/public/coins/usdc.webp";
import Bonk from "@/public/coins/bonk.webp";
import Jito from "@/public/coins/jito.webp";
import Usdt from "@/public/coins/usdt.webp";
import IO from "@/public/coins/io.webp";
import Jito2 from "@/public/coins/jitoS.webp";
import Dogw from "@/public/coins/dogw.webp";
import Ray from "@/public/coins/ray.webp";

const assets: CoinTypes[] = [
  { 
    name: "Wrapped SOL",
    symbol: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
    image: WSol
  },
  { 
    name: "Jupiter",
    symbol: "JUP",
    mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    decimals: 6,
    image: Jup
  },
  { 
    name: "Pyth Network",
    symbol: "PYTH",
    mint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
    decimals: 6,
    image: Pyth
  },
  { 
    name: "Wormhole Token",
    symbol: "W",
    mint: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
    decimals: 8,
    image: Worm
  },
  { 
    name: "USDC",
    symbol: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
    image: Usdc
  },
  { 
    name: "Bonk",
    symbol: "Bonk",
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    decimals: 5,
    image: Bonk
  },
  { 
    name: "JITO",
    symbol: "JTO",
    mint: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
    decimals: 9,
    image: Jito
  },
  { 
    name: "USDT",
    symbol: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    decimals: 6,
    image: Usdt
  },
  { 
    name: "IO",
    symbol: "IO",
    mint: "BZLbGTNCSFfoth2GYDtwr7e4imWzpR5jqcUuGEwr646K",
    decimals: 9,
    image: IO
  },
  { 
    name: "Jito Staked SOL",
    symbol: "JitoSOL",
    mint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
    decimals: 9,
    image: Jito2
  },
  { 
    name: "dogwifhat",
    symbol: "$WIF",
    mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    decimals: 6,
    image: Dogw
  },
  { 
    name: "Raydium",
    symbol: "RAY",
    mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    decimals: 6,
    image: Ray
  }
];

export default assets;