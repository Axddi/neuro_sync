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

    console.log("RAW PATH:", rawPath);
    console.log("NORMALIZED PATH:", path);

    const claims = event?.requestContext?.authorizer?.jwt?.claims || {};
    let groups = [];
    const rawGroups =
      claims["cognito:groups"] || claims["groups"] || [];

    if (Array.isArray(rawGroups)) {
      groups = rawGroups;
    } else if (typeof rawGroups === "string") {
      if (rawGroups.startsWith("[") && rawGroups.endsWith("]")) {
        groups = rawGroups
          .slice(1, -1)
          .split(",")
          .map((g) => g.trim());
      } else {
        groups = [rawGroups];
      }
    }

    console.log("GROUPS:", groups);

    const user = claims.sub || "anonymous";

    let body = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch {
        return corsResponse(400, { error: "Invalid JSON body" });
      }
    }

    }

    if (method === "GET" && path === "/") {
      return corsResponse(200, {
        message: "NeuroSync API running 🚀",
        user,
        groups,
      });
    }

    if (method === "POST" && path === "/patients") {
      if (!body.id || !body.name) {
        return corsResponse(400, { error: "id and name required" });
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

      return corsResponse(200, item);
    }

    if (method === "GET" && path === "/patients") {
      const data = await dynamo.scan({
        TableName: TABLE_NAME,
      }).promise();

      return corsResponse(200, {
        count: data.Items.length,
        patients: data.Items,
      });
    }

    if (method === "POST" && path === "/reminder") {
      if (!groups.includes("caregiver")) {
        return corsResponse(403, {
          error: "Only caregivers can send reminders",
        });
      }

      await sns.publish({
        TopicArn: SNS_TOPIC_ARN,
        Message: `Reminder from NeuroSync for user ${user} 💊`,
      }).promise();

      return corsResponse(200, { message: "Reminder sent 🚀" });
    }

if (method === "POST" && path === "/logs") {
if (!body.mood) {
  return corsResponse(400, { error: "mood required" });
}

  const item = {
    PK: `USER#${user}`,
    SK: `LOG#${Date.now()}`,
    type: body.type || "mood",
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

  return corsResponse(200, {
    count: data.Items.length,
    logs: data.Items,
  });
}

    return corsResponse(404, {
      message: "Route not found",
      method,
      path,
    });

  } catch (err) {
    console.error("ERROR:", err);
    return corsResponse(500, {
      error: err.message,
    });
  }
};

function corsResponse(status, body) {
  return {
    statusCode: status,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    },
    body: JSON.stringify(body),
  };
}