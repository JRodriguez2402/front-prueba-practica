import React, { useState, useEffect } from "react";
import  api  from "../services/api";

const Association = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [associations, setAssociations] = useState([]); // Guardar asociaciones localmente
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar productos, tiendas y asociaciones al inicio
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, storeResponse] = await Promise.all([
          api.get("/productos"),
          api.get("/tiendas"),
        ]);
        setProducts(productResponse.data);
        setStores(storeResponse.data);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("Hubo un problema al cargar los datos. Por favor, verifica tu conexión.");
      }
    };
    fetchData();
  }, []);

  // Función para manejar la asociación de producto a tienda
  const handleAssociate = async () => {
    if (!selectedProduct || !selectedStore) {
      alert("Por favor selecciona un producto y una tienda.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post(`/productos/${selectedProduct}/tiendas/${selectedStore}`);
      alert("¡Asociación exitosa!");

      // Actualizar asociaciones localmente después de la asociación
      setAssociations((prev) => [
        ...prev,
        { productId: selectedProduct, storeId: selectedStore },
      ]);

      // Limpiar las selecciones
      setSelectedProduct("");
      setSelectedStore("");
    } catch (err) {
      console.error("Error asociando producto y tienda:", err);
      setError("Hubo un problema al asociar el producto y la tienda. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la eliminación de una asociación
  const handleRemoveAssociation = async (productId, storeId) => {
    setLoading(true);
    setError("");
    try {
      await api.delete(`/productos/${productId}/tiendas/${storeId}`);
      alert("¡Asociación eliminada!");

      // Actualizar las asociaciones después de eliminar una
      setAssociations((prev) => prev.filter(
        (association) => !(association.productId === productId && association.storeId === storeId)
      ));
    } catch (err) {
      console.error("Error eliminando la asociación:", err);
      setError("Hubo un problema al eliminar la asociación. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-bold">Asociar Producto a Tienda</h1>

      {/* Manejo de errores */}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Selección de Producto */}
      <div className="mb-4">
        <label htmlFor="product" className="block mb-2 text-lg font-medium">
          Seleccionar Producto
        </label>
        <select
          id="product"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Seleccionar Producto --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.nombre} - ${product.precio}
            </option>
          ))}
        </select>
      </div>

      {/* Selección de Tienda */}
      <div className="mb-4">
        <label htmlFor="store" className="block mb-2 text-lg font-medium">
          Seleccionar Tienda
        </label>
        <select
          id="store"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Seleccionar Tienda --</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.nombre} - {store.ciudad}
            </option>
          ))}
        </select>
      </div>

      {/* Botón para asociar producto a tienda */}
      <button
        onClick={handleAssociate}
        disabled={loading}
        className={`px-6 py-2 rounded text-white ${
          loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Asociando..." : "Asociar"}
      </button>

      {/* Mostrar asociaciones actuales */}
      <h2 className="text-xl mt-6 mb-4 font-semibold">Asociaciones Actuales</h2>
      {associations.length > 0 ? (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Producto</th>
              <th className="border border-gray-300 px-4 py-2">Tienda</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {associations.map(({ productId, storeId }) => {
              const product = products.find((p) => p.id === productId);
              const store = stores.find((s) => s.id === storeId);

              return (
                <tr key={`${productId}-${storeId}`}>
                  <td className="border border-gray-300 px-4 py-2">{product?.nombre}</td>
                  <td className="border border-gray-300 px-4 py-2">{store?.nombre}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleRemoveAssociation(productId, storeId)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div>No hay asociaciones actuales.</div>
      )}
    </div>
  );
};

export default Association;
