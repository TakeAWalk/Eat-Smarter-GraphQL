"use strict";
module.exports = (sequelize, DataTypes) => {
  const Allergy = sequelize.define(
    "Allergy",
    {
      allergyDesc: DataTypes.STRING,
      allergyApiCode: DataTypes.STRING
    },
    {}
  );
  Allergy.associate = function(models) {
    // associations can be defined here
    Allergy.belongsTo(models.User, {
      allowNull: false
    });
  };
  return Allergy;
};
