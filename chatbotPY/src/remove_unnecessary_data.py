import requests

# Tu clave de API de Gemini
GEMINI_API_KEY = "AIzaSyCUGwh8GMZ6qwhUNhegHoNNppuugQR48O4"

def remover_datos_innecesarios(frase):
    """ Pide a Gemini que remueva los datos innecesarios de la consulta """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    # Crear el cuerpo de la solicitud
    data = {
        "contents": [{
            "parts": [{
                "text": f"""
Dada la siguiente frase, devuelveme unicamente, la frase pero elimina los verbos y otros datos innecesarios para la consulta, no agregues comillas ni ningun otro signo, ni ninguna otra frase. 

Frase: {frase}

                """
            }]
        }]
    }

    try:
        # Hacer la solicitud
        respuesta = requests.post(url, json=data, headers=headers)
        
        # Comprobar si la solicitud fue exitosa
        if respuesta.status_code == 200:
            respuesta_json = respuesta.json()
            # Procesar la respuesta y extraer los datos relevantes
            intent_sujeto = respuesta_json.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "⚠️ Error: No se pudo extraer el texto de la respuesta de Gemini.")
            return intent_sujeto
        else:
            return f"❌ Error en la solicitud a Gemini: {respuesta.status_code} - {respuesta.text}"
    
    except requests.exceptions.RequestException as e:
        return f"⚠️ Error en la conexión con Gemini: {str(e)}"



