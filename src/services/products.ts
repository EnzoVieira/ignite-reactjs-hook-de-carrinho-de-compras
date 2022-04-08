import { Product } from "../pages/Home"

import { api } from "./api"

export const getProductItem = async (productId: number) => {
  const response = await api.get<Product>(`/products/${productId}`)

  return response
}
