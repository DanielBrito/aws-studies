// index.js

const { remove } = require("./database.js");

exports.handler = async (event, context, callback) => {
  const { id } = event.queryStringParameters;

  const result = await remove(id);

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

async function remove(id) {
  const params = {
    TableName: "MyTable",
    Key: {
      id: {
        S: id,
      },
    },
  };

  try {
    await ddb.deleteItem(params).promise();
  } catch (err) {
    console.log("Failed to delete record", err);
    return "ERROR: Failed to delete record";
  }

  return "SUCCESS: Record deleted";
}

module.exports = { remove };
