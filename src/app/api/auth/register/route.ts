import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const { name, surname, phone, email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email и пароль обязательны" },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findFirst({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "Пользователь с такой электронной почтой уже существует" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name: name || "",
                surname: surname || "",
                phone: phone || "",
                email,
                password: hashedPassword,
            }
        })

        return NextResponse.json(
            { message: "Регистрация успешна", userId: user.id },
            { status: 201 }
        )
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { message: "Внутренняя ошибка сервера" },
            { status: 500 }
        )
    }
}