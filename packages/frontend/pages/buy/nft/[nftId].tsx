import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Flex, Heading, Image, Link, Stack, Text, Tooltip } from '@chakra-ui/react'
import styled from 'styled-components'
import { IconExternalLink, IconPhoto, IconMovie, IconMusic } from '@tabler/icons'
import Layout from '../../../components/layout/Layout'
import { truncateAddressString } from '../../../utils/truncateAddressString'

function Licensor() {
    const router = useRouter()
    const { licensorId } = router.query

    useEffect(() => {
        // Pull data from subgraph based on Licensor ID
    }, [licensorId])

    const licensorInfo = sampleLicensor
    const { brandName, brandSymbol, contractAddress, licenses } = licensorInfo || {}
    const [activeFilters, setActiveFilters] = useState([])

    const toggleFilter = (category) => {
        if (activeFilters.includes(category)) {
            const _activeFilters = activeFilters.filter(item => item !== category)
            setActiveFilters(_activeFilters)
        } else {
            const _activeFilters = activeFilters.slice(0)
            _activeFilters.push(category)
            setActiveFilters(_activeFilters)
        }
    }

    return (
        <Layout>

            {/* Header */}

            <Stack direction="row" alignItems="flex-end" mb=".8rem">
                <Heading size="lg">{brandName}</Heading>
                <Text pl=".3rem">{brandSymbol}</Text>
                <Link href={`https://etherscan.io/address/${contractAddress}`} isExternal pl=".8rem">
                    <Button colorScheme="gray" size="sm">
                        {contractAddress && truncateAddressString(contractAddress)}
                        <IconExternalLink width="1.2rem" style={{ marginLeft: '.3rem' }} />
                    </Button>
                </Link>
            </Stack>
            <RicePattern />


            <Text fontSize="lg" mb="1rem">Available for licensing</Text>

            {/* Filters */}

            <Stack direction="row" mb="2rem">
                <Button 
                    size="sm" 
                    variant="outline" 
                    colorScheme={activeFilters.length === 0 ? 'black' : 'gray'} 
                    onClick={() => setActiveFilters([])}
                    >
                    All
                </Button>
                <Button 
                    size="sm"
                    variant="outline" 
                    colorScheme={(activeFilters.includes('Images') || activeFilters.length === 0) ? 'black' : 'gray'} 
                    _hover={{ bg: "var(--chakra-colors-gray-200)" }}
                    onClick={() => toggleFilter('Images')}
                    >
                    <IconPhoto size="1.2rem" />
                    <Text pl="1">Images</Text>
                </Button>
                <Button 
                    size="sm" 
                    variant="outline" 
                    colorScheme={(activeFilters.includes('Videos') || activeFilters.length === 0) ? 'black' : 'gray'} 
                    _hover={{ bg: "var(--chakra-colors-gray-200)" }}
                    onClick={() => toggleFilter('Videos')}
                    >
                    <IconMovie size="1.2rem" />
                    <Text pl="1">Videos</Text>
                </Button>
                <Button 
                    size="sm" 
                    variant="outline" 
                    colorScheme={(activeFilters.includes('Audio') || activeFilters.length === 0) ? 'black' : 'gray'} 
                    _hover={{ bg: "var(--chakra-colors-gray-200)" }}
                    onClick={() => toggleFilter('Audio')}
                    >
                    <IconMusic size="1.2rem" />
                    <Text pl="1">Audio</Text>
                </Button>
            </Stack>

            {/* Licenses */}

            <Flex wrap="wrap">
                {licenses && licenses.map((item, i) => (
                    <LicenseItem item={item} key={i} />
                ))}
            </Flex>

        </Layout>
    )
}

