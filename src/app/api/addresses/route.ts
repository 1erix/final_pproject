import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    const user = await prisma.user.findFirst({
        where: { email: email || '' }
    })

    if (!user) {
        return NextResponse.json([])
    }

    const addresses = await prisma.address.findMany({
        where: { userId: user.id }
    })

    return NextResponse.json(addresses)
}

export async function POST(request: Request) {
    const { street, home_number, office_number, floor, email } = await request.json()

    const user = await prisma.user.findFirst({
        where: { email }
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const address = await prisma.address.create({
        data: {
            street,
            home_number: Number(home_number),
            office_number: office_number ? Number(office_number) : null,
            floor: floor ? Number(floor) : null,
            userId: user.id
        }
    })

    return NextResponse.json(address)
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    await prisma.address.delete({
        where: { id: Number(id) }
    })

    return NextResponse.json({ success: true })
}