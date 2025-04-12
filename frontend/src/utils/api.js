export const fetchProducts = async () => {
  const response = await fetch('http://localhost:3001/api/products');
  if (!response.ok) throw new Error('Fetch failed');
  return await response.json();
};
