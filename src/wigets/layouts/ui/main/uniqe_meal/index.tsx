import Image from 'next/image'
import css from './index.module.css'
import Link from 'next/link'

export default function UniqeMeal() {
    return (
        <section className={css.uniqe_meal}>
            <div className={css.text_btn}>
                <p>Создайте своё уникальное блюдо или выберите из готового!</p>
                <Link href='/pages/menu'>Перейти к меню</Link>
            </div>

            <div className={css.image}>
                <Image src='/uniqe_meal/food.png' alt='' width={761} height={340} />
            </div>
        </section>
    )
}