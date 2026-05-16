export type NavigationType = {
    href: string,
    title: string
}

export const NAVIGATION_LINKS: Array<NavigationType> = [
    {
        href: '/pages/menu',
        title: 'Меню'
    },
    {
        href: '/pages/cart',
        title: 'Корзина'
    },
    {
        href: '/pages/favourites',
        title: 'Избранное'
    }
]