
const feedData = [
    {
      name: "Migration Data Feed",
      symbol: "MDF",
      apiUrl: "http://migration",
      apiValueParseMap: "0.data.value",
      yearOffset: 1,
      rangeMin: 1000,
      rangeMax: 1000
    },
    {
      name: "Carbon Data Feed",
      symbol: "CDF",
      apiUrl: "http://migration",
      apiValueParseMap: "0.data.value",
      yearOffset: 1,
      rangeMin: 1000,
      rangeMax: 1000
    },
    {
      name: "Education Data Feed",
      symbol: "EDF",
      apiUrl: "http://migration",
      apiValueParseMap: "0.data.value",
      yearOffset: 1,
      rangeMin: 1000,
      rangeMax: 1000
    },
]

module.exports = {
    'feedData': feedData
};