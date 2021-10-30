import { VStack } from "@chakra-ui/react";

function Card(props) {
  const { children, ...others } = props;
  return (
    <VStack p="8" borderRadius="base" border="1px solid lightgrey" spacing="4" {...others}>
      {children}
    </VStack>
  );
}

export default Card;
