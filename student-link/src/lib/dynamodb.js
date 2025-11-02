// lib/dynamodb.js
//This is to connect to the db
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: "http://localhost:8000", // local DynamoDB endpoint
    credentials: {
        accessKeyId: "fakeMyKeyId",           // can be any string
        secretAccessKey: "fakeSecretAccessKey" // can be any string
    },
});

export const ddbDocClient = DynamoDBDocumentClient.from(client);


/*
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Document client makes it easier to work with JSON
export const ddbDocClient = DynamoDBDocumentClient.from(client);*/
