'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import css from './index.module.css'

interface OrderData {
    orderNumber: string
    items: any[]
    totalPrice: number
    deliveryType: string
    deliveryAddress: string
    deliveryDate: string
    deliveryTime: string
    paymentMethod: string
    paymentCard: string | null
    customerName: string
    customerEmail: string
    status: string
    estimatedTime: string
    createdAt: string
}

export default function OrderTracking() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const [order, setOrder] = useState<OrderData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (orderId) {
            const fetchOrder = async () => {
                try {
                    const resp = await fetch(`/api/orders?orderId=${orderId}`)
                    const data = await resp.json()
                    setOrder(data)
                } catch (error) {
                    console.error('Ошибка загрузки заказа:', error)
                } finally {
                    setLoading(false)
                }
            }
            fetchOrder()
        } else {
            setLoading(false)
        }
    }, [orderId])

    if (loading) {
        return <div className={css.loading}>Загрузка информации о заказе...</div>
    }

    if (!order) {
        return (
            <div className={css.notFound}>
                <h2>Заказ не найден</h2>
                <Link href="/" className={css.homeLink}>Вернуться на главную</Link>
            </div>
        )
    }

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Подтверждён': return css.statusConfirmed
            case 'Готовится': return css.statusPreparing
            case 'В пути': return css.statusDelivering
            case 'Доставлен': return css.statusDelivered
            default: return css.statusDefault
        }
    }

    return (
        <section className={css.order_tracking}>
            <div className={css.container}>
                <div className={css.header}>
                    <h1>Отслеживание заказа</h1>
                    <div className={css.orderNumber}>
                        <span>Номер заказа:</span>
                        <strong>#{order.orderNumber}</strong>
                    </div>
                </div>

                <div className={css.statusSection}>
                    <div className={css.statusCard}>
                        <h3>Статус заказа</h3>
                        <div className={`${css.statusBadge} ${getStatusClass(order.status)}`}>
                            {order.status}
                        </div>
                        <div className={css.estimatedTime}>
                            <span>Примерное время доставки:</span>
                            <strong>{order.estimatedTime}</strong>
                        </div>
                    </div>

                    <div className={css.timeline}>
                        <div className={`${css.timelineStep} ${css.active}`}>
                            <div className={css.stepDot}></div>
                            <div className={css.stepText}>Заказ подтверждён</div>
                        </div>
                        <div className={`${css.timelineStep} ${order.status !== 'Подтверждён' ? css.active : ''}`}>
                            <div className={css.stepDot}></div>
                            <div className={css.stepText}>Готовится</div>
                        </div>
                        <div className={`${css.timelineStep} ${order.status === 'В пути' || order.status === 'Доставлен' ? css.active : ''}`}>
                            <div className={css.stepDot}></div>
                            <div className={css.stepText}>В пути</div>
                        </div>
                        <div className={`${css.timelineStep} ${order.status === 'Доставлен' ? css.active : ''}`}>
                            <div className={css.stepDot}></div>
                            <div className={css.stepText}>Доставлен</div>
                        </div>
                    </div>
                </div>

                <div className={css.orderInfo}>
                    <div className={css.orderDetails}>
                        <h3>Состав заказа</h3>
                        <div className={css.itemsList}>
                            {order.items.map((item: any, index: number) => {
                                const price = item.customPrice ||
                                    Number(String(item.product?.price || item.custom?.start_price || '0').replace(/[^0-9.-]/g, ''))
                                return (
                                    <div key={index} className={css.orderItem}>
                                        <div className={css.itemInfo}>
                                            <span className={css.itemName}>
                                                {item.product?.name_of_food || item.custom?.custom_name}
                                            </span>
                                            <span className={css.itemQuantity}>x{item.quantity}</span>
                                        </div>
                                        <span className={css.itemPrice}>{price * item.quantity} ₽</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className={css.totalRow}>
                            <span>Итого:</span>
                            <strong>{order.totalPrice} ₽</strong>
                        </div>
                    </div>

                    <div className={css.deliveryInfo}>
                        <h3>Информация о доставке</h3>
                        <div className={css.infoRow}>
                            <span>Способ получения:</span>
                            <strong>{order.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}</strong>
                        </div>
                        {order.deliveryType === 'delivery' && (
                            <div className={css.infoRow}>
                                <span>Адрес доставки:</span>
                                <strong>{order.deliveryAddress}</strong>
                            </div>
                        )}
                        {order.deliveryDate && (
                            <div className={css.infoRow}>
                                <span>Дата доставки:</span>
                                <strong>{order.deliveryDate}</strong>
                            </div>
                        )}
                        {order.deliveryTime && (
                            <div className={css.infoRow}>
                                <span>Время доставки:</span>
                                <strong>{order.deliveryTime}</strong>
                            </div>
                        )}
                    </div>

                    <div className={css.paymentInfo}>
                        <h3>Способ оплаты</h3>
                        <div className={css.infoRow}>
                            <span>Метод оплаты:</span>
                            <strong>{order.paymentMethod === 'cash' ? 'Наличными' : 'Картой'}</strong>
                        </div>
                        {order.paymentCard && (
                            <div className={css.infoRow}>
                                <span>Карта:</span>
                                <strong>**** {order.paymentCard}</strong>
                            </div>
                        )}
                    </div>

                    <div className={css.customerInfo}>
                        <h3>Данные покупателя</h3>
                        <div className={css.infoRow}>
                            <span>Имя:</span>
                            <strong>{order.customerName || 'Не указано'}</strong>
                        </div>
                        <div className={css.infoRow}>
                            <span>Email:</span>
                            <strong>{order.customerEmail}</strong>
                        </div>
                    </div>
                </div>

                <div className={css.actions}>
                    <Link href="/" className={css.homeBtn}>На главную</Link>
                    <Link href="/pages/menu" className={css.menuBtn}>В меню</Link>
                </div>
            </div>
        </section>
    )
}