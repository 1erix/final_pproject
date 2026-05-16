import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const session = await getServerSession()
    if (!session?.user?.email) {
        return NextResponse.json([])
    }

    const user = await prisma.user.findFirst({
        where: { email: session.user.email }
    })

    if (!user) {
        return NextResponse.json([])
    }

    const { searchParams } = new URL(request.url)
    const customId = searchParams.get('customId')

    if (customId) {
        const favourite = await prisma.favourite_custom.findFirst({
            where: {
                userId: user.id,
                customId: parseInt(customId)
            }
        })
        return NextResponse.json({ isFavourite: !!favourite })
    }

    const favourites = await prisma.favourite_custom.findMany({
        where: { userId: user.id },
        include: {
            custom: {
                include: {
                    bases: true,
                    sauces: true,
                    cheeses: true,
                    vegetables: true,
                    meats: true
                }
            }
        }
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

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { customId, savedPrice, selections } = await request.json()

    const existing = await prisma.favourite_custom.findFirst({
        where: {
            userId: user.id,
            customId: customId
        }
    })

    if (existing) {
        return NextResponse.json({ message: "Already in favourites" })
    }

    const favourite = await prisma.favourite_custom.create({
        data: {
            userId: user.id,
            customId: customId,
            savedPrice: savedPrice,
            selections: selections
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

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const customId = searchParams.get('customId')

    if (!customId) {
        return NextResponse.json({ error: "customId required" }, { status: 400 })
    }

    await prisma.favourite_custom.deleteMany({
        where: {
            userId: user.id,
            customId: parseInt(customId)
        }
    })

    return NextResponse.json({ deleted: true })
}