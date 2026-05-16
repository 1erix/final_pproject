import css from './index.module.css'
import { Steps } from './steps'

export default function HowItWorks() {
    return (
        <section className={css.how_it_works}>
            <div className={css.h1}>
                <h1>Как это работает?</h1>
            </div>

            <Steps />
        </section>
    )
}