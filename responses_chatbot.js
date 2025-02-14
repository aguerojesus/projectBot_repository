const respuestas = {
    Concepto_Prematricula: "La prematrícula es el proceso en el que seleccionas cursos antes de la matrícula oficial.",
    Proceso_Prematricula: "Para realizar la prematrícula, ingresa al sistema, elige tus cursos y confirma.",
    Concepto_Matricula: "La matrícula es el proceso oficial donde inscribes los cursos para el semestre.",
    Proceso_Matricula: "Para matricularte, entra al sistema en las fechas oficiales y selecciona los cursos.",
    por_defecto: "Lo siento, no entiendo tu pregunta. ¿Puedes ser más específico?"
};

// Función para obtener una respuesta según la intención detectada
function obtenerRespuesta(intent) {
    return respuestas[intent] || respuestas["por_defecto"];
}

module.exports = { obtenerRespuesta };
