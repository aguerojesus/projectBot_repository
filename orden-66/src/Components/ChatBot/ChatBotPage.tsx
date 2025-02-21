import { useEffect, useRef, useState } from "react";
import "./ChatBotPage.css";
import IconChat from "./icon.tsx";
import messageServices from "../../services/messageServices.tsx";
import type { UserTypes } from "./userTypes.ts";

const MessageChat = ({ message, formattedTime }: { message: string, formattedTime: string }) => {
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
                    <label className="msger-send-btn" onClick={handleSendMessage}>Send</label>
                </form>
            </section>
        </div>
    );
}

export default ChatBotComponent;