import os
import requests

# Define directamente el valor del ACCESS_TOKEN
ACCESS_TOKEN = "K7ZJDLE6NAMXA33OKYDYHOIZZF47C6RL"

# Función para enviar un mensaje a Wit.ai y obtener la intención
def obtener_intencion(mensaje):
    url = "https://api.wit.ai/message"
    
    try:
        response = requests.get(url, 
                                headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
                                params={"q": mensaje})
        
        response_data = response.json()

        # Verificar si hay intenciones detectadas
        intents = response_data.get("intents", [])
        if intents:
            return intents[0]["name"]  # Retorna la intención
        
        return "por_defecto"  # Si no detecta intención, usa la respuesta por defecto
    except Exception as e:
        print("Error al conectar con Wit.ai:", e)
        return "por_defecto"
