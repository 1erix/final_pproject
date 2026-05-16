import FavouritesCards from '@/wigets/layouts/ui/favourites'
import css from './index.module.css'

export default function Favourites() {
    return (
        <section className={css.favourites}>
            <div className={css.cards}>
                <FavouritesCards />
            </div>
        </section>
    )
}