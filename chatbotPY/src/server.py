from flask import Flask, request, jsonify
from flask_cors import CORS
from browser import buscador_response
from correct_spelling import correctSpelling
from wit_ai_integration import obtener_intencion
from responses_chatbot import obtener_respuesta

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Habilitar CORS

# Ruta principal
@app.route('/')
def home():
    return "Bienvenido a la API de Chatbot. Envía un mensaje para procesarlo."

# Ruta para procesar el mensaje
@app.route("/mensaje", methods=["POST"])
def procesar_mensaje():
    data = request.get_json()
    texto = data.get("texto")
    
    if not texto:
        return jsonify({"error": "Debes enviar un mensaje de texto"}), 400
    
    try:
        intent = obtener_intencion(texto)  # Detectar intención con Wit.ai
        if intent == "por_defecto":
            respuesta = buscador_response(texto)
            if len(respuesta) > 5: # Gemini si no sabe que responder, no envia nada
                return jsonify({"respuesta": respuesta}) # Si no se detecta una intención, buscar en la web con SerpAPI y Gemini

        mensaje_respuesta = obtener_respuesta(intent)  # Obtener respuesta según la intención
        return jsonify({"respuesta": mensaje_respuesta})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Error procesando el mensaje"}), 500

# Ruta de prueba
@app.route("/mensaje", methods=["GET"])
def prueba():
    return jsonify({"mensaje": "Mensaje recibido correctamente"})

if __name__ == "__main__":
    app.run(port=3000, debug=True)
