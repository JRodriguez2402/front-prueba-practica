import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaExpand } from "react-icons/fa";
import  api  from "../services/api";
import Swal from "sweetalert2";

const StoreForm = () => {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    ciudad: "",
    direccion: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal
  const [errors, setErrors] = useState({});

  // Cargar tiendas al iniciar el componente
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await api.get("/tiendas");
      setStores(response.data);
    } catch (error) {
      console.error("Error al cargar las tiendas:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Limpiar el error del campo modificado
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.ciudad) newErrors.ciudad = "La ciudad es obligatoria.";
    else if (form.ciudad.length !== 3) newErrors.ciudad = "El código de ciudad debe tener 3 caracteres.";
    if (!form.direccion) newErrors.direccion = "La dirección es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // No continuar si el formulario tiene errores

    try {
      if (isEditing) {
        // Editar tienda existente
        await api.put(`/tiendas/${currentId}`, form);
        Swal.fire("Tienda Actualizada", "La tienda se actualizó correctamente.", "success");
      } else {
        // Crear nueva tienda
        await api.post("/tiendas", form);
        Swal.fire("Tienda Creada", "La tienda se creó correctamente.", "success");
      }
      fetchStores();
      resetForm();
    } catch (error) {
      console.error("Error al guardar la tienda:", error);
      Swal.fire("Error", "Hubo un problema al guardar la tienda.", "error");
    }
  };

  const handleEdit = (store) => {
    setForm(store);
    setIsEditing(true);
    setCurrentId(store.id);
    setIsModalOpen(true); // Abrir modal
  };

  const handleView = (store) => {
    setForm(store);
    setIsEditing(false);
    setCurrentId(store.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Este proceso eliminará la tienda permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await api.delete(`/tiendas/${id}`);
        fetchStores();
        Swal.fire("Tienda Eliminada", "La tienda ha sido eliminada.", "success");
      } catch (error) {
        console.error("Error al eliminar la tienda:", error);
        Swal.fire("Error", "Hubo un problema al eliminar la tienda.", "error");
      }
    }
  };

  const resetForm = () => {
    setForm({ nombre: "", ciudad: "", direccion: "" });
    setIsEditing(false);
    setCurrentId(null);
    setIsModalOpen(false); // Cerrar modal
    setErrors({});
  };

  const openModalToCreate = () => {
    resetForm();
    setIsModalOpen(true); // Abrir modal para nueva tienda
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Gestión de Tiendas</h1>

      {/* Botón para abrir el modal */}
      <button
        onClick={openModalToCreate}
        className="px-4 py-2 rounded bg-green-500 text-white mb-6"
      >
        <FaPlus className="inline mr-2" />
        Crear Tienda
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/3 p-6">
            <h2 className="text-2xl mb-4 font-semibold">
              {isEditing
                ? "Editar Tienda"
                : currentId
                ? "Detalles de Tienda"
                : "Crear Tienda"}
            </h2>
            <form
              onSubmit={isEditing || !currentId ? handleSubmit : (e) => e.preventDefault()}
            >
              {currentId && !isEditing && (
                <div className="mb-4">
                  <label className="block text-lg mb-1" htmlFor="id">
                    ID de la tienda
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={currentId}
                    className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
              )}
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
                  className={`w-full p-2 border rounded ${errors.nombre ? "border-red-500" : ""}`}
                  required
                  disabled={!isEditing && currentId}
                />
                {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-lg mb-1" htmlFor="ciudad">
                  Ciudad (Código 3 caracteres)
                </label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.ciudad ? "border-red-500" : ""}`}
                  required
                  maxLength={3}
                  disabled={!isEditing && currentId}
                />
                {errors.ciudad && <p className="text-red-500 text-sm">{errors.ciudad}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-lg mb-1" htmlFor="direccion">
                  Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.direccion ? "border-red-500" : ""}`}
                  required
                  disabled={!isEditing && currentId}
                />
                {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                >
                  Cancelar
                </button>
                {(isEditing || !currentId) && (
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded ${
                      isEditing ? "bg-yellow-500" : "bg-green-500"
                    } text-white`}
                  >
                    <FaSave className="inline mr-2" />
                    {isEditing ? "Actualizar" : "Guardar"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Tiendas */}
      <div>
        <h2 className="text-xl mb-4">Lista de Tiendas</h2>
        {stores.map((store) => (
          <div
            key={store.id}
            className="flex items-center justify-between mb-4 p-4 border rounded"
          >
            <div>
              <div className="font-semibold">{store.nombre}</div>
              <div className="text-gray-600">{store.ciudad}</div>
              <div className="text-gray-600">{store.direccion}</div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleView(store)}
                className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                <FaExpand />
              </button>
              <button
                onClick={() => handleEdit(store)}
                className="p-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(store.id)}
                className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreForm;
