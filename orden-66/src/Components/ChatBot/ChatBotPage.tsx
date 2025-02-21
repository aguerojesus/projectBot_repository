import { useEffect, useRef, useState } from "react";
import "./ChatBotPage.css";
import IconChat from "./icon.tsx";
import messageServices from "../../services/messageServices.tsx";
import type { UserTypes } from "./userTypes.ts";

const MessageChat = ({ message, formattedTime }: { message: string, formattedTime: string }) => {
    const [mute, setMute] = useState<boolean>(true);

    useEffect(() => {
        if (!mute) {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = "en-ES";
    
            const voices = speechSynthesis.getVoices();
            
            const selectedVoice = voices.find(voice => voice.lang === "pt-BR");
            utterance.voice = selectedVoice || null;
    
            speechSynthesis.speak(utterance);

            utterance.onend = () => {
                setMute(true);
            };
            
        } else {
            speechSynthesis.cancel();
        }
    }, [mute, message]);
    

    return (
        <>
            <div className="msg left-msg animate__animated animate__backInLeft">
                <div
                    className="msg-img"
                    style={{ backgroundImage: 'url(https://i.imgur.com/tox0ewn.png)' }}
                ></div>
                <div className="msg-bubble">
                    <div className="msg-info">
                        <div className="msg-info-name">Asistente R2-D2</div>
                        <div className="msg-info-time">{formattedTime}</div>
                    </div>
                    <div className="msg-text" dangerouslySetInnerHTML={{ __html: message }} />
                    <div className="msg-options" onClick={() => setMute(!mute)}>
                        {mute ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style={{ width: "18px" }}><path fill="#41ade7" d="M301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" /></svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style={{ width: "20px" }}><path fill="#41ade7" d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z" /></svg>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

const MessageUser = ({ message, formattedTime }: { message: string, formattedTime: string }) => {
    return (
        <>
            <div className="msg right-msg animate__animated animate__backInRight">
                <div
                    className="msg-img"
                    style={{ backgroundImage: 'url(https://static-00.iconduck.com/assets.00/death-star-icon-2043x2048-kbdst70a.png)' }}
                ></div>
                <div className="msg-bubble">
                    <div className="msg-info">
                        <div className="msg-info-name">User</div>
                        <div className="msg-info-time">{formattedTime}</div>
                    </div>
                    <div className="msg-text">
                        {message}
                    </div>
                </div>
            </div>
        </>
    );
}

const ChatBotComponent = ({ isHiding }: { isHiding: boolean }) => {
    const [hear, setHear] = useState<boolean>(false);
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Cambia a true si quieres formato 12h
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    const [historyChat, setHistoryChat] = useState<UserTypes[]>(() => {
        const savedHistory = localStorage.getItem('historyChat');
        return savedHistory ? JSON.parse(savedHistory) : [{
            sender: 'Bot',
            message: "¡Hola! ¿En qué puedo ayudarte?",
            formattedTime: formattedTime
        }];
    });

    const handleSendMessage = async () => {
        if (inputRef.current) {
            const message = inputRef.current.value.trim();
            if (message !== "") {
                setHistoryChat(prevHistory => [...prevHistory, { sender: 'User', message: message, formattedTime: formattedTime }]);
                inputRef.current.value = "";

                try {
                    const response = await messageServices({ text: message });
                    if (response && response.respuesta) {
                        setHistoryChat(prevHistory => [...prevHistory, { sender: 'Bot', message: response.respuesta, formattedTime: formattedTime }]);
                    } else {
                        setHistoryChat(prevHistory => [...prevHistory, { sender: 'Bot', message: "Error al obtener respuesta", formattedTime: formattedTime }]);
                    }
                } catch (error) {
                    console.error("Error al enviar mensaje:", error);
                    setHistoryChat(prevHistory => [...prevHistory, { sender: 'Bot', message: "No se pudo conectar con el servidor", formattedTime: formattedTime }]);
                }
            }
        }
    };

    const OnMicrophone = () => {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = "es-ES";
        recognition.start();

        recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
            const message = event.results[0][0].transcript;
            inputRef.current!.value = message;
            handleSendMessage();
        }
    }

    useEffect(() => {
        if (hear) {
            OnMicrophone();
        }
    }, [hear]);

    useEffect(() => {
        localStorage.setItem('historyChat', JSON.stringify(historyChat));
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [historyChat]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={`chatbot animate__animated ${isHiding ? "animate__slideOutDown" : "animate__slideInUp"}`}>
            <section className="msger">
                <header className="msger-header">
                    <div className="msger-header-title">
                        {<IconChat />}
                        <span>Chatbot y Asistente UCR</span>
                    </div>
                </header>

                <main className="msger-chat" ref={chatRef}>
                    {historyChat.map((user, index) => (
                        user.sender === "User" ?
                            <MessageUser key={index} message={user.message} formattedTime={user.formattedTime} /> :
                            <MessageChat key={index} message={user.message} formattedTime={user.formattedTime} />
                    ))}
                </main>

                <form className="msger-inputarea">
                    <input type="text" className="msger-input" ref={inputRef} placeholder="Enter your message..." onKeyPress={handleKeyPress} />

                    <div className="microphone" onClick={() => setHear(!hear)}>
                        {hear ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{ width: "12px"}}>
                                <path fill="gray" d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style={{ width: "20px" }}>
                                <path fill="gray" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 21.2-5.1 41.1-14.2 58.7L416 300.8 416 96c0-53-43-96-96-96s-96 43-96 96l0 54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128l0-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6z" />
                            </svg>
                        }
                    </div>
                    <label className="msger-send-btn" onClick={handleSendMessage}>Send</label>
                </form>
            </section>
        </div >
    );
}

export default ChatBotComponent;