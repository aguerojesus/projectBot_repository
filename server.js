const express = require("express");
const { obtenerIntencion } = require("./wit");
const { obtenerRespuesta } = require("./responses_chatbot");

const app = express();
app.use(express.json());

// Ruta para procesar mensajes desde el frontend
app.post("/mensaje", async (req, res) => {
    const { texto } = req.body;

    if (!texto) {
        return res.status(400).json({ error: "Debes enviar un mensaje de texto" });
    }

    try {
        const intent = await obtenerIntencion(texto); // Detectar intención con Wit.ai
        const mensajeRespuesta = obtenerRespuesta(intent); // Obtener respuesta según la intención

        res.json({ respuesta: mensajeRespuesta });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error procesando el mensaje" });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
