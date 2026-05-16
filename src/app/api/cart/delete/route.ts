import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient()

export async function DELETE() {
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

        await prisma.cart_item.deleteMany({
            where: { userId: user.id }
        })

        return NextResponse.json({ cleared: true })
    } catch (error) {
        console.error('DELETE error:', error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}