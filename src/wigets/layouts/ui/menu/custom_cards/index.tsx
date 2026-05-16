'use client'

import Image from 'next/image'
import css from './index.module.css'
import { useEffect, useState } from 'react'
import CustomModal from '../modals/custom_menu_modal'

interface Base {
    id: number
    name_of_base: string
    img_of_base: string
    price_of_base: string
}

interface Sauce {
    id: number
    name_of_sauce: string
    price_of_souce: string
}

interface Cheese {
    id: number
    name_of_cheese: string
    price_of_cheese: string
}

interface Vegetable {
    id: number
    name_of_vegetable: string
    price_of_vegetables: string
}

interface Meat {
    id: number
    name_of_meat: string
    price_of_meat: string
}

interface CustomProducts {
    id: number
    custom_name: string
    start_price: string
    custom_product_img: string
    start_set: string
    bases: Base[]
    sauces: Sauce[]
    cheeses: Cheese[]
    vegetables: Vegetable[]
    meats: Meat[]
}

export default function CustomCards() {
    const [customProducts, setCustomProducts] = useState<CustomProducts[]>([])
    const [selectedCustomProduct, setSelectedCustomProduct] = useState<CustomProducts | null>(null)
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)

    useEffect(() => {
        fetch('/api/products/custom_products')
            .then(res => res.json())
            .then(data => {
                setCustomProducts(data)
            })
    }, [])

    const openModal = (product: CustomProducts) => {
        setSelectedCustomProduct(product)
        setIsCustomModalOpen(true)
    }

    const closeModal = () => {
        setIsCustomModalOpen(false)
        setSelectedCustomProduct(null)
    }

    if (customProducts.length === 0) {
        return <div className={css.no_cards}>Нет кастомных позиций</div>
    }

    return (
        <>
            {customProducts.map((product) => (
                <div className={css.card} key={product.id}>
                    <div
                        className={css.image}
                        onClick={() => openModal(product)}
                    >
                        <Image
                            src={product.custom_product_img}
                            alt={product.custom_name}
                            width={200}
                            height={200}
                        />
                    </div>

                    <div className={css.text_btn}>
                        <h1 onClick={() => openModal(product)}>{product.custom_name}</h1>
                        <p>{product.start_price} </p>
                        <button onClick={() => openModal(product)}>Создать</button>
                    </div>
                </div>
            ))}

            <CustomModal
                isOpen={isCustomModalOpen}
                onClose={closeModal}
                product={selectedCustomProduct}
                mode="edit"
            />
        </>
    )
}