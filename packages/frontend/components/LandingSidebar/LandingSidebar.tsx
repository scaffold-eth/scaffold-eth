import React from "react"
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import styles from "./LandingSidebar.module.scss"

function LandingSidebar() : JSX.Element {
    return (
        <div className={styles.container}>
            <Box borderRadius=".6rem" bg="gray.50" pt="7" pb="14" px="7" ml="2rem" position="relative">
                <Text fontWeight="bold" fontSize="xl">Earn more simply</Text>
                <Text pt="4" pb="2" fontSize="90%">Of the listing price, you earn</Text>
                <Box mb="2rem">
                    {options.map( (option, index) => 
                        <Flex py={1.5} key={option.name} fontSize="90%" opacity={index === 0 ? 1 : 0.7} alignItems="center">
                            <Text pr="1rem" style={{ flex: '1 1 auto' }}>{option.name}</Text>
                            <div className={styles["progress-bar-container"]}>
                                <div className={styles["progress-bar"]} style={{ width: `${option.earnRate*100}%`}}></div>
                            </div>
                            <Text pl="1rem">{option.earnRate*100}%</Text>
                            <Image
                                maxHeight="1rem"
                                pl=".5rem"
                                src="/images/green-tick.svg"
                                opacity={index === 0 ? 1 : 0}
                                />
                        </Flex>
                    )}
                </Box>
                <NextLink href="/sell" passHref>
                    <Button variant="press-down" zIndex="1">Submit your content</Button>
                </NextLink>
                <Image
                  maxWidth="60%"
                  src="/images/landing-page-sidebar-bg.svg"
                  position="absolute"
                  bottom="1rem"
                  right="1rem"
                  opacity="0.8"
                />
            </Box>
        </div>
    )
}

const options = [
    {
        name: "Royalty Free NFT",
        earnRate: 0.95
    },
    {
        name: "iStock",
        earnRate: 0.45
    },
    {
        name: "Shutterstock",
        earnRate: 0.40
    },
    {
        name: "Adobe Stock",
        earnRate: 0.33
    },
]

export default LandingSidebar