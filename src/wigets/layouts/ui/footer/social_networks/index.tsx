import Image from 'next/image'
import css from './index.module.css'
import { NetworksType, SOCIAL_NETWORKS } from './models'

export const SocialNetworks = () => {
    return (
        <div className={css.social_networks}>
            {SOCIAL_NETWORKS.map((item: NetworksType, index) => (
                <Image src={item.icon} alt='' key={index} width={35} height={35} />
            ))}
        </div>
    )
}