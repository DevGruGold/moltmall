import React, { useState } from 'react';
import { ethers } from 'ethers';

const TokenizeProperty = ({ contractAddress, abi, signer }) => {
    const [formData, setFormData] = useState({
        location: '',
        valuation: '',
        sqft: '',
        documentHash: '', // In real app, this comes from IPFS upload
        tokenURI: ''      // In real app, this is metadata JSON uploaded to IPFS
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!signer) return alert("Please connect wallet");

        try {
            setStatus('Minting...');
            const contract = new ethers.Contract(contractAddress, abi, signer);

            // 1. In a real app, upload image & docs to IPFS here
            // const docHash = await uploadToIPFS(file);

            const tx = await contract.tokenizeProperty(
                await signer.getAddress(),
                formData.tokenURI,
                formData.location,
                ethers.utils.parseEther(formData.valuation), // Assuming valuation in ETH/Token units
                formData.sqft,
                formData.documentHash
            );

            await tx.wait();
            setStatus('Property Tokenized Successfully! Token ID: ' + tx.value); // Value might be in event logs
        } catch (error) {
            console.error(error);
            setStatus('Error: ' + error.message);
        }
    };

    return (
        <div className="tokenize-container bg-gray-900 text-white p-6 rounded-lg">
            <h2 className="text-2xl mb-4 font-bold text-yellow-400">🏠 Tokenize Real Estate</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Property Location</label>
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        placeholder="123 Blockchain Blvd, Crypto City"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Valuation (ETH)</label>
                        <input
                            name="valuation"
                            type="number"
                            value={formData.valuation}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Square Footage</label>
                        <input
                            name="sqft"
                            type="number"
                            value={formData.sqft}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Legal Documents (IPFS Hash)</label>
                    <input
                        name="documentHash"
                        value={formData.documentHash}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        placeholder="Qm..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Metadata URI (IPFS)</label>
                    <input
                        name="tokenURI"
                        value={formData.tokenURI}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        placeholder="ipfs://..."
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition"
                >
                    Mint Property Token
                </button>
            </form>
            {status && <p className="mt-4 text-center text-sm">{status}</p>}
        </div>
    );
};

export default TokenizeProperty;
