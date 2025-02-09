import "./ChatBotPage.css";
import FloatButton from "../../Components/FloatButton/FloatButtonComponent";

const ChatBotPage = () => {
    return (
        <div className="chatbot">
            <section className="msger">
                <header className="msger-header">
                    <div className="msger-header-title">
                        <i className="fas fa-comment-alt"></i> ChatBot
                    </div>
                    <div className="msger-header-options">
                        <span><i className="fas fa-cog"></i></span>
                    </div>
                </header>

                <main className="msger-chat">
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
                                Hi, welcome!😄
                            </div>

                        </div>
                    </div>

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
                                How can I enroll?
                            </div>
                        </div>
                    </div>
                </main>

                <form className="msger-inputarea">
                    <input type="text" className="msger-input" placeholder="Enter your message..." />
                    <button type="submit" className="msger-send-btn">Send</button>
                </form>
            </section>
            <div className="floatButtons">
                <div className="buttonContainer">
                    <FloatButton text="Matrícula" iconPath="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l352 0 0 256c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256z" onClick={() => console.log("Ir a Matrícula")} />
                </div>
                <div className="buttonContainer">
                    <FloatButton text="Otro Botón" iconPath="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l352 0 0 256c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256z" onClick={() => console.log("Otro botón")} />
                </div>
            </div>
        </div>
    );
}

export default ChatBotPage;