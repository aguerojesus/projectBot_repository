from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from time import sleep

# Configuración para ejecutar con interfaz gráfica (sin necesidad de headless)
chrome_options = Options()
chrome_options.add_argument('--no-sandbox')  # A veces ayuda a evitar errores
chrome_options.add_argument('--disable-dev-shm-usage')  # Evita el uso compartido de memoria

# Configurar el servicio con WebDriverManager para instalar y gestionar el driver automáticamente
service = Service(ChromeDriverManager().install())

# Inicializar el navegador
driver = webdriver.Chrome(service=service, options=chrome_options)

# Abrir la página de ChatGPT
driver.get("https://chat.openai.com/")

# Esperar hasta que el campo de texto esté visible
wait = WebDriverWait(driver, 10)
input_box = wait.until(EC.visibility_of_element_located((By.ID, "prompt-textarea")))

# Escribir un mensaje en el campo de texto
input_box.send_keys("¡Hola, ChatGPT!")

# Esperar un poco para simular la escritura y enviar el mensaje
sleep(1)

# Enviar el mensaje presionando "Enter"
input_box.send_keys(Keys.RETURN)

# Esperar unos segundos para que ChatGPT responda
sleep(120)

# Intentar encontrar la respuesta del chatbot con el nuevo selector
try:
    # Buscar el div que contiene la respuesta dentro de la estructura proporcionada
    respuesta = driver.find_element(By.XPATH, '//div[contains(@class, "markdown prose")]//p')
    print("\nRespuesta de ChatGPT:")
    print(respuesta.text)
except Exception as e:
    print("\nNo se pudo encontrar la respuesta de ChatGPT. Error:", str(e))

# Cerrar el navegador después de obtener la respuesta
driver.quit()
