Mi Tienda Online

Este proyecto es una aplicación web creada con React y Tailwind CSS para gestionar productos, tiendas y asociaciones entre ellos. Los usuarios pueden asociar productos a tiendas y visualizar esas asociaciones de manera interactiva.

Tecnologías Utilizadas
React: Para construir la interfaz de usuario interactiva.
Tailwind CSS: Para la estilización de la aplicación de manera eficiente y moderna.
Axios: Para realizar peticiones HTTP a la API.
React Router: Para manejar la navegación entre las diferentes secciones de la aplicación.

Estructura del Proyecto:
bash
Copy code
/src
/components
/Association.js # Componente para asociar productos a tiendas
/Navigation.js # Barra de navegación
/services
/api.js # Configuración de Axios para la API
tailwind.config.js # Configuración de Tailwind CSS
App.js # Componente principal
index.js # Punto de entrada de la aplicación
index.css # Estilos globales

Instalación:
Clona el repositorio en tu máquina local:
bash
Copy code
git clone <url-del-repositorio>
cd <nombre-del-repositorio>

Instala las dependencias:
bash
Copy code
npm install
Crea un archivo .env en la raíz del proyecto y define la URL base de la API:
arduino
Copy code
REACT_APP_API_URL=http://tu-api-url.com

Ejecuta el proyecto en modo de desarrollo:
bash
Copy code
npm start
La aplicación debería estar corriendo en http://localhost:3000.

Descripción de los Componentes

1. Association.js
   Este componente permite a los usuarios asociar productos con tiendas. La lógica de la aplicación está dividida en varios estados:

products: Lista de productos obtenidos desde la API.
stores: Lista de tiendas obtenidas desde la API.
associations: Guarda las asociaciones de productos y tiendas realizadas por los usuarios.
selectedProduct y selectedStore: Almacenan el producto y tienda seleccionados por el usuario.
loading y error: Se usan para manejar el estado de carga y errores.
Funcionalidades:
Cargar productos y tiendas: Los datos se cargan al inicio utilizando useEffect y se almacenan en el estado.
Asociar producto y tienda: El usuario selecciona un producto y una tienda, y puede asociarlos con un botón.
Eliminar asociación: Los usuarios pueden eliminar asociaciones previamente creadas. 

2. Navigation.js
Este componente proporciona una barra de navegación básica con enlaces a las páginas de productos, tiendas y asociaciones. Utiliza react-router-dom para la navegación.

3. api.js
   Este archivo contiene la configuración de Axios para manejar las peticiones HTTP a la API, con la URL base definida en la variable de entorno REACT_APP_API_URL.

js
Copy code
import axios from 'axios';

const api = axios.create({
baseURL: process.env.REACT_APP_API_URL,
});
export default api; 

4. tailwind.config.js
El archivo de configuración de Tailwind CSS, que permite personalizar el marco de trabajo según las necesidades del proyecto.

Cómo Funciona la Aplicación

Interfaz de Usuario:
Página de Asociaciones: Los usuarios pueden seleccionar un producto y una tienda desde los menús desplegables. Luego pueden asociarlos haciendo clic en el botón "Asociar". También se pueden eliminar asociaciones existentes haciendo clic en el botón "Eliminar" junto a cada asociación.

Visualización de Asociaciones Actuales: Después de realizar una asociación, se muestran en una tabla las relaciones entre productos y tiendas, junto con un botón para eliminarlas.

Comunicación con la API:
La API debe tener las siguientes rutas:

GET /productos: Retorna la lista de productos disponibles.
GET /tiendas: Retorna la lista de tiendas disponibles.
POST /productos/{productId}/tiendas/{storeId}: Crea una nueva asociación entre un producto y una tienda.
DELETE /productos/{productId}/tiendas/{storeId}: Elimina una asociación existente.
