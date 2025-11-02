// scripts/createUsersTable.js
// src/app/scripts/createUsersTable.js
//This is creating the local database
import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: "fakeMyKeyId",
        secretAccessKey: "fakeSecretAccessKey",
    },
});

const command = new CreateTableCommand({
    TableName: "Users",
    AttributeDefinitions: [
        { AttributeName: "UserId", AttributeType: "S" },
    ],
    KeySchema: [
        { AttributeName: "UserId", KeyType: "HASH" }, // Partition key
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
});

try {
    const response = await client.send(command);
    console.log("Table created:", response);
} catch (err) {
    console.error("Error creating table:", err);
}
