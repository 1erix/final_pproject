import Image from 'next/image'
import css from './index.module.css'
import { useState } from 'react'
import DefaultModal from '../../menu/modals/default_menu_modal'
import CustomModal from '../../menu/modals/custom_menu_modal'

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

interface CardsProps {
    items: CartItem[]
    onUpdate: () => void
}

export default function Cards({ items, onUpdate }: CardsProps) {
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [selectedCustom, setSelectedCustom] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'edit' | 'view'>('view')
    const [savedQuantity, setSavedQuantity] = useState(1)
    const [savedSelections, setSavedSelections] = useState<any>(null)

    const safeItems = Array.isArray(items) ? items : []

    const updateQuantity = async (id: number, newQuantity: number) => {
        if (newQuantity < 1) return

        const resp = await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, quantity: newQuantity })
        })

        if (resp.ok) {
            onUpdate()
        }
    }

    const removeItem = async (id: number) => {
        const resp = await fetch(`/api/cart?id=${id}`, { method: 'DELETE' })

        if (resp.ok) {
            onUpdate()
        }
    }

    const openProductModal = (item: CartItem) => {
        if (item.product) {
            setSelectedProduct(item.product)
            setSavedQuantity(item.quantity)
            setModalMode('view')
            setIsModalOpen(true)
        } else if (item.custom) {
            setSelectedCustom(item.custom)

            if (item.selections) {
                let parsedSelections = item.selections
                if (typeof item.selections === 'string') {
                    try {
                        parsedSelections = JSON.parse(item.selections)
                    } catch (e) {
                        console.error('Ошибка парсинга selections:', e)
                        parsedSelections = null
                    }
                }
                setSavedSelections(parsedSelections)
            } else {
                setSavedSelections(null)
            }

            setModalMode('view')
            setIsModalOpen(true)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedProduct(null)
        setSelectedCustom(null)
        setSavedSelections(null)
    }

    if (safeItems.length === 0) {
        return <div className={css.emptyCart}>
            <p>Корзина пуста</p>
        </div>
    }

    return (
        <>
            {safeItems.map((item, index) => (
                <div key={item.id}>
                    <section className={css.card} onClick={() => openProductModal(item)}>
                        <div className={css.without_line}>
                            <div className={css.image}>
                                <Image
                                    src={item.product?.food_img || item.custom?.custom_product_img || '/placeholder.jpg'}
                                    alt=''
                                    width={200}
                                    height={200}
                                />
                            </div>

                            <div className={css.right_part}>
                                <h1>{item.product?.name_of_food || item.custom?.custom_name}</h1>
                                <p className={css.price}>
                                    {(() => {
                                        if (item.customPrice) {
                                            return `${item.customPrice * item.quantity} ₽`
                                        }

                                        if (item.product?.price) {
                                            const priceNumber = Number(item.product.price.replace('₽', '').trim())
                                            return `${priceNumber * item.quantity} ₽`
                                        }

                                        if (item.custom?.start_price) {
                                            const priceNumber = Number(item.custom.start_price.replace('₽', '').trim())
                                            return `${priceNumber * item.quantity} ₽`
                                        }

                                        return '0 ₽'
                                    })()}
                                </p>

                                <div className={css.count}>
                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                        updateQuantity(item.id, item.quantity - 1)
                                    }}>-</button>
                                    <p>{item.quantity}</p>
                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                        updateQuantity(item.id, item.quantity + 1)
                                    }}>+</button>
                                </div>

                                <div className={css.remove_btn}>
                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                        removeItem(item.id)
                                    }}>удалить</button>
                                </div>
                            </div>
                        </div>

                        {index < safeItems.length - 1 && <div className={css.line}></div>}
                    </section>
                </div>
            ))}

            <DefaultModal
                isOpen={isModalOpen && !!selectedProduct}
                onClose={closeModal}
                dish={selectedProduct}
                mode={modalMode}
                initialQuantity={savedQuantity}
            />

            <CustomModal
                isOpen={isModalOpen && !!selectedCustom}
                onClose={closeModal}
                product={selectedCustom}
                mode={modalMode}
                savedSelections={savedSelections}
            />
        </>
    )
}