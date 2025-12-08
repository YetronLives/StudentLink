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
        TableName: "User",
        Item: {
            user_id: userId,
            name: `${body.firstName} ${body.lastName}`,
            username: body.username,
            email: body.email,
            password: passwordHash,
            school: body.school,
            major: body.major,
            library: [],
            year: body.year,
            created_at: new Date().toISOString(),
        },
    };

    await ddbDocClient.send(new PutCommand(params));

    return new Response(JSON.stringify({ userId }), { status: 201 });
}

