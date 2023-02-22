import { Observable } from "rxjs";

export interface P2PService {
  // utils function
  checkWallet(input: CheckWalletRequest): Observable<CheckWalletResponse>;
  broadcastAssignKey(input: BroadcastAssignKeyRequest): Observable<BroadcastAssignKeyResponse>;
}

export type BroadcastAssignKeyRequest = {
  id: number
};

export type BroadcastAssignKeyResponse = {
  id: number;
  name: string
};

export type CheckWalletRequest = {
  email: string
}

export type CheckWalletResponse = {
  publicKey: string
  address: string
}
