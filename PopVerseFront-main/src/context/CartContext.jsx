import React, { createContext, useState, useContext, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const storedCart = [];
        setCart(storedCart);
        calculateTotal(storedCart);
    }, []);

    const addToCart = (product) => {
        const updatedCart = [...cart];
        const itemIndex = updatedCart.findIndex((item) => item.id === product.id);

        if (itemIndex > -1) {
            updatedCart[itemIndex].quantity += 1;
        } else {
            updatedCart.push({ ...product, quantity: 1 });
        }

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
    };

    const removeOneFromCart = (id) => {
        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        ).filter((item) => item.quantity > 0);

        setCart(updatedCart);
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const calculateTotal = (cartItems) => {
        const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(totalAmount);
    };

    const clearCart = () => {
        setCart([]);
        setTotal(0);
        localStorage.removeItem("cart");
    }

    return (
        <CartContext.Provider value={{ cart, total, addToCart, removeFromCart, clearCart, removeOneFromCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}