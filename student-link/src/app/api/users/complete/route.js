// app/api/users/complete/route.ts
import { PutCommand } from "@aws-sdk/lib-dynamodb"
import { ddbDocClient } from "@/lib/dynamodb"
import { v4 as uuidv4 } from "uuid"

export async function POST(req) {
    const body = await req.json()
    const { email, username, school, major } = body
    const userId = uuidv4()

    const params = {
        TableName: "Users",
        Item: {
            UserId: userId,
            Email: email,
            Username: username,
            School: school,
            Major: major,
            Courses: [],
            CreationDate: new Date().toISOString(),
        },
    }

    await ddbDocClient.send(new PutCommand(params))
    return new Response("User completed", { status: 201 })
}
