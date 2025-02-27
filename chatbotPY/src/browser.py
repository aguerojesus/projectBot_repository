import requests
import spacy
import re

from mejorar_consulta import identificar_intencion_sujeto

# Cargar el modelo de spaCy para español
nlp = spacy.load("es_core_news_sm")

# Clave API de SerpAPI (reemplázala con la tuya)
SERPAPI_KEY = "43e8ea9c8e549634f16a2d62a08197a26cbcbe74350090a100ffd5bb8564fb73"

GEMINI_API_KEY = "AIzaSyCUGwh8GMZ6qwhUNhegHoNNppuugQR48O4"

prompt_gemini = """
Responde como si fueras la Universidad de Costa Rica, sede Paraíso. Mantén un tono formal e institucional, brindando información clara y precisa con un maximo de 300 caracteres. Si el resumen de información es relevante para la respuesta, úsalo. Si no lo es, responde solo con información pertinente a la UCR de Paraíso.

Para saludos o despedidas como "Hola", "Adiós" o similares, responde de manera cordial y respetuosa, mencionando que estás aquí para ayudar con información sobre la UCR de Paraíso.
En los demás casos, si no tienes suficiente información para dar una respuesta adecuada a la pregunta del usuario, no respondas.

En la respuesta agrega el link de la fuente de información de donde se extrajo el resumen. Si no se extrajo información de una fuente, no incluyas link.
Utiliza <a link>Nombre apropiado</a>
Puedes agregar amoticones si lo consideras necesario, pero no abuses de ellos.
Importante, Estructura la respuesta con html para darle formato. Ejemplo:
    - <a> para enlaces
    - <b> para negritas
    - <i> para cursivas
    - <ul> y <li> para listas
    - <p> para párrafos
    - <br> para saltos de línea
    - <h1>, <h2>, <h3> para títulos
    - <img> para imágenes
"""

def buscar_en_serpapi(consulta):

    """Busca información en Google usando SerpAPI con filtrado de sitios específicos"""
    query = f"{consulta} site:paraiso.ucr.ac.cr OR site:ematricula.ucr.ac.cr OR site:vive.ucr.ac.cr"
    url = "https://serpapi.com/search"
    params = {"q": query, "api_key": SERPAPI_KEY}
    
    respuesta = requests.get(url, params=params)
    if respuesta.status_code == 200:
        resultados = respuesta.json().get("organic_results", [])
        return resultados
    else:
        print(f"❌ Error en SerpAPI: {respuesta.status_code}")
        return []


def resumir_con_spacy(texto, num_frases=3):
    """Resume el contenido usando spaCy"""
    doc = nlp(texto)
    
    # Dividir el texto en frases
    frases = [sent.text for sent in doc.sents]

    # Seleccionar las primeras `num_frases` frases para el resumen
    resumen = " ".join(frases[:num_frases])
    return resumen

def mejorar_con_gemini(texto, pregunta):
    """ Pide a Gemini que refine y haga más atractivo el resumen """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": f"{prompt_gemini} Pregunta del usuario: '{pregunta}', resumen de información extraída de diversas fuentes : '{texto}'"}]}],
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

def links_de_resultados(resultados):
    """Extrae los enlaces de los resultados de búsqueda"""
    links = [r["link"] for r in resultados if "link" in r]
    return links[0]

def buscador_response(consulta):
    respuesta = ""  # 👈 Aquí está el problema, nunca se asigna un valor real
    # 1️⃣ Buscar información en SerpAPI
    resultados = buscar_en_serpapi(consulta)
    # 2️⃣ Extraer y concatenar snippets de los primeros 3 resultados
    contenido = " ".join([r.get("snippet", "") for r in resultados[:3]])
    print(f"ℹ️ Contenido de los resultados: {contenido}")
    # 3️⃣ Resumir con spacy y luego mejorar con Gemini
    if contenido:
        links = links_de_resultados(resultados)
        print(f"ℹ️ Links de los resultados: {links}")
        resumen = contenido
        print(f"ℹ️ Resumen con spaCy: {resumen}")
        mensaje_final = mejorar_con_gemini(resumen + links, consulta)
        respuesta = mensaje_final  # 👈 Aquí asignamos el mensaje final a `respuesta`
    return respuesta  # 👈 Ahora la función devuelve el resultado correcto

