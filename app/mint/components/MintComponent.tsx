"use client";

import React, { useState } from "react";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  LightSystemProgram,
  Rpc,
  confirmTx,
  createRpc,
} from "@lightprotocol/stateless.js";
import { createMint, mintTo, transfer } from "@lightprotocol/compressed-token";
import toast from "react-hot-toast";
import { Button } from "@/app/components/molecules/FormComponents";

// UI Component for minting compressed tokens
const MintComponent = () => {
  const [recipientPublicKey, setRecipientPublicKey] = useState<string>("");
  const [mintAmount, setMintAmount] = useState<string>("1000000000"); // 1e9 default
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);
  const [transferTxId, setTransferTxId] = useState<string | null>(null);

  // Function to handle minting compressed tokens
  const handleMint = async () => {
    if (!recipientPublicKey || !mintAmount) {
      toast.error(
        "Please provide a valid recipient public key and mint amount"
      );
      return;
    }

    setLoading(true);
    try {
      // Initialize keypairs
      const payer = Keypair.generate(); // Payer of the transactions
      const tokenRecipient = new PublicKey(recipientPublicKey); // Recipient's public key

      // Create an RPC connection
      const connection: Rpc = createRpc(); // Assuming a local connection

      // Airdrop lamports to the payer for fees
      await confirmTx(
        connection,
        await connection.requestAirdrop(payer.publicKey, 10e9)
      ); // Airdrop 10 SOL
      toast.success("Airdropped 10 SOL to payer.");

      // Create the compressed token mint
      const { mint, transactionSignature } = await createMint(
        connection,
        payer,
        payer.publicKey,
        9 // Number of decimals for the token
      );
      setMintAddress(mint.toBase58());
      setTransactionSignature(transactionSignature);
      console.log(
        `Mint created! Mint address: ${mint.toBase58()}, Tx ID: ${transactionSignature}`
      );
      toast.success("Compressed token mint created!");

      // Mint compressed tokens to the payer's account
      const mintToTxId = await mintTo(
        connection,
        payer,
        mint,
        payer.publicKey, // Destination
        payer,
        parseInt(mintAmount) // Amount to mint
      );
      console.log(
        `Minted ${mintAmount} tokens to ${payer.publicKey}. Tx ID: ${mintToTxId}`
      );
      toast.success(`Minted ${mintAmount} tokens successfully!`);

      // Transfer the minted tokens to the recipient
      const transferTxId = await transfer(
        connection,
        payer,
        mint,
        parseInt(mintAmount), // Amount to transfer
        payer, // Owner (payer is the owner in this case)
        tokenRecipient // To address (recipient public key)
      );
      setTransferTxId(transferTxId);
      console.log(
        `Transferred ${mintAmount} tokens to ${recipientPublicKey}. Tx ID: ${transferTxId}`
      );
      toast.success(`Transferred ${mintAmount} tokens to recipient!`);
    } catch (error: any) {
      console.error("Error during minting:", error);
      toast.error(`Error during minting: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:p-4 p-2 bg-[#404040] w-full md:w-[586px] center rounded-[34px]">
      <div className="w-full bg-[#2C2C2C] text-white center flex-col gap-4 rounded-[24px] md:p-5 p-2">
        <div className="between w-full mb-2 px-2">
          <h2 className="md:text-[18px] font-bold">Mint a Compressed Token</h2>
        </div>

        <div className="flex w-full flex-col gap-3 bg-[#404040] p-3 rounded-[14px]">
          <label className="text-sm font-medium">Recipient Public Key:</label>
          <input
            type="text"
            className="p-3 bg-[#2C2C2C] text-sm rounded-lg outline-none"
            value={recipientPublicKey}
            onChange={(e) => setRecipientPublicKey(e.target.value)}
            placeholder="Enter recipient's public key"
          />
        </div>

        <div className="flex w-full flex-col gap-3 bg-[#404040] p-3 rounded-[14px]">
          <label className="text-sm font-medium">
            Mint Amount (in smallest units):
          </label>
          <input
            type="number"
            className="p-3 bg-[#2C2C2C] text-sm rounded-lg outline-none"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            placeholder="Enter amount to mint"
          />
        </div>

        <Button
          classname="min-h-[50px] bg-[#9100A9] rounded-[24px] text-white font-bold w-full relative"
          link={handleMint}
          validation={!recipientPublicKey || loading}
        >
          {loading ? "Minting..." : "Mint"}
        </Button>

        {mintAddress && (
          <div className="md:mt-4 p-3 bg-[#404040] rounded-xl w-full flex flex-col gap-4">
            <p className="md:text-sm text-[10px] w-full break-words word-break-all">
              Mint Address: {mintAddress}
            </p>
            <p className="md:text-sm text-[10px] w-full break-words word-break-all">
              Mint Transaction Signature: {transactionSignature}
            </p>
            {transferTxId && (
              <p className="md:text-sm text-[10px] w-full break-words word-break-all">
                Transfer Transaction ID: {transferTxId}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MintComponent;
