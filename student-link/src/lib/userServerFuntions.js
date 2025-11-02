import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import {ddbDocClient} from "@/lib/dynamodb.js";


async function getUserByEmail(email) {
    const result = await ddbDocClient.send(
        new ScanCommand({
            TableName: "Users",
            FilterExpression: "Email = :email",
            ExpressionAttributeValues: { ":email": String(email).trim() },
            Limit: 1,
        })
    );
    return result.Items?.[0] || null;
}


export async function validateUserCredentials(email, password) {
    console.log("🔍 Validating user:", email);

    // 1️⃣ Retrieve user
    const scanCommand = new ScanCommand({
        TableName: "Users",
        FilterExpression: "Email = :email",
        ExpressionAttributeValues: { ":email": email.trim() },
        Limit: 1,
    });

    const result = await ddbDocClient.send(scanCommand);
    const user = result.Items?.[0];
    console.log("✅ User from DB:", user);

    if (!user) {
        console.error("❌ No user found for", email);
        return null;
    }

    // 2️⃣ Validate password
    const storedHash = user.PasswordHash || user.password;
    console.log("🧩 Stored hash:", storedHash);
    const isValid = await bcrypt.compare(password, storedHash);
    console.log("🔐 Password valid:", isValid);

    if (!isValid) {
        console.error("❌ Invalid password for:", email);
        return null;
    }

    // 3️⃣ Return NextAuth-compatible user object
    return {
        id: user.UserId,
        email: user.Email,
        username: user.Username,
        firstName: user.FirstName,
        lastName: user.LastName,
        school: user.School,
        major: user.Major,
    };
}




export async function fetchUserByEmailSSO(email) {
    const user = await getUserByEmail(email);
    if (!user) return null;
    return {
        id: user.UserId,
        email: user.Email,
        username: user.Username,
        firstName: user.FirstName,
        lastName: user.LastName,
        school: user.School,
        major: user.Major,
    };
}