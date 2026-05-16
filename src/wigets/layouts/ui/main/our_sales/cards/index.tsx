'use client'

import Image from 'next/image'
import { useState } from 'react'
import css from './index.module.css'
import { OUR_SALES, OurSalesType } from './models'

export const OurSales = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(true)
    const cardsToShow = 3

    const infiniteCards = [...OUR_SALES, ...OUR_SALES, ...OUR_SALES, ...OUR_SALES, ...OUR_SALES]

    const startOffset = Math.floor(infiniteCards.length / 2) - Math.floor(OUR_SALES.length / 2)

    const currentPosition = (startOffset + currentIndex) * (310 + 40)

    const nextSlide = () => {
        setIsTransitioning(true)
        setCurrentIndex(prev => prev + 1)
    }

    const prevSlide = () => {
        setIsTransitioning(true)
        setCurrentIndex(prev => prev - 1)
    }

    const handleTransitionEnd = () => {
        setIsTransitioning(false)
    }

    return (
        <div className={css.cards_arrows}>
            <button onClick={prevSlide} className={css.arrow_button}>
                <Image src='/our_sales/leftArrow.svg' alt='Previous' width={30} height={30} />
            </button>
            <div className={css.carousel_container}>
                <div
                    className={css.our_sales}
                    style={{
                        transform: `translateX(-${currentPosition}px)`,
                        transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {infiniteCards.map((item: OurSalesType, index) => (
                        <div className={css.our_sales_card} key={index}>
                            <h1>{item.title}</h1>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={nextSlide} className={css.arrow_button}>
                <Image src='/our_sales/rightArrow.svg' alt='Next' width={30} height={30} />
            </button>
        </div>
    )
}