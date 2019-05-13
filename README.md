# Flatware

(As in place settings.) This is a simple library to help you place settings. (eg, Configurations.)

We're trying to keep things simple. Therefore we're sticking with the idea of a one-level (flat) list of values, each of which has a unique name.

___flatware___ defines two kinds of objects - a ___spec___ (specification), and a ___conf___ (configuration).

## Contents
[spec](#spec)

[conf](#conf)

[Value Types](#Value Types)

[Constraints](#Constraints)

[Define a spec](#Define a spec)

[Templates](#Templates)

[Configurations](#Configurations)

[Validation] (#Validation)

[conf.adheresTo( spec )](#conf.adheresTo( spec ))

[conf.conformsWith( spec )](#conf.conformsWith( spec ))

[API](#API)

[flatware](#flatware)

[flatware.conf](#flatware.conf)

[flatware.conf.new](#flatware.conf.new() : conf)

[flatware.conf.fromJSON](#flatware.conf.fromObject( obj : Object ) : conf)

[flatware.conf.fromJSON](#flatware.conf.fromJSON( jsonText : JSONString ) : conf)

[flatware.conf.fromTemplate](#flatware.conf.fromTemplate( template : JSONString ) : conf)

[flatware.parseTemplate](#flatware.parseTemplate( template : JSONString ) : object)

[flatware.spec.fromObject](#flatware.spec.fromObject( obj : object ) : conf)

[flatware.spec.fromJSON](#flatware.spec.fromJSON( jsonText : JSONString ) : conf)

[flatware.spec.fromTemplate](#flatware.spec.fromTemplate( template : JSONString ) : spec)

[conf.adheresTo](#conf.adheresTo( spec : spec ) : confReport)

[conf.conformsWith](#conf.conformsWith( spec : spec ) : conf)

[conf.values.get](#conf.values.get( name : string ) : any)

[conf.values.list](#conf.values.list() : object)

[conf.values.remove](#conf.values.remove( name : string ) : void)

[conf.values.set](#conf.values.set( name : string, value : boolean | number | string | Date ) : void)

[spec.asObject](#spec.asObject() : specObject)

[spec.getTemplate](#spec.getTemplate() : string)

[spec.settings.define](#spec.settings.define( name : string, type : string ) : setting)

[spec.settings.fromObject](#spec.settings.fromObject( name : string, obj : object ) : setting)

[spec.settings.get](#spec.settings.get( settingName : string ) : setting)

[spec.settings.list](#spec.settings.list() : Array[ string ])

[spec.settings.remove](#spec.settings.remove( settingName : string ) : void)

[setting.asObject](#setting.asObject() : object)

[setting.desc](#setting.desc)

[setting.getConstraint](#setting.getConstraint( constraint : string ) : constraint)

[setting.listConstraints](#setting.listConstraints() : object)

[setting.name](#setting.name)

[setting.redefineType](#setting.redefineType( newType : string ) : setting)

[setting.rename](#setting.rename( newName : string ) : setting)

[setting.type](#setting.type)

## spec
#### Specification

It defines the values you are expecting to get. You can use it to validate a ___conf___.

## conf
#### Configuration

A thin wrapper around a simple value map. But the point is that you can validate it against a ___spec___.

## Value Types

You can use these to define the values a ___spec___ will accept. For simplicity's sake, we're sticking to a very limited set of value types:

- _boolean :_ JavaScript's boolean type. ___true___ and ___false___ are the only values.
- _number :_ JavaScript's number type, based on the _IEEE 754 Floating-Point_ standard, similar to a type called _double_ in many languages. Can accurately express integer values from -9,007,199,254,740,991 to 9,007,199,254,740,991. Can express real numbers with notably less precision.
- _string :_ JavaScript's text type.
- _Date :_ JavaScript's Date type.

## Constraints

These are further limitations on what values a ___spec___ allows.

- _optionsList :_ You can define a list (Array) of acceptable values. The chosen value must be one of these. Applies to: ( _number_, _sting_, _Date_ )
- _upperBound :_ The greatest / highest / latest  value you will accept. (Inclusive.) Applies to: ( _number_, _Date_ )
- _lowerBound :_ The smallest / lowest / earliest value you will accept. (Inclusive.) Applies to: ( _number_, _Date_ )
- _pattern :_ A [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) defining a text pattern that values you accept must match. Applies to: ( _string_ )

## Define a spec

Our example defines an imaginary configuration for a video game called [Rescue](http://www.tomspreen.com/rescue.html) . (Tom Spreen's unlicensed _Star Trek: The Next Generation_ adventure for Apple computers in the mid 1990s.)

```javascript
const spec = flatware.spec.fromObject({
  includeCubeShip: {
    type: "boolean",
    desc: "Determines whether or not the Borg ship will be included as one of the enemies.",
  },
  enemies: {
    type: "number",
    desc: "The number of enemy ships to include on the map.",
    lowerBound: 3,
    upperBound: 30,
    optionsList: [
      3, 6, 9, 12, 15, 18, 21, 24, 27, 30
    ]
  },
  skillLevel: {
    type: "string",
    desc: "Defines the attack strategies that enemies will use.",
    optionsList: [
      "The Cadet's Game",
      "The Captain's Game",
      "The Admiral's Game"
    ]
  },
  userName: {
    type: "string",
    desc: "The name we will display on the scoreboard for high-scoring games. Must be a string of between one and seven characters, without any whitespace.",
    pattern: /[^\s]{1,7}/
  },
  gameStartTime: {
    type: "Date",
    desc: "The date on which the game's timer starts. Must be during the second half of the 24th century.",
    lowerBound: new Date( "2350-01-01 00:00:00.000Z" ),
    upperBound: new Date( "2399-12-31 23:59:59.999Z" )
  }
});
```

You don't have to include descriptions, but they are helpful. Especially if you choose to generate a template.

## Templates

Once you have a spec defined, you can use it to generate a template:

```javascript
spec.getTemplate();
```

The template is a JSON string, (eg, You can easily save it as a text file.), Each setting will have all of its defined properties, as well as a ___value___ property, which users can set to any value, in order to define a configuration.

Here is an example of what a fragment of the template that the example ___spec___ we gave above might include:

```json
{
  "skillLevel": {
    "type": "string",
    "desc": "Defines the attack strategies that enemies will use.",
    "optionsList": [
      "The Cadet's Game",
      "The Captain's Game",
      "The Admiral's Game"
    ],
    "value": null
  },

  ...
}
```

You can define either a ___conf___, or a ___spec___, (or both), using a valid template.

eg,

```javascript
let conf;
let spec;

fs.readFile( "./template.json", ( error, template ) => {
  if ( error )
    throw error;
  else {
    conf = flatware.conf.fromTemplate( template );
    spec = flatware.spec.fromTemplate( template );
  }
});
```

## Configurations

You can also define a ___conf___ using a simple object:

```javascript
const conf = flatware.conf.fromObject({
  includeCubeShip: true,
  enemies: 15,
  skillLevel: "The Captain's Game",
  userName: "Picard",
  gameStartTime: "2366-06-18 01:00:00.000Z"
});
```

Or from a JSON file:

```javascript
let conf;

fs.readFile( "./conf.json", ( error, confJSON ) => {
  if ( error )
    throw error;
  else
    conf = flatware.conf.fromJSON( confJSON );
});
```

## Validation

You can use a ___spec___ to validate a ___conf___ object.

These methods give you a detailed report on the differences between your ___conf___ and your ___spec___. But it will not throw any errors. You're free to determine how to use it.

### conf.adheresTo( spec )

___adheresTo___ requires the ___conf___ to exactly match the ___spec___. Any ___missing___, ___illegal___, or ___extra___ values will give a ___false result___.

```javascript
{
  result: false,
  missing: [ includeCubeShip ],
  illegal: { enemies: 1 },
  extra: { starbases: 9 },
  okay: {
    skillLevel: "The Captain's Game",
    gameStartTime: Tue Jun 05 2379 21:52:31 GMT (Greenwhich Mean Time)
  }
}
```

### conf.conformsWith( spec )

___conformsWith___ requires the ___conf___ to not contradict the ___spec___'s definition of any of the settings it uses. It only reports ___false___ in the case of a type or constraint violation. Missing and extra values are allowed.

```javascript
{
  result: true,
  missing: [ includeCubeShip ],
  illegal: {},
  extra: { starbases: 9 },
  okay: {
    enemies: 15,
    skillLevel: "The Captain's Game",
    gameStartTime: Tue Jun 05 2379 21:52:31 GMT (Greenwhich Mean Time)
  }
}
```

## API

There is also a full, programmatic application programming interface for defining specs and confs. We present it below.

### flatware

The parent object. The only thing you need to import. ALl fo the functionality springs from this namespace.

### flatware.conf

The conf interface. (See [below](### setting.desc).)

### flatware.conf.new() : conf

Create a new blank ___conf___ object.

### flatware.conf.fromObject( obj : Object ) : conf

Create a  ___conf___ object defined by an object representation.

    `obj`: Any key-value map, represented as a JavaScript object. If you want this to adhere to - or conform to - a spec, then the values should belong to ___flatware___'s legal value types. (See above.)

#### returns

A ___conf___ object.

### flatware.conf.fromJSON( jsonText : JSONString ) : conf

Create a ___conf___ object defined by a JSON representation. This should work in the same way as `flatware.conf.fromObject` without having parse the JSON representation of an object.

    `jsonText`: The valid JSON string defining the configuration.

#### returns

A ___conf___ object.

### flatware.conf.fromTemplate( template : JSONString ) : conf

Create a ___conf___ object defined by a template representation. This should work in the same way as `flatware.conf.fromObject`, except that it takes template JSON representations. It ignores the ___spec___ properties, and only uses the `value` property.

    `template`: The valid JSON string defining the template.

#### returns

A ___conf___ object.

### flatware.parseTemplate( template : JSONString ) : Object

Takes a valid template (see above) represented as a JSON string, and returns an object containing both the ___spec___ and the ___conf___ objects that the template defines.i (Available as `spec` and `conf` respectively.)

    `template`: The valid JSON string defining the template.

### flatware.spec

The ___spec___ interface. (See [below]( ### setting.desc ).)

### flatware.spec.new() : conf

Create a new blank ___spec___ object.

### flatware.spec.fromObject( obj : Object ) : conf

Create a  ___spec___ object defined by an object representation.

    `obj`: A JavaScript object where each key defines one or more settings, each of which contain the following properties:

    - __type__: _Required_ One of ( `boolean`, `number`, `string`, `Date` )
    - __desc__: _Optional_ The textual description of the setting's meaning.
    - __optionsList__: _Optional_ You can define a list (Array) of acceptable values. The chosen value must be one of these. Applies to: ( _number_, _sting_, _Date_ )
    - __upperBound__: _Optional_ The greatest / highest / latest  value you will accept. (Inclusive.) Applies to: ( _number_, _Date_ )
    - __lowerBound__: _Optional_ The smallest / lowest / earliest value you will accept. (Inclusive.) Applies to: ( _number_, _Date_ )
    - __pattern__: _Optional_ A [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) defining a text pattern that values you accept must match. Applies to: ( _string_ )

#### returns

A ___spec___ object.

### flatware.spec.fromJSON( jsonText : JSONString ) : conf

Create a ___spec___ object defined by a JSON representation. This should work in the same way as `flatware.spec.fromObject` without having to parse the JSON representation of an object.

    `jsonText`: The valid JSON string defining the specification.

#### returns

A ___spec___ object.

### flatware.spec.fromTemplate( template : JSONString ) : spec

Create a ___spec___ object defined by a template representation. This should work in the same way as `flatware.spec.fromObject`, except that it takes template JSON representations. It ignores the `value` property and just uses the values that define a ___spec___. (See above.)

    `template`: The valid JSON string defining the template.

#### returns

A ___spec___ object.

### conf.adheresTo( spec : spec ) : confReport

Does this configuration match the specification exactly? Takes a valid ___spec___ object and returns a ___confReport___ object detailing the matched properties and violations. (If any.) To obtain a simple boolean result, call `conf.adheresTo( spec ).result`.

#### returns

A ___confReport___ object, with the following model:

    - __result : boolean__ Whether or not the ___conf___ matches the ___spec___ exactly.
    - __missing : Array[ string ]__ Lists any property names from the ___spec___ which are not implemented in the ___conf___.
    - __extra : object__ Lists any properties found in the ___conf___ that are not defined in the ___spec___.
    - __illegal : object__ Lists any properties from the ___conf___ that do not adhere to the type or constraints defined for the same name in the ___spec___.
    - ___okay : object___ Lists all properties from the ___conf___ that match the type and constraints from the ___spec___ exactly.

Example:

```javascript
{
  result: false,
  missing: [ includeCubeShip ],
  illegal: { enemies: 1 },
  extra: { starbases: 9 },
  okay: {
    skillLevel: "The Captain's Game",
    gameStartTime: Tue Jun 05 2379 21:52:31 GMT (Greenwhich Mean Time)
  }
}
```

### conf.conformsWith( spec : spec ) : confReport

Of all of the properties this configuration defines, do the ones defined by the specification match it? Otherwise stated, this is like the method `conf.adheresTo( spec : spec ) : confReport`, except that it tolerates extra properties not defined by the specification, and missing properties that the specification defines, but the configuration does not implement. Takes a valid ___spec___ object and returns a ___confReport___ object detailing the matched properties and violations. (If any.) To obtain a simple boolean result, call `conf.conformsWith( spec ).result`.

#### returns

A ___confReport___ object, with the following model:

    - __result : boolean__ Whether or not the properties in this ___conf___ that are defined by the ___spec___ match the ___spec___'s type and constraints.
    - __missing : Array[ string ]__ Lists any property names from the ___spec___ which are not implemented in the ___conf___.
    - __extra : object__ Lists any properties found in the ___conf___ that are not defined in the ___spec___.
    - __illegal : object__ Lists any properties from the ___conf___ that do not adhere to the type or constraints defined for the same name in the ___spec___.
    - ___okay : object___ Lists all properties from the ___conf___ that match the type and constraints from the ___spec___ exactly.

Example:

```javascript
{
  result: true,
  missing: [ includeCubeShip ],
  illegal: {},
  extra: { starbases: 9 },
  okay: {
    enemies: 15,
    skillLevel: "The Captain's Game",
    gameStartTime: Tue Jun 05 2379 21:52:31 GMT (Greenwhich Mean Time)
  }
}
```

### conf.values.get( name : string ) : any

If ___name___ has been defined in this conf, returns the value associated with that name. Otherwise, it returns ___undefined___.

### conf.values.list() : object

Returns an object containing all of the names and values defined in this ___conf___ object.

### conf.values.remove( name : string ) : void

Deletes the named property (and its value) from the ___conf___ object.

### conf.values.set( name : string, value : boolean | number | string | Date ) : void

If the ___name___ does not already exist in the ___conf___, creates ___value___ you provide associated with the  ___name___. If the ___name___ already exists, it associates the  ___value___ you provide with it.

### spec.asObject() : specObject

Returns the object representation of the ___spec___.

Example:

```javascript
{
  includeCubeShip: {
    type: "boolean",
    desc: "Determines whether or not the Borg ship will be included as one of the enemies.",
  },
  enemies: {
    type: "number",
    desc: "The number of enemy ships to include on the map.",
    lowerBound: 3,
    upperBound: 30,
    optionsList: [
      3, 6, 9, 12, 15, 18, 21, 24, 27, 30
    ]
  },
  skillLevel: {
    type: "string",
    desc: "Defines the attack strategies that enemies will use.",
    optionsList: [
      "The Cadet's Game",
      "The Captain's Game",
      "The Admiral's Game"
    ]
  },
  userName: {
    type: "string",
    desc: "The name we will display on the scoreboard for high-scoring games. Must be a string of between one and seven characters, without any whitespace.",
    pattern: /[^\s]{1,7}/
  },
  gameStartTime: {
    type: "Date",
    desc: "The date on which the game's timer starts. Must be during the second half of the 24th century.",
    lowerBound: new Date( "2350-01-01 00:00:00.000Z" ),
    upperBound: new Date( "2399-12-31 23:59:59.999Z" )
  }
}

```

### spec.getTemplate() : string

Returns the object representation of the ___spec___, with an additional `value` property for each defined name. You can use this to produce a template file, which you can use as a self-documenting config file, instantiating a ___conf___ with `flatware.conf.fromTemplate( templateJSON )`, or even a ___spec___, with `flatware.spec.fromTemplate( templateJSON )`. (Or even both, using `flatware.parseTemplate( templateJSON )`.)

### spec.settings.define( name : string, type : string ) : setting

Creates a new ___setting___ within the spec, for the ___name___ you provide, and of the ___type___ you specifiy. The new setting has no description or constraints or yet. This method returns the ___setting___ object, so that you can begin to specify them immediately.

- __name__ A string of one of more non-whitespace characters.
- __type__ One of: `"boolean"`, `"number"`, `"string"`, or `"Date"`. (Throws an error if the type is an illegal value.)

#### returns

A ___setting___ object. (See [below]( ### setting.desc ).)

### spec.settings.fromObject( name : string, obj : object ) : setting

Accepts a name and an object defining (obligatorily) and (optionally) a description and a list of constraints. Returns the setting that the object defined.

- __name__ A string, consisting of at least one non-whitespace character, which will be the name of the defined setting.
- __obj__ An object defining the properties ___type___ (mandatory), ___desc___, and ___constraints___ (optional).

Example:

```javascript
{
  type: "number",
  desc: "The number of enemy ships to include on the map.",
  lowerBound: 3,
  upperBound: 30,
  optionsList: [
    3, 6, 9, 12, 15, 18, 21, 24, 27, 30
  ]
}
```

#### returns

A ___setting___ object. (See [below]( ### setting.desc ).)

### spec.settings.get( settingName : string ) : setting

Returns the ___setting___ identified by the ___settingName___ you provide, if it exists. Otherwise, throws an error.

#### returns

A ___setting___ object. (See [below]( ### setting.desc ).)

### spec.settings.list() : Array[ string ]

Returns an Array of the setting names defined by the ___spec___.

### spec.settings.remove( settingName : string ) : void

Deletes the setting with the name ___settingName___ from the ___spec___. (If it exists.)

### setting.asObject() : object

Get the object representation of the ___setting___.

#### returns

The object representation of a ___setting___.

Example:

```javascript
{
  type: "number",
  desc: "The number of enemy ships to include on the map.",
  lowerBound: 3,
  upperBound: 30,
  optionsList: [
    3, 6, 9, 12, 15, 18, 21, 24, 27, 30
  ]
}
```

### setting.desc

_Read-write property._ Gets or sets the description of this setting. Must be a string of at least three words.

### setting.getConstraint( constraint : string ) : constraint

Returns the definition of the ___constraint___ you specify.

#### returns

A constraint object.

- __optionsList__ ( _number_, _string_, _Date_ ) An array of values of the ___settting___'s type.
- __lowerBound__ ( _number_, _Date_ ) The minimum acceptable value for a number or Date.
- __upperBound__ ( _number_, _Date_ ) The maximum acceptable value for a number or Date.
- __pattern__ ( _string_ ) A regular expression (pattern) specifying acceptable string values.

### setting.listConstraints() : object

Returns an object, where the keys are the ___constraint___ names, and the values are the constraint definitions.

- __optionsList__ ( _number_, _string_, _Date_ ) An array of values of the ___settting___'s type.
- __lowerBound__ ( _number_, _Date_ ) The minimum acceptable value for a number or Date.
- __upperBound__ ( _number_, _Date_ ) The maximum acceptable value for a number or Date.
- __pattern__ ( _string_ ) A regular expression (pattern) specifying acceptable string values.

### setting.name

_Read-only property._ The name of the setting.

### setting.redefineType( newType : string ) : setting

Changes the type of an existing setting. Resets its description and constraints.

- _newType_ ( `"boolean"` | `"number"` | `"string"` | `"Date"` ) The type that this ___setting___ will now become.

#### returns

The new ___setting___. Remember, any existing ___desc___ and ___constraint___ information will be erased.

### setting.rename( newName : string ) : setting

Changes the name of this setting within its ___spec___.

- __newName__ A string consisting of a least one non-whitespace character.

#### returns

The ___spec___ object, as defined by its new name.

### setting.type

_Read-only property._ The type of the property.

