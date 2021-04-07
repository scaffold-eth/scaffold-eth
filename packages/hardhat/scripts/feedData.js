
const feedData = [
  {
    name: "Primary Education Rate Feed",
    symbol: "ROFST",
    description: "The ROFST feed tracks the out-of-school rate for children of primary school age. The dataset is provided by UNICEF.",
    apiUrl: "https://sdmx.data.unicef.org/ws/public/sdmxapi/rest/data/UNESCO,UIS,1.0/USA.ROFST._T.._T._T....PCNT?format=sdmx-json",
    apiValueParseMap: "data.dataSets.0.series.0:0:0:0:0:0:0:0:0:0.observations.0.0",
    yearOffset: 3,
    value: 1200
   
  },  
  {
      name: "Migration Data Feed",
      symbol: "MDF",
      description: "The MDF feed tracks the out-of-school rate for children of primary school age. The dataset is provided by UNICEF.",
      apiUrl: "http://migration",
      apiValueParseMap: "0.data.value",
      yearOffset: 1,
      value: 1400
  },
  {
      name: "Carbon Data Feed",
      symbol: "CDF",
      description: "The CDF feed tracks the out-of-school rate for children of primary school age. The dataset is provided by UNICEF.",
      apiUrl: "http://migration",
      apiValueParseMap: "0.data.value",
      yearOffset: 1,
      value: 1500
    },
];

const fundData = [
  {
    name: 'Education Impact Fund',
    symbol: 'EIF',
    targetFeedId: 'ROFST',
    description: 'The Education Impact Fund features variable pricing based on the percentage of primary school age children out of school. All donations to the Education Impact Fund are transferred to UNICEF.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Unicef.png',
    rangeMin: 5,
    rangeMax: 20,
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
    rangeMin: 5,
    rangeMax: 20,
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