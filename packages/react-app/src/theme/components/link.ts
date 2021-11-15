import type { SystemStyleObject } from "@chakra-ui/theme-tools";

const baseStyle: SystemStyleObject = {
  transitionProperty: "common",
  transitionDuration: "fast",
  transitionTimingFunction: "ease-out",
  cursor: "pointer",
  textDecoration: "none",
  outline: "none",
  color: "inherit",
  _hover: {
    color: "aqua.300",
    textDecoration: "none",
  },
  _focus: {
    boxShadow: "none",
  },
};

export default {
  baseStyle,
};
