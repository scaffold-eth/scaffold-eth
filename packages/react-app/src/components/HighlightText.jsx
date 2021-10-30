import { Box } from "@chakra-ui/react";

function HighlightText(props) {
  const { children, ...others } = props;
  return (
    <Box as="span" mx="1" p="1" fontWeight="bold" borderRadius="base" bg="#f1f1f1" {...others}>
      {children}
    </Box>
  );
}

export default HighlightText;
