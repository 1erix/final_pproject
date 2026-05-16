import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
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

        const cart = await prisma.cart_item.findMany({
            where: { userId: user.id },
            include: {
                product: true,
                custom: {
                    include: {
                        bases: true,
                        sauces: true,
                        meats: true,
                        cheeses: true,
                        vegetables: true
                    }
                }
            }
        })

        return NextResponse.json(cart)
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
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

        const { productId, customId, quantity = 1, selections, customPrice } = await request.json()

        if (customId) {
            const existingItem = await prisma.cart_item.findFirst({
                where: {
                    userId: user.id,
                    customId: customId
                }
            })

            if (existingItem) {
                const updated = await prisma.cart_item.update({
                    where: { id: existingItem.id },
                    data: {
                        quantity: existingItem.quantity + quantity,
                        selections: selections ? JSON.stringify(selections) : existingItem.selections,
                        customPrice: customPrice || existingItem.customPrice
                    }
                })
                return NextResponse.json(updated)
            } else {
                const newItem = await prisma.cart_item.create({
                    data: {
                        userId: user.id,
                        customId: customId,
                        quantity,
                        selections: selections ? JSON.stringify(selections) : null,
                        customPrice: customPrice || null
                    }
                })
                return NextResponse.json(newItem)
            }
        }

        const existingItem = await prisma.cart_item.findFirst({
            where: {
                userId: user.id,
                productId: productId
            }
        })

        if (existingItem) {
            const updated = await prisma.cart_item.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            })
            return NextResponse.json(updated)
        } else {
            const newItem = await prisma.cart_item.create({
                data: {
                    userId: user.id,
                    productId: productId || null,
                    quantity
                }
            })
            return NextResponse.json(newItem)
        }
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
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

        const { id, quantity } = await request.json()

        const item = await prisma.cart_item.findFirst({
            where: { id, userId: user.id }
        })

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 })
        }

        if (quantity <= 0) {
            await prisma.cart_item.delete({ where: { id } })
            return NextResponse.json({ deleted: true })
        }

        const updated = await prisma.cart_item.update({
            where: { id },
            data: { quantity }
        })
        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
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
        const id = searchParams.get('id')

        const item = await prisma.cart_item.findFirst({
            where: { id: Number(id), userId: user.id }
        })

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 })
        }

        await prisma.cart_item.delete({ where: { id: Number(id) } })
        return NextResponse.json({ deleted: true })
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}