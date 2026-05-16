// В Header/index.tsx замените старый поиск на новый компонент:

'use client'

import Image from 'next/image'
import css from './index.module.css'
import { Navigation } from './navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import ProfileModal from '../profile'
import HeaderSearch from './search'

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const openProfileModal = () => {
        setIsProfileModalOpen(true)
    }

    const closeProfileModal = () => {
        setIsProfileModalOpen(false)
    }

    return (
        <>
            <header className={`${css.header} ${scrolled ? css.scrolled : ''}`}>
                <Link href='/' className={css.logo}>Tasty</Link>
                <Navigation />
                <HeaderSearch />
                <button className={css.profile} onClick={openProfileModal}>
                    <Image src='/header/profile.svg' alt='' width={40} height={40} />
                </button>
            </header>
            <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
        </>
    )
}