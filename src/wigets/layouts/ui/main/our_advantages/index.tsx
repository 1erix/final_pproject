import css from './index.module.css'
import { Advantages } from './models'

export default function OurAdvantages() {
    return (
        <section className={css.our_advantages}>
            <h1 className={css.h1}>Наши преимущества</h1>
            <Advantages />
        </section>
    )
}