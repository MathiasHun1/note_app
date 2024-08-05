import axios from 'axios'

const baseUrl = '/api/login'

const userLogin = async (credentials) => {
  try {
    const response = await axios.post(baseUrl, credentials)
    return response.data
  } catch(err) {
    throw new Error(err.message)
  }
}

export default { userLogin }