import Image from 'next/image'
import { ADVANTAGES, AdvantagesType } from './advantages'
import css from './index.module.css'

export const Advantages = () => {
    return (
        <div className={css.all_advantages}>
            {ADVANTAGES.map((item: AdvantagesType, index) => (
                <div className={css.advantage} key={index}>
                    <div dangerouslySetInnerHTML={{ __html: item.text }}></div>
                    <Image src={item.image} alt='' width={35} height={35} />
                </div>
            ))}
        </div>
    )
}