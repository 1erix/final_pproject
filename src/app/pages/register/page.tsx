'use client'

import { useRouter } from 'next/navigation'
import css from './index.module.css'
import { useState } from 'react'
import Link from 'next/link'

export default function Register() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

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
            headers: { 'Content-Type': 'applicatiion/json' },
            body: JSON.stringify(data)
        })

        if (resp.ok) {
            router.push('/auth/login?registered=true')
        } else {
            const error = await resp.json()
            setError(error.message || 'Ошибка регистрации')
        }
        setLoading(false)
    }

    return (
        <div className={css.container}>
            <form onSubmit={handleSubmit} className={css.form}>
                <h1>Регистрация</h1>

                {error && <div className={css.error}>{error}</div>}

                <input type="text" name="name" placeholder="Имя" required />
                <input type="text" name="surname" placeholder="Фамилия" required />
                <input type="tel" name="phone" placeholder="Телефон" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Пароль" required />

                <button type="submit" disabled={loading}>
                    {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                </button>

                <p>
                    Уже есть аккаунт? <Link href="/auth/login">Войти</Link>
                </p>
            </form>
        </div>
    )
}