import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
    const cistom_products = await prisma.custom_products.findMany({
        include: {
            bases: true,
            sauces: true,
            cheeses: true,
            vegetables: true,
            meats: true
        }
    })
    return NextResponse.json(cistom_products)
}