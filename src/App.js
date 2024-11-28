import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation"; // Importa el componente de navegación
import ProductList from "./pages/ProductList";
import StoreList from "./pages/StoreList";
import Association from "./pages/Association";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navigation /> {/* Barra de navegación */}
        <Routes>
          {/* Rutas de Productos */}
          <Route path="/productos" element={<ProductList />} />

          {/* Rutas de Tiendas */}
          <Route path="/Tiendas" element={<StoreList />} />

          {/* Ruta para Asociar productos a tiendas */}
          <Route path="/association" element={<Association />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
