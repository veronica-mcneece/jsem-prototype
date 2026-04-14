# Research Prototype: Intelligent Outfit Recommendation System (HueCloset)

## Overview
HueCloset is a research prototype that generates outfit recommendations based on **color harmony** and **environmental temperature conditions**. The system combines computer vision techniques, rule-based decision making, and scoring logic to produce aesthetically coherent and weather-appropriate outfit suggestions.

This prototype is designed as an experimental system for studying how computational methods can support visual aesthetic decision-making in fashion contexts.

---

## Research Problem
Selecting outfits involves balancing **visual compatibility (color harmony)** and **contextual appropriateness (weather conditions)**. This project investigates whether computational methods can approximate this decision-making process.

The system explores:
- How dominant color extraction can represent clothing items
- How environmental constraints (temperature) influence selection
- How rule-based scoring can approximate aesthetic judgment

---

## System Pipeline

User Input (Images + Temperature)
        ↓
Dominant Color Extraction (RGB analysis)
        ↓
Climate-Based Filtering (temperature constraints)
        ↓
Outfit Combination Generation
        ↓
Aesthetic Scoring (color harmony rules)
        ↓
Ranked Outfit Output

---

## Features
- Automated dominant color extraction from clothing images  
- Temperature-based filtering of clothing items  
- Rule-based outfit scoring system  
- Ranked outfit generation with explanations  
- Modular pipeline design for independent subsystem testing  

---

## How to Use the System

### Step 1: Access the Application
Open the deployed application in your browser:

https://huecloset.netlify.app/

---

### Step 2: Upload Clothing Items
- Upload images of clothing items (e.g., shirts, pants, jackets)
- Supported formats: .jpg, .png, .webp
- Multiple items are recommended for best results

---

### Step 3: Enter Temperature
- Input a numeric temperature value (°F)
- Example: 65

---

### Step 4: Generate Outfit
- Click the “Generate” button
- The system processes inputs through the pipeline:
  - Extracts dominant colors
  - Filters items based on temperature
  - Computes outfit compatibility scores
  - Ranks possible combinations

---

### Step 5: Interpret Results
- Ranked outfit combinations
- A score representing aesthetic + contextual fit
- A short explanation of the recommendation

---

## Example Execution

Input:
- Clothing items: shirt, pants, jacket  
- Temperature: 65°F  

Output:
Top Outfit Recommendation:
- Blue shirt
- Beige pants
- Light jacket

Score: 0.87

Explanation:
This outfit combines complementary colors and is suitable for mild weather conditions.

---

## Research-to-System Mapping

Research Concept              | System Component
----------------------------|----------------------------
Color harmony evaluation     | Dominant color extraction
Weather suitability          | Climate filtering module
Outfit decision modeling     | Scoring system
Recommendation generation    | Combination engine

---

## Error Handling & Validation
- Rejects unsupported or invalid image files  
- Handles missing or empty wardrobe inputs  
- Validates temperature input (must be numeric)  
- Prevents execution when insufficient data is provided  
- Displays fallback behavior when no valid outfits can be generated  

---

## Experimental Design
- Different temperature conditions (cold, mild, hot)
- Different clothing combinations and color distributions
- Repeated runs to test consistency of scoring outputs
- Observation of ranking stability across inputs

---

## Technical Architecture
- Frontend/UI: Web-based interface (Netlify deployment)
- Image Processing: RGB-based dominant color extraction
- Filtering Logic: Rule-based temperature constraints
- Scoring Engine: Color compatibility heuristics
- Output System: Ranked recommendation generation

---

## Development Practices
- Modular code structure separating extraction, filtering, and scoring logic  
- Clear separation of concerns across system components  
- Reusable functions for core processing tasks  
- Consistent naming conventions  
- Version control using Git with iterative development history  

---

## Reproducibility
This project can be fully reproduced by:
1. Cloning the repository  
2. Installing dependencies from requirements.txt  
3. Running the application locally or using the deployed Netlify link  

---

## Limitations
- Rule-based system does not use machine learning  
- Limited dataset of clothing images  
- Aesthetic evaluation is heuristic-based  
- Performance depends on input quality  

---

## Future Work
- Machine learning-based recommendations  
- Larger dataset expansion  
- User personalization  
- Improved UI/UX  
- Human evaluation studies  

---

## Example Workflow
1. Upload clothing items  
2. Enter temperature  
3. Extract dominant colors  
4. Filter by weather  
5. Generate combinations  
6. Rank outfits  
7. Display recommendation  

---

## Author
Veronica McNeece  
Computer Science – Junior Seminar  

---

## License
Academic use only.
Copyright (c) 2026 Veronica McNeece. This project is for academic purposes as part of the Allegheny College Junior Seminar. All rights reserved.