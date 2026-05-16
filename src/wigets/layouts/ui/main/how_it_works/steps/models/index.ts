export type StepsType = {
    title: string,
    icon: string,
    description: string,
    arrow: string
}

export const STEPS: Array<StepsType> = [
    {
        title: 'Шаг 1: Выберите основу',
        icon: '/how_it_works/steps/plates.svg',
        description: 'Рис, киноа, паста, салат - что душа пожелает!',
        arrow: '/how_it_works/rightArrow.svg'
    },
    {
        title: 'Шаг 2: Добавьте ингредиенты',
        icon: '/how_it_works/steps/ingredients.svg',
        description: 'Соберите свой идеальный вкус из десятков свежих компонентов',
        arrow: '/how_it_works/leftArrow.svg'
    },
    {
        title: 'Шаг 3: Оформите заказ',
        icon: '/how_it_works/steps/courier.svg',
        description: 'Закажите и наслаждайтесь едой!',
        arrow: null
    }
]