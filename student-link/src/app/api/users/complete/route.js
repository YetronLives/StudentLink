// app/api/users/complete/route.ts
import { PutCommand } from "@aws-sdk/lib-dynamodb"
import { ddbDocClient } from "@/lib/dynamodb"
import { v4 as uuidv4 } from "uuid"

export async function POST(req) {
    const body = await req.json();
    const { firstName, lastName, email, username, school, major, year } = body;
    const userId = uuidv4();

    const params = {
        TableName: "User",
        Item: {
            user_id: userId,
            email: email,
            username: username,
            school: school,
            name: `${firstName} ${lastName}`,
            major: major,
            year: year,
            library: [],
            created_at: new Date().toISOString(),
        },
    };

    await ddbDocClient.send(new PutCommand(params));
    return new Response("User completed", { status: 201 });
}
