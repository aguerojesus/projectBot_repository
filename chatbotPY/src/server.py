from flask import Flask, request, jsonify
from flask_cors import CORS
from browser import buscador_response
from correct_spelling import correctSpelling
from wit_ai_integration import obtener_intencion
from responses_chatbot import obtener_respuesta

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

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
        print("Intención:", mensaje_respuesta)
        return jsonify({"respuesta": mensaje_respuesta})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Error procesando el mensaje"}), 500

# Ruta de prueba
@app.route("/mensaje", methods=["GET"])
def prueba():
    return jsonify({"mensaje": "Mensaje recibido correctamente"})


# Ruta principal para recibir las consultas
@app.route('/analizar', methods=['POST'])
def analizar():
    # Obtener la consulta del cuerpo de la solicitud
    data = request.get_json()
    
    # Verificar si se envió la consulta
    if 'consulta' not in data:
        return jsonify({'error': 'Falta el parámetro "consulta"'}), 400
    
    consulta = data['consulta']
    
    # Llamar a la función para verificar si la consulta es negativa
    resultado = es_negativa(consulta)
    
    # Retornar el resultado como respuesta JSON
    return resultado

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3000, debug=True)

