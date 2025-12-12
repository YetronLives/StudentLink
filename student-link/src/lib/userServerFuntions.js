import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import {ddbDocClient} from "@/lib/dynamodb.js";


async function getUserByEmail(email) {
    const result = await ddbDocClient.send(
        new ScanCommand({
            TableName: "User",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: { ":email": String(email).trim() },
            ConsistentRead: true,
        })
    );
    return result.Items?.[0] || null;
}


export async function validateUserCredentials(email, password) {
    console.log("🔍 Validating user:", email);

    // 1️⃣ Retrieve user
    const user = await getUserByEmail(email);

    if (!user) {
        console.error("No user found for", email);
        return null;
    }


    // 2️⃣ Validate password
    const storedHash = user.password;
    console.log("🧩 Stored hash:", storedHash);
    const isValid = await bcrypt.compare(password, storedHash);
    console.log("🔐 Password valid:", isValid);

    if (!isValid) {
        console.error("Invalid password for:", email);
        return null;
    }

    // 3️⃣ Return NextAuth-compatible user object
    return {
        id: user.user_id,
        email: user.email,
        username: user.username,
        name: user.name,
        school: user.school,
        major: user.major,
        year: user.year,
        avatarUrl: user.avatarUrl,
    };
}




export async function fetchUserByEmailSSO(email) {
    const user = await getUserByEmail(email);
    if (!user) return null;
    return {
        id: user.user_id,
        email: user.email,
        username: user.username,
        name: user.name,
        school: user.school,
        major: user.major,
        year: user.year,
        avatarUrl: user.avatarUrl,
    };
}