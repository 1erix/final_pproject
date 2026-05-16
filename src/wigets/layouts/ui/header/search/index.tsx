'use client'

import { useEffect, useState, useRef } from 'react';
import css from './index.module.css'
import Image from 'next/image';
import Portal from './portal';
import DefaultModal from '../../menu/modals/default_menu_modal';
import CustomModal from '../../menu/modals/custom_menu_modal';

interface SearchResult {
    id: number,
    name: string,
    price: string,
    image: string,
    type: 'default' | 'custom',
    category?: string
}

export default function HeaderSearch() {
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [selectedCustom, setSelectedCustom] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedType, setSelectedType] = useState<'default' | 'custom' | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const performSearch = async () => {
        if (searchQuery.length < 1) {
            setResults([])
            setIsOpen(false)
            return
        }

        setLoading(true)
        try {
            const resp = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
            const data = await resp.json()
            setResults(data)
            setIsOpen(true)
        } catch (error) {
            console.log('search error', error)
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const handleResultClick = async (item: SearchResult) => {
        setSearchQuery('')
        setResults([])
        setIsOpen(false)

        if (item.type === 'default') {
            const resp = await fetch(`/api/products/default_menu`)
            const products = await resp.json()
            const product = products.find((p: any) => p.id === item.id)
            if (product) {
                setSelectedProduct(product)
                setSelectedType('default')
                setIsModalOpen(true)
            }
        } else if (item.type === 'custom') {
            const resp = await fetch(`/api/products/custom_products`)
            const customs = await resp.json()
            const custom = customs.find((c: any) => c.id === item.id)
            if (custom) {
                setSelectedCustom(custom)
                setSelectedType('custom')
                setIsModalOpen(true)
            }
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedProduct(null)
        setSelectedCustom(null)
        setSelectedType(null)
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            performSearch()
        }, 300)
        return () => clearTimeout(delayDebounce)
    }, [searchQuery])

    return (
        <>
            <div className={css.searchContainer} ref={containerRef}>
                <div className={css.searchBox}>
                    <Image src='/header/search.svg' alt='' width={25} height={25} />
                    <input
                        type="text"
                        placeholder="Поиск блюд..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={css.searchInput}
                    />
                </div>

                {isOpen && searchQuery.length > 0 && (
                    <div className={css.dropdown}>
                        {loading ? (
                            <div className={css.loading}>Поиск...</div>
                        ) : results.length === 0 ? (
                            <div className={css.noResults}>Ничего не найдено</div>
                        ) : (
                            <>
                                <div className={css.resultsCount}>Найдено: {results.length}</div>
                                <div className={css.resultsList}>
                                    {results.map((item) => (
                                        <div
                                            key={`${item.type}-${item.id}`}
                                            onClick={() => handleResultClick(item)}
                                            className={css.resultItem}
                                        >
                                            <Image src={item.image || '/placeholder.jpg'} alt={item.name} width={45} height={45} className={css.resultImage} />
                                            <div className={css.resultInfo}>
                                                <div className={css.resultName}>{item.name}</div>
                                                <div className={css.resultPrice}>{item.price}</div>
                                                {item.category && <span className={css.category}>{item.category}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <Portal>
                <DefaultModal
                    isOpen={isModalOpen && selectedType === 'default'}
                    onClose={closeModal}
                    dish={selectedProduct}
                    mode='view'
                    initialQuantity={1}
                />
            </Portal>

            <Portal>
                <CustomModal
                    isOpen={isModalOpen && selectedType === 'custom'}
                    onClose={closeModal}
                    product={selectedCustom}
                    mode='view'
                    savedSelections={undefined}
                />
            </Portal>
        </>
    )
}