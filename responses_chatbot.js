const axios = require('axios');

const accessToken = 'NOLZ5DZZ5Q7STTIQV6536YAZ7OHRYVU7';

async function obtenerRespuesta(mensaje) {
    const url = 'https://api.wit.ai/message';
    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { q: mensaje }
        });

        // Imprimir la respuesta completa para depuración
        console.log(response.data);  // Esto mostrará todo el objeto de respuesta de Wit.ai

        // Detectar la intención
        const intent = response.data.intents && response.data.intents[0];
        
        // Verificar si la intención es 'Preguntas_de_matricula'
        if (intent && intent.name === 'Preguntas_de_matricula') {
            // Detectar la entidad de matricula
            const entidadMatricula = response.data.entities && response.data.entities['matricula:matricula'];
            if (entidadMatricula && entidadMatricula.length > 0) {
                return "Para matricularte, primero debes ingresar al portal de matrículas, llenar el formulario y subir los documentos requeridos.";
            }
        }

        return "Lo siento, no entiendo tu pregunta. ¿Puedes ser más específico?";
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return "Hubo un error al procesar tu solicitud.";
    }
}

// Test del bot
obtenerRespuesta('¿Cómo puedo hacer la matricula?').then(respuesta => {
    console.log(respuesta);  // Debería mostrar la respuesta correspondiente a la matrícula
});
