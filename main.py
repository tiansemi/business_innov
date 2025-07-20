from typing import Union
from google import genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


from dotenv import load_dotenv
import os
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

@app.get("/prompt/{text}")
def read_item(text):
    import urllib.parse
    decoded_text = urllib.parse.unquote(text)
    
    client = genai.Client(api_key=API_KEY)
    try:
        # Check if this is a specific analysis request
        if "études de cas" in decoded_text.lower():
            response1 = client.models.generate_content(
                model="gemini-2.5-flash", 
                contents=f"""
                {decoded_text}
                
                Présente 3 études de cas détaillées sous forme de tableaux HTML avec:
                - Cas de réussite avec facteurs clés de succès
                - Cas d'échec avec leçons apprises
                - Analyse comparative des stratégies
                
                Utilise un style professionnel avec les couleurs orange et blanc.
                """
            )
        elif "étapes d'implémentation" in decoded_text.lower() or "étapes détaillées" in decoded_text.lower():
            response1 = client.models.generate_content(
                model="gemini-2.5-flash", 
                contents=f"""
                {decoded_text}
                
                Présente un plan d'implémentation détaillé sous forme de tableaux HTML avec:
                - Chronologie des étapes (Phase 1, 2, 3...)
                - Durée estimée pour chaque étape
                - Ressources nécessaires par phase
                - Jalons et indicateurs de réussite
                
                Utilise un style professionnel avec les couleurs orange et blanc.
                """
            )
        elif "risques" in decoded_text.lower():
            response1 = client.models.generate_content(
                model="gemini-2.5-flash", 
                contents=f"""
                {decoded_text}
                
                Présente une analyse des risques sous forme de tableaux HTML avec:
                - Risques financiers et stratégies de mitigation
                - Risques opérationnels et solutions
                - Risques réglementaires et conformité
                - Plan de contingence pour chaque risque majeur
                
                Utilise un style professionnel avec les couleurs orange et blanc.
                """
            )
        elif "outils" in decoded_text.lower() or "équipements" in decoded_text.lower():
            response1 = client.models.generate_content(
                model="gemini-2.5-flash", 
                contents=f"""
                {decoded_text}
                
                Présente une liste complète des outils et équipements sous forme de tableaux HTML avec:
                - Équipements essentiels avec prix approximatifs en FCFA
                - Outils optionnels pour l'expansion
                - Fournisseurs recommandés en Côte d'Ivoire
                - Alternatives économiques et de qualité
                
                Utilise un style professionnel avec les couleurs orange et blanc.
                """
            )
        else:
            # Standard business analysis
            response1 = client.models.generate_content(
                model="gemini-2.5-flash", 
                contents=f"""
                Avant de commencer, vérifie si '{decoded_text}' correspond à un métier ou une activité commerciale viable. 
                Si ce n'est pas le cas, retourne simplement un message demandant de mieux détailler l'activité.
                
                Sinon, fournis des conseils détaillés pour démarrer une activité de '{decoded_text}' en Côte d'Ivoire, incluant:
                1. Les étapes de démarrage (sans tenir compte du budget initial)
                2. Les principaux risques à anticiper
                3. Des situations concrètes pour donner une idée globale de l'activité
                4. Une liste de fournisseurs/marchands locaux pour les équipements
                5. Des idées de partenariats avec d'autres métiers
                6. Un minimum de matériel recommandé pour commencer
                
                Présente le tout sous forme de tableaux HTML bien structurés avec un style professionnel utilisant les couleurs orange et blanc.
                Ajoute des styles CSS intégrés pour améliorer la lisibilité et l'apparence.
                Donne uniquement le contenu des tableaux sans accusé de réception ni texte d'introduction.
                """
            )
            
        result1 = response1.text if response1.text else "Aucune réponse générée"
    except Exception as e:
        result1 = f"<div style='color: red; padding: 20px; border: 1px solid red; border-radius: 5px;'><strong>Erreur:</strong> Impossible de traiter votre demande. Détails: {str(e)}</div>"

    return {"Prompt": decoded_text, "resultat1": result1}