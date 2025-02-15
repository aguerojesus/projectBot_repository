const express = require("express");
const { obtenerIntencion } = require("./wit");
const { obtenerRespuesta } = require("./responses_chatbot");
const cors = require("cors");

const app = express();

// Habilitar CORS con los headers correctos
app.use(cors({
    origin: "http://localhost:5173", 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); // Para manejar JSON en las peticiones

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








// Ruta de prueba
app.post("/mensaje", (req, res) => {
    res.json({ mensaje: "Mensaje recibido correctamente" });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
