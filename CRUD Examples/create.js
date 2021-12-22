// index.js

const { create } = require("./database.js");

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);

  const result = await create(data);

  const status = result.includes("SUCCESS") ? 200 : 400;

  const responseBody = {
    message: result,
    payload: "",
  };

  const response = {
    statusCode: status,
    body: JSON.stringify(responseBody),
  };

  return response;
};

// database.js

const { v4: uuidv4 } = require("uuid");

const AWS = require("aws-sdk");

AWS.config.update({ region: "ca-central-1" });

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

async function create(data) {
  const params = {
    TableName: "MyTable",
    Item: {
      id: {
        S: uuidv4(),
      },
      name: {
        S: data.name,
      },
      age: {
        N: data.age.toString(),
      },
      isActive: {
        BOOL: true,
      },
    },
  };

  try {
    await ddb.putItem(params).promise();
  } catch (err) {
    console.log("Failed to create record", err);
    return "ERROR: Failed to create record";
  }

  return "SUCCESS: Record created";
}

module.exports = { create };
