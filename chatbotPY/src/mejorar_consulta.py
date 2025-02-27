import requests

GEMINI_API_KEY = "AIzaSyCUGwh8GMZ6qwhUNhegHoNNppuugQR48O4"

def identificar_intencion_sujeto(frase):
    """ Pide a Gemini que identifique la intención y el sujeto de una frase """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    # Crear el cuerpo de la solicitud
    data = {
        "contents": [{
            "parts": [{
                "text": f"""
Dada la siguiente frase, identica lo minimo que se necesita para entender la intención y el sujeto de la misma. Sin utilizar verbos

Frase: {frase}

Respuesta: "intención sujeto"

            """
            }]
        }]
    }

    # Hacer la solicitud
    respuesta = requests.post(url, json=data, headers=headers)

    if respuesta.status_code == 200:
        try:
            respuesta_json = respuesta.json()
            return respuesta_json.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "⚠️ Error: No se pudo extraer el texto de la respuesta de Gemini.")
        except Exception as e:
            return f"⚠️ Error al procesar la respuesta de Gemini: {str(e)}"
    else:
        return f"❌ Error en la solicitud a Gemini: {respuesta.status_code}"
