const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    console.log("FULL EVENT:", JSON.stringify(event));

    const method = event.requestContext.http.method;
    let path = event.rawPath;

    // 🔥 Normalize path (remove stage)
    path = path.replace(/^\/dev/, "");

    console.log("METHOD:", method);
    console.log("PATH:", path);

    // 🔐 Get user from JWT (Cognito)
    const user =
      event.requestContext?.authorizer?.jwt?.claims?.sub || "anonymous";

    console.log("USER:", user);

    // ===== SAFE BODY PARSE =====
    let body = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        return response(400, { error: "Invalid JSON body" });
      }
    }

    // ============================
    // ===== CREATE PATIENT =======
    // ============================
    if (method === "POST" && path === "/patients") {
      if (!body.id || !body.name) {
        return response(400, { error: "Missing required fields" });
      }

      const item = {
        PK: `PATIENT#${body.id}`,
        SK: "META",
        name: body.name,
        age: body.age || null,
        createdAt: new Date().toISOString(),
        createdBy: user,
      };

      await dynamo
        .put({
          TableName: TABLE_NAME,
          Item: item,
        })
        .promise();

      return response(200, item);
    }

    // ============================
    // ===== GET PATIENTS =========
    // ============================
    if (method === "GET" && path === "/patients") {
      return response(200, {
        message: "GET patients working ✅",
        user: user,
      });
    }

    // ============================
    // ===== HEALTH CHECK =========
    // ============================
    if (method === "GET" && path === "/") {
      return response(200, {
        message: "NeuroSync API running 🚀",
      });
    }

    // ============================
    // ===== FALLBACK =============
    // ============================
    return response(404, {
      message: "Route not found",
      method,
      path,
    });

  } catch (error) {
    console.error("ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};

// ===== RESPONSE HELPER =====
function response(status, body) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}