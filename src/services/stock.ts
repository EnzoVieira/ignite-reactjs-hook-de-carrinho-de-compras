import { Stock } from "../types"

import { api } from "./api"

export const getStockItem = async (productId: number) => {
  const response = await api.get<Stock>(`/stock/${productId}`)

  return response
}
