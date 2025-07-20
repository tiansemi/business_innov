from google import genai


# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client(api_key="AIzaSyACBedmUiIUibbSZZlbcUlKjhjkZHFjEcs")
prompted = "Je veux être un bon vendeur, donne moi des ressources"
response = client.models.generate_content(
    model="gemini-2.5-flash", contents="comment je peux modifierle champ paymentStatus dans laa table order dans mon app wix avec du code velo".format(prompted)
)
print(response.text)
