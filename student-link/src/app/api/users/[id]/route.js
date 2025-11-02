import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/lib/dynamodb";
import { v4 as uuidv4 } from "uuid";

//Updating new user
export async function PUT(req) {
    const body = await req.json();
    const userId = uuidv4();

    const params = {
        TableName: "Users",
        Item: {
            user_id: userId,
            name: {body.firstname, body.lastName},
            username: body.username,
            email: body.email,
            password: body.password, // 🔒 hash in real app!
            school: body.school,
            major: body.major,
            library: body.library || [],
            created_at: new Date().toISOString(),
        },
    };

    await ddbDocClient.send(new PutCommand(params));

    return new Response(JSON.stringify({ userId }), { status: 201 });
}