const LicenseItem = ({ item }) => {
    const { id, name, price, currency, filePreview, licensees } = item || {}

    return (
        <Link href={`/buy/nft/${id}`}>
            <Box 
                borderRadius="md" 
                overflow="hidden" 
                d="inline-block" 
                cursor="pointer" 
                border="1px solid #000" 
                p=".4rem"
                mr="1rem"
                mb="1rem"
                fontSize="90%"
                _hover={{
                    boxShadow: "0 0 0 .35rem rgba(0, 0, 0, 0.08), 0 0 0 .1rem rgba(0, 0, 0, 1)"
                }}
                >
                <Image src={filePreview} alt={name} height="10rem" mb=".3rem" />
                <Text>{name}</Text>
                <Flex justifyContent="space-between" alignItems="flex-end">
                    <Box>
                        <Text d="inline-block" fontSize="120%">{price}</Text>
                        <Text d="inline-block" fontSize="90%" pl=".3rem">{currency.toUpperCase()}</Text>
                    </Box>
                    {licensees < 10 && (
                        <Tooltip 
                            label={
                                <>
                                    <Text fontWeight="bold" mb=".2rem">Early Supporter Bonus is <span style={{ color: "var(--colour-highlight)"}}>Active</span></Text>
                                    <Text>The first 10 licensees of a listed item are eligible to share in a rebate pool, after deduction of DAO and hosting costs, from future purchases.</Text>
                                </>
                            } 
                            variant="black"
                            aria-label="A tooltip" 
                            hasArrow
                            >
                            <Text fontSize="90%">
                                <svg xmlns="http://www.w3.org/2000/svg" width="5.715" height="12.591" viewBox="0 0 5.715 12.591" style={{ display: 'inline-block', marginRight: '.3rem' }}><path id="Path_262" data-name="Path 262" d="M13.477,14,11,18.954h3.715l-2.477,4.954" transform="translate(-10 -12.658)" fill="none" stroke="#19db53" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                Early Supporter
                            </Text>
                        </Tooltip>
                    )}
                </Flex>
            </Box>
        </Link>
    )
}

const sampleLicensor = {
    brandName: 'Omnism',
    brandSymbol: 'OMSM',
    contractAddress: '0x298beaa0e556cdc4563d572f86aa005b08e770148b1ef9df028594f10391eb68',
    licenses: [
        {
            id: 1,
            name: 'Raccoon Birthday',
            price: '0.15',
            currency: 'eth',
            fileType: 'Image/JPG',
            filePreview: '/images/gallery/Image 11.jpg',
            licensees: 50,
        },
        {
            id: 2,
            name: 'Beach with Pink Sky',
            price: '0.305',
            currency: 'eth',
            fileType: 'Video/MP4',
            filePreview: '/images/gallery/Image 8.jpg',
            licensees: 15,
        },
        {
            id: 3,
            name: 'Factory in the 1900s',
            price: '0.78',
            currency: 'eth',
            fileType: 'Image/JPG',
            filePreview: '/images/gallery/Image 1.jpg',
            licensees: 15,
        },
        {
            id: 4,
            name: 'Waves',
            price: '0.26',
            currency: 'eth',
            fileType: 'Image/JPG',
            filePreview: '/images/gallery/Image 3.jpg',
            licensees: 5,
        },
        {
            id: 5,
            name: 'Pottery Pattern',
            price: '0.242',
            currency: 'eth',
            fileType: 'Image/JPG',
            filePreview: '/images/gallery/Image 10.jpg',
            licensees: 0,
        },
        {
            id: 6,
            name: 'Traced Leaf, Black & White',
            price: '0.10',
            currency: 'eth',
            fileType: 'Image/JPG',
            filePreview: '/images/gallery/Image 9.jpg',
            licensees: 120,
        },
        {
            id: 7,
            name: 'Joker Card',
            price: '0.15',
            currency: 'eth',
            fileType: 'Image/JPG',
            filePreview: '/images/gallery/Image 13.jpg',
            licensees: 200,
        },
        {
            id: 8,
            name: 'Extinct Fish Sketch',
            price: '0.90',
            currency: 'eth',
            fileType: 'Image/JPG',
            filePreview: '/images/gallery/Image 12.jpg',
            licensees: 200,
        },
        {
            id: 9,
            name: 'Flower Illustration, Watercolour',
            price: '0.18',
            currency: 'eth',
            fileType: 'Image/JPG',
            filePreview: '/images/gallery/Image 7.jpg',
            licensees: 200,
        },
    ]
}

const RicePattern = styled.div`
    background: #fff url('/images/rice-pattern.svg') repeat;
    border-radius: var(--chakra-radii-2xl);
    height: 10rem;
    margin-bottom: 1.5rem;
`

export default Licensor