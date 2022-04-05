import axios from 'axios'

const getChallengeReadme = async url => {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (err) {
    console.err('Error fetching challenge README', err)
    throw new Error('Error fetching challenge README')
  }
}

export default getChallengeReadme
