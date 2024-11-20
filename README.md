Here’s a professional and well-structured README for your **YouTube to Blog (YTob)** project:  

---

# 🎥 YTob: YouTube to Blog Generator  

**YTob** is an innovative web application that automates the conversion of YouTube videos into SEO-optimized blog posts. With advanced AI capabilities, it enhances content creation efficiency by generating concise summaries, AI-driven images, and even social media-ready content.  

---

## 🌟 Features  
### 🎯 Core Functionality  
- **YouTube to Blog Conversion**: Automatically generates detailed blog posts from YouTube video content.  
- **Text Summarization**: Uses the Google Gemini API to condense lengthy content into concise summaries.  
- **AI-Generated Images**: Integrates DALL·E API for high-quality, AI-driven visuals.  
- **Image Fetching**: Automatically sources relevant images via Pexels and Unsplash APIs.  
- **Short Video Creation**: Converts long-form YouTube videos into engaging Shorts using OpenAI.
- **Stripe Integration**: Stripe integration for monthly subscription for three different plans. 

### 📱 Social Media Integration  
- **Dynamic Facebook Posts**: Generates visually appealing posts for increased social engagement.  

---

## 🛠️ Tech Stack  
- **Frontend**: React.js, Tailwind CSS  
- **Backend**: Express.js  
- **APIs**:  
  - OpenAI API  
  - Google Gemini API  
  - DALL·E API  
  - Pexels and Unsplash APIs  
- **Deployment**:  
  - **Frontend**: Vercel  
  - **Backend**: Render  

---

## 🚀 Getting Started  

### 1️⃣ Installation  
Clone the repository:  
```bash  
git clone https://github.com/abhicsng007/ytob.git  
cd ytob  
```  

### 2️⃣ Install Dependencies  
For the frontend:  
```bash  
cd frontend  
npm install  
```  
For the backend:  
```bash  
cd backend  
npm install  
```  

### 3️⃣ Environment Setup  
Create a `.env` file in the root directories (`frontend` and `backend`) and add the following variables:  
#### Frontend:  
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<pk_test_>
NEXT_PUBLIC_API_URL=http://localhost:5000

```  
#### Backend:  
```
MONGODB_URI = ""
OPENAI_API_KEY=""
JWT_SECRET=""
JWT_REFRESH_SECRET=""
GEMINI_API_KEY = ""
PEXELS_API_KEY = ""
UNSPLASH_API_KEY = ""
GOOGLE_API_KEY = ""
GOOGLE_CX_ID =  ""
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=http://localhost:3000
PORT=5000
```  

### 4️⃣ Start the Application  
Start the backend:  
```bash  
cd backend  
npm start  
```  
Start the frontend:  
```bash  
cd frontend/ytob  
npm start  
```  

The app will run on `http://localhost:3000`.  

---

## 📈 Key Features Breakdown  

1. **YouTube Video Processing**  
   - Extracts video metadata and captions for text analysis.  

2. **Text Summarization**  
   - Utilizes Google Gemini API to create concise blog content.  

3. **AI Image Generation**  
   - Integrates DALL·E for generating context-aware images.  

4. **Dynamic Content Styling**  
   - Uses Tailwind CSS for a clean, responsive UI.  

5. **Seamless Deployment**  
   - Deployed on **Vercel** and **Render** for smooth user experiences.
     
6. **Monthly Subscription**  
   - Monthly recurrent subscription using **Stripe**.  

---

## 🤝 Contributions  
Contributions are welcome! Follow these steps to contribute:  
1. Fork the repository.  
2. Create a new branch:  
   ```bash  
   git checkout -b feature/YourFeatureName  
   ```  
3. Commit your changes:  
   ```bash  
   git commit -m "Add YourFeatureName"  
   ```  
4. Push to the branch:  
   ```bash  
   git push origin feature/YourFeatureName  
   ```  
5. Create a Pull Request.  

---

## 📧 Contact  
Feel free to reach out for collaboration or queries:  
- **Email**: [abhicsng007@gmail.com](mailto:abhicsng007@gmail.com)  
- **GitHub**: [abhicsng007](https://github.com/abhicsng007)  
- **LinkedIn**: [abhicsng](https://www.linkedin.com/in/abhicsng)  

---

## 📜 License  
This project is licensed under the MIT License. See the `LICENSE` file for more details.  

---

## 🎉 Acknowledgments  
- OpenAI for the robust APIs.  
- Pexels and Unsplash for providing access to a vast collection of images.  

---

This README will make your project stand out, with clear instructions and detailed descriptions for users and contributors. 🚀
