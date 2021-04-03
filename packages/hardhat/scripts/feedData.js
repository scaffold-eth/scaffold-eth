
const feedData = [
  {
    name: "Education Rate Feed",
    symbol: "ROFST",
    apiUrl: "https://sdmx.data.unicef.org/ws/public/sdmxapi/rest/data/UNESCO,UIS,1.0/USA.ROFST._T.._T._T....PCNT?format=sdmx-json",
    apiValueParseMap: "data.dataSets.0.series.0:0:0:0:0:0:0:0:0:0.observations.0.0",
    yearOffset: 1,
    rangeMin: 1000,
    rangeMax: 1000
  },  
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