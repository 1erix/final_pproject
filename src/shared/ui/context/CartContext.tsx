'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
    id: number
    productId: number | null
    customId: number | null
    quantity: number
    selections?: string | null
    customPrice?: number | null
    product?: {
        id: number
        name_of_food: string
        price: string
        food_img: string
        ingredients: string
        kkal: number
        belki: string
        zhiri: string
        uglevody: string
    }
    custom?: {
        id: number
        custom_name: string
        start_price: string
        custom_product_img: string
        start_set: string
        bases: any[]
        sauces: any[]
        cheeses: any[]
        vegetables: any[]
        meats: any[]
    }
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: any) => void
    removeItem: (id: number) => void
    updateQuantity: (id: number, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
    getTotalItems: () => number
    fetchCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    const fetchCart = async () => {
        try {
            const resp = await fetch('/api/cart')
            const data = await resp.json()
            setItems(data)
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const addItem = async (item: any) => {
        const resp = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
        if (resp.ok) {
            fetchCart()
        }
    }

    const removeItem = async (id: number) => {
        const resp = await fetch(`/api/cart?id=${id}`, { method: 'DELETE' })
        if (resp.ok) {
            fetchCart()
        }
    }

    const updateQuantity = async (id: number, quantity: number) => {
        const resp = await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, quantity })
        })
        if (resp.ok) {
            fetchCart()
        }
    }

    const clearCart = async () => {
        const resp = await fetch('/api/cart/delete', { method: 'DELETE' })
        if (resp.ok) {
            fetchCart()
        }
    }

    const getTotalPrice = () => {
        return items.reduce((total, item) => {
            if (item.customPrice) {
                return total + (item.customPrice * item.quantity)
            } else if (item.product?.price) {
                const price = Number(item.product.price.replace('₽', '').trim())
                return total + (price * item.quantity)
            }
            return total
        }, 0)
    }

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0)
    }

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            getTotalPrice,
            getTotalItems,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}