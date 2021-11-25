// index.js

const { getAllCondition } = require("database.js");

exports.handler = async (event, context, callback) => {
  const { result, payload } = await getAllCondition();

  const status = result.includes("SUCCESS") ? 200 : 400;

  const responseBody = {
    message: result,
    payload: payload,
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

const docClient = new AWS.DynamoDB.DocumentClient();

async function getAllCondition() {
  const params = {
    TableName: "MyTable",
    FilterExpression: "#field = :field",
    ExpressionAttributeNames: {
      "#field": "field",
    },
    ExpressionAttributeValues: {
      ":field": "Finished",
    },
  };

  let resultItems = [];
  let items;

  try {
    do {
      items = await docClient.scan(params).promise();
      items.Items.forEach((item) => resultItems.push(item));
      params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");
  } catch (err) {
    console.log("Failed to retrieve records", err);
    return "ERROR: Failed to retrieve records";
  }

  return {
    result: "SUCCESS: Retrieving records",
    payload: resultItems,
  };
}

module.exports = { getAllCondition };
