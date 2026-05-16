'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import css from './index.module.css'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function Login() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false
        })

        if (result?.error) {
            setError('Неверная электронная почта или пароль')
            setLoading(false)
        } else {
            router.push('/')
            router.refresh()
        }
    }

    return (
        <div className={css.container}>
            <form onSubmit={handleSubmit} className={css.form}>
                <h1>Вход в аккаунт</h1>

                {searchParams.get('registered') && (
                    <div className={css.success}>Регистрация успешна! Войдите в аккаунт.</div>
                )}

                {error && <div className={css.error}>{error}</div>}

                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Пароль" required />

                <button type="submit" disabled={loading}>
                    {loading ? 'Загрузка...' : 'Войти'}
                </button>

                <p>
                    Нет аккаунта? <Link href="/pages/register">Зарегистрироваться</Link>
                </p>
            </form>
        </div>
    )
}