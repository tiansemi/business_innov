
# ExpGainer - Business Assistant Platform

🚀 An AI-powered business consultation platform that helps entrepreneurs in Côte d'Ivoire start and develop their business activities.

## Features

- **AI Business Analysis**: Get detailed business advice using Google's Gemini AI
- **Multi-section Analysis**: 
  - Main business analysis
  - Case studies with success/failure examples
  - Implementation steps with timeline
  - Risk assessment and mitigation
  - Required tools and equipment with pricing
- **Voice Integration**: Voice input and text-to-speech output using Edge TTS
- **Interactive UI**: Modern interface built with Next.js and Chakra UI
- **Business Suggestions**: Pre-defined popular business ideas for quick selection

## Tech Stack

**Frontend:**
- Next.js 15 with React 19
- Chakra UI for components
- Heroicons for icons
- Axios for API calls

**Backend:**
- FastAPI (Python)
- Google Gemini AI API
- Edge TTS for text-to-speech
- CORS middleware for cross-origin requests

## Deployment on Replit

### Prerequisites

1. **Environment Variables**: Set up your Gemini API key
   - Go to the Secrets tab in your Replit workspace
   - Add a new secret: `GEMINI_API_KEY` with your Google AI API key
   - Get your API key from [Google AI Studio](https://aistudio.google.com/)

### Automatic Deployment

This project is configured for easy deployment on Replit:

1. **Clone/Import Project**: 
   - Fork this Repl or import from GitHub
   - All dependencies will be automatically installed

2. **Start the Application**:
   - Click the **Run** button to start the backend server
   - Use the "Start Frontend" workflow to launch the Next.js frontend
   - The backend runs on port 8000, frontend on port 3000

3. **Access Your Application**:
   - Frontend: Your Repl's URL (automatically forwarded from port 3000)
   - Backend API: `your-repl-url:8000` for direct API access

### Manual Setup (if needed)

If you need to set up manually:

```bash
git clonne https://github.com/tiansemi/business_innov.git
cd business_innov
python -m venv ev
.\ev\Scripts\activate
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
cd expgainer
npm i

# Start backend server
cd ..
fastapi dev main.py
```

open new terminal and run 

```bash
# Start frontend (in a new terminal)
cd expgainer
npm run dev
```

### Workflows Configuration

The project includes pre-configured workflows:

- **Start Backend**: Runs the FastAPI server (set as Run button default)
- **Start Frontend**: Runs the Next.js development server

### Publishing Your App

To make your app publicly accessible:

1. **Configure for Production**:
   - Go to the Deployments tab in your Replit workspace
   - Select "Autoscale Deployment" for automatic scaling
   - Configure your deployment settings

2. **Environment Setup**:
   - Ensure your `GEMINI_API_KEY` is set in Secrets
   - The app will automatically use production settings

3. **Deploy**:
   - Click "Deploy" to publish your application
   - Your app will be available at your deployment URL

### Configuration Files

- **`.replit`**: Defines run commands and port configurations
- **`requirements.txt`**: Python dependencies
- **`expgainer/package.json`**: Node.js dependencies
- **`.env`**: Environment variables (use Secrets tab instead)

### API Endpoints

The backend provides these endpoints:

- `GET /`: Health check
- `GET /prompt/{text}`: Main business analysis endpoint
- `POST /tts`: Text-to-speech conversion (planned)

### Troubleshooting

**Common Issues:**

1. **API Key Error**: Make sure `GEMINI_API_KEY` is set in Secrets tab
2. **Port Issues**: Ensure backend is running on 0.0.0.0:8000
3. **Frontend Not Loading**: Check if both backend and frontend are running

**Debug Steps:**

1. Check the Console tab for error messages
2. Verify both workflows are running successfully
3. Test backend API directly at `/` endpoint
4. Ensure all dependencies are installed

### Customization

To customize the application:

1. **Business Categories**: Edit the `businessSuggestions` array in `expgainer/pages/index.js`
2. **AI Prompts**: Modify the prompt templates in `main.py`
3. **Styling**: Update Chakra UI themes in `expgainer/pages/_app.js`
4. **Voice Settings**: Adjust TTS parameters in the voice handling functions

### Support

For deployment issues:
- Check Replit's deployment documentation
- Use the Console tab to debug issues
- Ensure all environment variables are properly set

---

**Note**: This application is specifically designed for deployment on Replit. All configurations are optimized for the Replit environment, including port forwarding, environment variable management, and automatic dependency installation.
