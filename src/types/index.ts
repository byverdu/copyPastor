export type CopyPastorSyncStorageTypes = "copyPastorHistory";

export type CopyPastorItem = {
  href: string;
  copyText: string;
  date: number;
  id: string;
  favorite: boolean;
};

export type CopyPastorMessageType =
  | "get-storage"
  | "save-history"
  | "delete-selected"
  | "error"
  | "clear-history"
  | "set-favorite";

export type CopyPastorSyncStorage = {
  copyPastorHistory: CopyPastorItem[];
};

export interface CopyPastorMessage {
  type?: CopyPastorSyncStorageTypes | string;
  msg: CopyPastorMessageType;
  payload?: any;
}
