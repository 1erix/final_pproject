'use client'

import { useSession } from 'next-auth/react'
import css from './index.module.css'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Address {
    id: number,
    street: string,
    home_number: number,
    office_number?: number | null,
    floor?: number | null
}

interface Payment {
    id: number,
    card_number: string,
    month: string,
    year: string,
    cvc: string
}

export default function MakingAnOrder() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [cartItems, setCartItems] = useState<any[]>([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [loading, setLoading] = useState(true)

    const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
    const [deliveryAddress, setDeliveryAddress] = useState('')
    const [deliveryDate, setDeliveryDate] = useState('')
    const [deliveryTime, setDeliveryTime] = useState('')

    const [addresses, setAddresses] = useState<Address[]>([])
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
    const [showAddressForm, setShowAddressForm] = useState(false)

    const [newAddress, setNewAddress] = useState({
        street: '',
        home_number: '',
        office_number: '',
        floor: ''
    })
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')
    const [payments, setPayments] = useState<Payment[]>([])
    const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null)
    const [showPaymentForm, setShowPaymentForm] = useState(false)
    const [newPayment, setNewPayment] = useState({
        card_number: '',
        month: '',
        year: '',
        cvc: ''
    })

    const calculateTotal = (items: any[]) => {
        let total = 0
        items.forEach(item => {
            if (item.customPrice) {
                total += item.customPrice * item.quantity
            } else if (item.product?.price) {
                let priceNumber = 0
                if (typeof item.product.price === 'string') {
                    priceNumber = Number(item.product.price.replace(/[^0-9.-]/g, ''))
                } else {
                    priceNumber = Number(item.product.price)
                }
                total += priceNumber * item.quantity
            } else if (item.custom?.start_price) {
                let priceNumber = 0
                if (typeof item.custom.start_price === 'string') {
                    priceNumber = Number(item.custom.start_price.replace(/[^0-9.-]/g, ''))
                } else {
                    priceNumber = Number(item.custom.start_price)
                }
                total += priceNumber * item.quantity
            }
        })
        setTotalPrice(total)
    }

    const loadCart = async () => {
        try {
            const resp = await fetch('/api/cart')
            const data = await resp.json()

            if (Array.isArray(data)) {
                setCartItems(data)
                calculateTotal(data)
            }
        } catch (error) {
            console.log('ошибка загрузки корзины:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadAddress = async () => {
        if (!session?.user?.email) return
        const resp = await fetch(`/api/addresses?email=${session.user.email}`)
        const data = await resp.json()
        setAddresses(data)
        if (data.length > 0) {
            setSelectedAddressId(data[0].id)
        }
    }

    const loadPayments = async () => {
        if (!session?.user?.email) return
        const resp = await fetch(`/api/payments?email=${session.user.email}`)
        const data = await resp.json()
        setPayments(data)
        if (data.length > 0) {
            setSelectedPaymentId(data[0].id)
        }
    }

    const addAddress = async () => {
        const resp = await fetch('/api/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newAddress, email: session?.user?.email })
        })
        if (resp.ok) {
            setShowAddressForm(false)
            setNewAddress({ street: '', home_number: '', office_number: '', floor: '' })
            loadAddress()
        }
    }

    const addPayment = async () => {
        const resp = await fetch('/api/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                card_number: newPayment.card_number,
                month: newPayment.month,
                year: newPayment.year,
                cvc: newPayment.cvc,
                email: session?.user?.email
            })
        })
        if (resp.ok) {
            setShowPaymentForm(false)
            setNewPayment({ card_number: '', month: '', year: '', cvc: '' })
            loadPayments()
        }
    }

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/pages/login')
        }
    }, [status, router])

    useEffect(() => {
        if (status === 'authenticated') {
            loadCart()
            loadAddress()
            loadPayments()
        }
    }, [status])

    const generateOrderNumber = () => {
        return Math.floor(1000000 + Math.random() * 9000000).toString()
    }

    const handleSubmitOrder = async () => {
        try {
            if (deliveryType === 'delivery' && !selectedAddressId && addresses.length === 0) {
                alert('Пожалуйста, добавьте адрес доставки')
                return
            }

            const orderNumber = generateOrderNumber()

            const orderData = {
                orderNumber,
                items: cartItems,
                totalPrice,
                deliveryType,
                deliveryAddress: deliveryType === 'delivery' && selectedAddress
                    ? `${selectedAddress.street}, ${selectedAddress.home_number}${selectedAddress.office_number ? `, кв/офис ${selectedAddress.office_number}` : ''}`
                    : 'Самовывоз',
                deliveryDate,
                deliveryTime,
                paymentMethod,
                paymentCard: paymentMethod === 'card' && selectedPayment ? selectedPayment.card_number.slice(-4) : null,
                customerName: session?.user?.name,
                customerEmail: session?.user?.email,
                status: 'Подтверждён',
                estimatedTime: '45-60 минут',
                createdAt: new Date().toISOString()
            }

            console.log('Sending order:', orderData)

            const resp = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })

            const result = await resp.json()
            console.log('Response:', result)

            if (resp.ok && result.success) {
                await fetch('/api/cart/delete', { method: 'DELETE' })
                router.push(`/pages/order_tracking?orderId=${result.orderId}`)
            } else {
                alert(`Ошибка при оформлении заказа: ${result.error || 'Неизвестная ошибка'}`)
            }
        } catch (error) {
            console.error('Submit order error:', error)
            alert('Произошла ошибка при оформлении заказа')
        }
    }

    const selectedAddress = addresses.find(a => a.id === selectedAddressId)
    const selectedPayment = payments.find(a => a.id === selectedPaymentId)

    if (status === 'loading' || loading) {
        return <div className={css.loading}>Загрузка...</div>
    }

    return (
        <section className={css.making_an_order}>
            <h1 className={css.title}>Оформление заказа</h1>

            <div className={css.content}>
                <div className={css.leftSection}>
                    <div className={css.section}>
                        <h2>Контактная информация</h2>
                        <div className={css.formGroup}>
                            <input type="text" placeholder="Введите имя" defaultValue={session?.user?.name || ''} />
                        </div>
                        <div className={css.formGroup}>
                            <input type="email" placeholder="Введите email" defaultValue={session?.user?.email || ''} />
                        </div>
                    </div>

                    <div className={css.section}>
                        <h2>Способ получения</h2>
                        <div className={css.paymentMethods}>
                            <label className={css.radioLabel}>
                                <input
                                    type="radio"
                                    name="deliveryType"
                                    checked={deliveryType === 'delivery'}
                                    onChange={() => setDeliveryType('delivery')}
                                />
                                <span>Доставка</span>
                            </label>
                            <label className={css.radioLabel}>
                                <input
                                    type="radio"
                                    name="deliveryType"
                                    checked={deliveryType === 'pickup'}
                                    onChange={() => setDeliveryType('pickup')}
                                />
                                <span>Самовывоз</span>
                            </label>
                        </div>
                    </div>

                    {deliveryType === 'delivery' && (
                        <div className={css.section}>
                            <h2>Информация о доставке</h2>

                            {addresses.length > 0 && !showAddressForm && (
                                <div className={css.savedItems}>
                                    <p className={css.savedLabel}>Выберите сохранённый адрес:</p>
                                    {addresses.map(addr => (
                                        <label key={addr.id} className={css.radioLabel}>
                                            <input
                                                type="radio"
                                                name="address"
                                                checked={selectedAddressId === addr.id}
                                                onChange={() => setSelectedAddressId(addr.id)}
                                            />
                                            <span>{addr.street}, {addr.home_number}</span>
                                            {addr.office_number && <span>, кв/офис {addr.office_number}</span>}
                                            {addr.floor && <span>, этаж {addr.floor}</span>}
                                        </label>
                                    ))}
                                    <button className={css.addBtn} onClick={() => setShowAddressForm(true)}>+ Добавить новый адрес</button>
                                </div>
                            )}

                            {showAddressForm && (
                                <div className={css.formModal}>
                                    <h3>Новый адрес</h3>
                                    <input
                                        type="text"
                                        placeholder="Улица"
                                        value={newAddress.street}
                                        onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Номер дома"
                                        value={newAddress.home_number}
                                        onChange={e => setNewAddress({ ...newAddress, home_number: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Квартира/офис"
                                        value={newAddress.office_number}
                                        onChange={e => setNewAddress({ ...newAddress, office_number: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Этаж"
                                        value={newAddress.floor}
                                        onChange={e => setNewAddress({ ...newAddress, floor: e.target.value })}
                                    />
                                    <div className={css.formActions}>
                                        <button onClick={addAddress}>Сохранить</button>
                                        <button onClick={() => setShowAddressForm(false)}>Отмена</button>
                                    </div>
                                </div>
                            )}

                            {!showAddressForm && addresses.length === 0 && (
                                <div className={css.emptyInfo}>
                                    <p>Нет сохранённых адресов</p>
                                    <button className={css.addBtn} onClick={() => setShowAddressForm(true)}>+ Добавить адрес</button>
                                </div>
                            )}

                            <div className={css.formGroup}>
                                <input
                                    type="date"
                                    value={deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    placeholder="Дата доставки"
                                />
                            </div>
                            <div className={css.formGroup}>
                                <input
                                    type="time"
                                    value={deliveryTime}
                                    onChange={(e) => setDeliveryTime(e.target.value)}
                                    placeholder="Время доставки"
                                />
                            </div>
                        </div>
                    )}

                    {deliveryType === 'pickup' && (
                        <div className={css.section}>
                            <h2>Самовывоз</h2>
                            <div className={css.pickupInfo}>
                                <p>Адрес самовывоза: г. Москва, ул. Тверская, д. 15</p>
                                <p>Режим работы: ежедневно с 10:00 до 22:00</p>
                            </div>
                        </div>
                    )}

                    <div className={css.section}>
                        <h2>Оплата</h2>

                        <div className={css.paymentMethods}>
                            <label className={css.radioLabel}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    checked={paymentMethod === 'cash'}
                                    onChange={() => setPaymentMethod('cash')}
                                />
                                <span>Наличными</span>
                            </label>
                            <label className={css.radioLabel}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                />
                                <span>Картой</span>
                            </label>
                        </div>

                        {paymentMethod === 'card' && (
                            <>
                                {payments.length > 0 && !showPaymentForm && (
                                    <div className={css.savedItems}>
                                        <p className={css.savedLabel}>Выберите сохранённую карту:</p>
                                        {payments.map(payment => (
                                            <label key={payment.id} className={css.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={selectedPaymentId === payment.id}
                                                    onChange={() => setSelectedPaymentId(payment.id)}
                                                />
                                                <span>**** **** **** {payment.card_number.slice(-4)}</span>
                                                <span className={css.cardDate}>{payment.month}/{payment.year}</span>
                                            </label>
                                        ))}
                                        <button className={css.addBtn} onClick={() => setShowPaymentForm(true)}>+ Добавить новую карту</button>
                                    </div>
                                )}

                                {showPaymentForm && (
                                    <div className={css.formModal}>
                                        <h3>Новая карта</h3>
                                        <input
                                            type="text"
                                            placeholder="Номер карты"
                                            maxLength={16}
                                            value={newPayment.card_number}
                                            onChange={e => setNewPayment({ ...newPayment, card_number: e.target.value })}
                                        />
                                        <div className={css.rowInputs}>
                                            <input
                                                type="text"
                                                placeholder="ММ"
                                                maxLength={2}
                                                value={newPayment.month}
                                                onChange={e => setNewPayment({ ...newPayment, month: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="ГГ"
                                                maxLength={2}
                                                value={newPayment.year}
                                                onChange={e => setNewPayment({ ...newPayment, year: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="CVC"
                                                maxLength={3}
                                                value={newPayment.cvc}
                                                onChange={e => setNewPayment({ ...newPayment, cvc: e.target.value })}
                                            />
                                        </div>
                                        <div className={css.formActions}>
                                            <button onClick={addPayment}>Сохранить</button>
                                            <button onClick={() => setShowPaymentForm(false)}>Отмена</button>
                                        </div>
                                    </div>
                                )}

                                {!showPaymentForm && payments.length === 0 && (
                                    <div className={css.emptyInfo}>
                                        <p>Нет сохранённых карт</p>
                                        <button className={css.addBtn} onClick={() => setShowPaymentForm(true)}>+ Добавить карту</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className={css.rightSection}>
                    <div className={css.orderSummary}>
                        <h2>Ваш заказ</h2>
                        <div className={css.orderItems}>
                            {cartItems.map(item => {
                                const price = item.customPrice ||
                                    Number(String(item.product?.price || item.custom?.start_price || '0').replace(/[^0-9.-]/g, ''))

                                return (
                                    <div key={item.id} className={css.orderItem}>
                                        <span>{item.product?.name_of_food || item.custom?.custom_name} x{item.quantity}</span>
                                        <span>{price * item.quantity} ₽</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className={css.totalRow}>
                            <span>Итого:</span>
                            <span className={css.totalPrice}>{totalPrice} ₽</span>
                        </div>
                        <button className={css.payBtn} onClick={handleSubmitOrder}>
                            Оплатить {totalPrice} ₽
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}