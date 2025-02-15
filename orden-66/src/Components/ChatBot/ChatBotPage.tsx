import { useEffect, useRef, useState } from "react";
import "./ChatBotPage.css";
import IconChat from "./icon.tsx";
const MessageChat = ({ message }: { message: string }) => {
    return (
        <>
            <div className="msg left-msg">
                <div
                    className="msg-img"
                    style={{ backgroundImage: 'url(https://accionsocial.ucr.ac.cr/sites/default/files/herramienta/imagenes/2020-12/Logo%20UCR.JPG)' }}
                ></div>
                <div className="msg-bubble">
                    <div className="msg-info">
                        <div className="msg-info-name">Orden-66</div>
                        <div className="msg-info-time">12:45</div>
                    </div>
                    <div className="msg-text">
                        {message}
                    </div>
                </div>
            </div>
        </>
    );
}

const MessageUser = ({ message }: { message: string }) => {
    return (
        <>
            <div className="msg right-msg">
                <div
                    className="msg-img"
                    style={{ backgroundImage: 'url(https://images.fineartamerica.com/images/artworkimages/medium/3/8-ahegao-danilov-ilya-transparent.png)' }}
                ></div>
                <div className="msg-bubble">
                    <div className="msg-info">
                        <div className="msg-info-name">User</div>
                        <div className="msg-info-time">12:46</div>
                    </div>
                    <div className="msg-text">
                        {message}
                    </div>
                </div>
            </div>
        </>
    );
}

const ChatBotComponent = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    const [historyUser, setHistoryUser] = useState<string[]>([]);
    const [historyBot, setHistoryBot] = useState<string[]>(["Hola", "Yo soy la ia de la ucr","sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss"]);

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


    return (
        <div className="chatbot">
            <section className="msger">
                <header className="msger-header">
                    <div className="msger-header-title">
                        <i>
                            {<IconChat />}
                        </i> ChatBot
                    </div>
                    <div className="msger-header-options">
                        <span><i className="fas fa-cog"></i></span>
                    </div>
                </header>

                <main className="msger-chat" ref={chatRef}>
                    {historyBot.map((message, index) => (
                        <MessageChat key={index} message={message} />
                    ))}
                    {historyUser.map((message, index) => (
                        <MessageUser key={index} message={message} />
                    ))}
                </main>

                <form className="msger-inputarea">
                    <input type="text" className="msger-input" ref={inputRef} placeholder="Enter your message..." />
                    <label className="msger-send-btn" onClick={handleSendMessage}>Send</label>
                </form>
            </section>
        </div>
    );
}

export default ChatBotComponent;