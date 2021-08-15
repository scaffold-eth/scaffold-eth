/* eslint-disable no-console */
import { Box, Grid, GridItem, Heading, ListItem, UnorderedList, Stack, Text, Image, Button } from '@chakra-ui/react'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import MusicVideoAudioSVG from './MusicVideoAudioSVG'
import React, { useState, useEffect } from 'react'
import { ChainId, useEthers } from '@usedapp/core'
import { ethers, providers } from 'ethers'
import hardhatContracts from '../../../contracts/hardhat_contracts.json'
import { IpNftFactory as IpNftFactoryType } from '../../../types/typechain'
import { Photo, GalleryIndex } from '../../../utils/Types'
import { Buckets, PushPathResult, PrivateKey, WithKeyInfoOptions, KeyInfo } from '@textile/hub'

const keyInfo: KeyInfo = { key: 'bslg36pqnurdiujqywjblx2n2xa',}
const keyInfoOptions: WithKeyInfoOptions = { debug: false, }


function NewUploads(): JSX.Element {
  const [buckets, setBuckets] = useState(null)
  const [bucketKey, setBucketKey] = useState(null)
  const [identity, setIdentity] = useState(null)
  const [multimedia, setMultimedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [links, setLinks] = useState(null)
  const { chainId, library } = useEthers()

  const IpNftFactoryContract = hardhatContracts['80001']['mumbai']['contracts']['IpNftFactory']
  const contractAddress = IpNftFactoryContract['address']
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const [index1, setIndex1] = useState({
    author: '',
    date: 0,
    paths: [],
  })
  const ipfsGateway = 'https://hub.textile.io'

  useEffect(() => {
    // Clear your user during development
    // await localStorage.clear()
    console.log('useEffect - []')
    async function setIdentityFn() {
      const _identity = await getIdentity()
      setIdentity(_identity)
    }
    setIdentityFn()
    
  }, [])

  useEffect(() => {
    console.log('useEffect - [identity]')
    async function getBucketKeyFn() {
      const { buckets, bucketKey } = await getBucketKey()
      setBuckets(buckets)
      setBucketKey(bucketKey)
    }
    if (identity) getBucketKeyFn()
  }, [identity])

  useEffect(() => {
    console.log('useEffect - [buckets, bucketKey]')
    async function settingIdentity1() {
      await getBucketLinks()
    }
    settingIdentity1()
    const index = (async (): Promise<GalleryIndex> => {
      return await getPhotoIndex()
    })()

    if (index && bucketKey && buckets) {
      (async () => {
        await galleryFromIndex(await index)
        setIndex1(await index)
        setLoading(false)
      })()
    }
  }, [buckets, bucketKey])

  async function galleryFromIndex(index: GalleryIndex) {
    console.log('galleryFromIndex, index:', index)

    if (!buckets || !bucketKey) {
      console.error('galleryFromIndex - No bucket client or root key')
      return
    }

    const _multimedia = []
    for (const path of index.paths) {
      const metadata = await buckets.pullPath(bucketKey, path)
      /* eslint-disable no-console */
      console.log(await buckets.links(bucketKey))
      /* eslint-disable no-console */
      // console.log(links)
      const { value } = await metadata.next()
      let str = ''
      for (let i = 0; i < value.length; i++) {
        str += String.fromCharCode(parseInt(value[i]))
      }
      const json: Photo = JSON.parse(str)
      json &&
        Object.keys(json).map((key) => {
          const item = json[key]
          _multimedia.push({
            ...item,
            src: `${ipfsGateway}/ipfs/${item.cid}`,
          })
        })
    }

    if (_multimedia.length > 0) setMultimedia(_multimedia)
  }

  async function getPhotoIndex(): Promise<GalleryIndex> {
    console.log('getPhotoIndex')

    if (!buckets || !bucketKey) {
      // console.error('getPhotoIndex - No bucket client or root key')
      return
    }
    try {
      const metadata = buckets.pullPath(bucketKey, 'index.json')
      const { value } = await metadata.next()
      let str = ''
      for (let i = 0; i < value.length; i++) {
        str += String.fromCharCode(parseInt(value[i]))
      }
      const index: GalleryIndex = JSON.parse(str)
      return index
    } catch (error) {
      const index = await initIndex()
      await initPublicGallery()
      return index
    }
  }

  async function initPublicGallery() {
    console.log('initPublicGallery')

    if (!buckets || !bucketKey) {
      console.error('No bucket client or root key')
      return
    }
    const buf = Buffer.from(publicGallery)
    /* eslint-disable no-console */
    console.log('initpublicgallery')
    /* eslint-disable no-console */
    console.log(buf)
    ;(async () => {
      await buckets.pushPath(bucketKey, 'index.html', buf)
    })()
  }

  async function initIndex() {
    console.log('initIndex')

    if (!identity) {
      console.error('Identity not set')
      return
    }
    const index = {
      author: identity.public.toString(),
      date: new Date().getTime(),
      paths: [],
    }
    await storeIndex(index)
    return index
  }

  async function storeIndex(index: GalleryIndex) {
    console.log('storeIndex', index, buckets, bucketKey)

    if (!buckets || !bucketKey) {
      console.error('storeIndex - No bucket client or root key')
      return
    }
    const buf = Buffer.from(JSON.stringify(index, null, 2))
    const path = `index.json`
    try {
      await buckets.pushPath(bucketKey, path, buf)
    } catch (e) {
      /* eslint-disable no-console */
      console.log(e)
    }
  }

  async function onDrop(acceptedFiles: File[]) {
    console.log('onDrop')
    if (multimedia.length > 50) {
      throw new Error('Gallery at maximum size')
    }
    if (acceptedFiles.length > 5) {
      throw new Error('Max 5 images at a time')
    }
    for (const accepted of acceptedFiles) {
      await handleNewFile(accepted)
    }
  }

  useEffect(() => {
    console.log('useEffect - [index1]')
    async function method() {
      storeIndex(index1)
    }
    if (buckets && bucketKey) method()
  }, [index1])

  async function getBucketLinks() {
    console.log('getBucketLinks')

    if (!buckets || !bucketKey) {
      // console.error('getBucketLinks - No bucket client or root key')
      return
    }
    const links = await buckets.links(bucketKey)
    /* eslint-disable no-console */
    console.log(links)
    setLinks({
      ...links,
    })
  }

  async function getBucketKey() {
    console.log('getBucketKey, identity: ', identity)

    if (!identity) {
      throw new Error('Identity not set')
    }
    const buckets = await Buckets.withKeyInfo(keyInfo, keyInfoOptions)
    // Authorize the user and your insecure keys with getToken
    await buckets.getToken(identity)

    const buck = await buckets.getOrCreate('RoyaltyFreeNft')
    if (!buck.root) {
      throw new Error('Failed to open bucket')
    }

    return { buckets: buckets, bucketKey: buck.root.key }
  }

  async function getIdentity(): Promise<PrivateKey> {
    console.log('getIdentity')

    try {
      const storedIdent = localStorage.getItem('identity')
      if (storedIdent === null) {
        throw new Error('No identity')
      }
      const restored = PrivateKey.fromString(storedIdent)
      return restored
    } catch (e) {
      /**
       * If any error, create a new identity.
       */
      try {
        const identity = PrivateKey.fromRandom()
        const identityString = identity.toString()
        localStorage.setItem('identity', identityString)
        return identity
      } catch (err) {
        return err.message
      }
    }
  }

  /**
   * processAndStore resamples the image and extracts the metadata. Next, it
   * calls insertFile to store each of the samples plus the metadata in the bucket.
   * @param image
   * @param path
   * @param name
   * @param limits
   */
  async function processAndStore(
    file: File,
    path: string,
    name: string,
    realName: string
  ): Promise<Photo> {
    console.log('processAndStore, file: ', file, path, name, realName)

    // const size = await browserImageSize(finalImage)
    const location = `${path}${name}`
    const raw = await insertFile(file, location)
    const metadata = {
      cid: raw.path.cid.toString(),
      name: realName,
      fileType: file.name.split('.').pop(),
      filePreview: location,
      FileUrl: null,
      tags: null,
      category: null,
    }
    /* eslint-disable no-console */
    console.log('metadata')
    /* eslint-disable no-console */
    console.log(metadata)

    setMultimedia([
      ...multimedia,
      {
        ...metadata,
        src: `${ipfsGateway}/ipfs/${metadata.cid}`,
      },
    ])

    return metadata
  }

  async function insertFile(file: File, path: string): Promise<PushPathResult> {
    console.log('insertFile()')

    if (!buckets || !bucketKey) {
      throw new Error('insertFile - No bucket client or root key')
    }
    const _buckets: Buckets = buckets

    return await _buckets.pushPath(bucketKey, path, file.stream())
  }

  async function interactWithContract(urlPath: string) {
    console.log(signer, contractAddress)
    if (signer) {
      console.log('interact with contract', urlPath, signer, contractAddress)
      const contract = new ethers.Contract(
        contractAddress,
        IpNftFactoryContract.abi,
        signer
      ) as IpNftFactoryType
      const transaction = await contract.newIpNft('TestBrandName', 'TestBrandSymbol', urlPath)
      await transaction.wait()
    }
  }

  async function handleNewFile(file: File) {
    console.log('handleNewFile')

    if (!buckets || !bucketKey) {
      console.error('handleNewFile - No bucket client or root key')
      return
    }
    const multiMediaSchema: { [key: string]: any } = {}
    const now = new Date().getTime()
    const filename = `${now}_${file.name}`
    multiMediaSchema[identity.toString()] = await processAndStore(
      file,
      identity.toString() + '/',
      filename,
      `${file.name}`
    )

    const metadata = Buffer.from(JSON.stringify(multiMediaSchema, null, 2))
    const metaname = `${now}_${file.name}.json`
    const path = `metadata/${metaname}`

    ;(async () => {
      const raw = await buckets.pushPath(bucketKey, path, metadata)
      /* eslint-disable no-console */
      console.log('raw', raw)
      interactWithContract(raw.path.path)
    })()

    setIndex1({
      ...index1,
      paths: [...index1.paths, path],
    })
  }

  return (
    <>
      <Grid mt="2rem" fontSize="sm" templateColumns="repeat(3, 1fr)" gap="8">
        <GridItem
          colSpan={1}
          mr="2rem"
          position="sticky"
          top="0"
          alignSelf="flex-start"
        >
          <Heading as="h1" mb="1.5rem" fontSize="1.5rem">
            Upload your content to start selling
          </Heading>
          <Text mb="1.5rem">Make sure that your media files are</Text>

          <UnorderedList>
            <ListItem>Owned by you</ListItem>
            <ListItem>High quality and clear</ListItem>
            <ListItem>Original and not over edited</ListItem>
          </UnorderedList>
        </GridItem>
        <GridItem colSpan={2}>
        {/* <Button onClick={() => interactWithContract('/test/path/')}>Test Contract</Button> */}
          <UploadBox style={{ cursor: 'pointer' }}>
            
            <Dropzone
              onDrop={onDrop}
              accept={'image/*, video/*, audio/*'}
              maxSize={20000000}
              multiple={true}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Stack direction="column" mx="auto" my="8vh">
                    <MusicVideoAudioSVG />
                    <Box height="2rem"></Box>
                    <Box
                      fontSize="xl"
                      color="#fff"
                      textAlign="center"
                      marginTop="2rem"
                    >
                      Drag and drop up to 10 files
                      <br />
                      or{' '}
                      <Box color="var(--colour-highlight)" d="inline-block">
                        Browse
                      </Box>{' '}
                      to choose your files
                    </Box>
                  </Stack>
                </div>
              )}
            </Dropzone>
          </UploadBox>
        </GridItem>
        {/* <GridItem>
          <Box mt="5">
            {multimedia &&
              multimedia.map((item) => (
                <Image src={item.src} alt={item.name} key={item.src} />
              ))}
          </Box>
        </GridItem> */}
      </Grid>
    </>
  )
}

const UploadBox = styled.div`
  border: 1rem solid var(--chakra-colors-gray-100);
  background: #000;
  border-radius: var(--chakra-radii-md);
`

const publicGallery =
  '<!doctype html><html lang=en><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><meta http-equiv=x-ua-compatible content="ie=edge"><meta property="twitter:description" content="built with textile.io. uses textile buckets and ipns to serve photo galleries over ipns"><title>Public Gallery</title><link rel=stylesheet href=https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css><script src=https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js></script><div class=wrapper><div class=grid></div></div><script>const loadIndex=async()=>{const elements=[]\n' +
  'const index=await fetch("index.json")\n' +
  'const json=await index.json()\n' +
  'for(let path of json.paths){try{const meta=await fetchMetadata(path)\n' +
  'elements.push({href:meta.path,type:"image"})}catch(err){console.log(err)}}\n' +
  'const lightbox=GLightbox({selector:".grid",touchNavigation:true,closeButton:false,loop:true,elements:elements,});lightbox.open();}\n' +
  'const fetchMetadata=async(path)=>{const index=await fetch(path)\n' +
  'const json=await index.json()\n' +
  'return json.original}\n' +
  'window.addEventListener("DOMContentLoaded",function(){loadIndex()});</script>'

export default NewUploads