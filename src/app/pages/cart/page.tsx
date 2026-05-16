'use client'

import Cards from '@/wigets/layouts/ui/cart/cards'
import css from './index.module.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CartItem {
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

export default function Cart() {
    const [cartItem, setCartItem] = useState<CartItem[]>([])
    const [totalPrice, setTotalPrice] = useState(0)

    const fetchCart = async () => {
        try {
            const resp = await fetch('/api/cart')
            const data = await resp.json()
            if (Array.isArray(data)) {
                setCartItem(data)
                calculateTotal(data)
            } else {
                setCartItem([])
                setTotalPrice(0)
            }
        } catch {
            setCartItem([])
            setTotalPrice(0)
        }
    }

    const calculateTotal = (items: CartItem[]) => {
        let total = 0
        items.forEach(item => {
            if (item.customPrice) {
                total += item.customPrice * item.quantity
            } else if (item.product?.price) {
                const priceNumber = Number(item.product.price.replace('₽', '').trim())
                total += priceNumber * item.quantity
            } else if (item.custom?.start_price) {
                const priceNumber = Number(item.custom.start_price.replace('₽', '').trim())
                total += priceNumber * item.quantity
            }
        })
        setTotalPrice(total)
    }

    const clearCart = async () => {
        const resp = await fetch('/api/cart/delete', { method: 'DELETE' })
        if (resp.ok) {
            fetchCart()
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    return (
        <section className={css.cart}>
            <div className={css.cards}>
                <Cards items={cartItem} onUpdate={fetchCart} />
            </div>

            <div className={css.results}>
                <div className={css.promocode}>
                    <input type="text" placeholder='Введите промокод' />
                    <button>Отправить</button>
                </div>

                <div className={css.result}>
                    <h1>Итого:</h1>
                    <p>{totalPrice} ₽</p>
                </div>

                <div className={css.buttons}>
                    <div className={css.to_pay}>
                        <Link href='/pages/making_an_order'>Перейти к оплате</Link>
                    </div>

                    <div className={css.clear_cart}>
                        <button onClick={clearCart}>очистить корзину</button>
                    </div>
                </div>
            </div>
        </section>
    )
}