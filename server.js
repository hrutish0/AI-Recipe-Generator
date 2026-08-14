const express = require("express");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


app.post("/api/generate-recipe", async (req, res) => {

    try {

        const { ingredients } = req.body;

        console.log("Ingredients received:", ingredients);

        if (!ingredients || ingredients.trim() === "") {

            return res.status(400).json({
                error: "Please enter some ingredients."
            });

        }


        const prompt = `
You are an AI cooking assistant.

The user currently has these ingredients:

${ingredients}

Create a practical and tasty recipe using as many of these ingredients as possible.

Return the recipe in this exact structure:

RECIPE NAME:

DESCRIPTION:

INGREDIENTS:

INSTRUCTIONS:

OPTIONAL INGREDIENTS:

SUBSTITUTIONS:

Important rules:

1. Prioritize the ingredients provided by the user.
2. Do not assume the user has unusual ingredients.
3. Basic ingredients such as salt, pepper, oil and water can be assumed.
4. Give realistic quantities.
5. Give clear step-by-step cooking instructions.
6. Suggest optional ingredients separately.
7. Suggest substitutions when useful.
8. Keep the recipe reasonably simple for a home cook.
`;


        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: prompt

        });


        console.log("Gemini response received");

        res.json({
            recipe: response.text
        });


    } catch (error) {

        console.error("GEMINI ERROR:");
        console.error(error);

        res.status(500).json({

            error: error.message ||
                "Failed to generate recipe."

        });

    }

});


app.listen(3000, () => {

    console.log(
        "Server running at http://localhost:3000"
    );

});