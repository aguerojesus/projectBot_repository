import { useEffect, useState } from "react";
import "./MessagesComponents.css";

const Message = ({ sender, message, formattedTime }: { sender: string, message: string, formattedTime: string }) => {
    const [mute, setMute] = useState<boolean>(true);

    useEffect(() => {
        if (!mute && sender === "Asistente R2-D2") {
            const cleanText = document.createElement('div');
            cleanText.innerHTML = message;
            const textToRead = cleanText.textContent || cleanText.innerText || "";
    
            const maxChunkLength = 300;  // Fragmentos pequeños para evitar límites
            const chunks: (string | undefined)[] = [];
    
            let remainingText = textToRead.trim();
            while (remainingText.length > maxChunkLength) {
                let splitIndex = remainingText.lastIndexOf(' ', maxChunkLength);
                if (splitIndex === -1) splitIndex = maxChunkLength;  // Por si hay una palabra muy larga
    
                chunks.push(remainingText.substring(0, splitIndex));
                remainingText = remainingText.substring(splitIndex + 1).trim();
            }
            if (remainingText) chunks.push(remainingText);
    
            const voices = speechSynthesis.getVoices();
            const selectedVoice = voices.find(voice => voice.lang === "es-ES") || null;
    
            const speakChunks = (index = 0) => {
                if (index >= chunks.length) {
                    setMute(true);  // Cuando termina de leer todo
                    return;
                }
    
                const utterance = new SpeechSynthesisUtterance(chunks[index]);
                utterance.lang = "es-ES";
                utterance.voice = selectedVoice;
    
                utterance.onend = () => {
                    speakChunks(index + 1);  // Llama al siguiente fragmento
                };
    
                utterance.onerror = (err) => {
                    console.error("Error en síntesis de voz:", err);
                    setMute(true);  // Por seguridad, silenciar si algo falla
                };
    
                speechSynthesis.speak(utterance);
            };
    
            speechSynthesis.cancel();  // Cancelar cualquier lectura previa
            speakChunks();  // Empezar a leer
    
        } else {
            speechSynthesis.cancel();  // Si mute es true o cambia algo
        }    
    }, [mute]);  // Las dependencias incluyen mute para asegurarse de que no se repita innecesariamente

    return (
        <>
            <div className={sender != "User" ? "msg left-msg animate__animated animate__backInLeft" : "msg right-msg animate__animated animate__backInRight"}>
                <div
                    className="msg-img"
                    style={{ backgroundImage: sender != "User" ? 'url(https://i.imgur.com/tox0ewn.png)' : 'url(https://static-00.iconduck.com/assets.00/death-star-icon-2043x2048-kbdst70a.png)' }}
                ></div>
                <div className="msg-bubble">
                    <div className="msg-info">
                        <div className="msg-info-name">{sender}</div>
                        <div className="msg-info-time">{formattedTime}</div>
                    </div>
                    <div className="msg-text" dangerouslySetInnerHTML={{ __html: message }} />
                    {sender != "User" ? //Solo el bot puede tener speaker
                        <div className="msg-options" onClick={() => setMute(!mute)}>
                            {mute ?
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style={{ width: "18px" }}><path fill="#41ade7" d="M301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" /></svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style={{ width: "20px" }}><path fill="#41ade7" d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z" /></svg>
                            }
                        </div> :
                        <></>
                    }
                </div>
            </div>
        </>
    );
}

export default Message;