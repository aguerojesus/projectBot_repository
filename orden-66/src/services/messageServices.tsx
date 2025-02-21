const messageServices = async ({ text }: { text: string }) => {
    try {
        const response = await fetch("http://127.0.0.1:3000/mensaje", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ texto: text }) // Asegurar estructura correcta
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        return data;
    } catch (error) {
        console.error("Error en messageServices:", error);
        return { error: "Error al conectar con el servidor" };
    }
};

export default messageServices;
