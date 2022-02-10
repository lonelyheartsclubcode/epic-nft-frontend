import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';

// Constants
const TWITTER_HANDLE = 'lonelyheartsclubcde';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have ethereum object.", ethereum);
    }
  

    const accounts = await ethereum.request({ method: 'eth_accounts'});

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized accounts", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found.");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Get MetaMask!");
        return;
      }
      // request access to account
      const accounts = await ethereum.request({ method: 'eth_requestAccounts'});

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }

    const askContractToMintNft = async () => {
      const CONTRACT_ADDRESS = "0x7b4fe1128110Ff62d0fEE2703e9e9DD7e6BA3bD1";

      try{
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

          console.log("Time to pay gas.");
          let nftTxn = await connectedContract.makeAnEpicNft();

          console.log("Minting.");
          await nftTxn.wait();

          console.log(`Minted, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

        } else {
          console.log("Ethereum object does not exist!");
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">PhunPhrases!</p>
          <p className="sub-text">
            3-word fun phrases that are generated dynamically, 100% on-chain. Over 3k+ possible combinations!
          </p>
          {currentAccount === "" ? (
          renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className='cta-button connect-wallet-button'>
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
