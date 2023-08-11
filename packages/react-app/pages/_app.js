import { useEffect } from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import celoGroups from "@celo/rainbowkit-celo/lists";
import Layout from "../components/Layout";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { publicProvider } from "wagmi/providers/public";
import { Alfajores, Celo} from "@celo/rainbowkit-celo/chains";
import localFont from '@next/font/local';
import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider);

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID; // get one at https://cloud.walletconnect.com/app;
const ethUtil = require('ethereumjs-util');
const abi = require('ethereumjs-abi');
const chai = require('chai');

const { chains, publicClient } = configureChains(
    [Celo, Alfajores],
    [publicProvider()]
);

const connectors = celoGroups({
    chains,
    projectId,
    appName:
        (typeof document === "object" && document.title) || "Your App Name",
});

const appInfo = {
    appName: "Celo Composer",
};

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient: publicClient,
});

const satoshi = localFont({
    src : [
        {
            path: '../public/Satoshi/Fonts/Variable/Satoshi-Variable.tff',
            weight: '700'
        }
    ],
    variable: '--font-satoshi-variable'
})

function App({ Component, pageProps }) {
    const typedData = {
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            MintCert: [
                { name: 'owner', type: 'address' },
                { name: 'recipient', type: 'address' },
                { name: 'certificateID', type: 'uint256' },
                { name: 'nonce', type: 'uint256' },
                { name: 'deadline', type: 'uint256' },
            ],
        },
        primaryType: 'MintCert',
        domain: {
            name: 'Educational Certificate',
            version: '1',
            chainId: 44787,
            verifyingContract: '0x68fE959ceDf999e581d1A45C33Ea4DE964daa11a',
        },
        message: {
            owner : '0x9B69F998b2a2b20FF54a575Bd5fB90A5D71656C1',
            recipient : '0xFa027a58eF89d124CA94418CE5403C29Af2D7459',
            certificateID : 1,
            nonce : 0, 
            deadline : 1722787680,
        },
    };
    
    const types = typedData.types;
    
    // Recursively finds all the dependencies of a type
    function dependencies(primaryType, found = []) {
        if (found.includes(primaryType)) {
            return found;
        }
        if (types[primaryType] === undefined) {
            return found;
        }
        found.push(primaryType);
        for (let field of types[primaryType]) {
            for (let dep of dependencies(field.type, found)) {
                if (!found.includes(dep)) {
                    found.push(dep);
                }
            }
        }
        return found;
    }
    
    function encodeType(primaryType) {
        // Get dependencies primary first, then alphabetical
        let deps = dependencies(primaryType);
        deps = deps.filter(t => t != primaryType);
        deps = [primaryType].concat(deps.sort());
    
        // Format as a string with fields
        let result = '';
        for (let type of deps) {
            result += `${type}(${types[type].map(({ name, type }) => `${type} ${name}`).join(',')})`;
        }
        return result;
    }
    
    function typeHash(primaryType) {
        return ethUtil.keccakFromString(encodeType(primaryType), 256);
    }
    
    function encodeData(primaryType, data) {
        let encTypes = [];
        let encValues = [];
    
        // Add typehash
        encTypes.push('bytes32');
        encValues.push(typeHash(primaryType));
    
        // Add field contents
        for (let field of types[primaryType]) {
            let value = data[field.name];
            if (field.type == 'string' || field.type == 'bytes') {
                encTypes.push('bytes32');
                value = ethUtil.keccakFromString(value, 256);
                encValues.push(value);
            } else if (types[field.type] !== undefined) {
                encTypes.push('bytes32');
                value = ethUtil.keccak256(encodeData(field.type, value));
                encValues.push(value);
            } else if (field.type.lastIndexOf(']') === field.type.length - 1) {
                throw 'TODO: Arrays currently unimplemented in encodeData';
            } else {
                encTypes.push(field.type);
                encValues.push(value);
            }
        }
    
        return abi.rawEncode(encTypes, encValues);
    }
    
    function structHash(primaryType, data) {
        return ethUtil.keccak256(encodeData(primaryType, data));
    }
    
    function signHash() {
        return ethUtil.keccak256(
            Buffer.concat([
                Buffer.from('1901', 'hex'),
                structHash('EIP712Domain', typedData.domain),
                structHash(typedData.primaryType, typedData.message),
            ]),
        );

    }
    
   
   const handleSign = async () => {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const senderAddress = accounts[0];

            // Construct the EIP-712 message hash
            const messageHash = signHash();
            // Request the signature using eth_signTypedData_v4
            const signature = await ethereum.request({
                method: 'eth_signTypedData_v4',
                params: [senderAddress, typedData],
            });

            console.log("Signature:", signature);
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        console.error("MetaMask not detected");
    }
};


    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
                chains={chains}
                appInfo={appInfo}
                coolMode={true}
            >
            <div  className={`${satoshi.variable} font-sans`}>
            <div className='bg-[#0B031E]'>
                <Layout>
                    <Component {...pageProps}/>
                    <button onClick={handleSign}>Sign Here</button>
                </Layout>
            </div>

            </div>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default App;


