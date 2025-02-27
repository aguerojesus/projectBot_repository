import requests
import spacy

# Cargar el modelo de spaCy para español
nlp = spacy.load("es_core_news_sm")

# Clave API de SerpAPI (reemplázala con la tuya)
SERPAPI_KEY = "b67b67e718b9efe57283b35a10f610be248315b6e1a9d83c1c1250d010d84cb7"

GEMINI_API_KEY = "AIzaSyCUGwh8GMZ6qwhUNhegHoNNppuugQR48O4"

prompt_gemini = """
Responde como si fueras la Universidad de Costa Rica, sede Paraíso. Mantén un tono formal e institucional, brindando información clara y precisa con un máximo de 300 caracteres. Si el usuario saluda (por ejemplo, "buenos días", "saludos cordiales", etc.), responde de manera cordial y formal, como corresponde en un contexto institucional. Si el resumen de información es relevante para la respuesta, úsalo. Si no lo es, responde solo con información pertinente a la UCR de Paraíso.

En los demás casos, si no tienes suficiente información para dar una respuesta adecuada a la pregunta del usuario, no respondas.
Si la pregunta del usuario no se entiende, no respondas.

Cuando el usuario se despide o dice algo negativo, porfavor agrega este emoticon "🌟" en tu despedida

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

# vive es el sitio con menor importancia
def buscar_en_serpapi(consulta, num_resultados):
    """Busca información en Google usando SerpAPI con filtrado de sitios específicos"""
    query_especifica = f"{consulta} site:paraiso.ucr.ac.cr OR site:ematricula.ucr.ac.cr"
    url = "https://serpapi.com/search"
    params = {"q": query_especifica, "api_key": SERPAPI_KEY}
    
    respuesta = requests.get(url, params=params)
    
    if respuesta.status_code == 200:
        resultados = respuesta.json().get("organic_results", [])
        
        if len(resultados) >= num_resultados:
            # Si hay suficientes resultados, retornarlos
            return resultados[:num_resultados]
        else:
            # Si no hay suficientes resultados, buscar más general
            print("❌ No se encontraron suficientes resultados en los sitios específicos. Buscando de manera más general...")
            query_general = f"{consulta} UCR paraiso"
            params["q"] = query_general
            respuesta_general = requests.get(url, params=params)
            
            if respuesta_general.status_code == 200:
                resultados_generales = respuesta_general.json().get("organic_results", [])
                return resultados_generales[:num_resultados]
            else:
                print(f"❌ Error en SerpAPI (búsqueda general): {respuesta_general.status_code}")
                return []
    else:
        print(f"❌ Error en SerpAPI (búsqueda específica): {respuesta.status_code}")
        return []



def resumir_con_spacy(texto, num_frases=3):
    """Resume el contenido usando spaCy"""
    doc = nlp(texto)
    
    # Dividir el texto en frases
    frases = [sent.text for sent in doc.sents]

    # Seleccionar las primeras `num_frases` frases para el resumen
    resumen = " ".join(frases[:num_frases])
    return resumen

def extraer_palabras_clave(consulta):
    # Procesamos la consulta con spaCy
    doc = nlp(consulta)
    
    # Filtramos las palabras clave (sustantivos, nombres propios, adjetivos, etc.)
    palabras_clave = []
    for token in doc:
        if token.pos_ in ['NOUN', 'PROPN', 'ADJ']:  # Sustantivos, nombres propios y adjetivos
            palabras_clave.append(token.text)
    
    # Unir las palabras clave en una nueva consulta
    return ' '.join(palabras_clave)

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

"""Obtiene una respuesta del buscador utilizando SerpAPI y Gemini"""
def buscador_response(consulta):
    respuesta = "" 
    # Extraer palabras clave de la consulta para buscar en SerpAPI
    consulta_serpAPI = extraer_palabras_clave(consulta)
    print(f"ℹ️ Consulta a SerpAPI: {consulta_serpAPI}")

    # Buscar en SerpAPI con las palabras clave
    resultados = buscar_en_serpapi(consulta_serpAPI, 1)
    print(f"ℹ️ Resultados de la búsqueda: {resultados}")

    # Si hay resultados, extraer los enlaces y mejorar el resumen con Gemini
    if resultados:
        mensaje_final = mejorar_con_gemini(resultados , consulta)
        respuesta = mensaje_final
    return respuesta 

