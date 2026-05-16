import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get('email')

        const user = await prisma.user.findFirst({
            where: { email: email || '' }
        })

        if (!user) {
            return NextResponse.json([])
        }

        const payments = await prisma.payment.findMany({
            where: { userId: user.id }
        })

        return NextResponse.json(payments)
    } catch (error) {
        console.error('GET /api/payments error:', error)
        return NextResponse.json([])
    }
}

export async function POST(request: Request) {
    try {
        const { card_number, month, year, cvc, email } = await request.json()

        const user = await prisma.user.findFirst({
            where: { email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const payment = await prisma.payment.create({
            data: {
                card_number: String(card_number),
                month: String(month),
                year: String(year),
                cvc: String(cvc),
                userId: user.id
            }
        })

        return NextResponse.json(payment, { status: 201 })
    } catch (error) {
        console.error('POST /api/payments error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        await prisma.payment.delete({
            where: { id: Number(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/payments error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}