// index.js

const { update } = require("./database.js");

exports.handler = async (event, context, callback) => {
  const { id } = event.queryStringParameters;
  const data = JSON.parse(event.body);

  const result = await update(id, data);

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

const AWS = require("aws-sdk");

AWS.config.update({ region: "ca-central-1" });

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

async function update(id, payload) {
  const params = {
    TableName: "MyTable",
    Key: {
      id: {
        S: id,
      },
    },
    UpdateExpression:
      "SET firstField = :firstField, secondField = :secondField, thirdField = :thirdField",
    ExpressionAttributeValues: {
      ":firstField": {
        S: payload.firstField,
      },
      ":secondField": {
        N: payload.secondField.toString(),
      },
      ":thirdField": {
        BOOL: true,
      },
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await ddb.updateItem(params).promise();
  } catch (err) {
    console.log("Failed to update record", err);
    return "ERROR: Failed to update record";
  }

  return "SUCCESS: Record updated";
}
