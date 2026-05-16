import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const session = await getServerSession()
    if (!session?.user?.email) {
        return NextResponse.json({ isFavourite: false })
    }

    const user = await prisma.user.findFirst({
        where: { email: session.user.email }
    })

    if (!user) {
        return NextResponse.json({ isFavourite: false })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (productId) {
        const favourite = await prisma.favourite_default.findFirst({
            where: {
                userId: user.id,
                productId: parseInt(productId)
            }
        })
        return NextResponse.json({ isFavourite: !!favourite })
    }

    const favourites = await prisma.favourite_default.findMany({
        where: { userId: user.id },
        include: { product: true }
    })

    return NextResponse.json(favourites)
}

export async function POST(request: Request) {
    const session = await getServerSession()
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findFirst({
        where: { email: session.user.email }
    })

    const { productId } = await request.json()

    const favourite = await prisma.favourite_default.create({
        data: {
            userId: user.id,
            productId: productId
        }
    })

    return NextResponse.json(favourite)
}

export async function DELETE(request: Request) {
    const session = await getServerSession()
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findFirst({
        where: { email: session.user.email }
    })

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    await prisma.favourite_default.deleteMany({
        where: {
            userId: user.id,
            productId: parseInt(productId || '0')
        }
    })

    return NextResponse.json({ deleted: true })
}