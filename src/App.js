import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import myEpicNft from './utils/myEpicNft.json';

// Constants
const TWITTER_HANDLE = 'lonelyheartscde';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/phunphrases';
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0x4eB6d926c8A9DaAb81c467D5F7b63066ca54bd64";

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
    
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain" + chainId);

    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the rinkeby network!");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts'});

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized accounts", account);
      setCurrentAccount(account);

      setupEventListener();
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

      setupEventListener();
    } catch (error) {
      console.log(error)
    }

  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted",(from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey, we minted an NFT to your wallet. It may be blank right now. It might take up to 10 minutes to appear on opensea, but here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`);
        });

        console.log("Setup event listener!")
      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();
  
        console.log("Minting...please wait.")
        await nftTxn.wait();
        
        console.log(`Minted, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
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
          
          {currentAccount === "" 
          ? renderNotConnectedContainer()
          : (
            <button onClick={askContractToMintNft} className='cta-button connect-wallet-button'>
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
        <button onClick={(e) => {
            e.preventDefault();
            window.location.href=OPENSEA_LINK;
          }} className="cta-button connect-wallet-button">
            🌊 View Collection on OpenSea
          </button>
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
