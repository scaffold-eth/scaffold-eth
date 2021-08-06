import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { utils } from 'ethers'
import { useReducer } from 'react'
import Layout from '../components/layout/Layout'

type StateType = {
  signature: string
  messageToSign: string
  addressToVerify: string
  signatureToVerify: string
  messageToVerify: string
  verificationSuccess: boolean
}
type ActionType =
  | {
      type: 'SET_SIGNATURE'
      signature: string
    }
  | {
      type: 'SET_MESSAGE_TO_SIGN'
      messageToSign: string
    }
  | {
      type: 'SET_ADDRESS_TO_VERIFY'
      addressToVerify: string
    }
  | {
      type: 'SET_SIGNATURE_TO_VERIFY'
      signatureToVerify: string
    }
  | {
      type: 'SET_MESSAGE_TO_VERIFY'
      messageToVerify: string
    }
  | {
      type: 'SET_VERIFICATION_SUCCESS'
      verificationSuccess: boolean
    }

const initialState: StateType = {
  signature: '',
  messageToSign: '',
  addressToVerify: '',
  signatureToVerify: '',
  messageToVerify: '',
  verificationSuccess: false,
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_SIGNATURE':
      return {
        ...state,
        signature: action.signature,
      }
    case 'SET_MESSAGE_TO_SIGN':
      return {
        ...state,
        messageToSign: action.messageToSign,
      }
    case 'SET_ADDRESS_TO_VERIFY':
      return {
        ...state,
        addressToVerify: action.addressToVerify,
      }
    case 'SET_SIGNATURE_TO_VERIFY':
      return {
        ...state,
        signatureToVerify: action.signatureToVerify,
      }
    case 'SET_MESSAGE_TO_VERIFY':
      return {
        ...state,
        messageToVerify: action.messageToVerify,
      }
    case 'SET_VERIFICATION_SUCCESS':
      return {
        ...state,
        verificationSuccess: action.verificationSuccess,
      }
    default:
      throw new Error()
  }
}

function SignatureExampleIndex(): JSX.Element {
  const { library } = useEthers()

  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    signature,
    messageToSign,
    addressToVerify,
    signatureToVerify,
    messageToVerify,
    verificationSuccess,
  } = state

  const sign = async () => {
    if (library) {
      const signer = library.getSigner()
      const newSignature = await signer.signMessage(messageToSign)
      dispatch({
        type: 'SET_SIGNATURE',
        signature: newSignature,
      })
    }
  }

  const verifySignature = () => {
    if (messageToVerify && signatureToVerify) {
      const addressFromMessage = utils.verifyMessage(
        messageToVerify,
        signatureToVerify
      )
      if (addressFromMessage === addressToVerify) {
        dispatch({
          type: 'SET_VERIFICATION_SUCCESS',
          verificationSuccess: true,
        })
      } else {
        dispatch({
          type: 'SET_VERIFICATION_SUCCESS',
          verificationSuccess: false,
        })
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('Invalid message or signature!')
      dispatch({
        type: 'SET_VERIFICATION_SUCCESS',
        verificationSuccess: false,
      })
    }
  }

  return (
    <Layout>
      <Heading as="h1" mb="12">
        Signature Demo Page
      </Heading>
      <Box maxWidth="container.sm">
        <Text fontWeight="semibold">Use your MetaMask to sign a message.</Text>
        <Input
          mt="6"
          type="text"
          placeholder="Enter Message"
          onChange={(e) => {
            dispatch({
              type: 'SET_MESSAGE_TO_SIGN',
              messageToSign: e.target.value,
            })
          }}
        />
        <Button mt="2" colorScheme="teal" onClick={sign}>
          Sign
        </Button>
      </Box>
      <Text mt="8">This is the signature: {signature}</Text>
      <Divider my="8" />
      <Box maxWidth="container.sm">
        <Text fontWeight="semibold">
          Enter an Address, Signature, and Message to verify the Message.
        </Text>
        <Text mt="6">Address:</Text>
        <Input
          mt="2"
          type="text"
          placeholder="Enter Address To Verify"
          onChange={(e) => {
            dispatch({
              type: 'SET_ADDRESS_TO_VERIFY',
              addressToVerify: e.target.value,
            })
          }}
        />
        <Text mt="6">Signature:</Text>
        <Input
          mt="2"
          type="text"
          placeholder="Enter Signature To Verify"
          onChange={(e) => {
            dispatch({
              type: 'SET_SIGNATURE_TO_VERIFY',
              signatureToVerify: e.target.value,
            })
          }}
        />
        <Text mt="4">Message:</Text>
        <Input
          mt="2"
          type="text"
          placeholder="Enter Message To Verify"
          onChange={(e) => {
            dispatch({
              type: 'SET_MESSAGE_TO_VERIFY',
              messageToVerify: e.target.value,
            })
          }}
        />
        <Button mt="2" colorScheme="teal" onClick={verifySignature}>
          Verify
        </Button>
        {verificationSuccess ? (
          <Alert mt="4" status="success">
            <AlertIcon />
            Verified!
          </Alert>
        ) : (
          <Alert mt="4" status="info">
            <AlertIcon />
            Not Verified!
          </Alert>
        )}
      </Box>
    </Layout>
  )
}

export default SignatureExampleIndex
