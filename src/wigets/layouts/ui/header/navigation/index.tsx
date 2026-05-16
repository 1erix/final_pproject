import Link from 'next/link'
import css from './index.module.css'
import { NAVIGATION_LINKS, NavigationType } from './models'

export const Navigation = () => {
    return (
        <nav className={css.nav}>
            {NAVIGATION_LINKS.map((item: NavigationType, index) => (
                <Link href={item.href} key={index} className={css.link}>{item.title}</Link>
            ))}
        </nav>
    )
}