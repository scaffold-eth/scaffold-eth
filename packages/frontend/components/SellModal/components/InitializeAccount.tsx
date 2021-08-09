import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid,
  GridItem,
  Link,
  Heading,
  Text,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react'
import { Formik, Field, Form } from 'formik'
import styled from 'styled-components'
import NFTLicense from './NFTLicense'

function InitializeAccount(): JSX.Element {

  function validateBrandName(value) {
    if (!value) {
      return 'Name is required'
    }
  }
  function validateBrandSymbol(value) {
    if (!value) {
      return 'Symbol is required'
    } else if (!value.match(/^[A-Z]{1,10}$/)) {
        return 'Max 4 alphabets'
    }
  }
  function validateAgreement(value) {
      if (!value) {
          return 'You need to agree to continue.'
      }
  }
  

  return (
    <>
      <Formik
        initialValues={{
          brandName: '',
          brandSymbol: '',
          agree: false
        }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            actions.setSubmitting(false)
          }, 1000)
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Heading fontSize="2xl">
              Start selling in as fast as 2 steps!
            </Heading>

            <Grid mt="2rem" fontSize="sm" templateColumns="repeat(3, 1fr)" gap="8">
              <GridItem colSpan={1} mr="2rem" >
                <Box mb="1rem">
                  <Numbering>1</Numbering>
                </Box>
                <Text fontWeight="bold" mb="2">
                  Choose your brand name and symbol
                </Text>
                <Text mb="6">
                  All content uploaded through your wallet will be tagged under
                  this brand identifier.
                </Text>
                <Box mb="5">
                <Field name="brandName" validate={validateBrandName}>
                  {({ field, form }) => (
                    <FormControl
                      id="brandName"
                      isRequired
                      isInvalid={
                        form.errors.brandName && form.touched.brandName
                      }
                    >
                      <FormLabel htmlFor="brandName" fontSize="sm">Brand Name</FormLabel>
                      <input type="text" className="form-control big" {...field} />
                    </FormControl>
                  )}
                </Field>
                </Box>
                <Box>
                <Field name="brandSymbol" validate={validateBrandSymbol}>
                  {({ field, form }) => (
                    <FormControl
                      id="brandSymbol"
                      isRequired
                      isInvalid={
                        form.errors.brandSymbol && form.touched.brandSymbol
                      }
                    >
                      <FormLabel htmlFor="brandSymbol" fontSize="sm">Brand Symbol</FormLabel>
                      <input type="text" className="form-control big" placeholder="XXXX" {...field} />
                      <FormHelperText>Max 4 characters</FormHelperText>
                    </FormControl>
                  )}
                </Field>
                </Box>
              </GridItem>
              <GridItem colSpan={2}>
                <Box mb="1rem">
                  <Numbering>2</Numbering>
                </Box>
                <Text fontWeight="bold" mb="2">
                  Review and accept the licensing contract
                </Text>
                <Text mb="4">
                  This license, designed by{' '}
                  <Link href="https://www.dapperlabs.com/" isExternal textDecoration="underline">
                    Dapper Labs
                  </Link>
                  , is designed to balance two concerns:
                </Text>
                <UnorderedList mb="6">
                  <ListItem>
                    Protecting the hard work and ingenuity of creators
                  </ListItem>
                  <ListItem>
                    Cranting users the freedom and flexibility to fully enjoy
                    their non-fungible tokens
                  </ListItem>
                </UnorderedList>

                <Divider mb="4" />
                {/* <Box color="gray.500" d="inline-block">
                  <Table>
                    <Tbody>
                      <Tr>
                        <Td p="2">Brand Name:</Td>
                        <Td p="2">{values && values.brandName}</Td>
                      </Tr>
                      <Tr>
                        <Td p="2">Symbol:</Td>
                        <Td p="2">{values && values.brandSymbol}</Td>
                      </Tr>
                      <Tr>
                        <Td p="2">Signer:</Td>
                        <Td p="2">0x789...ab7</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box> */}
                <NFTLicense />
                
                <Field name="agree" validate={validateAgreement}>
                  {({ field, form }) => (
                    <FormControl
                      id="agree"
                      isRequired
                      mb="7"
                      isInvalid={
                        form.errors.agree && form.touched.agree
                      }
                    >
                      <Checkbox {...field} size="sm" iconSize="10rem" colorScheme="green">I agree that all media files I list on &quot;Royalty Free NFT&quot; are bound by the above agreement. The contract will be signed by my wallet (0x789...ab7) on the blockchain as proof of agreement.</Checkbox>
                    </FormControl>
                  )}
                </Field>
              </GridItem>
            </Grid>

            <Box background="#000" borderRadius="base" p="3" textAlign="right">
              <Button
                type="submit"
                variant="press-down"
                isLoading={isSubmitting}
                loadingText="Creating..."
              >
                Create seller account
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  )
}

const Numbering = styled.div`
  display: inline-block;
    border-radius: 50%;
    color: #fff;
    background: #000;
    padding: .2rem;
    width: 1.8rem;
    height: 1.8rem;
    text-align: center;
    font-weight: bold;
`
export default InitializeAccount
