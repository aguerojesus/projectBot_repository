import { useEffect, useState } from "react";
import "./HomePage";
import FloatButtonComponent from "../../Components/FloatButton/FloatButtonComponent";
import ChatBotComponent from "../../Components/ChatBot";
import messaggeServices from "../../services/messageServices";
const HomePage = () => {
    const [htmlContent, setHtmlContent] = useState<string>('')
    const [isChatBotVisible, setIsChatBotVisible] = useState<boolean>(false);

    useEffect(() => {
        fetch('/Pagina.html')
            .then(response => response.text())
            .then(data => setHtmlContent(data))
    }, [])

    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            <FloatButtonComponent
                text="ChatBot"
                iconPath="M320 0c17.7 0 32 14.3 32 32l0 64 120 0c39.8 0 72 32.2 72 72l0 272c0 39.8-32.2 72-72 72l-304 0c-39.8 0-72-32.2-72-72l0-272c0-39.8 32.2-72 72-72l120 0 0-64c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224l16 0 0 192-16 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-16 0 0-192 16 0z"
                //onClick={() => setIsChatBotVisible(!isChatBotVisible)} 
                onClick={() => messaggeServices({ text: 'Hola' })} 
            />
            {isChatBotVisible && <ChatBotComponent />}
        </>
    );
}

export default HomePage;