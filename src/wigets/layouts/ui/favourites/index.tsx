'use client'

import Image from 'next/image'
import css from './index.module.css'
import { useEffect, useState } from 'react'
import DefaultModal from '../menu/modals/default_menu_modal'
import CustomModal from '../menu/modals/custom_menu_modal'

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

interface CustomProduct {
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

interface DefaultProduct {
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

interface FavouriteItem {
    id: string | number
    customId?: number
    productId?: number
    type?: 'custom' | 'default'
    savedPrice?: number | null
    selections?: string | null
    custom?: CustomProduct
    product?: DefaultProduct
}

interface SavedSelections {
    baseId?: number
    sauceIds?: number[]
    cheeseIds?: number[]
    vegetableIds?: number[]
    meatIds?: number[]
}

interface ApiCustomItem {
    id: number
    customId?: number
    productId?: number
    savedPrice?: number | null
    selections?: string | null
    custom?: CustomProduct
    product?: DefaultProduct
}

export default function FavouritesCards() {
    const [favourites, setFavourites] = useState<FavouriteItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedProduct, setSelectedProduct] = useState<DefaultProduct | null>(null)
    const [selectedCustom, setSelectedCustom] = useState<CustomProduct | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [savedQuantity, setSavedQuantity] = useState(1)
    const [savedSelections, setSavedSelections] = useState<SavedSelections | undefined>(undefined)
    const [currentFavouriteId, setCurrentFavouriteId] = useState<string | number | null>(null)

    useEffect(() => {
        loadFavourites()
    }, [])

    const loadFavourites = async () => {
        setLoading(true)
        try {
            const customResp = await fetch('/api/favourites')
            const customData: ApiCustomItem[] = await customResp.json()

            const defaultResp = await fetch('/api/favourites/default')
            const defaultData: ApiCustomItem[] = await defaultResp.json()

            let allFavourites: FavouriteItem[] = []

            if (Array.isArray(customData)) {
                const customWithPrefix: FavouriteItem[] = customData.map((item) => ({
                    ...item,
                    id: `custom_${item.id}`,
                    type: 'custom',
                    customId: item.customId,
                    productId: item.productId,
                    savedPrice: item.savedPrice,
                    selections: item.selections,
                    custom: item.custom
                }))
                allFavourites = [...allFavourites, ...customWithPrefix]
            }

            if (Array.isArray(defaultData)) {
                const defaultWithPrefix: FavouriteItem[] = defaultData.map((item) => ({
                    ...item,
                    id: `default_${item.id}`,
                    type: 'default',
                    customId: item.customId,
                    productId: item.productId,
                    savedPrice: item.savedPrice,
                    selections: item.selections,
                    product: item.product
                }))
                allFavourites = [...allFavourites, ...defaultWithPrefix]
            }

            setFavourites(allFavourites)
        } catch (error) {
            console.error('Error loading favourites:', error)
            setFavourites([])
        } finally {
            setLoading(false)
        }
    }

    const removeFromFavouritesById = async (item: FavouriteItem) => {
        if (item.type === 'custom' && item.custom) {
            await fetch(`/api/favourites?customId=${item.custom.id}`, { method: 'DELETE' })
        } else if (item.type === 'default' && item.product) {
            await fetch(`/api/favourites/default?productId=${item.product.id}`, { method: 'DELETE' })
        }
        setFavourites(prev => prev.filter(fav => fav.id !== item.id))
    }

    const openProductModal = (item: FavouriteItem) => {
        setCurrentFavouriteId(item.id)
        if (item.type === 'default' && item.product) {
            setSelectedProduct(item.product)
            setSavedQuantity(1)
            setIsModalOpen(true)
        } else if (item.type === 'custom' && item.custom) {
            setSelectedCustom(item.custom)

            let parsedSelections: SavedSelections | undefined = undefined
            if (item.selections) {
                try {
                    parsedSelections = typeof item.selections === 'string'
                        ? JSON.parse(item.selections)
                        : (item.selections as SavedSelections)
                } catch (e) {
                    console.error('Ошибка парсинга selections:', e)
                }
            }
            setSavedSelections(parsedSelections)
            setIsModalOpen(true)
        }
    }

    const handleRemoveFromFavourites = () => {
        if (currentFavouriteId) {
            setFavourites(prev => prev.filter(fav => fav.id !== currentFavouriteId))
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedProduct(null)
        setSelectedCustom(null)
        setSavedSelections(undefined)
        setCurrentFavouriteId(null)
    }

    if (loading) {
        return <div className={css.loading}>Загрузка...</div>
    }

    if (!favourites.length) {
        return <div className={css.empty}>
            <p>Нет избранных позиций</p>
        </div>
    }

    return (
        <>
            <div className={css.favourites}>
                <div className={css.cards}>
                    {favourites.map((item) => (
                        <section className={css.card} key={item.id} onClick={() => openProductModal(item)}>
                            <div className={css.without_line}>
                                <div className={css.image}>
                                    <Image
                                        src={item.custom?.custom_product_img || item.product?.food_img || '/placeholder.jpg'}
                                        alt=''
                                        width={250}
                                        height={250}
                                    />
                                </div>

                                <div className={css.right_part}>
                                    <h1>{item.custom?.custom_name || item.product?.name_of_food}</h1>
                                    <p>
                                        {item.savedPrice
                                            ? `${item.savedPrice}₽ `
                                            : `${item.custom?.start_price || item.product?.price}`
                                        }
                                    </p>

                                    <div className={css.add_to_cart}>
                                        <button onClick={(e) => {
                                            e.stopPropagation()
                                        }}>добавить в корзину</button>
                                    </div>

                                    <button
                                        className={css.removeFavourite}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeFromFavouritesById(item)
                                        }}
                                    >
                                        Удалить из избранного
                                    </button>
                                </div>
                            </div>

                            <div className={css.line}></div>
                        </section>
                    ))}
                </div>
            </div>

            <DefaultModal
                isOpen={isModalOpen && !!selectedProduct}
                onClose={closeModal}
                dish={selectedProduct}
                mode='view'
                initialQuantity={savedQuantity}
                onRemoveFromFavourites={handleRemoveFromFavourites}
            />

            <CustomModal
                isOpen={isModalOpen && !!selectedCustom}
                onClose={closeModal}
                product={selectedCustom}
                mode='view'
                savedSelections={savedSelections}
                onRemoveFromFavourites={handleRemoveFromFavourites}
            />
        </>
    )
}