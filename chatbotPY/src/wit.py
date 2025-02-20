import os
import requests
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN = os.getenv("3OFSKDB7UT4UHSVLKK562I4U3PFML47T")

# Función para enviar un mensaje a Wit.ai y obtener la intención
def obtener_intencion(mensaje):
    url = "https://api.wit.ai/message"
    
    try:
        response = requests.get(url, 
                                headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
                                params={"q": mensaje})
        
        response_data = response.json()
        print("Respuesta de Wit.ai:", response_data)  # Depuración
        
        # Verificar si hay intenciones detectadas
        intents = response_data.get("intents", [])
        
        if intents:
            return intents[0]["name"]  # Retorna el nombre de la intención más relevante
        
        return "por_defecto"  # Si no detecta intención, usa la respuesta por defecto
    except Exception as e:
        print("Error al conectar con Wit.ai:", e)
        return "por_defecto"
