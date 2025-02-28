FROM python:3.11-slim

# Crear directorio de trabajo
WORKDIR /chatbotPY

# Copiar requerimientos
COPY requirements.txt .

# Instalar las dependencias
RUN pip install -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Descargar el modelo de spaCy
RUN python -m spacy download es_core_news_sm

# Exponer puerto
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["python", "src/server.py"]
