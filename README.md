# GameXStore

Tienda online de videojuegos, consolas y accesorios gaming.  
Proyecto de Fin de Grado — DAM · ILERNA Madrid · Anis Ben Ayed

---

## Descripción

GameXStore es una aplicación web e-commerce completa con frontend estático, API REST en Python y chatbot inteligente integrado con Google Gemini. Permite navegar el catálogo de productos, contactar con la tienda, suscribirse al newsletter y consultar dudas al asistente virtual.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend | Python 3.11 · FastAPI · Uvicorn |
| Base de datos | MySQL 8.0 |
| IA / Chatbot | Google Gemini API (`google-genai`) |
| Contenerización | Docker · Docker Compose |
| CI/CD | GitHub Actions (pytest + coverage) |

---

## Estructura del proyecto

```
GameXStore/
├── index.html               # Página principal / catálogo
├── cart.html                # Carrito de compra
├── servicios.html           # Servicios de la tienda
├── contacto.html            # Formulario de contacto
├── 404.html                 # Página de error
├── blog/                    # Entradas del blog
├── css/                     # Hojas de estilo
├── js/                      # Scripts del frontend
├── image/                   # Imágenes (productos, blog, og, iconos)
├── main.py                  # API FastAPI (endpoints /contact /newsletter /chat)
├── bbdd.sql                 # Esquema y datos de la base de datos
├── requirements.txt         # Dependencias de producción
├── requirements-dev.txt     # Dependencias de desarrollo (pytest, etc.)
├── regen_images.py          # Script de descarga y procesado de imágenes
├── Dockerfile               # Imagen Docker del backend
├── docker-compose.yml       # Orquestación backend + MySQL
├── start.bat                # Arranque rápido en Windows
├── tests/                   # Suite de tests automatizados
└── .github/workflows/ci.yml # Pipeline CI/CD
```

---

## Instalación y ejecución

### Opción A — Docker (recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/anisweb16/game.git
cd game

# 2. Crear el archivo de entorno
cp .env.example .env
# Editar .env con tu GEMINI_API_KEY y credenciales MySQL

# 3. Levantar los contenedores
docker compose up --build
```

La API quedará disponible en `http://localhost:8000`.

### Opción B — Ejecución local

```bash
# 1. Crear entorno virtual e instalar dependencias
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# 2. Configurar variables de entorno
cp .env.example .env
# Rellenar .env con los valores reales

# 3. Importar la base de datos
mysql -u root -p < bbdd.sql

# 4. Iniciar la API
uvicorn main:app --reload --port 8000

# 5. Abrir el frontend
# Abrir index.html con Live Server (VS Code) o similar
```

---

## Variables de entorno

Copia `.env.example` como `.env` y rellena los valores:

```env
GEMINI_API_KEY=tu_clave_aqui
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gamexstore_db
DB_USER=root
DB_PASSWORD=tu_password_aqui
ALLOWED_ORIGINS=http://127.0.0.1:5501,http://localhost:5501
```

> La clave de Gemini se obtiene en [https://ai.google.dev](https://ai.google.dev)

---

## API — Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/contact` | Guarda un mensaje de contacto en la BD |
| `POST` | `/newsletter` | Registra un email en la lista de suscriptores |
| `POST` | `/chat` | Consulta al chatbot Gemini con contexto de la tienda |
| `GET` | `/docs` | Documentación interactiva Swagger UI |

---

## Tests

```bash
pip install -r requirements-dev.txt
pytest -v --cov=main --cov-report=term-missing
```

El pipeline de CI ejecuta los tests automáticamente en cada push a `main`.

---

## Imágenes de productos

Las imágenes se generan con el script `regen_images.py`, que descarga las fotos desde Amazon, Wikipedia y Steam CDN, y las convierte a WebP/JPG en tres resoluciones (thumb 300px, card 600px, full 1200px).

```bash
python regen_images.py
```

---

## Autor

**Anis Ben Ayed**  
Ciclo Formativo de Grado Superior — Desarrollo de Aplicaciones Multiplataforma  
ILERNA Madrid · 2025
