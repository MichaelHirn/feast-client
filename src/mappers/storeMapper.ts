import { Store } from '../store'
import { UpdateStoreStatus } from '../types'

export const StoreMapper = {
  fromListStoresResponse (response: any): Store[] {
    if (response.store instanceof Array) {
      return response.store.map(storeObject => Store.fromFeast(storeObject))
    }
    return []
  },

  fromUpdateStoreResponse (response: any): { store: Store, status: UpdateStoreStatus } {
    return {
      store: Store.fromFeast(response.store),
      status: UpdateStoreStatus[response.status] as unknown as UpdateStoreStatus
    }
  }
}
