import { Blocks } from './blocks'
import css from './index.module.css'

export default function DoForU() {
    return (
        <section className={css.do_for_u}>
            <div className={css.h1}>
                <h1>Собрали для вас</h1>
            </div>

            <Blocks />
        </section>
    )
}