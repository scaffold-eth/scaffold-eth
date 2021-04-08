
const feedData = [
  {
    name: "Primary Education Rate Feed",
    symbol: "ROFST",
    description: "The ROFST feed tracks the out-of-school rate for children of primary school age. The dataset is provided by UNICEF.",
    apiUrl: "https://sdmx.data.unicef.org/ws/public/sdmxapi/rest/data/UNESCO,UIS,1.0/USA.ROFST._T.._T._T....PCNT?format=sdmx-json",
    apiValueParseMap: "data.dataSets.0.series.0:0:0:0:0:0:0:0:0:0.observations.0.0",
    yearOffset: 4,
    value: 1200
   
  },  
  {
      name: "Immunization Data Feed",
      symbol: "IDF",
      description: "The IDF feed tracks the percentage of surviving infants who received the third dose of hep B-containing vaccine in the East Asia and Pacific region. Data is provided by UNICEF and WHO.",
      apiUrl: "https://sdmx.data.unicef.org/ws/public/sdmxapi/rest/data/UNICEF,IMMUNISATION,1.0/UNICEF_EAP..HEPB3.?format=sdmx-json",
      apiValueParseMap: "data.dataSets.0.series.0:0:0:0.observations.0.0",
      yearOffset: 2,
      value: 100
  },
  {
      name: "Greenhouse Gas Emission Feed",
      symbol: "GGEF",
      description: "The GGEF feed tracks the greenhouse gas emissions in tonnes per capita in the EU. Data is provided by the European Environmental Agency (EEA)",
      apiUrl: "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/sdg_13_10/A.GHG_T_HAB.EU28?format=json",
      apiValueParseMap: "value.0",
      yearOffset: 3,
      value: 100
    },
];

const fundData = [
  {
    name: 'Education Impact Fund',
    symbol: 'EIF',
    targetFeedId: 'ROFST',
    description: 'The Education Impact Fund uses variable pricing based on the percentage of primary school age children out of school. All donations to the Education Impact Fund are transferred to UNICEF.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Unicef.png',
    rangeMin: 20,
    rangeMax: 5,
    attributes: [
      {
        trait_type: "Beneficiary Address",
        value: "0x09097097" // unicef address
      }
    ]
  },
  {
    name: 'Environmental Action Fund',
    symbol: 'EAF',
    targetFeedId: 'GGEF',
    description: 'The Environmental Action Fund uses variable pricing based on greenhouse gas emissions in the European Union. All donations to the Environmental Action Fund are transferred to the World Wide Fund for Nature.',
    image: 'https://1000logos.net/wp-content/uploads/2017/05/WWF-logo.png',
    rangeMin: 10,
    rangeMax: 5,
    attributes: [
      {
        trait_type: "Beneficiary Address",
        value: "0x09097097" // wwf address
      }
    ]
  },
  {
    name: 'Immunization Awareness Fund',
    symbol: 'IAF',
    targetFeedId: 'IDF',
    description: 'The Immunization Awareness Fund uses variable pricing based on the percentage of surviving infants who received the third dose of hep B-containing vaccine in the East Asia and Pacific region. All donations to the Immunization Awareness Fund are transferred to the WHO.',
    image: 'https://w7.pngwing.com/pngs/10/325/png-transparent-world-health-organization-computer-icons-business-organization-emblem-logo-innovation.png',
    rangeMin: 70,
    rangeMax: 100,
    attributes: [
      {
        trait_type: "Beneficiary Address",
        value: "0x09097097" // WHO address
      }
    ]
  },
  {
    name: 'Immunization Awareness Fund (UNICEF)',
    symbol: 'IAFU',
    targetFeedId: 'IDF',
    description: 'The Immunization Awareness Fund uses variable pricing based on the percentage of of surviving infants who received the third dose of hep B-containing vaccine in the East Asia and Pacific region. All donations to the Immunization Awareness Fund are transferred to UNICEF.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Unicef.png',
    rangeMin: 70,
    rangeMax: 100,
    attributes: [
      {
        trait_type: "Beneficiary Address",
        value: "0x09097097" // WHO address
      }
    ]
  },
]

module.exports = {
    'feedData': feedData,
    'fundData': fundData,
};