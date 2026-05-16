'use client'

import DefaultCards from '@/wigets/layouts/ui/menu/default_menu'
import css from './index.module.css'
import CustomCards from '@/wigets/layouts/ui/menu/custom_cards'
import { useState, useEffect } from 'react'

export default function Menu() {
    const [activeTab, setActiveTab] = useState<'default' | 'custom'>('default')
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <section className={css.menu}>
            <div className={css.choose}>
                <h1 className={`${css.tabTitle} ${activeTab === 'default' ? css.active : ''}`} onClick={() => setActiveTab('default')}>Общее меню</h1>
                <h1 className={`${css.tabTitle} ${activeTab === 'custom' ? css.active : ''}`} onClick={() => setActiveTab('custom')}>Кастомизированное меню</h1>
            </div>

            <div className={css.cards}>
                {activeTab === 'default' ? (
                    <div className={css.default_cards}>
                        <DefaultCards />
                    </div>
                ) : (
                    <div className={css.custom_cards}>
                        <CustomCards />
                    </div>
                )}
            </div>

            <button
                className={`${css.scrollTop} ${showScrollTop ? css.visible : ''}`}
                onClick={scrollToTop}
                aria-label="Наверх"
            >
                ⭡
            </button>
        </section>
    )
}