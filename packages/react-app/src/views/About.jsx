/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Typography, List, Card, Skeleton, Divider, Space, Row, Col, Image, Carousel } from "antd";
import { useQuery, gql } from '@apollo/client';
import Blockies from 'react-blockies'
import { useParams } from 'react-router-dom'
import { formatEther } from "@ethersproject/units";
import Paragraph from "antd/lib/skeleton/Paragraph";



const { Text, Title } = Typography

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZoneName : 'short' };



const ARTWORK_QUERY = gql`
  query ($artwork: String!) {
    artwork(id: $artwork) {
      id
      createdAt
      tokenId
      price
      revoked
      name
      desc
      artworkImageUrl
      artworkRevokedImageUrl
      
      artist {
        address
      }
      
      beneficiary {
        name
      }
    }
  }
`

const grid = {
  gutter: 16,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 4,
  xl: 6,
  xxl: 4,
}

const Subgraph = (props) => {
  return (
    <Row>
      <Col span={12} offset={6}>
        <br/><br/>
        
        <Row style={{textAlign: 'left'}} justify="center">
          <Col flex="1">
            <Title style={{'text-align': 'center'}} level={1}>🤝 About Good Tokens 🤝</Title>
          </Col>
        </Row>
        <br/>

        <Row className="full-width" style={{textAlign: 'left'}}>
        <h2 id="-inspiration">💭 Inspiration</h2>
        <br/>
        <p>As digital artists, we wanted to explore the potential of creating a more balanced model for art ownership, in which NFTs could be used to create positive impact, from addressing the environmental impact of crypto mining to encouraging engagement in targeted communities.</p>
        <p>Smart contracts make it possible to imbue assets with agency, an opportunity to make the work itself a continuous, evolving project.</p>
        <br/><br/>
        <h2 id="-concept">💡 Concept</h2>
        <p>Good Tokens is our radical new model for art ownership that guarantees works of art support causes artists care about.</p>
        <p>Rather than just a transactional asset that is bought once and held, Good Token NFTs require continuous contribution or engagement with a cause. This creates a long-lasting relationship between the artist, art, owner, and supported organizations.</p>
        <p>As one model to maintain ownership, buyers must accumulate Good Fund engagement tokens, the price of which track Good Data Feeds, oracles that index NGO real-world data.</p>
        <p><br/></p>
        <h2 id="youtube-video-here">👨‍🎨 Overview and Walkthrough</h2>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/HPe-l8ncYFY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
        <p><br/></p>
        <h2 id="-live-demo-here-https-good-tokens-surge-sh-"><a href="https://good-tokens.surge.sh/">🏁 Live Demo Here!</a></h2>
        <p>Please connect to the Rinkeby network! </p>
        <h2 id="-hosted-subgraph-here-https-thegraph-com-explorer-subgraph-jasperdegens-good-tokens-"><a href="https://thegraph.com/explorer/subgraph/jasperdegens/good-tokens">Hosted Subgraph Here!</a></h2>
        <h2 id="-contracts">🔨 Contracts</h2>
        <p>The Good Tokens system consists of three main contracts, deployed to the Rinkeby testnet:</p>
        <ul>
        <li>📝 GoodToken  [<a href="https://rinkeby.etherscan.io/address/0xa508d9bf37bab3162894b4559c001e763537bc77">0xA508d9bf37baB3162894b4559c001e763537Bc77</a>]</li>
        <li>📝 GoodTokenFund  [<a href="https://rinkeby.etherscan.io/address/0xd6a0ad998252274cD4568391743e62CC9Fa9568e">0xd6a0ad998252274cD4568391743e62CC9Fa9568e</a>]</li>
        <li>📝 GoodDataFeed  [<a href="https://rinkeby.etherscan.io/address/0x6E293e996f4D40D66025A7520D7cCd037f93779c">0x6E293e996f4D40D66025A7520D7cCd037f93779c</a>]</li>
        <li>🖇️ <a href="https://thegraph.com/explorer/subgraph/jasperdegens/good-tokens">Good Tokens Subgraph</a></li>
        <li>🌊 <a href="https://testnets.opensea.io/collection/goodtokens">OpenSea Marketplace</a></li>
        </ul>
        <p><br/>
        <br/></p>
        <h2 id="-good-tokens-overview">👍 Good Tokens Overview</h2>
        <p><img style={{maxWidth: '100%'}} src="https://raw.githubusercontent.com/jasperdegens/scaffold-eth/389679d08a84bfd9a186f4525ff2cd654bee4dfb/packages/react-app/public/GoodTokens.png" alt="Good Token Overview"/></p>
        <p><br/>
        <br/></p>
        <h2 id="-technical-overview">🦾 Technical Overview</h2>
        <p><img style={{maxWidth: '100%'}}src="https://raw.githubusercontent.com/jasperdegens/scaffold-eth/good-tokens/packages/react-app/public/GoodTokensTechnical.png" alt="Technical Overview"/></p>
        <p><br/>
        <br/></p>
        <h2 id="-chainlink-oracle-and-jobs">🔗 Chainlink Oracle and Jobs</h2>
        <p>For this project we used a Chainlink oracle on the Rinkeby network at address <a href="https://rinkeby.etherscan.io/address/0x032887D0D0055e0f90447369F57EEb76b7a8e210">0x032887D0D0055e0f90447369F57EEb76b7a8e210</a>. We leveraged the HttpGet, JSONParse,  Multiply, EthUint256, and EthTx core adapters. Thanks to Javier, Keenan, Patrick, the excellent node-operator network for making this possible!</p>
        <p><br/>
        <br/></p>
        <h2 id="-unicef-eea-sdmx-data-queries">🌐 UNICEF, EEA, SDMX Data Queries</h2>
        <p>Many NGOs and non-profit organizations use the SDMX protocol to provide their data to 3rd parties. Our <a href="https://rinkeby.etherscan.io/address/0x6E293e996f4D40D66025A7520D7cCd037f93779c">GoodDataFeed</a> contract can register any open SDMX compatable data source and query data for a given year onchain via a <a href="https://rinkeby.etherscan.io/address/0x032887D0D0055e0f90447369F57EEb76b7a8e210">Chainlink oracle</a> and node for transparent and trusted data. For our prototype, we selected <a href="https://sdmx.data.unicef.org/databrowser/index.html">two data feeds</a> from UNICEF, one focused on immunizations and the other on out of school rates, and we also used a greenhouse gas emission metric from the <a href="https://ec.europa.eu/eurostat/web/sdmx-infospace/welcome">EEA</a>.</p>
        <p><br/>
        <br/></p>
        <h2 id="-the-graph-ipfs-https-thegraph-com-explorer-subgraph-jasperdegens-good-tokens-"><a href="https://thegraph.com/explorer/subgraph/jasperdegens/good-tokens">🖇️ The Graph + IPFS</a></h2>
        <p>We leveraged The Graph to bind together the data from our contracts and our metadata stored on IPFS.</p>
        <p>Interesting tidbits:</p>
        <ul>
        <li><strong>Event Handlers</strong> for GoodToken, GoodTokenFund, and GoodDataFeed contracts.</li>
        <li><strong>Block Handler</strong> to query and update subgraph if tokens on our GoodToken contract were revoked.</li>
        <li><strong>IPFS cat</strong> calls to pull in pinned metadata for frontend magic.</li>
        </ul>
        <p>We would have liked to use <strong>Call Handlers</strong> as well in order to cut down on gas costs, however at this time they are not supported on Rinkeby (we wanted to stick with Rinkeby to test <a href="https://testnets.opensea.io/collection/goodtokens">intergration with OpenSea</a>);</p>
        <p>You can view our <a href="https://thegraph.com/explorer/subgraph/jasperdegens/good-tokens">hosted subgraph here</a>!</p>
        <p><br/>
        <br/></p>
        <h2 id="-special-thanks-to-">🙏 Special thanks to:</h2>
        <ul>
        <li>🐦 Keenan and Patrick at Chainlink for amazing advice and support.</li>
        <li>Javier for hosting a Chainlink node on Rinkeby.</li>
        <li>Mehran at UNICEF for sharing the orgniazations inspiring vision for blockchain tech.</li>
        <li>The Graph for making block-chain querying, IPFS integration, and frontent development an absolute pleasure.</li>
        <li>Austin Griffith for incredible scaffold code-base to get started with.</li>
        </ul>

        </Row>
  
      </Col>
    </Row>
  )
}

export default Subgraph;
