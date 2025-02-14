const messaggeServices = ({text}:{text:string}) => {
    var url = 'http://localhost:3000/mensaje';

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: text}),
    })
        .then((res) => res.json())
        .then((data) => console.log("Respuesta:", data.respuesta))
        .catch((error) => console.error("Error:", error));
}

export default messaggeServices;