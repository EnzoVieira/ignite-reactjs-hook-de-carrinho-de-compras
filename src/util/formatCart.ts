import { Product } from "../types"

import { formatPrice } from "./format"

export const formatCart = (products: Product[]) => {
  const formatedCart = products.map((product) => ({
    ...product,
    priceFormatted: formatPrice(product.price),
    subTotal: formatPrice(product.amount * product.price),
  }))

  return formatedCart
}
