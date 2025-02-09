import "./FloatButtonComponent.css";

const FloatButtonComponent = ({ text, iconPath, onClick }:{text:string, iconPath:string, onClick:any}) => {
    return (
        <button className="Btn" onClick={onClick} aria-label={text}>
            <div className="sign">
                <svg viewBox="0 0 512 512">
                    <path d={iconPath}></path>
                </svg>
            </div>
            <div className="text">{text}</div>
        </button>
    );
};

export default FloatButtonComponent;
