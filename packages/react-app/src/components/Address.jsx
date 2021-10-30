import React from "react";
import {
  Skeleton,
  Link,
  Text,
  Input,
  InputGroup,
  Editable,
  EditableInput,
  EditablePreview,
  InputLeftElement,
  Button,
  SkeletonCircle,
  SkeletonText,
  IconButton,
} from "@chakra-ui/react";
import { useClipboard } from "@chakra-ui/hooks";
import { Box, Flex, HStack } from "@chakra-ui/layout";
import Blockies from "react-blockies";
import { useLookupAddress } from "eth-hooks/dapps/ens";
import { MdContentCopy, MdCheckCircle } from "react-icons/md";
import { RiExternalLinkFill } from "react-icons/ri";

// changed value={address} to address={address}

/*
  ~ What it does? ~

  Displays an address with a blockie image and option to copy address

  ~ How can I use? ~

  <Address
    address={address}
    ensProvider={mainnetProvider}
    blockExplorer={blockExplorer}
    fontSize={fontSize}
  />

  ~ Features ~

  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
  - Provide fontSize={fontSize} to change the size of address text
*/

const blockExplorerLink = (address, blockExplorer) =>
  `${blockExplorer || "https://etherscan.io/"}${"address/"}${address}`;

export default function Address(props) {
  const address = props.value || props.address;
  const ens = useLookupAddress(props.ensProvider, address);
  const { hasCopied, onCopy } = useClipboard(address);

  if (!address) {
    return (
      <Box padding="6" as="span">
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={1} spacing="4" />
      </Box>
    );
  }

  let displayAddress = address.substr(0, 6);

  const ensSplit = ens && ens.split(".");
  const validEnsCheck = ensSplit && ensSplit[ensSplit.length - 1] === "eth";
  if (validEnsCheck) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + address.substr(-4);
  } else if (props.size === "long") {
    displayAddress = address;
  }

  const etherscanLink = blockExplorerLink(address, props.blockExplorer);
  if (props.minimized) {
    return (
      <Box as="span" verticalAlign="middle">
        <Link target="_blank" href={etherscanLink} rel="noopener noreferrer">
          <Blockies seed={address.toLowerCase()} size={8} scale={2} />
        </Link>
      </Box>
    );
  }

  let text;
  if (props.onChange) {
    text = (
      <Editable placeholder={address}>
        <EditablePreview width="100%" />
        <Link target="_blank" href={etherscanLink} rel="noopener noreferrer">
          <EditableInput value={displayAddress} onChange={props.onChange} />
        </Link>
      </Editable>
    );
  } else {
    text = (
      <Flex alignItems="center" justifyContent="center" flexGrow="1">
        <Link
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="none"
          textOverflow={displayAddress.startsWith("0x") ? "ellipsis" : "unset"}
          href={etherscanLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <RiExternalLinkFill />
          {displayAddress}
        </Link>
      </Flex>
    );
  }

  return (
    <HStack fontSize={props.fontSize ? props.fontSize : 28} verticalAlign="middle">
      {/* <span style={{ verticalAlign: "middle" }}>
      </span> */}
      <Blockies seed={address.toLowerCase()} size={8} scale={props.fontSize ? props.fontSize / 7 : 4} />
      {text}
      <IconButton
        onClick={onCopy}
        aria-label="Copy Address"
        fontSize="20px"
        icon={hasCopied ? <MdCheckCircle color="green" /> : <MdContentCopy />}
      />
    </HStack>
  );
}
