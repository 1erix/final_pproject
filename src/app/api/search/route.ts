import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (query.length < 1) {
        return NextResponse.json([])
    }

    try {
        const [allProducts, allCustom] = await Promise.all([
            prisma.product.findMany({
                select: {
                    id: true,
                    name_of_food: true,
                    price: true,
                    food_img: true
                }
            }),
            prisma.custom_products.findMany({
                select: {
                    id: true,
                    custom_name: true,
                    start_price: true,
                    custom_product_img: true
                }
            })
        ])

        const queryLower = query.toLowerCase()

        const filteredProducts = allProducts.filter(p =>
            p.name_of_food.toLowerCase().includes(queryLower)
        )

        const filteredCustom = allCustom.filter(c =>
            c.custom_name.toLowerCase().includes(queryLower)
        )

        const results = [
            ...filteredProducts.map(p => ({
                id: p.id,
                name: p.name_of_food,
                price: p.price,
                image: p.food_img,
                type: 'default' as const
            })),
            ...filteredCustom.map(c => ({
                id: c.id,
                name: c.custom_name,
                price: c.start_price,
                image: c.custom_product_img,
                type: 'custom' as const
            }))
        ]

        return NextResponse.json(results)
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json([])
    }
}