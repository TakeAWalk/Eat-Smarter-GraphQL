const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const app = express();
const db = require("./models");

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("now listening for request on port 3000");
  });
});
