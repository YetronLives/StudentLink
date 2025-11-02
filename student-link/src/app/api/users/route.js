// app/api/users/route.ts
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import {ddbDocClient} from "@/lib/dynamodb.js";
import bcrypt from "bcryptjs";

export async function POST(req) {
    const body = await req.json();
    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(body.password, 10);

    const params = {
        TableName: "Users",
        Item: {
            UserId: userId,
            FirstName: body.firstName,
            LastName: body.lastName,
            Username: body.username,
            Email: body.email,
            PasswordHash: passwordHash, // 🔒 hash in real app!
            School: body.school,
            Major: body.major,
            Courses: body.courses || [],
            CreationDate: new Date().toISOString(),
        },
    };

    await ddbDocClient.send(new PutCommand(params));

    return new Response(JSON.stringify({ userId }), { status: 201 });
}

