import requests
import spacy

# Cargar el modelo de spaCy para español
nlp = spacy.load("es_core_news_sm")

# Clave API de SerpAPI (reemplázala con la tuya)
SERPAPI_KEY = "9d2a4bb719f8c31af03d7485a78fb314cea72e42166fa3b719c16ee37cfb7759"

GEMINI_API_KEY = "AIzaSyCUGwh8GMZ6qwhUNhegHoNNppuugQR48O4"


def buscar_en_serpapi(consulta):
    """Busca información en Google usando SerpAPI"""
    url = "https://serpapi.com/search"
    params = {"q": consulta + " Del Recinto de Paraiso de la UCR", "api_key": SERPAPI_KEY}
    
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

def mejorar_con_gemini(texto):
    """ Pide a Gemini que refine y haga más atractivo el resumen """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": f"Crea una respuesta resumida, informativa y formal en base al siguiente texto, una unica respuesta no pongas nada mas, de no mas de 300 caracteres: {texto}"}]}]
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
    resultados = buscar_en_serpapi(consulta)

    # 2️⃣ Extraer y concatenar snippets de los primeros 3 resultados
    contenido = " ".join([r.get("snippet", "") for r in resultados[:3]])

    # 3️⃣ Resumir con Hugging Face y luego mejorar con Gemini
    if contenido:
        resumen = resumir_con_spacy(contenido)
        mensaje_final = mejorar_con_gemini(resumen)
        respuesta = mensaje_final  # 👈 Aquí asignamos el mensaje final a `respuesta`

    return respuesta  # 👈 Ahora la función devuelve el resultado correcto

