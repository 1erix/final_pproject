import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
    const products = await prisma.product.findMany({
        orderBy: {
            id: 'desc'
        }
    })
    return NextResponse.json(products)
}