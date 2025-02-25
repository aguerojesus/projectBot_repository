import json

try:
    with open("./../data/answers.json", "r", encoding="utf-8") as file:
        data = json.load(file)
        answers = data.get("answers", {})
except (FileNotFoundError, json.JSONDecodeError):
    answers = {"por_defecto": "Lo siento, no tengo una respuesta para eso."}

try:
    with open("./../data/contacts.json", "r", encoding="utf-8") as file:
        data = json.load(file)
        contacts = data.get("contacts", [])
except (FileNotFoundError, json.JSONDecodeError):
    contacts = []
    
intentos_fallidos = 0
def obtener_respuesta(intent):
    global intentos_fallidos

    if not intent or not isinstance(intent, str):
        intentos_fallidos += 1
        # Si se han fallado 3 veces, preguntar si necesita más ayuda
        if intentos_fallidos >= 3:
            intentos_fallidos = 0  # Resetear el contador
            return "¿Puedo ayudarte con algo más? Si no, puedo cerrar sesión."
        return answers.get("por_defecto", "Lo siento, no tengo una respuesta para eso.")
    
    # Resetear el contador si hay una intención válida
    intentos_fallidos = 0
    return answers.get(intent, answers.get("por_defecto", "Lo siento, no tengo una respuesta para eso."))

def obtener_contactos_por_criterio(criterio):
    if not criterio or not isinstance(criterio, str):
        return "Por favor, ingresa un criterio de búsqueda válido"

    criterio_lower = criterio.lower()
    contactos_encontrados = [
        contacto for contacto in contacts
        if any(criterio_lower in str(valor).lower() for clave, valor in contacto.items() if isinstance(valor, str))
    ]

    return contactos_encontrados if contactos_encontrados else "No se encontraron contactos"
