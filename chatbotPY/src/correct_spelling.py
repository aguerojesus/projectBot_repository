from spellchecker import SpellChecker
spell = SpellChecker(language='es')
def correctSpelling(texto):
    print("Corrigiendo ortografía...", texto)
    palabras = texto.split() 
    print("Palabras:", palabras)
    
    # Corregir cada palabra, si no se puede corregir, dejamos la palabra original
    palabras_corregidas = []
    for palabra in palabras:
        corregida = spell.correction(palabra)
        if corregida and corregida != palabra:
            palabras_corregidas.append(corregida)
        else:
            palabras_corregidas.append(palabra)

    print("Palabras corregidas:", palabras_corregidas)
    return " ".join(palabras_corregidas)