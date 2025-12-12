import { PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/lib/dynamodb";
import { v4 as uuidv4 } from "uuid";

// Get user by ID
export async function GET(req, { params }) {
    try {
        const { id: userId } = await params;
        
        const getParams = {
            TableName: "User",
            Key: {
                user_id: userId
            }
        };
        
        const result = await ddbDocClient.send(new GetCommand(getParams));
        
        if (!result.Item) {
            return new Response(JSON.stringify({ error: "User not found" }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Remove sensitive data
        const { password, ...userWithoutPassword } = result.Item;
        
        return new Response(JSON.stringify(userWithoutPassword), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error getting user:", error);
        return new Response(JSON.stringify({ error: "Failed to get user" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Update user profile
export async function PATCH(req, { params }) {
    try {
        const { id: userId } = await params;
        const body = await req.json();
        
        // Build update expression dynamically
        const updateExpressions = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
        
        // Handle different fields that can be updated
        if (body.name !== undefined) {
            updateExpressions.push("#name = :name");
            expressionAttributeNames["#name"] = "name";
            expressionAttributeValues[":name"] = body.name;
        }
        
        if (body.username !== undefined) {
            updateExpressions.push("username = :username");
            expressionAttributeValues[":username"] = body.username;
        }
        
        if (body.school !== undefined) {
            updateExpressions.push("school = :school");
            expressionAttributeValues[":school"] = body.school;
        }
        
        if (body.major !== undefined) {
            updateExpressions.push("major = :major");
            expressionAttributeValues[":major"] = body.major;
        }
        
        if (body.year !== undefined) {
            updateExpressions.push("#year = :year");
            expressionAttributeNames["#year"] = "year";
            expressionAttributeValues[":year"] = body.year;
        }
        
        if (body.avatarUrl !== undefined) {
            updateExpressions.push("avatarUrl = :avatarUrl");
            expressionAttributeValues[":avatarUrl"] = body.avatarUrl;
        }
        
        // Add updated timestamp
        updateExpressions.push("updated_at = :updated_at");
        expressionAttributeValues[":updated_at"] = new Date().toISOString();
        
        if (updateExpressions.length === 1) { // Only updated_at
            return new Response(JSON.stringify({ error: "No fields to update" }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const updateParams = {
            TableName: "User",
            Key: {
                user_id: userId
            },
            UpdateExpression: `SET ${updateExpressions.join(", ")}`,
            ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW"
        };
        
        const result = await ddbDocClient.send(new UpdateCommand(updateParams));
        
        // Remove sensitive data
        const { password, ...userWithoutPassword } = result.Attributes;
        
        return new Response(JSON.stringify({
            message: "User updated successfully",
            user: userWithoutPassword
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ 
            error: "Failed to update user",
            details: error.message 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Create new user (keeping existing functionality)
export async function PUT(req) {
    const body = await req.json();
    const userId = uuidv4();

    const params = {
        TableName: "User",
        Item: {
            user_id: userId,
            name: `${body.firstName} ${body.lastName}`,
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