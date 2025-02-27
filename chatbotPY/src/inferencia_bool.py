import spacy

# Cargar el modelo de spaCy
nlp = spacy.load("es_core_news_sm")

def es_negativa(consulta: str) -> bool:
    # Procesar la consulta
    doc = nlp(consulta)
    
    # Buscar palabras de negación
    for token in doc:
        if token.dep_ == "neg" or token.text.lower() in ["no", "nada", "nadie", "ningún", "jamás", "nunca"]:
            return True  # Si se encuentra una palabra de negación, la oración es negativa
    
    return False  # Si no se encuentra ninguna palabra de negación, la oración no es negativa
