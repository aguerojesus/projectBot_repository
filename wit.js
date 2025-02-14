const axios = require("axios");
require("dotenv").config();

const accessToken = process.env.WIT_AI_ACCESS_TOKEN;

// Función para enviar un mensaje a Wit.ai y obtener la intención
async function obtenerIntencion(mensaje) {
    const url = "https://api.wit.ai/message";

    try {
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { q: mensaje }
        });

        console.log("Respuesta de Wit.ai:", response.data); // Depuración

        // Verificar si hay intenciones detectadas
        const intents = response.data.intents;

        if (intents.length > 0) {
            return intents[0].name; // Retorna el nombre de la intención más relevante
        }

        return "por_defecto"; // Si no detecta intención, usa la respuesta por defecto
    } catch (error) {
        console.error("Error al conectar con Wit.ai:", error);
        return "por_defecto";
    }
}

module.exports = { obtenerIntencion };
