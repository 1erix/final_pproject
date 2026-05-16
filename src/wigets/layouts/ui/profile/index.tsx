'use client'

import { useEffect, useState } from 'react'
import css from './index.module.css'
import Image from 'next/image'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface ProfileModalProps {
    isOpen: boolean
    onClose: () => void
}

interface Address {
    id: number
    street: string
    home_number: number
    office_number?: number | null
    floor?: number | null
}

interface Payment {
    id: number
    card_number: string
    month: number
    year: number
    cvc: string
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'info' | 'addresses' | 'payments'>('info')
    const [mode, setMode] = useState<'profile' | 'login' | 'register'>('profile')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [registerSuccess, setRegisterSuccess] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        phone: '',
        email: ''
    })

    const [originalUserData, setOriginalUserData] = useState({
        name: '',
        surname: '',
        phone: '',
        email: ''
    })

    const [addresses, setAddresses] = useState<Address[]>([])
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [newAddress, setNewAddress] = useState({
        street: '',
        home_number: '',
        office_number: '',
        floor: ''
    })

    const [payments, setPayments] = useState<Payment[]>([])
    const [showPaymentForm, setShowPaymentForm] = useState(false)
    const [newPayment, setNewPayment] = useState({
        card_number: '',
        month: '',
        year: '',
        cvc: ''
    })

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            if (status === 'authenticated') {
                setMode('profile')
                loadUserData()
                loadAddresses()
                loadPayments()
            } else {
                setMode('login')
            }
            setError('')
            setRegisterSuccess(false)
            setIsEditing(false)
            setActiveTab('info')
        } else {
            document.body.style.overflow = 'unset'
            setRegisterSuccess(false)
            setIsEditing(false)
            setShowAddressForm(false)
            setShowPaymentForm(false)
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, status])

    const loadUserData = async () => {
        if (!session?.user?.email) return
        try {
            const resp = await fetch(`/api/user?email=${session.user.email}`)
            if (resp.ok) {
                const data = await resp.json()
                setUserData({
                    name: data.name || '',
                    surname: data.surname || '',
                    phone: data.phone || '',
                    email: data.email || session.user.email || ''
                })
                setOriginalUserData({
                    name: data.name || '',
                    surname: data.surname || '',
                    phone: data.phone || '',
                    email: data.email || session.user.email || ''
                })
            }
        } catch (error) {
            console.error('Error loading user data:', error)
        }
    }

    const loadAddresses = async () => {
        if (!session?.user?.email) return
        const resp = await fetch(`/api/addresses?email=${session.user.email}`)
        const data = await resp.json()
        setAddresses(data)
    }

    const loadPayments = async () => {
        if (!session?.user?.email) return
        try {
            const resp = await fetch(`/api/payments?email=${session.user.email}`)
            const data = await resp.json()
            if (Array.isArray(data)) {
                setPayments(data)
            } else {
                setPayments([])
            }
        } catch {
            setPayments([])
        }
    }

    const saveUserChanges = async () => {
        console.log('1. Начало сохранения')
        console.log('2. Данные для сохранения:', {
            name: userData.name,
            surname: userData.surname,
            phone: userData.phone,
            email: session?.user?.email
        })

        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: userData.name,
                    surname: userData.surname,
                    phone: userData.phone,
                    email: session?.user?.email
                })
            })

            if (response.ok) {
                setIsEditing(false)
                setOriginalUserData({ ...userData })
                await update({ name: userData.name })
            } else {
                setError('Ошибка сохранения')
            }
        } catch {
            setError('Ошибка соединения')
        }
    }

    const cancelEditing = () => {
        setUserData({ ...originalUserData })
        setIsEditing(false)
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
            loadAddresses()
        }
    }

    const deleteAddress = async (id: number) => {
        await fetch(`/api/addresses?id=${id}`, { method: 'DELETE' })
        loadAddresses()
    }

    const addPayment = async () => {
        const resp = await fetch('/api/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                card_number: String(newPayment.card_number),
                month: String(newPayment.month),
                year: String(newPayment.year),
                cvc: String(newPayment.cvc),
                email: session?.user?.email
            })
        })

        if (resp.ok) {
            setShowPaymentForm(false)
            setNewPayment({ card_number: '', month: '', year: '', cvc: '' })
            loadPayments()
        } else {
            setError('Ошибка добавления карты')
        }
    }

    const deletePayment = async (id: number) => {
        await fetch(`/api/payments?id=${id}`, { method: 'DELETE' })
        loadPayments()
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setRegisterSuccess(false)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Неверный email или пароль')
            } else if (result?.ok) {
                onClose()
                router.refresh()
            }
        } catch {
            setError('Ошибка входа')
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setRegisterSuccess(false)

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name'),
            surname: formData.get('surname'),
            email: formData.get('email'),
            password: formData.get('password'),
            phone: formData.get('phone')
        }

        const resp = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (resp.ok) {
            setRegisterSuccess(true)
            setMode('login')
            setError('')
        } else {
            let errorMessage = 'Ошибка регистрации'
            try {
                const errorData = await resp.json()
                errorMessage = errorData.message || errorMessage
            } catch {

            }
            setError(errorMessage)
        }
        setLoading(false)
    }

    if (!isOpen) return null

    if (mode === 'profile' && session?.user) {
        return (
            <>
                <div className={css.overlay} onClick={onClose} />
                <section className={css.profile_modal}>
                    <div className={css.close}>
                        <Image src='/menu/close-sm.svg' alt='' width={30} height={30} onClick={onClose} />
                    </div>

                    <div className={css.headerRow}>
                        <h2 className={css.title}>Личный кабинет</h2>
                        {!isEditing ? (
                            <button className={css.editBtn} onClick={() => setIsEditing(true)}>Изменить</button>
                        ) : (
                            <div className={css.editActions}>
                                <button className={css.saveBtn} onClick={saveUserChanges}>Сохранить</button>
                                <button className={css.cancelBtn} onClick={cancelEditing}>Отменить</button>
                            </div>
                        )}
                    </div>

                    <div className={css.tabs}>
                        <button className={`${css.tab} ${activeTab === 'info' ? css.activeTab : ''}`} onClick={() => setActiveTab('info')}>
                            Контактная информация
                        </button>
                        <button className={`${css.tab} ${activeTab === 'addresses' ? css.activeTab : ''}`} onClick={() => setActiveTab('addresses')}>
                            Мои адреса
                        </button>
                        <button className={`${css.tab} ${activeTab === 'payments' ? css.activeTab : ''}`} onClick={() => setActiveTab('payments')}>
                            Мои карты
                        </button>
                    </div>

                    {activeTab === 'info' && (
                        <div className={css.contact_info}>
                            <h3 className={css.sectionTitle}>Контактная информация</h3>
                            <div className={css.inputGroup}>
                                <label>Имя</label>
                                <input type="text" value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} disabled={!isEditing} />
                            </div>
                            <div className={css.inputGroup}>
                                <label>Фамилия</label>
                                <input type="text" value={userData.surname} onChange={e => setUserData({ ...userData, surname: e.target.value })} disabled={!isEditing} />
                            </div>
                            <div className={css.inputGroup}>
                                <label>Телефон</label>
                                <input type="tel" value={userData.phone} onChange={e => setUserData({ ...userData, phone: e.target.value })} disabled={!isEditing} />
                            </div>
                            <div className={css.inputGroup}>
                                <label>Email</label>
                                <input type="email" value={userData.email} disabled />
                            </div>
                        </div>
                    )}

                    {activeTab === 'addresses' && (
                        <div className={css.addressesSection}>
                            <div className={css.sectionHeader}>
                                <h3 className={css.sectionTitle}>Мои адреса</h3>
                                <button className={css.addBtn} onClick={() => setShowAddressForm(true)}>+ Добавить адрес</button>
                            </div>

                            {addresses.length === 0 && !showAddressForm && (
                                <p className={css.emptyText}>Нет сохранённых адресов</p>
                            )}

                            {addresses.map(addr => (
                                <div key={addr.id} className={css.addressCard}>
                                    <div className={css.cardContent}>
                                        <p>{addr.street}, {addr.home_number}</p>
                                        {addr.office_number && <p>Кв/офис: {addr.office_number}</p>}
                                        {addr.floor && <p>Этаж: {addr.floor}</p>}
                                    </div>
                                    {isEditing && (
                                        <button className={css.deleteBtn} onClick={() => deleteAddress(addr.id)}>Удалить</button>
                                    )}
                                </div>
                            ))}

                            {showAddressForm && (
                                <div className={css.formModal}>
                                    <h4>Добавить адрес</h4>
                                    <input type="text" placeholder="Улица" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} />
                                    <input type="text" placeholder="Номер дома" value={newAddress.home_number} onChange={e => setNewAddress({ ...newAddress, home_number: e.target.value })} />
                                    <input type="text" placeholder="Квартира/офис" value={newAddress.office_number} onChange={e => setNewAddress({ ...newAddress, office_number: e.target.value })} />
                                    <input type="text" placeholder="Этаж" value={newAddress.floor} onChange={e => setNewAddress({ ...newAddress, floor: e.target.value })} />
                                    <div className={css.formActions}>
                                        <button onClick={addAddress}>Сохранить</button>
                                        <button onClick={() => setShowAddressForm(false)}>Отмена</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className={css.paymentsSection}>
                            <div className={css.sectionHeader}>
                                <h3 className={css.sectionTitle}>Мои карты</h3>
                                <button className={css.addBtn} onClick={() => setShowPaymentForm(true)}>+ Добавить карту</button>
                            </div>

                            {payments.length === 0 && !showPaymentForm && (
                                <p className={css.emptyText}>Нет сохранённых карт</p>
                            )}

                            {payments.map(payment => (
                                <div key={payment.id} className={css.paymentCard}>
                                    <div className={css.cardContent}>
                                        <p>**** **** **** {payment.card_number.slice(-4)}</p>
                                        <p>{payment.month}/{payment.year}</p>
                                    </div>
                                    {isEditing && (
                                        <button className={css.deleteBtn} onClick={() => deletePayment(payment.id)}>Удалить</button>
                                    )}
                                </div>
                            ))}

                            {showPaymentForm && (
                                <div className={css.formModal}>
                                    <h4>Добавить карту</h4>
                                    <input type="text" placeholder="Номер карты" maxLength={16} value={newPayment.card_number} onChange={e => setNewPayment({ ...newPayment, card_number: e.target.value })} />
                                    <div className={css.rowInputs}>
                                        <input type="text" placeholder="ММ" maxLength={2} value={newPayment.month} onChange={e => setNewPayment({ ...newPayment, month: e.target.value })} />
                                        <input type="text" placeholder="ГГ" maxLength={2} value={newPayment.year} onChange={e => setNewPayment({ ...newPayment, year: e.target.value })} />
                                        <input type="text" placeholder="CVC" maxLength={3} value={newPayment.cvc} onChange={e => setNewPayment({ ...newPayment, cvc: e.target.value })} />
                                    </div>
                                    <div className={css.formActions}>
                                        <button onClick={addPayment}>Сохранить</button>
                                        <button onClick={() => setShowPaymentForm(false)}>Отмена</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <button className={css.logoutBtn} onClick={() => signOut()}>Выйти</button>
                </section>
            </>
        )
    }

    if (mode === 'login') {
        return (
            <>
                <div className={css.overlay} onClick={onClose} />
                <section className={css.profile_modal}>
                    <div className={css.close}>
                        <Image src='/menu/close-sm.svg' alt='' width={30} height={30} onClick={onClose} />
                    </div>

                    <h2 className={css.title}>Вход в аккаунт</h2>

                    {registerSuccess && (
                        <div className={css.success}>
                            Регистрация успешна! Теперь войдите в аккаунт.
                        </div>
                    )}

                    <form onSubmit={handleLogin} className={css.form}>
                        {error && <div className={css.error}>{error}</div>}

                        <div className={css.inputGroup}>
                            <label>Email</label>
                            <input type="email" name="email" placeholder="example@mail.com" required />
                        </div>

                        <div className={css.inputGroup}>
                            <label>Пароль</label>
                            <input type="password" name="password" placeholder="••••••••" required />
                        </div>

                        <button type="submit" disabled={loading} className={css.submitBtn}>
                            {loading ? 'Загрузка...' : 'Войти'}
                        </button>

                        <p className={css.switchMode}>
                            Нет аккаунта?{' '}
                            <button type="button" onClick={() => {
                                setMode('register')
                                setRegisterSuccess(false)
                                setError('')
                            }}>
                                Зарегистрироваться
                            </button>
                        </p>
                    </form>
                </section>
            </>
        )
    }

    return (
        <>
            <div className={css.overlay} onClick={onClose} />
            <section className={css.profile_modal}>
                <div className={css.close}>
                    <Image src='/menu/close-sm.svg' alt='' width={30} height={30} onClick={onClose} />
                </div>

                <h2 className={css.title}>Регистрация</h2>

                <form onSubmit={handleRegister} className={css.form}>
                    {error && <div className={css.error}>{error}</div>}

                    <div className={css.inputGroup}>
                        <label>Имя</label>
                        <input type="text" name="name" placeholder="Иван" required />
                    </div>

                    <div className={css.inputGroup}>
                        <label>Фамилия</label>
                        <input type="text" name="surname" placeholder="Иванов" required />
                    </div>

                    <div className={css.inputGroup}>
                        <label>Телефон</label>
                        <input type="tel" name="phone" placeholder="+7 999 123-45-67" required />
                    </div>

                    <div className={css.inputGroup}>
                        <label>Email</label>
                        <input type="email" name="email" placeholder="example@mail.com" required />
                    </div>

                    <div className={css.inputGroup}>
                        <label>Пароль</label>
                        <input type="password" name="password" placeholder="••••••••" required />
                    </div>

                    <button type="submit" disabled={loading} className={css.submitBtn}>
                        {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                    </button>

                    <p className={css.switchMode}>
                        Уже есть аккаунт?{' '}
                        <button type="button" onClick={() => {
                            setMode('login')
                            setRegisterSuccess(false)
                            setError('')
                        }}>
                            Войти
                        </button>
                    </p>
                </form>
            </section>
        </>
    )
}