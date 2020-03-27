import {CopyPastorSyncStorage, CopyPastorSyncStorageTypes} from '../types';

export default function testHelper (greeting: string): string {
  return `Hello ${greeting}`
}

export const copyPastor = {
  set(items: CopyPastorSyncStorage, callback?: () => void) {
    return chrome.storage.sync.set(items, callback)
  },
  get(items: CopyPastorSyncStorageTypes[], callback: (result: CopyPastorSyncStorage) => void) {
    return chrome.storage.sync.get(items, callback)
  }
}