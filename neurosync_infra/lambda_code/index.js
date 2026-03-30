const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const TABLE_NAME = process.env.TABLE_NAME;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

exports.handler = async (event) => {
  const method =
    event?.requestContext?.http?.method ||
    event?.httpMethod ||
    "";

  if (method === "OPTIONS") {
    return corsResponse(200, {});
  }

  try {
    let rawPath = event?.rawPath || event?.requestContext?.http?.path || "";
    let path = rawPath.replace(/^\/dev/, "");

    console.log("PATH:", path);

    const claims = event?.requestContext?.authorizer?.jwt?.claims || {};
    const user = claims.sub || "anonymous";

    const groups = claims["cognito:groups"] || [];

    let body = {};
    if (event.body) {
      body = JSON.parse(event.body);
    }

    if (method === "GET" && path === "/") {
      return corsResponse(200, {
        message: "API running",
        user,
        groups,
      });
    }

    if (method === "POST" && path === "/logs") {
      if (!body.mood) {
        return corsResponse(400, { error: "mood required" });
      }

      const item = {
        PK: `USER#${user}`,
        SK: `LOG#${Date.now()}`,
        mood: body.mood,
        notes: body.notes || "",
        tags: body.tags || [],
        createdAt: new Date().toISOString(),
      };

      await dynamo.put({
        TableName: TABLE_NAME,
        Item: item,
      }).promise();

      return corsResponse(200, item);
    }

    if (method === "GET" && path === "/logs") {
      const data = await dynamo.query({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `USER#${user}`,
          ":sk": "LOG#",
        },
        ScanIndexForward: false,
      }).promise();

      return corsResponse(200, data.Items);
    }

    return corsResponse(404, { error: "Route not found" });

  } catch (err) {
    console.error(err);
    return corsResponse(500, { error: err.message });
  }
};

function corsResponse(status, body) {
  return {
    statusCode: status,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    },
    body: JSON.stringify(body),
  };
}