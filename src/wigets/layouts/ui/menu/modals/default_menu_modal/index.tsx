'use client'

import { useEffect, useState } from "react"
import css from './index.module.css'
import Image from "next/image"

interface DefaultModalProps {
    isOpen: boolean
    onClose: () => void
    onRemoveFromFavourites?: () => void
    dish: {
        id: number
        name_of_food: string
        price: string
        ingredients: string
        food_img: string
        kkal: number
        belki: string
        zhiri: string
        uglevody: string
    } | null
    mode?: 'edit' | 'view'
    initialQuantity?: number
}

export default function DefaultModal({ isOpen, onClose, onRemoveFromFavourites, dish, mode = 'edit', initialQuantity = 1 }: DefaultModalProps) {
    const [quantity, setQuantity] = useState(() => {
        if (mode === 'view') {
            return initialQuantity
        }
        return 1
    })
    const [isFavourite, setIsFavourite] = useState(false)
    const isViewMode = mode === 'view'

    const checkIfFavourite = async () => {
        if (!dish) return
        const resp = await fetch(`/api/favourites/default?productId=${dish.id}`)
        const data = await resp.json()
        setIsFavourite(data.isFavourite)
    }

    const addToFavourites = async () => {
        if (!dish) return

        if (isFavourite) {
            const resp = await fetch(`/api/favourites/default?productId=${dish.id}`, { method: 'DELETE' })
            if (resp.ok) {
                setIsFavourite(false)
                if (onRemoveFromFavourites) {
                    onRemoveFromFavourites()
                }
                console.log('Удалено из избранного')
            } else {
                console.error('Ошибка удаления:', await resp.text())
            }
        } else {
            const resp = await fetch('/api/favourites/default', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: dish.id })
            })
            if (resp.ok) {
                setIsFavourite(true)
                console.log('Добавлено в избранное')
            } else {
                console.error('Ошибка добавления:', await resp.text())
            }
        }
    }

    const addToCart = async () => {
        if (!dish) return

        await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: dish.id,
                quantity: quantity
            })
        })
    }

    const incrementQuantity = () => setQuantity(prev => prev + 1)

    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(prev => prev - 1)
    }

    useEffect(() => {
        if (isOpen && dish) {
            document.body.style.overflow = 'hidden'
            checkIfFavourite()
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, dish])

    if (!isOpen || !dish) return null

    return (
        <>
            <div className={css.overlay} onClick={onClose} />

            <div className={css.modal}>
                <div className={css.header}>
                    <div className={css.close}>
                        <Image src='/menu/close-sm.svg' alt="" width={30} height={30} onClick={onClose} />
                    </div>
                    <div className={css.favouriteHeader}>
                        <button onClick={addToFavourites} className={css.favouriteBtnHeader}>
                            <Image
                                src={isFavourite ? '/favourites/secondF.png' : '/favourites/firstF.png'}
                                alt='избранное'
                                width={30}
                                height={30}
                            />
                        </button>
                    </div>
                </div>

                <div className={css.info}>
                    <div className={css.img_count}>
                        <Image src={dish.food_img} alt="" width={300} height={300} />

                        <div className={css.content}>
                            <h1>{dish.name_of_food}</h1>

                            <div className={css.count_btn}>
                                <div className={css.count}>
                                    <button onClick={decrementQuantity} disabled={isViewMode}>-</button>
                                    <p>{quantity}</p>
                                    <button onClick={incrementQuantity} disabled={isViewMode}>+</button>
                                </div>

                                {!isViewMode && (
                                    <div className={css.add_to_cart}>
                                        <button onClick={addToCart}>Добавить</button>
                                    </div>
                                )}
                            </div>

                            <p>{dish.price}</p>
                        </div>
                    </div>

                    <div className={css.ingredients_bzhu}>
                        <div className={css.ingredients}>
                            <p><span>Состав:</span> {dish.ingredients}</p>
                        </div>

                        <div className={css.bzhu}>
                            <div className={css.kkal}>
                                <p>{dish.kkal}</p>
                                <h2>ккал</h2>
                            </div>
                            <div className={css.belki}>
                                <p>{dish.belki}</p>
                                <h2>белки</h2>
                            </div>
                            <div className={css.zhiri}>
                                <p>{dish.zhiri}</p>
                                <h2>жиры</h2>
                            </div>
                            <div className={css.uglevody}>
                                <p>{dish.uglevody}</p>
                                <h2>углеводы</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}