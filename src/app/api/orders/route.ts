import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"

const prisma = new PrismaClient()

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

        const orderData = await request.json()
        console.log('Order data received:', orderData)

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                items: JSON.stringify(orderData.items),
                totalPrice: orderData.totalPrice,
                status: orderData.status || 'Подтверждён'
            }
        })

        return NextResponse.json({ success: true, orderId: order.id })
    } catch (error) {
        console.error('Order creation error:', error)
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const orderId = searchParams.get('orderId')

        if (!orderId) {
            return NextResponse.json({ error: "Order ID required" }, { status: 400 })
        }

        const order = await prisma.order.findFirst({
            where: { id: parseInt(orderId) }
        })

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        const parsedOrder = {
            ...order,
            items: JSON.parse(order.items)
        }

        return NextResponse.json(parsedOrder)
    } catch (error) {
        console.error('Order fetch error:', error)
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
    }
}