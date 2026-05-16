import Image from 'next/image'
import css from './index.module.css'
import { SocialNetworks } from './social_networks'

export default function Footer() {
    return (
        <footer className={css.footer}>
            <div className={css.left_part}>
                <div className={css.phone}>
                    <p>+7 999 999 99 99</p>
                    <Image src='/footer/phone.svg' alt='' width={22} height={22} />
                </div>

                <div className={css.email}>
                    <p>someemailaddress@email.ru</p>
                </div>

                <SocialNetworks />
            </div>

            <div className={css.right_part}>
                <div className={css.sales_ingredients}>
                    <p>Узнавайте первыми о новых акциях и ингредиентах!</p>
                </div>

                <form>
                    <input placeholder="email" type='email' />
                    <button>Отправить</button>
                </form>
            </div>
        </footer>
    )
}