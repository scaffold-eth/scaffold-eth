// Wrapper API to BGv3 (Bazaar) API
import axios from "axios";

const BG_API_URL = "https://buidlguidl-v3.ew.r.appspot.com";

export const getAllBuilders = async () => {
  try {
    const response = await axios.get(`${BG_API_URL}/builders`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
