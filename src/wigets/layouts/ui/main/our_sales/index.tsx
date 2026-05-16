import css from './index.module.css'
import { OurSales } from './cards'

export default function OurSalesPage() {
    return (
        <section className={css.our_sales}>

            <h1 className={css.h1}>Наши акции</h1>
            <OurSales />
        </section>
    )
}