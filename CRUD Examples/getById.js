// index.js

const { getById } = require("./database.js");

exports.handler = async (event, context, callback) => {
  const { id } = event.queryStringParameters;

  const { result, payload } = await getById(id);

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

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

async function getById(id) {
  const params = {
    TableName: "MyTable",
    Key: {
      id: {
        S: id,
      },
    },
  };

  try {
    const result = await ddb.getItem(params).promise();

    const data = {
      name: result.Item.name.S,
      age: Number(result.Item.age.N),
      isActive: result.Item.isActive.BOOL,
    };

    return {
      result: "SUCCESS: Retrieving record",
      payload: data,
    };
  } catch (err) {
    console.log("Failed to retrieve record", err);
    return {
      result: "ERROR: Failed to retrieve record",
      payload: "",
    };
  }
}

module.exports = { getById };
