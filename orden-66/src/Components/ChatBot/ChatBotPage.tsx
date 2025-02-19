import { useEffect, useRef, useState } from "react";
import "./ChatBotPage.css";
import IconChat from "./icon.tsx";
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
                        <div className="msg-info-name">Orden-66</div>
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
    const inputRef = useRef<HTMLInputElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    const [historyUser, setHistoryUser] = useState<string[]>([]);
    const [historyBot, setHistoryBot] = useState<string[]>(["Hola, yo soy la ia de la ucr", "¿En qué puedo ayudarte?"]);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Cambia a true si quieres formato 12h
    });

    const handleSendMessage = () => {
        if (inputRef.current) {
            const message = inputRef.current.value;
            if (message.trim() !== "") {
                setHistoryUser(prevHistory => [...prevHistory, message]);
                inputRef.current.value = "";
            }
        }
    };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [historyUser, historyBot]);

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
                        <span>ChatBot</span>
                    </div>
                </header>

                <main className="msger-chat" ref={chatRef}>
                    {historyBot.map((message, index) => (
                        <MessageChat key={index} message={message} formattedTime={formattedTime} />
                    ))}
                    {historyUser.map((message, index) => (
                        <MessageUser key={index} message={message} formattedTime={formattedTime} />
                    ))}
                </main>

                <form className="msger-inputarea">
                    <input type="text" className="msger-input" ref={inputRef} placeholder="Enter your message..." onKeyPress={handleKeyPress}/>
                    <label className="msger-send-btn" onClick={handleSendMessage}>Send</label>
                </form>
            </section>
        </div>
    );
}

export default ChatBotComponent;