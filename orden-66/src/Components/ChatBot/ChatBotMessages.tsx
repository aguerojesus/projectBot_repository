import { ChatBotMessagesTypes } from "../../types/ChatBotMessagesTypes";

export const ChatBotMessages: ChatBotMessagesTypes[] = [
    {
        type: 'welcome',
        message: `
            <p><b>Bienvenido al chatbot R2-D2</b></p>
            <p>Soy tu asistente de la UCR Recinto Paraíso.</p>
            <p>Puedo brindarte información sobre los siguientes temas:</p>
            <ul style="text-align: left; display: inline-block;">
                <li> ✔️​ Matrícula</li>
                <li> ✔️​ Prematrícula</li>
                <li> ✔️​ Préstamo de Libros</li>
                <li> ✔️​ Préstamo de Equipo Audiovisual</li>
                <li> ✔️​ Otros asuntos universitarios</li>
            </ul>
            <p>¿En qué te puedo ayudar hoy? 😉</p>
        `
    },
    {
        type: 'inactive',
        message: "Esta sección se cerró por inactividad. Si quieres continuar con la conversación, cierra y abre de nuevo el chat. Gracias."
    },
    {
        type: 'help',
        message: "¿Necesitas algo más?"
    },
    {
        type: 'default',
        message: "Lo siento, no entiendo tu pregunta. ¿Puedes ser más específico?"
    },
    {
        type: 'si',
        message: '¡Genial! ¿En qué más puedo ayudarte?'
    },
    {
        type: 'no',
        message: "¡Entendido! fue un placer ayudarte. Si tienes más preguntas, no dudes en escribirme. 🌟"
    },
    {
        type: 'fallback',
        message: "Parece que no estoy entendiendo. ¿Quieres que te ayude con otra cosa?"
    },
    {
        type: 'adios',
        message: "¡Hasta luego! 🌟"
    }
];