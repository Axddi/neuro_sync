const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const TABLE_NAME = process.env.TABLE_NAME;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

exports.handler = async (event) => {
  try {
    console.log("EVENT:", JSON.stringify(event));

    const method = event?.requestContext?.http?.method || "";
    let path = event?.requestContext?.http?.path || "";
    path = path.replace(/^\/[a-zA-Z0-9_-]+/, "");

    console.log("METHOD:", method, "PATH:", path);
    const claims = event?.requestContext?.authorizer?.jwt?.claims || {};

    let groups =
      claims["cognito:groups"] ||
      claims["groups"] ||
      [];

    if (typeof groups === "string") {
      groups = [groups];
    }

    const user = claims.sub || "anonymous";
    let body = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch {
        return response(400, { error: "Invalid JSON body" });
      }
    }

    if (method === "POST" && path === "/auth/login") {
      try {
        const { email, password } = body;

        if (!email || !password) {
          return response(400, { error: "Email and password required" });
        }

        return response(200, {
          token: "dummy-token",
          user: {
            email,
            role: "caregiver",
          },
        });

      } catch (err) {
        console.error("LOGIN ERROR:", err);
        return response(500, { error: "Login failed" });
      }
    }

    if (method === "GET" && path === "/") {
      return response(200, {
        message: "NeuroSync API running 🚀",
        user,
        groups,
      });
    }

    if (method === "POST" && path === "/patients") {
      if (!body.id || !body.name) {
        return response(400, { error: "id and name required" });
      }

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

    if (method === "GET" && path === "/patients") {
      const data = await dynamo.scan({
        TableName: TABLE_NAME,
      }).promise();

      return response(200, {
        count: data.Items.length,
        patients: data.Items,
      });
    }

    if (method === "POST" && path === "/reminder") {
      if (!groups.includes("caregiver")) {
        return response(403, {
          error: "Only caregivers can send reminders",
        });
      }

      if (!SNS_TOPIC_ARN) {
        return response(500, { error: "SNS_TOPIC_ARN missing" });
      }

      await sns.publish({
        TopicArn: SNS_TOPIC_ARN,
        Message: `Reminder from NeuroSync for user ${user} 💊`,
      }).promise();

      return response(200, { message: "Reminder sent 🚀" });
    }

    return response(404, {
      message: "Route not found",
      method,
      path,
    });

  } catch (err) {
    console.error("ERROR:", err);
    return response(500, {
      error: err.message,
    });
  }
};

function response(status, body) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
    body: JSON.stringify(body),
  };
}