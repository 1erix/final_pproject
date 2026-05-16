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

    const addresses = await prisma.address.findMany({
        where: { userId: user.id }
    })

    return NextResponse.json(addresses)
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

        const { street, home_number, office_number, floor } = await request.json()

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
    } catch (error) {
        console.error('POST /api/addresses error:', error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
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

        await prisma.address.delete({
            where: { id: Number(id) }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/addresses error:', error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}