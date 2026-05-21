import { RouterProvider } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import router from "./routes/AppRoutes";
import "./styles/global.css";

function App() {
  return (
    <CartProvider>
      <ProductProvider>
        <RouterProvider router={router} />
      </ProductProvider>
    </CartProvider>
  );
}

export default App;
