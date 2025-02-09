const axios = require('axios');

const accessToken = 'NOLZ5DZZ5Q7STTIQV6536YAZ7OHRYVU7';

async function obtenerRespuesta(mensaje) {
    const url = 'https://api.wit.ai/message';
    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { q: mensaje }
        });

        console.log(response.data); // Depuración

        // Verificar los intents detectados
        const intents = response.data.intents;

        if (intents.length > 0) {
            const intent = intents[0].name;

            switch (intent) {
                case 'Concepto_Prematricula':
                    return "La prematrícula es el proceso en el que seleccionas cursos antes de la matrícula oficial.";
                case 'Proceso_Prematricula':
                    return "Para realizar la prematrícula, ingresa al sistema, elige tus cursos y confirma.";
                case 'Concepto_Matricula':
                    return "La matrícula es el proceso oficial donde inscribes los cursos para el semestre.";
                case 'Proceso_Matricula':
                    return "Para matricularte, entra al sistema en las fechas oficiales y selecciona los cursos.";
                default:
                    return "Lo siento, no entiendo tu pregunta. ¿Puedes ser más específico?";
            }
        }

        return "Lo siento, no entiendo tu pregunta. ¿Puedes ser más específico?";
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return "Hubo un error al procesar tu solicitud.";
    }
}

// Test
obtenerRespuesta('Que es la prematricula').then(console.log);
obtenerRespuesta('¿Como hago la matrícula?').then(console.log);
