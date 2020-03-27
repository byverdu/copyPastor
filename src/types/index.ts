export type CopyPastorSyncStorageTypes = 'copyPastorHistory' | 'copyPastorFavs';

export type CopyPastorSyncStorage = {
  [prop in CopyPastorSyncStorageTypes]?: string[]
}
