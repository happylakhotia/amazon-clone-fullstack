import { useProductContext } from "../context/ProductContext";

export const useProducts = () => {
  return useProductContext();
};

export default useProducts;
