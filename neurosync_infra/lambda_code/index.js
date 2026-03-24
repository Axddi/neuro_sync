const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
    try {
        console.log("EVENT:", JSON.stringify(event));

        const method =
          event.requestContext?.http?.method || event.httpMethod;

        let path = event.rawPath || event.path;
        if (path.startsWith("/dev")) {
            path = path.replace("/dev", "");
        }

        // ✅ SAFE BODY PARSE (ONLY HERE)
        const body = typeof event.body === "string"
          ? JSON.parse(event.body)
          : event.body || {};

        // ROUTES
        if (method === "POST" && path === "/patients") {
            return await createPatient(body);
        }

        if (method === "POST" && path === "/logs") {
            return await createLog(body);
        }

        if (method === "GET" && path === "/logs") {
            return await getLogs(event);
        }

        return response(404, { message: "Route not found" });

    } catch (error) {
        console.error("ERROR:", error);
        return response(500, { error: error.message });
    }
};

// ---------------- PATIENT ----------------

const createPatient = async (body) => {
    const item = {
        PK: `PATIENT#${body.id}`,
        SK: "META",
        name: body.name,
        age: body.age,
        createdAt: new Date().toISOString()
    };

    await dynamo.put({
        TableName: TABLE_NAME,
        Item: item
    }).promise();

    return response(200, item);
};

// ---------------- LOGS ----------------

const createLog = async (body) => {
    const item = {
        PK: `PATIENT#${body.patientId}`,
        SK: `LOG#${Date.now()}`,
        mood: body.mood,
        note: body.note,
        createdAt: new Date().toISOString()
    };

    await dynamo.put({
        TableName: TABLE_NAME,
        Item: item
    }).promise();

    return response(200, item);
};

const getLogs = async (event) => {
    const patientId = event.queryStringParameters?.patientId;

    const result = await dynamo.query({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
            ":pk": `PATIENT#${patientId}`,
            ":sk": "LOG#"
        }
    }).promise();

    return response(200, result.Items);
};

// ---------------- HELPER ----------------

const response = (status, body) => ({
    statusCode: status,
    body: JSON.stringify(body),
});``