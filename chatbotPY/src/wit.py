import os
import requests
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")

# Función para enviar un mensaje a Wit.ai y obtener la intención
def obtener_intencion(mensaje):
    url = "https://api.wit.ai/message"
    
    try:
        response = requests.get(url, 
                                headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
                                params={"q": mensaje})
        
        response_data = response.json()
        print("Respuesta de Wit.ai:", response_data)  # Depuración completa
        
        # Verificar si hay intenciones detectadas
        intents = response_data.get("intents", [])
        if intents:
            print(f"Intención detectada: {intents[0]['name']}")  # Imprimir la intención detectada
            return intents[0]["name"]  # Retorna la intención
        
        return "por_defecto"  # Si no detecta intención, usa la respuesta por defecto
    except Exception as e:
        print("Error al conectar con Wit.ai:", e)
        return "por_defecto"

