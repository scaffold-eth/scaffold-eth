import React, { useState, useEffect } from 'react'
import { Avatar, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useEventListener } from "./hooks"
import { getFromIPFS } from "./helpers"
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

const useStyles = makeStyles((theme) => ({
  gridList: {
    width: "95vw"
  },
  titleBar: {
  background:
    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
},
}));

export default function NftyWallet(props) {

  const [allInks, setAllInks] = useState()

  let allInkView

  let inkCreations = useEventListener(props.readContracts,'NFTINK',"newInk",props.localProvider, 1)

  const classes = useStyles();

  const getImageWidth = () => {
    if(window.document.body.clientWidth / 9 < 120) {
      return 120
    }
    return window.document.body.clientWidth / 9
  }

  useEffect(()=>{

      if(props.readContracts) {

        const getInkImages = async (e) => {
          const jsonContent = await getFromIPFS(e['jsonUrl'], props.ipfsConfig)
          const inkJson = JSON.parse(jsonContent)
          const inkImageHash = inkJson.image.split('/').pop()
          const imageContent = await getFromIPFS(inkImageHash, props.ipfsConfig)
          const inkImageURI = 'data:image/png;base64,' + imageContent.toString('base64')
          return Object.assign({image: inkImageURI, name: inkJson.name, url: inkJson.drawing}, e);
        }

        const loadStream = async (e) => {
          if(inkCreations) {
            const newInkCreations = await Promise.all(inkCreations.map(getInkImages))
            setAllInks(newInkCreations.reverse())
          }
        }

        loadStream()

      }

  },[props.readContracts,props.tab, inkCreations])

       if(allInks) {
         allInkView = (
      <GridList cellHeight={'auto'} className={classes.gridList}>
        {allInks.map((item) => (
          <a onClick={() => props.showInk(item['url'])}><GridListTile key={item.image} cols={9}>
            {item['image']?<img src={item['image']} alt={item['name']} width={120} height={120}/>:<Avatar icon={<LoadingOutlined />} />}
            <GridListTileBar className={classes.titleBar} titlePosition="top"
                title={item.name}
                subtitle={<span>{item.limit.toString()=="0"?'unlimited':item.limit.toString()}</span>}
              />
          </GridListTile></a>
        ))}
      </GridList>
)
    } else {
      allInkView = (<Empty
        description={
          <span>
          No inks...
            </span>
          }
          />
        )
    }

    return allInkView

        }
