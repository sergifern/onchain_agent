import {
  EVMWalletClient,
  EVMTypedData,
  EVMTransaction,
  EVMReadRequest,
} from "@goat-sdk/wallet-evm";
import { PrivyClient } from "@privy-io/server-auth";
import { ethers, Interface, JsonFragment, toQuantity } from "ethers";
import { createPublicClient } from "viem";
import { http } from "viem";
import { base } from "viem/chains";

const publicClient = createPublicClient({ 
  chain: base,
  transport: http()
})


export class PrivyEVMWalletClient extends EVMWalletClient {
  private privy: PrivyClient;
  private userAddress: `0x${string}`;
  private chainId: number;
  private provider: ethers.JsonRpcProvider;

  constructor(privyClient: PrivyClient, userAddress: `0x${string}`, chainId: number) {
    super();
    this.privy = privyClient;
    this.userAddress = userAddress;
    this.chainId = chainId;

    this.provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL, {
      name: "base",
      chainId: this.chainId,
    });
  }

  // Métodos síncronos obligatorios
  getAddress(): `0x${string}` | "" {
    return this.userAddress;
  }

  getChain() {
    return {
      type: "evm" as const,
      id: this.chainId,
    };
  }

  // Si se necesita resolver ENS, puedes implementar lógica similar a la de viem,
  // o lanzar un error si no se requiere esta funcionalidad.
  async resolveAddress(address: string): Promise<`0x${string}`> {
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) return address as `0x${string}`;
    throw new Error("ENS resolution not implemented in PrivyEVMWalletClient"); // TODO: IMPLEMENT BASENAMES RESOLUTION
  }

  // Firma un mensaje utilizando Privy
  async signMessage(message: string): Promise<{ signature: `0x${string}` }> {
    //console.log("*************signMessage", message, this.userAddress);
    const { signature } = await this.privy.walletApi.ethereum.signMessage({
      address: this.userAddress,
      chainType: "ethereum",
      message,
    });
    return { signature: signature as `0x${string}` };
  }

  // Firma datos tipados usando la API de Privy
  async signTypedData(data: EVMTypedData): Promise<{ signature: `0x${string}` }> {
    //console.log("*************signTypedData", data, this.userAddress);
    const { signature } = await this.privy.walletApi.ethereum.signTypedData({
      address: this.userAddress,
      chainType: "ethereum",
      typedData: data,
    });
    return { signature: signature as `0x${string}` };
  }

  async sendTransaction(
    transaction: EVMTransaction
  ): Promise<{ hash: `0x${string}`; status: "success" | "reverted" }> {
    const { to, abi, functionName, args, value, data } = transaction;
    
    //console.log("*************sendTransaction", transaction, this.userAddress);
    // Verificar que exista la cuenta conectada
    if (!this.userAddress) throw new Error("No account connected");
  
    // Resolver la dirección destino (por ejemplo, si se trata de un ENS)
    const toAddress = await this.resolveAddress(to);
  
    const valueHex = value ? toQuantity(value.toString()) : "0x0";

    // Caso 1: Transferencia simple (sin ABI)
    if (!abi) {
      const txParams = {
        to: toAddress,
        value: valueHex,
        data, // Puede venir vacío en una transferencia ETH simple
      };
  
      const { hash } = await this.privy.walletApi.ethereum.sendTransaction({
        address: this.userAddress,
        chainType: "ethereum",
        caip2: `eip155:${this.chainId}`,
        transaction: txParams as any,
      });
      return this.waitForReceipt(hash as `0x${string}`);
    }
  
    // Caso 2: Llamada a contrato (se requiere functionName)
    if (!functionName) {
      throw new Error("Function name is required for contract calls");
    }
  
    // Codificar la llamada al contrato usando el ABI
    const iface = new Interface(abi as any);
    const callData = iface.encodeFunctionData(functionName, args);
  
    const txParams = {
      to: toAddress,
      value: valueHex, // Generalmente 0 en llamadas a contrato
      data: callData,
    };
  
    //console.log("*************txParams", txParams);
  
    // Enviar la transacción usando la API de Privy
    const { hash } = await this.privy.walletApi.ethereum.sendTransaction({
      address: this.userAddress,
      chainType: "ethereum",
      caip2: `eip155:${this.chainId}`,
      transaction: txParams as any,
    });
    //console.log("*************hash", hash);
    return this.waitForReceipt(hash as `0x${string}`);
  }

    /* async read(request: EVMReadRequest) {
        const { address, abi, functionName, args } = request;
        if (!abi) throw new Error("Read request must include ABI for EVM");

        const result = await this.publicClient.readContract({
            address: await this.resolveAddress(address),
            abi,
            functionName,
            args,
        });

        return { value: result };
    }*/

  async read(request: EVMReadRequest): Promise<{ value: unknown }> {
    //console.log("*************read", request);
  
    // If the request includes ABI, functionName, and args,
    // we can encode the call data.
    if (request.abi && request.functionName && request.args) {
      try {
        // Create an ethers Interface from the ABI.
        const abi = request.abi as JsonFragment[];
        const iface = new Interface(abi);
        // Encode the function call with the provided function name and args.
        const data = iface.encodeFunctionData(request.functionName, request.args);
        
        // Create a transaction request with the encoded data.
        const txRequest: ethers.TransactionRequest = {
          to: request.address,
          data,
        };
        //console.log("[read] Encoded txRequest:", txRequest);
        
        // Call the contract.
        const resultData = await this.provider.call(txRequest);
        //console.log("[read] Raw result data:", resultData);
        
        // Decode the result using the ABI.
        const decoded = iface.decodeFunctionResult(request.functionName, resultData);
        //console.log("[read] Decoded result:", decoded);
        
        // Return the decoded result. (You might need to adjust the format to what your tools expect)
        return { value: decoded };
      } catch (error) {
        console.error("[read] Error encoding/decoding call:", error);
        throw error;
      }
    }
  
    // Fallback: if the request already has a data field, call directly.
    /*if (request.data) {
      const result = await this.provider.call(request as ethers.TransactionRequest);
      return { value: result };
    }*/
  
    throw new Error("[read] Request does not include necessary fields for a contract call.");
  }


  async balanceOf(
    address: string
  ): Promise<{
    value: string;
    decimals: number;
    symbol: string;
    name: string;
    inBaseUnits: string;
  }> {
    //console.log("*************balanceOf", address, this.userAddress);
    if (address.toLowerCase() === this.userAddress.toLowerCase()) {
      // Native balance: use provider.getBalance.
      const balanceBN = await this.provider.getBalance(this.userAddress);
      // For native ETH, we use 18 decimals and a generic "ETH" symbol.
      return {
        value: balanceBN.toString(),
        decimals: 18,
        symbol: "ETH",
        name: "Ethereum",
        inBaseUnits: balanceBN.toString(),
      };
    } else {
      // ERC-20 token balance: assume the address is a token contract.
      const erc20Abi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)",
        "function name() view returns (string)",
      ];
      const contract = new ethers.Contract(address, erc20Abi, this.provider);
      const balanceBN = await contract.balanceOf(this.userAddress);
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();
      const name = await contract.name();
      //console.log("*************balanceBN", balanceBN.toString());

      return {
        value: balanceBN.toString(),
        decimals,
        symbol,
        name,
        inBaseUnits: balanceBN.toString(),
      };
    }
  }

  // Simula la espera del recibo de la transacción. Aquí podrías integrar un proveedor JSON-RPC para obtener la confirmación real.
  private async waitForReceipt(txHash: `0x${string}`) {
    //console.log("*************waitForReceipt", txHash);
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
    return { hash: receipt.transactionHash, status: receipt.status };
  }
}  // End of class

// Move the factory function outside the class
export function privyWallet(
  privyClient: PrivyClient,
  userAddress: `0x${string}`,
  chainId: number
): PrivyEVMWalletClient {
  return new PrivyEVMWalletClient(privyClient, userAddress, chainId);
}
