import Image from 'next/image'
import css from './index.module.css'
import { BLOCKS, BlocksType } from './models'
import Link from 'next/link'

export const Blocks = () => {
    return (
        <div className={css.container}>
            {BLOCKS.map((item: BlocksType, index) => (
                <div key={index} className={css.block}>
                    {index === 1 ? (
                        <>
                            <div className={`${css.right_part} ${css.scd_left_part}`}>
                                <Image src={item.image} alt='' width={323} height={323} />
                            </div>

                            <div className={`${css.left_part} ${css.scd_right_part}`}>
                                <h1>{item.title}</h1>
                                <p>{item.description}</p>
                                <Link href='pages/menu'>Собрать как у шефа</Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={css.left_part}>
                                <h1>{item.title}</h1>
                                <p>{item.description}</p>
                                <Link href='pages/menu'>Собрать как у шефа</Link>
                            </div>

                            <div className={css.right_part}>
                                <Image src={item.image} alt='' width={423} height={423} />
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}