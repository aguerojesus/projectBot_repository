import requests
from transformers import pipeline
import torch
import torch_directml  # Importar DirectML para AMD en Windows

# Claves API (Reemplázalas con las tuyas)
SERPAPI_KEY = "9d2a4bb719f8c31af03d7485a78fb314cea72e42166fa3b719c16ee37cfb7759"
GEMINI_API_KEY = "AIzaSyCUGwh8GMZ6qwhUNhegHoNNppuugQR48O4"

device = torch_directml.device()  # Usar la GPU de AMD

# Modelo de Hugging Face para resumen
summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=device)
def buscar_en_serpapi(consulta):
    #Busca información en Google usando SerpAPI
    url = "https://serpapi.com/search"
    params = {"q": consulta, "api_key": SERPAPI_KEY}
    
    respuesta = requests.get(url, params=params)
    if respuesta.status_code == 200:
        resultados = respuesta.json().get("organic_results", [])
        return resultados
    else:
        print(f"❌ Error en SerpAPI: {respuesta.status_code}")
        return []

def resumir_con_huggingface(texto):
    #Resume el contenido usando Hugging Face
    if len(texto) > 0:
        resumen = summarizer(texto, max_length=100, min_length=30, do_sample=False)
        return resumen[0]['summary_text']
    else:
        return "No hay contenido suficiente para resumir."

def mejorar_con_gemini(texto):
    #Pide a Gemini que refine y haga más atractivo el resumen
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": f"Crea una respuesta carismatica, y formal en base al siguiente texto, una unica respuesta no pongas nada mas, de no mas de 250 caracteres: {texto}"}]}]
    }

    respuesta = requests.post(url, json=data, headers=headers)
    
    if respuesta.status_code == 200:
        respuesta_json = respuesta.json()
        try:
            return respuesta_json["candidates"][0]["content"]["parts"][0]["text"]
        except KeyError:
            return "⚠️ Error: No se pudo extraer el texto de la respuesta de Gemini."
    else:
        return f"❌ Error en la solicitud a Gemini: {respuesta.status_code}"

def buscador_response(consulta):
    respuesta = ""  # 👈 Aquí está el problema, nunca se asigna un valor real

    # 1️⃣ Buscar información en SerpAPI
    consulta = "Psicologia UCR Paraíso"
    resultados = buscar_en_serpapi(consulta)

    # 2️⃣ Extraer y concatenar snippets de los primeros 3 resultados
    contenido = " ".join([r.get("snippet", "") for r in resultados[:3]])

    # 3️⃣ Resumir con Hugging Face y luego mejorar con Gemini
    if contenido:
        resumen = resumir_con_huggingface(contenido)
        mensaje_final = mejorar_con_gemini(resumen)
        respuesta = mensaje_final  # 👈 Aquí asignamos el mensaje final a `respuesta`

    return respuesta  # 👈 Ahora la función devuelve el resultado correcto

