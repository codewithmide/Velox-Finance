"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input, Button } from "../../components/molecules/FormComponents";
import DropDownSelect from "../../components/molecules/DropDownSelect";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import Modal from "../../components/molecules/Modal";
import toast from "react-hot-toast";
import { Rpc, bn, createRpc } from "@lightprotocol/stateless.js";
import Loader from "../../components/atom/Loader";
import {
  CompressedTokenProgram,
  selectMinCompressedTokenAccountsForTransfer,
} from "@lightprotocol/compressed-token";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { generateGravatar } from "../../utils/svgImage";
import TimeframeSelect from "@/app/components/molecules/TimeframeDropdown";

interface CompressedAsset {
  mint: string;
  tokenPoolPda: string;
  symbol: string;
  name: string;
  decimals: number;
  image: string;
}

const COMPRESSED_TOKEN_PROGRAM_PDA =
  process.env.NEXT_PUBLIC_COMPRESSED_TOKEN_PROGRAM_PDA || "";

const DCAComponent = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromAsset, setFromAsset] = useState<CompressedAsset | null>(null);
  const [toAsset, setToAsset] = useState<CompressedAsset | null>(null);
  const [slippage, setSlippage] = useState("1");
  const [customSlippage, setCustomSlippage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState<any>(null);
  const [priceImpact, setPriceImpact] = useState<string | null>(null);
  const [activeInput, setActiveInput] = useState<"from" | "to">("from");
  const [balance, setBalance] = useState<number | null>(null);
  const [hasEnoughBalance, setHasEnoughBalance] = useState<boolean>(true);
  const [compressedAssets, setCompressedAssets] = useState<CompressedAsset[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  const [connection, setConnection] = useState<Rpc | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("Minute");
  const [duration, setDuration] = useState("1");
  const [order, setOrder] = useState("2");

  const timeframes = ["Minute", "Hour", "Day", "Week"];

  // Function to handle changing the selected timeframe
  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_DEVNET_API_BASE_URL;
    if (apiKey) {
      const rpcConnection = createRpc(apiKey);
      setConnection(rpcConnection);

      fetchCompressedTokens(rpcConnection).then((tokens) => {
        setCompressedAssets(tokens);
        if (tokens.length > 0) {
          setFromAsset(tokens[0]);
        }
      });
    }
  }, []);

  // Function to change the selected "from" asset
  const handleFromAssetChange = (assetMint: string) => {
    const selectedAsset = compressedAssets.find(
      (asset) => asset.mint === assetMint
    );
    setFromAsset(selectedAsset || null);
  };

  // Function to change the selected "to" asset
  const handleToAssetChange = (assetMint: string) => {
    const selectedAsset = compressedAssets.find(
      (asset) => asset.mint === assetMint
    );
    setToAsset(selectedAsset || null);
  };

  // Function to format mint address for better UX
  const formatMintAddress = (address: string) => {
    return `${address.slice(0, 3)}...${address.slice(-2)}`;
  };

  // Fetch compressed tokens owned by the program's PDA
  const fetchCompressedTokens = async (
    connection: Rpc
  ): Promise<CompressedAsset[]> => {
    try {
      const accounts = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(COMPRESSED_TOKEN_PROGRAM_PDA),
        { programId: TOKEN_PROGRAM_ID }
      );

      const compressedTokens: CompressedAsset[] = accounts.value.map(
        ({ account }) => {
          const mint = account.data.parsed.info.mint;
          const tokenPoolPda = account.data.parsed.info.owner;
          return {
            mint,
            tokenPoolPda,
            symbol: "CT", // Default values for compressed tokens
            name: "Compressed Token",
            decimals: 9,
            image: "/compressed-token.png", // Placeholder image for compressed tokens
          };
        }
      );

      console.log("Fetched compressed tokens: ", compressedTokens);
      return compressedTokens;
    } catch (error) {
      console.error("Error fetching compressed tokens: ", error);
      toast.error("Error fetching compressed tokens.");
      return [];
    }
  };

  // Fetch balance for a given asset (either SOL or SPL token)
  const fetchBalance = async (asset: CompressedAsset) => {
    if (!wallet.connected || !wallet.publicKey) {
      setBalance(null);
      return;
    }

    try {
      const rpcUrl = process.env.NEXT_PUBLIC_DEVNET_API_BASE_URL;
      const solanaConnection = new Connection(rpcUrl!);

      if (asset.symbol === "SOL") {
        const solBalance = await solanaConnection.getBalance(wallet.publicKey);
        const userBalance = solBalance / Math.pow(10, asset.decimals);
        setBalance(userBalance);
        setHasEnoughBalance(userBalance >= parseFloat(fromAmount || "0"));
      } else {
        const accounts = await solanaConnection.getTokenAccountsByOwner(
          wallet.publicKey,
          {
            mint: new PublicKey(asset.mint),
          }
        );

        if (accounts.value.length > 0) {
          const balanceData = await solanaConnection.getTokenAccountBalance(
            accounts.value[0].pubkey
          );
          const userBalance =
            parseFloat(balanceData.value.amount) / Math.pow(10, asset.decimals);
          setBalance(userBalance);
          setHasEnoughBalance(userBalance >= parseFloat(fromAmount || "0"));
        } else {
          setBalance(0);
          setHasEnoughBalance(false);
        }
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(null);
    }
  };

  // Fetch balance whenever a new asset is selected
  useEffect(() => {
    if (wallet.connected && fromAsset) {
      fetchBalance(fromAsset);
    }
  }, [fromAsset, wallet.connected]);

  // Handle input changes for "from" and "to" fields
  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isFrom: boolean
  ) => {
    const { value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      if (isFrom) {
        setFromAmount(value);
        setActiveInput("from");

        if (balance !== null) {
          setHasEnoughBalance(parseFloat(value) <= balance);
        }
      } else {
        setToAmount(value);
        setActiveInput("to");
      }
      debounceQuoteCall(
        Number(value),
        isFrom ? fromAsset : toAsset,
        isFrom ? toAsset : fromAsset,
        isFrom
      );
    }
  };

  // Debounce function to reduce excessive API calls
  const debounceQuoteCall = useCallback(
    debounce(
      (
        amount: number,
        from: CompressedAsset | null,
        to: CompressedAsset | null,
        isFrom: boolean
      ) => {
        if (from && to) {
          getQuote(amount, from, to, isFrom);
        }
      },
      500
    ),
    [fromAsset, toAsset, activeInput, slippage, connection]
  );

  // Get a quote for the token DCA
  const getQuote = async (
    amount: number,
    from: CompressedAsset,
    to: CompressedAsset,
    isFrom: boolean
  ) => {
    if (isNaN(amount) || amount <= 0 || !connection) return;

    setLoading(true);
    try {
      const amountInSmallestUnit = Math.floor(
        amount * Math.pow(10, from.decimals)
      );
      const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${from.mint}&outputMint=${to.mint}&amount=${amountInSmallestUnit}&slippageBps=${
        Number(slippage) * 100
      }${isFrom ? "" : "&swapMode=ExactOut"}`;
      const quote = await fetch(quoteUrl).then((res) => res.json());

      if (quote && (isFrom ? quote.outAmount : quote.inAmount)) {
        const resultAmount =
          Number(isFrom ? quote.outAmount : quote.inAmount) /
          Math.pow(10, isFrom ? to.decimals : from.decimals);
        if (isFrom) {
          setToAmount(resultAmount.toFixed(to.decimals));
        } else {
          setFromAmount(resultAmount.toFixed(from.decimals));
        }
        setQuoteResponse(quote);
        setPriceImpact(quote.priceImpactPct);
      } else {
        throw new Error("Invalid quote response");
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      toast.error("Error fetching quote: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDCA = async () => {
    if (
      !wallet.connected ||
      !wallet.signTransaction ||
      !wallet.publicKey ||
      !connection
    ) {
      toast.error(
        "Wallet is not connected or does not support signing transactions"
      );
      return;
    }

    setLoading(true);
    try {
      const publicKey = wallet.publicKey;
      const mint = new PublicKey(String(fromAsset?.mint)); // The SPL token mint
      const amount = bn(
        Math.floor(
          Number(fromAmount) * Math.pow(10, Number(fromAsset?.decimals))
        )
      );

      // Step 1: Ensure Associated Token Account (ATA) is created
      let ata;
      try {
        ata = await getAssociatedTokenAddress(
          mint,
          publicKey // Owner (the connected wallet)
        );
        console.log("Associated token account (ATA): ", ata.toBase58());
      } catch (error: any) {
        throw new Error(`Error creating/fetching ATA: ${error.message}`);
      }

      const ataAccountInfo = await connection.getAccountInfo(ata);
      if (!ataAccountInfo) {
        console.log("ATA does not exist. Creating it...");
        try {
          const createAtaIx = createAssociatedTokenAccountInstruction(
            publicKey, // Payer
            ata, // Associated token account
            publicKey, // Owner
            mint // Token mint
          );

          const transaction = new Transaction().add(createAtaIx);

          // Fetch and assign recent blockhash
          const { blockhash } = await connection.getRecentBlockhash();
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = publicKey;

          const signedTransaction = await wallet.signTransaction(transaction);
          const txid = await connection.sendRawTransaction(
            signedTransaction.serialize()
          );
          console.log("ATA creation transaction signature: ", txid);
          await connection.confirmTransaction(txid, "confirmed"); // Wait for confirmation
        } catch (error: any) {
          throw new Error(`Error creating ATA: ${error.message}`);
        }
      } else {
        console.log("ATA already exists.");
      }

      // Step 2: Check SPL token balance in the ATA
      let tokenBalance;
      try {
        tokenBalance = await connection.getTokenAccountBalance(ata);
        console.log("Token Balance in ATA:", tokenBalance.value.uiAmount);
      } catch (error: any) {
        throw new Error(`Error fetching token balance: ${error.message}`);
      }
      if (
        tokenBalance.value.uiAmount === 0 ||
        Number(tokenBalance.value.uiAmount) < Number(fromAmount)
      ) {
        throw new Error(
          `Not enough balance in the SPL token account. Available: ${tokenBalance.value.uiAmount}, required: ${fromAmount}`
        );
      }

      // Step 3: Compress the SPL tokens
      let compressIx;
      try {
        console.log("Compressing SPL tokens...");
        compressIx = await CompressedTokenProgram.compress({
          payer: publicKey, // The wallet is the payer
          owner: publicKey, // The wallet is the owner
          source: ata, // The associated token account
          toAddress: publicKey, // The destination address (wallet itself)
          amount,
          mint,
        });
        console.log("Compression instruction created: ", compressIx);
      } catch (error: any) {
        throw new Error(`Error compressing SPL tokens: ${error.message}`);
      }

      // Step 4: Fetch compressed token accounts
      let compressedTokenAccounts;
      try {
        console.log("Fetching compressed token accounts...");
        compressedTokenAccounts =
          await connection.getCompressedTokenAccountsByOwner(publicKey, {
            mint,
          });
        if (
          !compressedTokenAccounts ||
          compressedTokenAccounts.items.length === 0
        ) {
          throw new Error("No compressed token accounts found for this mint.");
        }
        console.log(
          "Compressed token accounts fetched: ",
          compressedTokenAccounts
        );
      } catch (error: any) {
        throw new Error(
          `Error fetching compressed token accounts: ${error.message}`
        );
      }

      // Step 5: Select compressed token accounts for transfer
      let inputAccounts;
      try {
        inputAccounts = selectMinCompressedTokenAccountsForTransfer(
          compressedTokenAccounts.items,
          amount
        );
        console.log("Selected compressed token accounts: ", inputAccounts);
      } catch (error: any) {
        throw new Error(
          `Error selecting compressed token accounts for transfer: ${error.message}`
        );
      }

      // Step 6: Fetch validity proof
      let proof;
      try {
        console.log("Fetching validity proof...");
        proof = await connection.getValidityProof(
          inputAccounts.map((account) => bn(account.compressedAccount.hash))
        );
        console.log("Validity proof fetched: ", proof);
      } catch (error: any) {
        throw new Error(`Error fetching validity proof: ${error.message}`);
      }

      // Step 7: Get swap instructions (perform token swap)
      let swapInstructions;
      try {
        console.log("Fetching swap instructions...");
        swapInstructions = await fetch(
          "https://quote-api.jup.ag/v6/swap-instructions",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quoteResponse, // Ensure this is properly set
              userPublicKey: wallet.publicKey.toBase58(),
            }),
          }
        ).then((res) => res.json());

        if (swapInstructions.error) {
          throw new Error(
            "Failed to get swap instructions: " + swapInstructions.error
          );
        }
        console.log("Swap instructions fetched: ", swapInstructions);
      } catch (error: any) {
        throw new Error(`Error fetching swap instructions: ${error.message}`);
      }

      // Step 8: Decompress the swapped tokens back to SPL format
      let decompressIx;
      try {
        console.log("Decompressing swapped tokens...");
        decompressIx = await CompressedTokenProgram.decompress({
          payer: publicKey, // The wallet is the payer
          inputCompressedTokenAccounts: inputAccounts,
          toAddress: ata, // The associated token account
          amount,
          recentInputStateRootIndices: proof.rootIndices,
          recentValidityProof: proof.compressedProof,
        });
        console.log("Decompression instruction created: ", decompressIx);
      } catch (error: any) {
        throw new Error(`Error decompressing swapped tokens: ${error.message}`);
      }

      // Step 9: Add all instructions (compression, swap, decompression) to the transaction
      const transaction = new Transaction()
        .add(compressIx) // Compress the SPL tokens
        .add(...swapInstructions.instructions) // Perform the swap
        .add(decompressIx); // Decompress the swapped tokens

      // Fetch and assign recent blockhash
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Step 10: Sign the transaction with the user's wallet
      let signedTransaction;
      try {
        console.log("Signing transaction...");
        signedTransaction = await wallet.signTransaction(transaction);
      } catch (error: any) {
        throw new Error(`Error signing transaction: ${error.message}`);
      }

      // Step 11: Send the transaction
      let signature;
      try {
        console.log("Sending transaction...");
        signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );
        console.log("Transaction signature: ", signature);
      } catch (error: any) {
        throw new Error(`Error sending transaction: ${error.message}`);
      }

      toast.success(
        "Swap, compression, and decompression completed successfully!"
      );
      console.log("Transaction completed with signature: ", signature);
    } catch (error: any) {
      console.error("Error during swap: ", error);
      toast.error("Error during swap: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSlippageChange = (value: string) => {
    setSlippage(value);
    setModalOpen(false);
    debounceQuoteCall(
      Number(fromAmount),
      fromAsset,
      toAsset,
      activeInput === "from"
    );
  };

  return (
    <div className="md:p-4 p-2 bg-[#404040] center rounded-[34px]">
      <div className="md:w-[586px] bg-[#2C2C2C] text-white center flex-col gap-4 rounded-[24px] md:p-5 p-2">
        <div className="between w-full mb-2 px-2">
          <h2 className="md:text-[18px] font-bold">DCA</h2>
        </div>

        <div className="between w-full px-2">
          <p className="md:text-sm text-[10px]">
            {balance !== null
              ? `Balance: ${balance.toFixed(fromAsset ? fromAsset.decimals : 0)}`
              : "Balance not available"}
          </p>
          {!hasEnoughBalance && (
            <p className="md:text-sm text-[10px] text-red-600">
              Insufficient {fromAsset ? formatMintAddress(fromAsset.mint) : ""}{" "}
              balance
            </p>
          )}
        </div>

        <div className="relative w-full flex flex-col items-center gap-4">
          <div className="between gap-2 p-3 bg-[#414141] w-full rounded-[16px]">
            <Input
              label="I want to allocate"
              value={fromAmount}
              onChange={(e) => handleAmountChange(e, true)}
              name="from"
              placeholder="0.00"
              type="text"
            />
            <div className="my-auto">
              <DropDownSelect
                cta="Select Mint"
                options={compressedAssets.map((asset) => ({
                  name: asset.mint,
                  action: () => handleFromAssetChange(asset.mint),
                  image: generateGravatar(asset.mint),
                }))}
                active={fromAsset ? formatMintAddress(fromAsset.mint) : ""}
                formatMintAddress={formatMintAddress}
              />
            </div>
          </div>
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => {
              setFromAsset(toAsset);
              setToAsset(fromAsset);
              setFromAmount(toAmount);
              setToAmount(fromAmount);
              setActiveInput(activeInput === "from" ? "to" : "from");
              debounceQuoteCall(Number(toAmount), toAsset, fromAsset, false);
            }}
          >
            <Image src="/icon/filter.png" alt="swap" width={40} height={40} />
          </button>
          <div className="between gap-2 p-3 bg-[#414141] w-full rounded-[16px]">
            <Input
              label="To buy"
              value={toAmount}
              onChange={(e) => handleAmountChange(e, false)}
              name="to"
              placeholder="0.00"
              type="text"
            />
            <div className="my-auto center">
              <DropDownSelect
                cta="Select Mint"
                options={compressedAssets.map((asset) => ({
                  name: asset.mint,
                  action: () => handleToAssetChange(asset.mint),
                  image: generateGravatar(asset.mint),
                }))}
                active={toAsset ? formatMintAddress(toAsset.mint) : ""}
                formatMintAddress={formatMintAddress}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full gap-2">
          <div className="between gap-4 flex-col md:flex-row">
            <div className="between w-full md:w-1/2 gap-2 p-3 bg-[#414141] relative rounded-[16px]">
              <Input
                label="Every"
                value={duration}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setDuration(value);
                }}
                placeholder="1"
                type="text"
              />
              <div className="absolute bottom-0 right-0 pb-4 pr-4">
                <TimeframeSelect
                  cta="Minute"
                  options={timeframes.map((timeframe) => ({
                    name: timeframe,
                    action: () => handleTimeframeChange(timeframe),
                  }))}
                  active={selectedTimeframe}
                />
              </div>
            </div>

            <div className="between w-full md:w-1/2 gap-2 p-3 bg-[#414141] h-full relative rounded-[16px]">
              <Input
                label="Over"
                value={order}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setOrder(value);
                }}
                placeholder="2"
                type="text"
              />
              <div className="flex items-end justify-end absolute bottom-0 right-0 pb-6 pr-4 md:text-2xl text-lg h-full">
                Orders
              </div>
            </div>
          </div>

          <Button
            link={handleDCA}
            classname="mt-4 min-h-[50px] bg-[#9100A9] rounded-[24px] text-white font-bold w-full relative"
            loading={loading}
            validation={!wallet.connected || !hasEnoughBalance || loading}
          >
            {loading ? <Loader /> : <div>Swap</div>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DCAComponent;

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
