import { useEffect, useState } from "react";
import "./HomePage";
import FloatButtonComponent from "../../Components/FloatButton/FloatButtonComponent";
import ChatBotComponent from "../../Components/ChatBot/ChatBotPage";

const HomePage = () => {
    const [htmlContent, setHtmlContent] = useState<string>('')
    const [isChatBotVisible, setIsChatBotVisible] = useState<boolean>(false);
    const [isHiding, setIsHiding] = useState<boolean>(false);

    useEffect(() => {
        fetch('/Pagina.html')
            .then(response => response.text())
            .then(data => setHtmlContent(data))
    }, [])

    const toggleChatBot = () => {
        if (isChatBotVisible) {
            setIsHiding(true); // Comienza la animación de cierre
            setTimeout(() => {
                setIsChatBotVisible(false);
                setIsHiding(false); // Reseteamos el estado de ocultar para la próxima vez
            }, 500); // Este tiempo debe coincidir con la duración de la animación
        } else {
            setIsChatBotVisible(true);
        }
    };

    return (
        <>
            <iframe
                src="/Pagina.html"
                style={{ width: '100%', height: '97vh', border: 'none' }}
                title="Pagina HTML"
            />
            <FloatButtonComponent
                text="ChatBot"
                iconPath="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"
                onClick={toggleChatBot}
            />
            {isChatBotVisible && (
                <ChatBotComponent isHiding={isHiding} />
            )}
        </>
    );
}

export default HomePage;