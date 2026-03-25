const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    console.log("FULL EVENT:", JSON.stringify(event));

    const method = event.requestContext.http.method;
    let path = event.rawPath;

    // 🔥 Normalize path
    path = path.replace(/^\/dev/, "");

    const user =
      event.requestContext?.authorizer?.jwt?.claims?.sub || "anonymous";

    let body = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        return response(400, { error: "Invalid JSON body" });
      }
    }

    // ============================
    // CREATE PATIENT
    // ============================
    if (method === "POST" && path === "/patients") {
      const item = {
        PK: `PATIENT#${body.id}`,
        SK: "META",
        name: body.name,
        createdAt: new Date().toISOString(),
        createdBy: user,
      };

      await dynamo.put({
        TableName: TABLE_NAME,
        Item: item,
      }).promise();

      return response(200, item);
    }

    // ============================
    // SEND REMINDER (SNS 🔥)
    // ============================
    if (method === "POST" && path === "/reminder") {
      await sns.publish({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Message: `Reminder for user ${user}: Take medication 💊`,
      }).promise();

      return response(200, { message: "Reminder sent 🚀" });
    }

    // ============================
    // HEALTH CHECK
    // ============================
    if (method === "GET" && path === "/") {
      return response(200, {
        message: "NeuroSync API running 🚀",
      });
    }

    return response(404, { message: "Route not found", method, path });

  } catch (error) {
    console.error(error);
    return response(500, { error: error.message });
  }
};

function response(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}