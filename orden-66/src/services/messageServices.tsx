export const messageServices = async ({ text }: { text: string }) => {
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
        return data;
    } catch (error) {
        console.error("Error en messageServices:", error);
        return { error: "Error al conectar con el servidor" };
    }
};

export const nplServices = async ({ text }: { text: string }) => {
    try {
        const response = await fetch("http://127.0.0.1:3000/analizar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ consulta: text }) // Asegurar estructura correcta
        });
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Aquí puedes verificar si hay un campo 'error' o algo similar
        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        console.error("Error en nplServices:", error);
        return { error: "Error al conectar con el servidor o procesar la consulta." };
    }
};
