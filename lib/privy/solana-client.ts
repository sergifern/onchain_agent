import { 
  SolanaWalletClient ,
  SolanaTransaction
} from "@goat-sdk/wallet-solana";
import {
  Connection,
  Transaction,
  VersionedTransaction,
  PublicKey,
} from "@solana/web3.js";
import { PrivyClient } from "@privy-io/server-auth";

export type PrivySolanaWalletClientCtorParams = {
  connection: Connection;
  privyClient: PrivyClient;
  userAddress: string;
  // CAIP2 para Solana, por ejemplo para mainnet: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
  caip2?: string;
};

export class PrivySolanaWalletClient extends SolanaWalletClient {
  private privy: PrivyClient;
  private userAddress: string;
  private caip2: string;

  constructor(params: PrivySolanaWalletClientCtorParams) {
    super({ connection: params.connection as any });
    this.privy = params.privyClient;
    this.userAddress = params.userAddress;
    this.caip2 = params.caip2 || "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";
  }

  // Implementación requerida: retorna la dirección de la wallet
  getAddress(): string {
    return this.userAddress;
  }

  // Opcional: Si deseas firmar mensajes
  async signMessage(message: string | Uint8Array): Promise<{ signature: string }> {
    const result = await this.privy.walletApi.solana.signMessage({
      address: this.userAddress,
      chainType: "solana" as any,
      message,
    });
    return { signature: result.signature.toString() };
  }

  // Firma una transacción sin enviarla
  async signTransaction(
    transaction: Transaction | VersionedTransaction
  ): Promise<{ signedTransaction: Transaction | VersionedTransaction }> {
    return await this.privy.walletApi.solana.signTransaction({
      address: this.userAddress,
      chainType: "solana" as any,
      transaction,
    });
  }

  // Envía la transacción usando Privy
  async sendTransaction(transaction: SolanaTransaction): Promise<{ hash: string }> {
    let tx: Transaction;
  
    // Si la transacción no tiene el método serialize, reconstruirla
    if (typeof (transaction as any).serialize !== "function") {
      tx = new Transaction();
      if ("instructions" in transaction && Array.isArray(transaction.instructions)) {
        for (const instr of transaction.instructions) {
          tx.add(instr);
        }
      }
    } else {
      tx = transaction as unknown as Transaction;
    }
  
    // Asigna feePayer forzando la asignación, ya que el tipo no lo declara
    if (!("feePayer" in tx) || !tx.feePayer) {
      (tx as any).feePayer = new PublicKey(this.getAddress());
    }
  
    // Asigna recentBlockhash si no está presente
    if (!tx.recentBlockhash) {
      const latestBlockhash = await this.getConnection().getLatestBlockhash();
      tx.recentBlockhash = latestBlockhash.blockhash;
    }

    console.log('FINAL TX********', tx);
  
    // Envía la transacción utilizando Privy
    const { hash } = await this.privy.walletApi.solana.signAndSendTransaction({
      address: this.userAddress,
      chainType: "solana" as any,
      caip2: this.caip2 as any,
      transaction: tx,
    });
    
    return { hash };
  }

  // Implementa o lanza error si no es necesario
  async sendRawTransaction(transaction: string): Promise<{ hash: string }> {
    throw new Error("sendRawTransaction is not implemented in PrivySolanaWalletClient");
  }
}
