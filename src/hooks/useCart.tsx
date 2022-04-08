import { createContext, ReactNode, useContext, useState } from "react"
import { toast } from "react-toastify"

import { Product } from "../types"

import { getStockItem } from "../services/stock"
import { getProductItem } from "../services/products"

interface CartProviderProps {
  children: ReactNode
}

interface UpdateProductAmount {
  productId: number
  amount: number
}

interface CartContextData {
  cart: Product[]
  addProduct: (productId: number) => Promise<void>
  removeProduct: (productId: number) => void
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void
}

const CartContext = createContext<CartContextData>({} as CartContextData)

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart")

    if (storagedCart) {
      return JSON.parse(storagedCart)
    }

    return []
  })

  async function verifyInStock(
    amount: number,
    productId: number
  ): Promise<boolean> {
    const stockItem = await getStockItem(productId)

    // const currentAmount = maybeProduct ? maybeProduct.amount : 0

    if (amount > stockItem.data.amount) {
      toast.error("Quantidade solicitada fora de estoque")

      return false
    }

    return true
  }

  const addProduct = async (productId: number) => {
    try {
      const updatedCart = [...cart]

      const productAlreadyInCart = updatedCart.find(
        (product) => product.id === productId
      )

      const amount = productAlreadyInCart ? productAlreadyInCart.amount + 1 : 0

      const validAmount = await verifyInStock(amount, productId)
      if (!validAmount) {
        return
      }

      if (!productAlreadyInCart) {
        const product = await getProductItem(productId)

        const newProduct = { ...product.data, amount: 1 }
        updatedCart.push(newProduct)
      } else {
        productAlreadyInCart.amount += 1
      }

      setCart(updatedCart)
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart))
    } catch {
      toast.error("Erro na adição do produto")
    }
  }

  const removeProduct = (productId: number) => {
    try {
      const productExists = cart.find((product) => product.id === productId)

      if (!productExists) {
        toast.error("Erro na remoção do produto")

        return
      }

      const updatedCart = cart.filter((product) => product !== productExists)

      setCart(updatedCart)
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart))
    } catch {
      toast.error("Erro na remoção do produto")
    }
  }

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) {
        return
      }

      const updatedCart = [...cart]

      const product = updatedCart.find(
        (product) => product.id === productId
      ) as Product

      const validAmount = await verifyInStock(amount, productId)
      if (!validAmount) {
        return
      }

      product.amount = amount

      setCart(updatedCart)
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart))
    } catch {
      toast.error("Erro na alteração de quantidade do produto")
    }
  }

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextData {
  const context = useContext(CartContext)

  return context
}
