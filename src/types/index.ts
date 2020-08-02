export type CopyPastorSyncStorageTypes = 'copyPastorHistory' | 'copyPastorFavs';

export type CopyPastorSyncStorage = {
  [prop in CopyPastorSyncStorageTypes]?: string[]
}

export interface CopyPastorMessage {
  type: (CopyPastorSyncStorageTypes | string)
  msg: string
}