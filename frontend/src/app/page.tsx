'use client'

import Link from "next/link";
import { BrowserProvider, Contract } from "ethers";
import { useEffect, useState } from "react";
import Factory from './Factory.json';
import List from "./components/List";
import Token from "./components/Token";
import Trade from "./components/Trade";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [factory, setFactory] = useState(null);
  const [fee, setFee] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [token, setToken] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showTrade, setShowTrade] = useState(false);

  function toggleCreate() {
    setShowCreate((prev) => !prev);
  }

  function toggleTrade(selectedToken) {
    setToken(selectedToken);
    setShowTrade((prev) => !prev);
  }

  async function loadBlockchainData() {
    const providerA = new BrowserProvider(window.ethereum);
    setProvider(providerA);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);

    const factory = new Contract('0xE8C4cAd0cd0dff02CdBBd1870CfdC06217E7EE82', Factory, providerA);
    setFactory(factory);
    const gasLimit = 500000; // Adjust based on the contract needs
    const fee = await factory.fee({ gasLimit })
    setFee(fee);

    const totalTokens = Number(await factory.totalTokens());
    const fetchedTokens = [];

    for (let i = 0; i < Math.min(totalTokens, 6); i++) {
      const tokenSale = await factory.getTokenSale(i);

      fetchedTokens.push({
        token: tokenSale.token,
        name: tokenSale.name,
        creator: tokenSale.creator,
        sold: tokenSale.sold,
        raised: tokenSale.raised,
        isOpen: tokenSale.isOpen,
      });
    }

    setTokens(fetchedTokens.reverse());
  }

  useEffect(() => {
    loadBlockchainData();
  }, [showCreate, showTrade]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <main className="max-w-6xl mx-auto py-12 px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-700">Core DAO Launchpad</h1>
          <p className="text-lg text-gray-600 mt-2">
            Launch your token on Core DAO with AI-powered assistance.
          </p>
        </div>

        {/* Wallet Connection Info */}
        <div className="text-center mb-6">
          {account ? (
            <p className="text-lg font-semibold text-green-600">Connected: {account}</p>
          ) : (
            <p className="text-lg font-semibold text-red-500">No Account Found</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link
            href="/ai"
            className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 text-lg font-medium text-center"
          >
            Chat with AI 🤖
          </Link>
          <button
            onClick={factory && account ? toggleCreate : null}
            className={`py-3 px-6 rounded-lg shadow-md text-lg font-medium transition duration-300 ${
              factory && account
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-800 cursor-not-allowed"
            }`}
          >
            {factory ? (account ? "Start a New Token 🚀" : "Please Connect") : "Contract Not Deployed"}
          </button>
        </div>

        {/* Token Listings */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-gray-800 text-center">New Listings</h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!account ? (
              <p className="text-center col-span-full text-lg text-red-500">Please connect your wallet.</p>
            ) : tokens.length === 0 ? (
              <p className="text-center col-span-full text-lg text-gray-500">No tokens listed yet.</p>
            ) : (
              tokens.map((token, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition transform hover:scale-105"
                >
                  <h3 className="text-xl font-bold text-gray-800">{token.name}</h3>
                  <p className="text-sm text-gray-600">Creator: {token.creator}</p>
                  <p className="text-sm text-gray-600">Raised: {token.raised} ETH</p>
                  <p className="text-sm text-gray-600">Sold: {token.sold} Tokens</p>
                  <p className={`mt-2 font-semibold ${token.isOpen ? "text-green-600" : "text-red-600"}`}>
                    {token.isOpen ? "Open for Sale" : "Closed"}
                  </p>
                  <button
                    onClick={() => toggleTrade(token)}
                    className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                  >
                    Trade Token 🔄
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Conditional Rendering for Forms */}
        {showCreate && (
          <List toggleCreate={toggleCreate} fee={fee} provider={provider} factory={factory} />
        )}

        {showTrade && (
          <Trade toggleTrade={toggleTrade} token={token} provider={provider} factory={factory} />
        )}
      </main>
    </div>
  );
}
