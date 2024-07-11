import { useState, useContext, createContext, ReactNode } from "react";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem ={
    id: number
    quantity: number
}

type ShoppingCartContext = {
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    openCart: () => void
    closeCart: () => void
    cartQuantity: () => number
    cartItems: CartItem[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}


export function ShoppingCartProvider({children}: ShoppingCartProviderProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    
    function getItemQuantity(id: number) {
        const item = cartItems.find(item => item.id === id);
        return item ? item.quantity : 0;
    }   

    function increaseCartQuantity(id: number) {
        setCartItems(currItems => {
          if (currItems.find(item => item.id === id) == null) {
            // If item does not exist, add it with quantity 1
            return [...currItems, { id, quantity: 1 }];
          } else {
            // If item exists, increase its quantity by 1
            return currItems.map(item => {
              if (item.id === id) {
                return { ...item, quantity: item.quantity + 1 };
              } else {
                return item;
              }
            });
          }
        });
      }

      function decreaseCartQuantity(id: number) {
        setCartItems(currItems => {

          const item = currItems.find(item => item.id === id);
          // Check if item exists and handle case where item is undefined
          if (item && item.quantity === 1) {
            // Filter out the item if its quantity is 1
            return currItems.filter(item => item.id !== id);
          } else if (item) {
            // If item exists and quantity is more than 1, decrease its quantity by 1
            return currItems.map(item => {
              if (item.id === id) {
                return { ...item, quantity: item.quantity - 1 };
              } else {
                return item;
              }
            });
          } else {
            // If the item is not found, return the current items unmodified
            return currItems;
          }
        });
      }

      function removeFromCart(id: number) {
        setCartItems(currItems => {
          return currItems.filter(item => item.id !== id);
        });
      }
      
      function cartQuantity() {
        return cartItems.reduce((totalQuantity, item) => {
          // Accumulate the quantity of each item in the cart
          return totalQuantity + item.quantity;
        }, 0); // Start with an initial value of 0
      }

      function openCart() {
        setIsOpen(true)
      }
      function closeCart() {
        setIsOpen(false)
      }
      
    return <ShoppingCartContext.Provider 
    value={{
        getItemQuantity,
        increaseCartQuantity, 
        decreaseCartQuantity, 
        removeFromCart,
        cartItems,
        cartQuantity,
        openCart,
        closeCart
        }}>
        {children}
    </ShoppingCartContext.Provider>
}