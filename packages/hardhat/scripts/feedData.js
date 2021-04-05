
const feedData = [
  {
    name: "Education Rate Feed",
    symbol: "ROFST",
    apiUrl: "https://sdmx.data.unicef.org/ws/public/sdmxapi/rest/data/UNESCO,UIS,1.0/USA.ROFST._T.._T._T....PCNT?format=sdmx-json",
    apiValueParseMap: "data.dataSets.0.series.0:0:0:0:0:0:0:0:0:0.observations.0.0",
    yearOffset: 1,
   
  },  
  {
      name: "Migration Data Feed",
      symbol: "MDF",
      apiUrl: "http://migration",
      apiValueParseMap: "0.data.value",
      yearOffset: 1,
    },
    {
      name: "Carbon Data Feed",
      symbol: "CDF",
      apiUrl: "http://migration",
      apiValueParseMap: "0.data.value",
      yearOffset: 1,
    },
    {
      name: "Education Data Feed",
      symbol: "EDF",
      apiUrl: "http://migration",
      apiValueParseMap: "0.data.value",
      yearOffset: 1,
    },
];

const fundData = [
  {
    name: 'Education Impact Fund',
    symbol: 'EIF',
    targetFeedId: 'ROFST',
    description: 'The Education Impact Fund features variable pricing based on the percentage of primary school age children out of school. All donations to the Education Impact Fund are transferred to UNICEF.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Unicef.png',
    rangeMin: 1000,
    rangeMax: 1000,
    attributes: [
      {
        trait_type: "Beneficiary Address",
        value: "0x09097097" // unicef address
      }
    ]
  },
  {
    name: 'Environmental Awareness Fund',
    symbol: 'EAF',
    targetFeedId: 'CDF',
    description: 'The Environmental Awareness Fund features variable pricing based on the carbon emissions of countries in the European Union. All donations to the Enbironmental Awareness Fund are transferred to the WWF.',
    image: 'https://1000logos.net/wp-content/uploads/2017/05/WWF-logo.png',
    rangeMin: 1000,
    rangeMax: 1000,
    attributes: [
      {
        trait_type: "Beneficiary Address",
        value: "0x09097097" // wwf address
      }
    ]
  },
]

module.exports = {
    'feedData': feedData,
    'fundData': fundData,
};