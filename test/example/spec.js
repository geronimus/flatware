const specObject  = {
  storageAdaptor: {
    type: "string",
    desc: "The name of the class to use for data storage",
    optionsList: [ "memoryStorage", "fileSystemStorage" ]
  },
  processTarget: {
    type: "number",
    desc: "The target number of processes for the system to maintain under auto-scaling",
    lowerBound: 1,
    upperBound: 6,
    optionsList: [ 1, 2, 3, 4, 5, 6 ]
  },
  clientOnly: {
    type: "boolean",
    desc: "Indicates whether this is a detached client instance"
  },
  dateMax: {
    type: "Date",
    desc: "The date value used to represent an as-yet-unknown date in the future",
    optionsList: [ new Date( 2147483647000 ), new Date( "9999-12-31T23:59:59.999Z" ) ]
  }
}

export { specObject };

