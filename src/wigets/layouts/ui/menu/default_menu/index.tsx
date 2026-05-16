'use client'

import Image from 'next/image'
import css from './index.module.css'
import { useEffect, useState } from 'react'
import DefaultModal from '../modals/default_menu_modal'

interface DefaultProducts {
    id: number
    name_of_food: string
    price: string
    ingredients: string
    food_img: string
    kkal: number
    belki: string
    zhiri: string
    uglevody: string
}

export default function DefaultCards() {
    const [products, setProducts] = useState<DefaultProducts[]>([])
    const [selectedProduct, setSelectedProduct] = useState<DefaultProducts | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetch('/api/products/default_menu')
            .then(res => res.json())
            .then(data => {
                setProducts(data)
            })
    }, [])

    const openModal = (dish: DefaultProducts) => {
        setSelectedProduct(dish)
        setIsModalOpen(true)
        console.log('🔵 isModalOpen set to true')
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedProduct(null)
    }

    if (products.length === 0) {
        return <div className={css.no_cards}>Нет доступных блюд</div>
    }

    const addToCart = async (product: DefaultProducts) => {
        const resp = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id })
        })
    }

    return (
        <>
            {products.map((product) => (
                <div className={css.card} key={product.id}>
                    <div className={css.image} onClick={() => openModal(product)}>
                        <Image src={product.food_img} alt='' width={200} height={200} />
                    </div>

                    <div className={css.text_btn}>
                        <h1 onClick={() => openModal(product)}>{product.name_of_food}</h1>
                        <p>{product.price}</p>
                        <button onClick={() => addToCart(product)}>Добавить в корзину</button>
                    </div>
                </div>
            ))}

            <DefaultModal isOpen={isModalOpen} onClose={closeModal} dish={selectedProduct} />
        </>

    )
}