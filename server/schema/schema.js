const graphql = require("graphql");
const _ = require("lodash");
const db = require("../models");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

// ====Types====
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },
    caloricGoal: { type: GraphQLInt },
    allergies: {
      type: GraphQLList(AllergyType),
      resolve(parent, args) {
        return db.Allergy.findAll({
          where: { UserId: parent.id }
        });
      }
    }
  })
});

const AllergyType = new GraphQLObjectType({
  name: "Allergy",
  fields: () => ({
    id: { type: GraphQLID },
    allergyDesc: { type: GraphQLString },
    allergyApiCode: { type: GraphQLString },
    UserId: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        console.log(parent.id);
        return db.User.findOne({ where: { id: parent.UserId } });
      }
    }
  })
});

// ====RootQuery====
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return db.User.findOne({
          where: { id: args.id }
        });
      }
    },
    allergy: {
      type: AllergyType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return db.Allergy.findOne({
          where: { id: args.id }
        });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return db.User.findAll({});
      }
    },
    allergies: {
      type: new GraphQLList(AllergyType),
      resolve(parent, args) {
        return db.Allergy.findAll({});
      }
    }
  }
});

// ====Mutations====
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLID) },
        caloricGoal: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return db.User.create({
          firstName: args.firstName,
          lastName: args.lastName,
          age: args.age,
          caloricGoal: args.caloricGoal
        });
      }
    },
    associateAllergy: {
      type: AllergyType,
      args: {
        allergyDesc: { type: new GraphQLNonNull(GraphQLString) },
        allergyApiCode: { type: new GraphQLNonNull(GraphQLString) },
        UserId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return db.Allergy.create({
          allergyDesc: args.allergyDesc,
          allergyApiCode: args.allergyApiCode,
          UserId: args.userId
        });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
