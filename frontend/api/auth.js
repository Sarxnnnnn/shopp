const API_URL = 'http://localhost:3000/api/auth'; // หรือ URL จริงหลัง deploy

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const registerUser = async (name, email, password) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data;
};
