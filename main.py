import os
import mysql.connector
from fastapi import FastAPI
from pydantic import BaseModel
from google import genai
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Carga las variables del archivo .env
load_dotenv()

app = FastAPI()

# CORS: solo permitimos el frontend local, no "*"
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://127.0.0.1:5501,http://localhost:5501").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    from unittest.mock import MagicMock
    client = MagicMock()

# Configuracion MySQL: credenciales leidas desde .env
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME")
}

class ChatRequest(BaseModel):
    message: str

class ContactRequest(BaseModel):
    nombre: str
    email: str
    telefono: str = ""
    asunto: str
    mensaje: str

class NewsletterRequest(BaseModel):
    email: str

def get_all_store_data():
    """Yjib el data kemel mel DB bech Gemini ya9rah kemel"""
    all_info = ""
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        # 1. Jib el Produits kol (nombre + precio solo, sin descripcion larga)
        cursor.execute("SELECT nombre, precio, categoria FROM productos")
        for row in cursor.fetchall():
            all_info += f"{row['categoria'].upper()}: {row['nombre']} {row['precio']}€\n"
            
        # 2. Jib el FAQ kol
        cursor.execute("SELECT pregunta, respuesta FROM faq")
        for row in cursor.fetchall():
            all_info += f"FAQ: {row['pregunta']} -> {row['respuesta']}\n"
            
        # 3. Jib Site Content kol
        cursor.execute("SELECT seccion, contenido FROM site_content")
        for row in cursor.fetchall():
            all_info += f"INFO TIENDA: {row['seccion']}: {row['contenido']}\n"
            
        conn.close()
        return all_info
    except Exception as e:
        return f"Error al leer DB: {e}"

@app.post("/contact")
async def contact_endpoint(req: ContactRequest):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contactos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(120),
                email VARCHAR(120),
                telefono VARCHAR(40),
                asunto VARCHAR(200),
                mensaje TEXT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute(
            "INSERT INTO contactos (nombre, email, telefono, asunto, mensaje) VALUES (%s,%s,%s,%s,%s)",
            (req.nombre, req.email, req.telefono, req.asunto, req.mensaje)
        )
        conn.commit()
        conn.close()
        return {"ok": True, "msg": "Mensaje recibido. Te responderemos pronto."}
    except Exception as e:
        return {"ok": False, "msg": "Error al guardar el mensaje."}


@app.post("/newsletter")
async def newsletter_endpoint(req: NewsletterRequest):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS newsletter (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(120) UNIQUE,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute(
            "INSERT IGNORE INTO newsletter (email) VALUES (%s)",
            (req.email,)
        )
        conn.commit()
        conn.close()
        return {"ok": True, "msg": "Suscripcion completada. Gracias!"}
    except Exception as e:
        return {"ok": False, "msg": "Error al suscribirse."}


@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        full_knowledge_base = get_all_store_data()

        prompt = f"""Eres el asistente de GameXStore. Datos de la tienda:
{full_knowledge_base}
Pregunta: "{request.message}"
Responde en español, breve y amable."""
        
        response = client.models.generate_content(
            model="gemini-flash-lite-latest",
            contents=prompt
        )
        
        return {"response": response.text}
        
    except Exception as e:
        print(f"[CHAT ERROR] {e}", flush=True)
        return {"response": "Error técnico, por favor intenta más tarde."}