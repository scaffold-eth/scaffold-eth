import { DeepPartial, Theme } from "@chakra-ui/react";

/** extend additional color here */
const extendedColors: DeepPartial<Record<string, Theme["colors"]["current" | "purple"]>> = {
  // white: "#fff",
  // space: "#0E0333",
  // spacepink: "#301041",
  // spacelight: "#1A103D",
  // spacelightalpha: "rgba(255, 255, 255, 0.05)",
  // stone: "#9B95B0",
  // smoke: "#3B3058",
  // purple: {
  //   50: "#eee9fe",
  //   100: "#cab8fb",
  //   200: "#8C65F7", // purplelight
  //   300: "#6F3FF5", // purple
  //   400: "#5932C4", // purpledark
  //   500: "#6F3FF5",
  //   600: "#4b0ff2",
  //   700: "#420bdc",
  //   800: "#3b0ac4",
  //   900: "#2d0893",
  // },
  // pink: {
  //   50: "#ffffff",
  //   100: "#fccfdf",
  //   200: "#F579A6", // pinklight
  //   300: "#F35890", // pink
  //   400: "#D44D6E", // pinkdark
  //   500: "#F35890",
  //   600: "#f02870",
  //   700: "#ed1161",
  //   800: "#d60f57",
  //   900: "#a60c44",
  // },
  // aqua: {
  //   50: "#98fee6",
  //   100: "#66fed9",
  //   200: "#5BF1CD", // aqualight
  //   300: "#02E2AC", // aqua
  //   400: "#11BC92", // aquadark
  //   500: "#02E2AC",
  //   600: "#02af86",
  //   700: "#019672",
  //   800: "#017d5f",
  //   900: "#014a39",
  // },
};

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme["colors"]> = {};

const colors = {
  ...overridenChakraColors,
  ...extendedColors,
};

export default colors;
