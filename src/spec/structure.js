const setting = [
  "type",
  "desc",
  "constraints"
];

const constraintsByType = {
  "boolean": [],
  "number": [
    "lowerBound",
    "upperBound",
    "optionsList"
  ],
  "string": [
    "pattern",
    "optionsList"
  ],
  "Date": [
    "lowerBound",
    "upperBound",
    "optionsList"
  ]
};

const types = Object.keys( constraintsByType );

const propertiesByType = types.reduce(
  ( obj, type ) => {
    obj[ type ] = setting
      .filter( prop => prop !== "constraints" )
      .concat( constraintsByType[ type ] );
    return obj;
  },
  {}
);

export {
  setting,
  types,
  constraintsByType,
  propertiesByType
};

