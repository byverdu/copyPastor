export type CopyPastorSyncStorageTypes = "copyPastorHistory" | "copyPastorFavs";

export type CopyPastorItem = {
  href: string;
  copyText: string;
  date: number;
  id: string;
  favorite: boolean;
};

export type CopyPastorMessageType =
  | "save-history"
  | "delete-selected"
  | "error"
  | "clear-history"
  | "set-favorite";

export type CopyPastorSyncStorage = {
  [prop in CopyPastorSyncStorageTypes]?: CopyPastorItem[];
};

export interface CopyPastorMessage {
  type?: CopyPastorSyncStorageTypes | string;
  msg: CopyPastorMessageType;
  payload?: any;
}

export enum CopyPastorMessageEnum {
  "save-history" = "save-history",
  "delete-selected" = "delete-selected",
  "error" = "error",
  "set-favorite" = "set-favorite",
  "clear-history" = "clear-history",
}
