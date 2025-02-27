
export interface DocumentData {
  id: string
  namespace: string
  name: string
  description: string
  type: string;
  isPublic: boolean;
  access: string[]
  views: number,
  likes: number,
  lastUpdated: string,
  blockchain: {
    network: string,
    txHash: string,
    blockNumber: number,
    timestamp: string,
  }
}