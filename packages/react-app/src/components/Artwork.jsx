import { formatEther } from '@ethersproject/units';
import { Badge, Card, Col, Row, Image, Typography } from 'antd'
import React from 'react'
import Blockies from 'react-blockies'
import { useHistory } from 'react-router';

const stringToSlug = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaeeeeiiiioooouuuunc------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
  
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
  
    return str
}  


const { Text, Title } = Typography

const Artwork = ({artwork}) => {
    const history = useHistory()
    const isForSale = artwork.revoked || (artwork.artist.address === artwork.owner)
    const isImage = !!artwork.artworkImageUrl.match(/.jpg|.png/)
    
    let content = (
        <Card hoverable onClick={() => history.push(`/artworks/${artwork.tokenId}/${stringToSlug(artwork.name)}`)}
          title={
            <Row justify="space-between">
              <Col>
                <Blockies seed={artwork.artist.address} scale={2} />
                <Text type="secondary"> &nbsp; {artwork.artist.name}</Text>
              </Col>
              <Col><Text>{formatEther(artwork.price)} ☰</Text></Col>
            </Row>
          }
          cover={isImage ? <Image src={artwork.artworkImageUrl} /> : <video autoPlay loop src={artwork.artworkImageUrl}/>}
        >
          <Row justify="start" style={{textAlign: 'left'}}>
            <Text strong>{artwork.name}</Text> <Text type="secondary">🤝 {artwork.fund.name}</Text>
          </Row>
        </Card>
      )
    
      if(isForSale) {
        content = (
            <Badge.Ribbon color={artwork.revoked ? "gold" : "cyan"} text={artwork.revoked ? "Revoked!" : "on sale!"}>
                {content}
            </Badge.Ribbon>
        )
    }

    return content
}

export default Artwork