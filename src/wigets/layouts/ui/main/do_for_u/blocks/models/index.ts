export type BlocksType = {
    title: string,
    description: string,
    image: string
}

export const BLOCKS: Array<BlocksType> = [
    {
        title: 'Пикантная паста с креветками',
        description: 'Состав: паста фетучини, тигровые креветки, соус "Унаги", пармезан, руккола',
        image: '/do_for_u/firstRecipe.svg'
    },
    {
        title: 'Сытный боул с говядиной',
        description: 'Состав: бурый рис, маринованная говядина, авокадо, соус "Терьяки", кунжут',
        image: '/do_for_u/secondRecipe.svg'
    }
]