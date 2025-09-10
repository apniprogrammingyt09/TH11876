import random
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# --- Selenium Setup ---
options = Options()
options.add_argument("--headless")  # run in background
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# --- Your Google Form link ---
FORM_URL = "https://docs.google.com/forms/d/1U7Edj8CCE57r4ZcuDakiEwS6bgTnw6dxOWQupPybnzo/viewform"

# --- Dummy data ---
genders = ["Male", "Female", "Prefer not say", "Other"]
regions = ["North", "South", "East", "West", "Central"]

def submit_dummy_response(user_id):
    driver.get(FORM_URL)
    time.sleep(2)  # let form load

    # ========== Fill Fields ==========
    # Note: adjust indexes if order in your form is different
    text_inputs = driver.find_elements(By.CSS_SELECTOR, 'input[type="text"]')

    # Name
    text_inputs[0].send_keys(f"User{user_id}")

    # Age
    text_inputs[1].send_keys(str(random.randint(18, 60)))

    # Region
    text_inputs[2].send_keys(random.choice(regions))

    # Contact
    text_inputs[3].send_keys(f"+91{random.randint(6000000000, 9999999999)}")

    # Select Gender (random one from the first multiple-choice block)
    gender_options = driver.find_elements(By.CSS_SELECTOR, 'div[role="radio"]')
    if gender_options:
        random.choice(gender_options).click()

    # TODO: Extend here for other multiple-choice / checkbox questions
    # You can locate them with driver.find_elements(By.CSS_SELECTOR, 'div[role="checkbox"]') or another 'div[role="radio"]'

    # ========== Submit ==========
    submit_btn = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, '//span[text()="Submit"]'))
    )
    driver.execute_script("arguments[0].click();", submit_btn)

    # Wait for submission confirmation
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//div[contains(text(),"response has been recorded")]'))
    )

    print(f"✅ Submitted User{user_id}")

# --- Run multiple submissions ---
for i in range(1, 106):  # 105 users
    submit_dummy_response(i)

driver.quit()