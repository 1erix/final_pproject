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
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            name: user.name || '',
            surname: user.surname || '',
            phone: user.phone || '',
            email: user.email || ''
        })
    } catch (error) {
        console.error('GET /api/user error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const { name, surname, phone, email } = await request.json()

        console.log('Updating user:', { name, surname, phone, email })

        const user = await prisma.user.findFirst({
            where: { email: email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name: name || '',
                surname: surname || '',
                phone: phone || ''
            }
        })

        console.log('User updated:', updatedUser)

        return NextResponse.json({
            success: true,
            user: {
                name: updatedUser.name,
                surname: updatedUser.surname,
                phone: updatedUser.phone,
                email: updatedUser.email
            }
        })
    } catch (error) {
        console.error('PUT /api/user error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}