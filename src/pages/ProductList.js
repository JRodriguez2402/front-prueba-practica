import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaExpand } from "react-icons/fa";
import  api  from "../services/api";
import Swal from "sweetalert2";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ nombre: "", precio: "", tipo: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/productos");
      setProducts(response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los productos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "precio" ? parseFloat(value) || "" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/productos/${currentId}`, form);
        Swal.fire("Actualizado", "El producto ha sido actualizado.", "success");
      } else {
        await api.post("/productos", form);
        Swal.fire("Creado", "El producto ha sido creado.", "success");
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el producto.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setIsEditing(true);
    setCurrentId(product.id);
    setIsModalOpen(true);
  };

  const handleView = (product) => {
    setForm(product);
    setIsEditing(false);
    setCurrentId(product.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esto eliminará el producto permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/productos/${id}`);
      Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
      fetchProducts();
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el producto.", "error");
    }
  };

  const resetForm = () => {
    setForm({ nombre: "", precio: "", tipo: "" });
    setIsEditing(false);
    setCurrentId(null);
    setIsModalOpen(false);
  };

  const openModalToCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Gestión de Productos</h1>
      <button
        onClick={openModalToCreate}
        className="px-4 py-2 rounded bg-green-500 text-white mb-6 flex items-center"
      >
        <FaPlus className="mr-2" />
        Crear Producto
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? "Editar Producto" : "Crear Producto"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-lg mb-1" htmlFor="nombre">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg mb-1" htmlFor="precio">
                  Precio
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg mb-1" htmlFor="tipo">
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="" disabled>
                    Selecciona un tipo
                  </option>
                  <option value="Perecedero">Perecedero</option>
                  <option value="No perecedero">No Perecedero</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded ${
                    isEditing ? "bg-yellow-500" : "bg-green-500"
                  } text-white`}
                >
                  <FaSave className="mr-2 inline" />
                  {isEditing ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl mb-4">Lista de Productos</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between mb-4 p-4 border rounded"
            >
              <div>
                <div className="font-bold text-lg">{product.nombre}</div>
                <div className="text-gray-600">${product.precio}</div>
                <div className="text-gray-500 italic">{product.tipo}</div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(product)}
                  className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  <FaExpand />
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
