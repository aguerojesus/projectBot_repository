const messaggeServices = ({text}:{text:string}) => {

    fetch("http://localhost:3000/mensaje", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "texto" : "Que es prematricula" })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error jesus:", error));
}

export default messaggeServices;