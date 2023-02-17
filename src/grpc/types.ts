import { Observable } from "rxjs";

export interface P2PService {
  // utils function
  broadcastAssignKey(input: BroadcastAssignKeyRequest): Observable<BroadcastAssignKeyResponse>;
}

export type BroadcastAssignKeyRequest = {
  id: number
};

export type BroadcastAssignKeyResponse = {};
