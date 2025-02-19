// app/api/mood/route.ts
import { NextRequest, NextResponse } from "next/server";
import { secp256k1 } from "@noble/curves/secp256k1";
import { Hex, WriteContractReturnType, recoverTypedDataAddress } from "viem";
import { adminClients, fundraiseContracts } from "~~/app/lib/admin";
import scaffoldConfig from "~~/scaffold.config";

// Helper function to convert hex to number
const hexToNumber = (hex: string): number => parseInt(hex, 16);

export async function POST(request: NextRequest) {
  const { metaTransaction, signature, chainId } = await request.json();

  console.log("MetaTransaction: ", signature, chainId);

  try {
    const targetNetwork = scaffoldConfig.targetNetworks[0];
    const adminClient = adminClients[targetNetwork.id];
    const fundraiseContract = fundraiseContracts[targetNetwork.id];

    console.log("Verifying signature...");

    // Convert string representations back to BigInt
    const convertedMetaTransaction = {
      ...metaTransaction,
      nonce: BigInt(metaTransaction.nonce),
    };

    // Verify the signature
    const signerAddress = await recoverTypedDataAddress({
      domain: {
        name: "Fundraise",
        version: "1",
        chainId: BigInt(chainId),
        verifyingContract: fundraiseContract.address,
      },
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        MetaTransactionStruct: [
          { name: "nonce", type: "uint256" },
          { name: "from", type: "address" },
          { name: "functionSignature", type: "bytes" },
        ],
      },
      primaryType: "MetaTransactionStruct",
      message: convertedMetaTransaction,
      signature: signature as Hex,
    });

    console.log("Signature verified, its from: ", signerAddress);

    if (signerAddress.toLowerCase() !== metaTransaction.from.toLowerCase()) {
      throw new Error("Invalid signature");
    }

    // Split the signature
    const signatureHex = signature.slice(2); // Remove '0x' prefix
    const { r, s } = secp256k1.Signature.fromCompact(signatureHex.slice(0, 128));
    const v = hexToNumber(`0x${signatureHex.slice(128)}`);

    // Convert r and s to hexadecimal strings
    const rHex = `0x${r.toString(16).padStart(64, "0")}`;
    const sHex = `0x${s.toString(16).padStart(64, "0")}`;

    console.log("=============", "calling");

    // Call executeMetaTransaction on the DataContract
    const tx: WriteContractReturnType = await adminClient.writeContract({
      address: fundraiseContract.address,
      abi: fundraiseContract.abi,
      functionName: "executeMetaTransaction",
      args: [metaTransaction.from, metaTransaction.functionSignature, rHex, sHex, v],
    });
    console.log("=============", tx);
    return NextResponse.json({ message: "Mood stored successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error storing mood:", error);
    return NextResponse.json({ message: "Error storing mood" }, { status: 500 });
  }
}
