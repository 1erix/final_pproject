'use client'

import { useEffect, useState } from 'react'
import css from './index.module.css'
import Image from 'next/image'

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

interface CustomModalProps {
    isOpen: boolean
    onClose: () => void
    onRemoveFromFavourites?: () => void
    product: CustomProducts | null
    mode: 'edit' | 'view'
    savedSelections?: {
        baseId?: number
        sauceIds?: number[]
        cheeseIds?: number[]
        vegetableIds?: number[]
        meatIds?: number[]
    }
}

export default function CustomModal({ isOpen, onClose, onRemoveFromFavourites, product, mode = 'edit', savedSelections }: CustomModalProps) {
    const [currentBaseIndex, setCurrentBaseIndex] = useState<number>(0)
    const [selectedBase, setSelectedBase] = useState<number | null>(null)
    const [selectedSauces, setSelectedSauces] = useState<number[]>([])
    const [selectedCheeses, setSelectedCheeses] = useState<number[]>([])
    const [selectedVegetables, setSelectedVegetables] = useState<number[]>([])
    const [selectedMeats, setSelectedMeats] = useState<number[]>([])
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [isFavourite, setIsFavourite] = useState(false)

    const isViewMode = mode === 'view'


    const checkIfFavourite = async () => {
        if (!product) return
        const resp = await fetch(`/api/favourites?customId=${product.id}`)
        const data = await resp.json()
        setIsFavourite(data.isFavourite)
    }

    useEffect(() => {
        if (isOpen && product) {
            checkIfFavourite()
        }
    }, [isOpen, product])

    const addToFavourites = async () => {
        if (!product) return

        if (isFavourite) {
            const resp = await fetch(`/api/favourites?customId=${product.id}`, { method: 'DELETE' })
            if (resp.ok) {
                setIsFavourite(false)
                if (onRemoveFromFavourites) {
                    onRemoveFromFavourites()
                }
            }
        } else {
            const selections = {
                baseId: selectedBase,
                sauceIds: selectedSauces,
                cheeseIds: selectedCheeses,
                vegetableIds: selectedVegetables,
                meatIds: selectedMeats
            }

            const resp = await fetch('/api/favourites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customId: product.id,
                    savedPrice: totalPrice,
                    selections: JSON.stringify(selections)
                })
            })
            if (resp.ok) {
                setIsFavourite(true)
            }
        }
    }

    const addToCart = async () => {
        if (!product) return

        const selections = {
            baseId: selectedBase,
            sauceIds: selectedSauces,
            cheeseIds: selectedCheeses,
            vegetableIds: selectedVegetables,
            meatIds: selectedMeats
        }

        await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customId: product.id,
                quantity: 1,
                selections: selections,
                customPrice: totalPrice
            })
        })
    }

    useEffect(() => {
        if (isOpen && product?.bases?.length) {
            document.body.style.overflow = 'hidden'

            if (isViewMode && savedSelections) {
                setSelectedBase(savedSelections.baseId || product.bases[0]?.id || null)
                setSelectedSauces(savedSelections.sauceIds || [])
                setSelectedCheeses(savedSelections.cheeseIds || [])
                setSelectedVegetables(savedSelections.vegetableIds || [])
                setSelectedMeats(savedSelections.meatIds || [])
            } else {
                setSelectedBase(product.bases[0].id)
                setSelectedSauces([])
                setSelectedCheeses([])
                setSelectedVegetables([])
                setSelectedMeats([])
            }
        } else {
            document.body.style.overflow = 'unset'
            if (!isViewMode) resetSelections()
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    useEffect(() => {
        calculateTotal()
    }, [selectedBase, selectedSauces, selectedCheeses, selectedVegetables, selectedMeats])

    const resetSelections = () => {
        setCurrentBaseIndex(0)
        setSelectedBase(product?.bases[0]?.id || null)
        setSelectedSauces([])
        setSelectedCheeses([])
        setSelectedVegetables([])
        setSelectedMeats([])
    }

    const calculateTotal = () => {
        if (!product) return 0
        let total = parseInt(product.start_price)

        if (selectedBase) {
            const base = product.bases.find(b => b.id === selectedBase)
            total += parseInt(base?.price_of_base || '0')
        }

        selectedSauces.forEach(id => {
            const sauce = product.sauces.find(s => s.id === id)
            total += parseInt(sauce?.price_of_souce || '0')
        })

        selectedCheeses.forEach(id => {
            const cheese = product.cheeses.find(c => c.id === id)
            total += parseInt(cheese?.price_of_cheese || '0')
        })

        selectedVegetables.forEach(id => {
            const vegetable = product.vegetables.find(v => v.id === id)
            total += parseInt(vegetable?.price_of_vegetables || '0')
        })

        selectedMeats.forEach(id => {
            const meat = product.meats.find(m => m.id === id)
            total += parseInt(meat?.price_of_meat || '0')
        })

        setTotalPrice(total)
    }

    const nextBase = () => {
        if (product?.bases.length) {
            const newIndex = (currentBaseIndex + 1) % product.bases.length
            setCurrentBaseIndex(newIndex)
            setSelectedBase(product.bases[newIndex].id)
        }
    }

    const prevBase = () => {
        if (product?.bases.length) {
            const newIndex = (currentBaseIndex - 1 + product.bases.length) % product.bases.length
            setCurrentBaseIndex(newIndex)
            setSelectedBase(product.bases[newIndex].id)
        }
    }

    const handleSauceChange = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedSauces([...selectedSauces, id])
        } else {
            setSelectedSauces(selectedSauces.filter(s => s !== id))
        }
    }

    const handleCheeseChange = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedCheeses([...selectedCheeses, id])
        } else {
            setSelectedCheeses(selectedCheeses.filter(c => c !== id))
        }
    }

    const handleVegetableChange = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedVegetables([...selectedVegetables, id])
        } else {
            setSelectedVegetables(selectedVegetables.filter(v => v !== id))
        }
    }

    const handleMeatChange = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedMeats([...selectedMeats, id])
        } else {
            setSelectedMeats(selectedMeats.filter(m => m !== id))
        }
    }

    const getBaseNameById = (id: number | null) => {
        if (!id || !product) return ''
        const base = product.bases.find(b => b.id === id)
        return base?.name_of_base || ''
    }

    if (!isOpen || !product) return null

    const currentBase = product.bases[currentBaseIndex]

    return (
        <>
            <div className={css.overlay} onClick={onClose} />

            <section className={css.modal}>
                <div className={css.header}>
                    <div className={css.close}>
                        <Image src='/menu/close-sm.svg' alt='' width={30} height={30} onClick={onClose} />
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

                <div className={css.start_set}>
                    <h1>{product.custom_name}</h1>
                    <p><span>Начальный набор:</span> {product.start_set}</p>
                    <p><span>Базовая цена:</span> {product.start_price} </p>
                </div>

                <div className={css.content}>
                    <div className={css.bases}>
                        <h2>1. Выберите основу</h2>

                        {currentBase && (
                            <div className={css.option}>
                                <div className={css.slider}>
                                    <Image
                                        src='/our_sales/leftArrow.svg'
                                        alt=''
                                        width={20}
                                        height={20}
                                        onClick={prevBase}
                                        className={css.arrow}
                                    />

                                    <div
                                        className={css.baseImageWrapper}
                                        onClick={() => setSelectedBase(currentBase.id)}
                                    >
                                        <Image
                                            src={currentBase.img_of_base}
                                            alt={currentBase.name_of_base}
                                            width={250}
                                            height={250}
                                            className={`${css.baseImage} ${selectedBase === currentBase.id ? css.selectedBaseImage : ''}`}
                                        />
                                    </div>

                                    <Image
                                        src='/our_sales/rightArrow.svg'
                                        alt=''
                                        width={20}
                                        height={20}
                                        onClick={nextBase}
                                        className={css.arrow}
                                    />
                                </div>

                                <div className={css.name_price}>
                                    <h3>{currentBase.name_of_base}</h3>
                                    <p>{currentBase.price_of_base} </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={css.h2}>
                        <h2>2. Выберите ингредиенты</h2>
                    </div>

                    <div className={css.other_ingredients}>
                        {product.sauces && product.sauces.length > 0 && (
                            <div className={css.category}>
                                <h3>Соусы</h3>
                                <div className={css.ingredientsGrid}>
                                    {product.sauces.map((sauce) => (
                                        <label
                                            key={sauce.id}
                                            className={`${css.ingredientOption} ${selectedSauces.includes(sauce.id) ? css.selected : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedSauces.includes(sauce.id)}
                                                onChange={(e) => handleSauceChange(sauce.id, e.target.checked)}
                                                className={css.hiddenInput}
                                            />
                                            <span className={css.ingredientName}>{sauce.name_of_sauce}</span>
                                            <span className={css.ingredientPrice}>+{sauce.price_of_souce} </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.vegetables && product.vegetables.length > 0 && (
                            <div className={css.category}>
                                <h3>Овощи</h3>
                                <div className={css.ingredientsGrid}>
                                    {product.vegetables.map((vegetable) => (
                                        <label
                                            key={vegetable.id}
                                            className={`${css.ingredientOption} ${selectedVegetables.includes(vegetable.id) ? css.selected : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedVegetables.includes(vegetable.id)}
                                                onChange={(e) => handleVegetableChange(vegetable.id, e.target.checked)}
                                                className={css.hiddenInput}
                                            />
                                            <span className={css.ingredientName}>{vegetable.name_of_vegetable}</span>
                                            <span className={css.ingredientPrice}>+{vegetable.price_of_vegetables} </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.cheeses && product.cheeses.length > 0 && (
                            <div className={css.category}>
                                <h3>Сыры</h3>
                                <div className={css.ingredientsGrid}>
                                    {product.cheeses.map((cheese) => (
                                        <label
                                            key={cheese.id}
                                            className={`${css.ingredientOption} ${selectedCheeses.includes(cheese.id) ? css.selected : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCheeses.includes(cheese.id)}
                                                onChange={(e) => handleCheeseChange(cheese.id, e.target.checked)}
                                                className={css.hiddenInput}
                                            />
                                            <span className={css.ingredientName}>{cheese.name_of_cheese}</span>
                                            <span className={css.ingredientPrice}>+{cheese.price_of_cheese} </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.meats && product.meats.length > 0 && (
                            <div className={css.category}>
                                <h3>Белок</h3>
                                <div className={css.ingredientsGrid}>
                                    {product.meats.map((meat) => (
                                        <label
                                            key={meat.id}
                                            className={`${css.ingredientOption} ${selectedMeats.includes(meat.id) ? css.selected : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedMeats.includes(meat.id)}
                                                onChange={(e) => handleMeatChange(meat.id, e.target.checked)}
                                                className={css.hiddenInput}
                                            />
                                            <span className={css.ingredientName}>{meat.name_of_meat}</span>
                                            <span className={css.ingredientPrice}>+{meat.price_of_meat} </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={css.h2}>
                        <h2>3. Результат</h2>
                    </div>

                    <div className={css.result}>
                        <div className={css.selectedItems}>
                            {selectedBase && (
                                <div className={css.resultItem}>
                                    <span className={css.itemName}>{getBaseNameById(selectedBase)}</span>
                                    <span className={css.itemPrice}>
                                        +{product.bases.find(b => b.id === selectedBase)?.price_of_base}
                                    </span>
                                </div>
                            )}

                            {selectedSauces.map(id => {
                                const sauce = product.sauces.find(s => s.id === id)
                                return sauce ? (
                                    <div key={id} className={css.resultItem}>
                                        <p className={css.itemName}>{sauce.name_of_sauce}</p>
                                        <p className={css.itemPrice}>+{sauce.price_of_souce} </p>
                                    </div>
                                ) : null
                            })}

                            {selectedVegetables.map(id => {
                                const vegetable = product.vegetables.find(v => v.id === id)
                                return vegetable ? (
                                    <div key={id} className={css.resultItem}>
                                        <p className={css.itemName}>{vegetable.name_of_vegetable}</p>
                                        <p className={css.itemPrice}>+{vegetable.price_of_vegetables} </p>
                                    </div>
                                ) : null
                            })}

                            {selectedCheeses.map(id => {
                                const cheese = product.cheeses.find(c => c.id === id)
                                return cheese ? (
                                    <div key={id} className={css.resultItem}>
                                        <p className={css.itemName}>{cheese.name_of_cheese}</p>
                                        <p className={css.itemPrice}>+{cheese.price_of_cheese} </p>
                                    </div>
                                ) : null
                            })}

                            {selectedMeats.map(id => {
                                const meat = product.meats.find(m => m.id === id)
                                return meat ? (
                                    <div key={id} className={css.resultItem}>
                                        <p className={css.itemName}>{meat.name_of_meat}</p>
                                        <p className={css.itemPrice}>+{meat.price_of_meat} </p>
                                    </div>
                                ) : null
                            })}
                        </div>

                        <div className={css.totalBlock}>
                            <div className={css.totalRow}>
                                <p className={css.totalValue}><span>Итого:</span> {totalPrice}₽</p>
                            </div>

                            <div className={css.actionButtons}>
                                {!isViewMode && (
                                    <button className={css.addButton} onClick={addToCart}>Добавить в корзину</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}