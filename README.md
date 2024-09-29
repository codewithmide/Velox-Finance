# **Volex Finanace**

Welcome to **Volex Finanace**, a decentralized token swapping platform built on **Solana** using **Next.js**. The platform integrates with **Jupiter Aggregator** for token swaps and **zk-compression** to compress and decompress tokens during transactions by optimizing on-chain interactions. This platform is built for users who want to perform atomic swaps with efficiency, privacy, and scalability on Solana's mainnet.

---

## **Table of Contents**

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Key Components](#key-components)
6. [How to Run](#how-to-run)
7. [How to Use](#how-to-use)
8. [Swap Flow](#swap-flow)
9. [Contributing](#contributing)
10. [License](#license)

---

## **Features**

- **Token Swapping**: Swap SPL tokens and Solana tokens using the Jupiter Aggregator API.
- **zk-Compression**: Compress and decompress tokens to optimize on-chain storage using Light Protocol's stateless zk-compression.
- **User-friendly Interface**: Intuitive UI to interact with the wallet and monitor token balances.
- **Wallet Integration**: Connect your Solana wallet using `@solana/wallet-adapter-react` for a seamless decentralized experience.
- **Atomic Transactions**: Compress, swap, and decompress tokens in a single atomic transaction.

---

## **Tech Stack**

- **Framework**: [Next.js](https://nextjs.org/)
- **Blockchain**: [Solana](https://solana.com/)
- **API Integration**: [Jupiter Aggregator](https://jup.ag/)
- **zk-compression**: [Light Protocol](https://www.zkcompression.com/)
- **Wallet Adapter**: `@solana/wallet-adapter-react`
- **Languages**: TypeScript
- **Styling**: Tailwind CSS

---

## **Getting Started**

To run this project locally, follow the steps below:

### **Prerequisites**

- **Node.js**: v16.x or higher
- **npm** or **yarn**: Latest version
- **Solana Wallet**: A connected Solana wallet (e.g., Phantom, Sollet)
- **RPC Endpoints**: You need RPC API keys for both the **mainnet** and **devnet**.

### **Installation**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/codewithmide/Velox-Finance
   cd volex
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   Or with **yarn**:

   ```bash
   yarn install
   ```

3. **Configure environment variables**:

   Create a `.env` file in the root directory with the following content:

   ```bash
   NEXT_PUBLIC_MAINNET_API_BASE_URL=https://example-mainnet-api.com/your-key
   NEXT_PUBLIC_DEVNET_API_BASE_URL=https://example-devnet-api.com/your-key
   ```

   Replace the placeholder values with your actual API keys for Solana RPC endpoints.

4. **Start the development server**:

   ```bash
   npm run dev
   ```

   Or with **yarn**:

   ```bash
   yarn dev
   ```

   The application should now be running at `http://localhost:3000`.

---

## **Environment Variables**

This project relies on two key environment variables for Solana RPC connections:

- **NEXT_PUBLIC_MAINNET_API_BASE_URL**: The RPC endpoint for Solana **mainnet**. Used for production deployments and live token swaps.
- **NEXT_PUBLIC_DEVNET_API_BASE_URL**: The RPC endpoint for Solana **devnet**. Used for testing and development purposes.

These values must be set in the `.env` file. If you're using public RPC endpoints, ensure they are reliable and include your API key for better rate-limiting control.

```bash
NEXT_PUBLIC_MAINNET_API_BASE_URL=<your-mainnet-rpc-url>
NEXT_PUBLIC_DEVNET_API_BASE_URL=<your-devnet-rpc-url>
```

---

## **Key Components**

### **1. SwapComponent**

- Located in `app/components/Swap.tsx`.
- This component handles:
  - **Token selection** from dropdowns for the "From" and "To" tokens.
  - **Fetching token balances** from the connected Solana wallet.
  - **Slippage settings** for swap transactions.
  - **Token compression and decompression** using zk-compression.
  - **Swapping tokens** using Jupiter Aggregator.

### **2. Modal**

- Located in `app/components/molecules/Modal.tsx`.
- A reusable modal component used for displaying UI elements like slippage settings.

### **3. Wallet Integration**

- **Solana Wallet Adapter** (`@solana/wallet-adapter-react`) is used to manage wallet connections, balances, and transactions. The application supports wallets like Phantom and Sollet.

---

## **How to Run**

### **Mainnet**

To run the app with the mainnet environment:

1. Make sure your `.env` file has the `NEXT_PUBLIC_MAINNET_API_BASE_URL` set correctly.
2. Then, run the following command to build and start the production version:

   ```bash
   npm run build && npm start
   ```

### **Devnet**

For development and testing purposes, you can switch to the devnet environment by setting `NEXT_PUBLIC_DEVNET_API_BASE_URL` in your `.env` file and running the development server:

```bash
npm run dev
```

---

## **How to Use**

1. **Connect your wallet**: Open the app and connect your Solana wallet (e.g., Phantom).
2. **Select tokens**: Choose the tokens you wish to swap from the dropdown menu.
3. **Input amount**: Enter the amount of tokens to swap.
4. **Adjust slippage**: If needed, open the slippage modal to adjust the slippage tolerance for the swap.
5. **Perform swap**: Click the **Swap** button to compress, swap, and decompress the tokens atomically.

---

## **Swap Flow**

### **1. Token Compression**

Before the swap happens, the platform uses **zk-compression** to compress the tokens, optimizing transaction size and privacy. This is handled using the `CompressedTokenProgram` from Light Protocol.

### **2. Jupiter Swap**

Once the token is compressed, the swap is executed using the **Jupiter Aggregator API**, which ensures the best route and lowest fees for the swap.

### **3. Token Decompression**

After the swap, the token is decompressed back to its original form. This entire process happens atomically, ensuring no interruptions in the user experience.

---
