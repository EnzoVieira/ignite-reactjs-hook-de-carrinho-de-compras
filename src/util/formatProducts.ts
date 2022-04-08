import { Product } from "../pages/Home"

import { formatPrice } from "./format"

export const formatProducts = (products: Product[]) => {
  const formatedCart = products.map((product) => ({
    ...product,
    priceFormatted: formatPrice(product.price),
  }))

  return formatedCart
}
