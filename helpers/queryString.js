// The purpose of this f() is to assist in creating a query string
// The type of query can be set to change the the context of the query
// later on in the req/res lifecylce

const querystring = require("querystring");

module.exports = (type, postId) => {
  const acceptedTypes = ["updated", "created", "deleted"];

  const selectedType = acceptedTypes.find(element => {
    return element === type;
  });
  if (!selectedType)
    throw new Error('You did not provide a correct "type" of change');

  const theType = { typeOfQuery: selectedType };

  if (postId) {
    return querystring.stringify({
      postUrl: `post/${postId.toString()}`,
      [theType.typeOfQuery]: true
    });
  } else {
    return querystring.stringify({
      [theType.typeOfQuery]: true
    });
  }
};
