import sys
import os
from wit_ai_integration import obtener_intencion
from server import procesar_mensaje

def test_intencion_basica():
    entrada = "Que es la matricula"
    resultado = obtener_intencion(entrada)  
    assert "bien" in resultado.lower() or "hola" in resultado.lower(), f"Error: Resultado inesperado: {resultado}"

def test_intencion_wit():
    entrada = "necesito saber como matricular"
    resultado = obtener_intencion(entrada)  
    assert "clima" in resultado, f"Error: Intención no detectada correctamente: {resultado}"

def test_entrada_invalida():
    entrada = "%%%&&&&**"
    resultado = obtener_intencion(entrada)
    assert "perdón" in resultado.lower() or "no entendí" in resultado.lower(), f"Error: No se manejó correctamente la entrada inválida: {resultado}"

def test_combinado_wit_y_gemini():
    entrada = "Ayúdame a encontrar información sobre horarios"
    resultado = procesar_mensaje(entrada)  
    assert "horarios" in resultado.lower(), f"Error: El chatbot no respondió correctamente a la solicitud combinada: {resultado}"




#Ejecutar test pytest chatbot_test.py
#Si no ejecuta esta opción: python -m pytest chatbot_test.py