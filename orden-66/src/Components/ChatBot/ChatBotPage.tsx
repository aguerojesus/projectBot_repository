import { useEffect, useRef, useState } from "react";
import "./ChatBotPage.css";
import IconChat from "./icon.tsx";
import messageServices from "../../services/messageServices.tsx";
import type { UserTypes } from "../../types/userTypes.ts";
import Message from "../Messages/MessagesComponents.tsx";
import { ChatBotMessages } from "./ChatBotMessages.tsx";
import { ChatBotMessagesTypes } from "../../types/ChatBotMessagesTypes.ts";

const ChatBotComponent = ({ isHiding }: { isHiding: boolean }) => {
    const [botName] = useState<string>("Asistente R2-D2");
    const [hear, setHear] = useState<boolean>(false); // Activa el micrófono
    /* si van 3 veces que no entiende, se le pregunte al usuario si lo puedo ayudar con otra cosa, y si dice que no, se cierre sesión */
    const [numTimesNotUnderstood, setNumTimesNotUnderstood] = useState<number>(3); 
    const [formattedTime] = useState<string>(`${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`); //
    const [count, setCount] = useState<number>(0); // Contador para desactivar el chat despues de 3 mensajes
    const [talk, setTalk] = useState<boolean>(false); // El chat hablara siempre que haya un mensaje nuevo
    const [messageChat] = useState<ChatBotMessagesTypes[]>(ChatBotMessages);


    const inputRef = useRef<HTMLTextAreaElement>(null); // Obtiene el valor del input
    const chatRef = useRef<HTMLDivElement>(null); // Baja el chat despues de enviar un mensaje

    const [historyChat, setHistoryChat] = useState<UserTypes[]>(() => {
        const savedHistory = localStorage.getItem('historyChat');
        return savedHistory ? JSON.parse(savedHistory) : [{
            sender: botName,
            message: messageChat[0].message,
            formattedTime: formattedTime
        }];
    });

    useEffect(() => { // Desactiva el chat despues de 3 mensajes y envia un mensaje de despedida
        if (count < 3) {
            const timeout = setTimeout(() => {
                setCount(count + 1);
                if (count === 2) {
                    setHistoryChat(prevHistory => [
                        ...prevHistory,
                        { sender: botName, message: messageChat[1].message, formattedTime: formattedTime }
                    ]);
                } else {
                    setHistoryChat(prevHistory => [
                        ...prevHistory,
                        { sender: botName, message: messageChat[2].message, formattedTime: formattedTime }
                    ]);
                }

            }, 30000);

            return () => clearTimeout(timeout);
        }
    }, [historyChat]);

    useEffect(() => {
        
    }, [count]);

    const handleSendMessage = async () => {
        if (inputRef.current) {
            const message = inputRef.current.value.trim();
            if (message !== "") {
                setHistoryChat(prevHistory => [...prevHistory, { sender: 'User', message: message, formattedTime: formattedTime }]);
                setCount(0);
                inputRef.current.value = "";

                try {
                    const response = await messageServices({ text: message });
                    if (response && response.respuesta) {
                        setHistoryChat(prevHistory => [...prevHistory, { sender: botName, message: response.respuesta, formattedTime: formattedTime }]);
                    } else {
                        setHistoryChat(prevHistory => [...prevHistory, { sender: botName, message: "Error al obtener respuesta", formattedTime: formattedTime }]);
                    }
                } catch (error) {
                    console.error("Error al enviar mensaje:", error);
                    setHistoryChat(prevHistory => [...prevHistory, { sender: botName, message: "No se pudo conectar con el servidor", formattedTime: formattedTime }]);
                }
            }
        }
    };

    useEffect(() => { // Activa el micrófono
        if (hear) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.lang = "es-ES";
            recognition.start();

            recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
                const message = event.results[0][0].transcript;
                inputRef.current!.value = message;
                handleSendMessage();
            }
        }
    }, [hear]);

    useEffect(() => { // Guarda los mensajes en el localStorage
        localStorage.setItem('historyChat', JSON.stringify(historyChat));
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [historyChat]);

    useEffect(() => {
        if (isHiding) {
            deleteDefaultMessages();
            setTalk(false);
        }
    }, [isHiding]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { // Para usar el enter
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const deleteDefaultMessages = () => {
        setHistoryChat((prevHistory) => {
            const updatedHistory = prevHistory.filter(
                (item) =>
                    item.message !== messageChat[1].message && item.message !== messageChat[2].message
            );
            localStorage.setItem('historyChat', JSON.stringify(updatedHistory));
            return updatedHistory;
        });
    };

    useEffect(() => { // Habla el chat si el último mensaje fue del bot y el talk está activado
        var lastMessage = historyChat[historyChat.length - 1];
        if (talk && lastMessage.sender === botName) {
            const utterance = new SpeechSynthesisUtterance(lastMessage.message);
            utterance.lang = "es-ES";
            setTimeout(() => {
                window.speechSynthesis.speak(utterance);
            }, 100); // 100 ms de retraso        
        }
    }, [talk, historyChat]);

    return (
        <div className={`chatbot animate__animated ${isHiding ? "animate__slideOutDown" : "animate__slideInUp"}`}>
            <section className="msger">
                <header className="msger-header">
                    <div className="msger-header-title">
                        {<IconChat />}
                        <span>Chatbot y Asistente UCR</span>
                    </div>

                    <div className="checkbox-wrapper-35">
                        <input value="private" name="switch" id="switch" type="checkbox" className="switch" />
                        <label htmlFor="switch" onClick={() => setTalk(!talk)}>
                            <span className="switch-x-text">Talk is </span>
                            <span className="switch-x-toggletext">
                                <span className="switch-x-unchecked"><span className="switch-x-hiddenlabel">Unchecked: </span>Off</span>
                                <span className="switch-x-checked"><span className="switch-x-hiddenlabel">Checked: </span>On</span>
                            </span>
                        </label>
                    </div>
                </header>

                <main className="msger-chat" ref={chatRef}>
                    {historyChat.map((user, index) => (
                        <Message key={index} sender={user.sender} message={user.message} formattedTime={user.formattedTime} />
                    ))}
                </main>

                <form className="msger-inputarea">
                    <textarea className="msger-input" ref={inputRef} placeholder="Enter your message..." onKeyPress={handleKeyPress}
                        disabled={count > 2}
                        maxLength={100}
                    />
                    <div className="microphone" onClick={() => setHear(!hear)}>
                        {hear ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{ width: "12px" }}>
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