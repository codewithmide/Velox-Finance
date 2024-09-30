"use client";

import React, { useState } from "react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { LightSystemProgram, Rpc, confirmTx, createRpc } from "@lightprotocol/stateless.js";
import { createMint, mintTo, transfer } from "@lightprotocol/compressed-token";
import toast from "react-hot-toast";

// UI Component for minting compressed tokens
const MintComponent = () => {
  const [recipientPublicKey, setRecipientPublicKey] = useState<string>("");
  const [mintAmount, setMintAmount] = useState<string>("1000000000"); // 1e9 default
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [transferTxId, setTransferTxId] = useState<string | null>(null);

  // Function to handle minting compressed tokens
  const handleMint = async () => {
    if (!recipientPublicKey || !mintAmount) {
      toast.error("Please provide a valid recipient public key and mint amount");
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
      await confirmTx(connection, await connection.requestAirdrop(payer.publicKey, 10e9)); // Airdrop 10 SOL
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
      console.log(`Mint created! Mint address: ${mint.toBase58()}, Tx ID: ${transactionSignature}`);
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
      console.log(`Minted ${mintAmount} tokens to ${payer.publicKey}. Tx ID: ${mintToTxId}`);
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
      console.log(`Transferred ${mintAmount} tokens to ${recipientPublicKey}. Tx ID: ${transferTxId}`);
      toast.success(`Transferred ${mintAmount} tokens to recipient!`);
    } catch (error: any) {
      console.error("Error during minting:", error);
      toast.error(`Error during minting: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-[#F8F8F9] shadow flex flex-col gap-4 rounded-lg w-[586px]">
      <h2 className="text-2xl">Mint a Compressed Token</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Recipient Public Key:</label>
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg active:border-gray-500 outline-none"
          value={recipientPublicKey}
          onChange={(e) => setRecipientPublicKey(e.target.value)}
          placeholder="Enter recipient's public key"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Mint Amount (in smallest units):</label>
        <input
          type="number"
          className="p-2 border border-gray-300 rounded-lg active:border-gray-500 outline-none"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
          placeholder="Enter amount to mint"
        />
      </div>

      <button
        className="mt-4 p-2 bg-black text-white rounded-lg"
        onClick={handleMint}
        disabled={loading}
      >
        {loading ? "Minting..." : "Mint Compressed Tokens"}
      </button>

      {mintAddress && (
        <div className="mt-4 p-3 bg-green-100 rounded-lg">
          <p>Mint Address: {mintAddress}</p>
          <p>Mint Transaction Signature: {transactionSignature}</p>
          {transferTxId && <p>Transfer Transaction ID: {transferTxId}</p>}
        </div>
      )}
    </div>
  );
};

export default MintComponent;
