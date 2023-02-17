export class NodeCommitmentDto {
  commitment: string;

  signature: string;

  pubNode: string;

  constructor(commitment: string, signature: string, pubNode: string) {
    this.commitment = commitment;
    this.signature = signature;
    this.pubNode = pubNode;
  }
}
