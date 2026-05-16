import Image from 'next/image'
import css from './index.module.css'
import { STEPS, StepsType } from './models'

export const Steps = () => {
    return (
        <div>
            {STEPS.map((item: StepsType, index) => (
                <div className={css.step} key={index}>
                    <div className={`${css.without_img} ${index === 1 ? css.second_step : ''}`}>
                        <div className={css.text_img} >
                            <h1>{item.title}</h1>
                            <Image src={item.icon} alt='' width={30} height={30} />
                        </div>
                        <p>{item.description}</p>
                    </div>
                    {item.arrow && (
                        <div className={css.arrow}>
                            <Image src={item.arrow} alt='' width={180} height={180} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}