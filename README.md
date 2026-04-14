# Research Prototype: Intelligent Outfit Recommendation System

## Overview
This project is a research prototype developed for Junior Seminar. The goal of the system is to generate outfit recommendations based on **color compatibility** and **temperature conditions**. It combines image processing, rule-based filtering, and scoring techniques to produce aesthetically coherent and weather-appropriate outfits.

This prototype supports experimentation on:
- Color harmony and dominant color extraction
- Climate-based clothing selection
- Algorithmic outfit scoring

---

## Research Problem
Choosing outfits that are both visually cohesive and appropriate for weather conditions is a complex task. This project explores how computational methods can:
- Extract meaningful features from clothing images  
- Apply constraints based on environmental data  
- Rank outfit combinations using aesthetic principles  

---

## Features
- Dominant color extraction from clothing images  
- Temperature-based filtering system  
- Outfit scoring based on color compatibility  
- Modular design for testing subsystems independently  

---

## Installation Instructions

### Prerequisites
Make sure you have the following installed:
- Python 3.9+
- pip (Python package manager)

### Step-by-Step Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the prototype:
```bash
python main.py
```

---

## Usage

### Basic Example
1. Add clothing images to the `data/` folder  
2. Run the system:
```bash
python main.py
```
3. The program will:
   - Extract dominant colors  
   - Filter items based on temperature  
   - Generate and rank outfit combinations  

### Expected Output
- Ranked list of outfit combinations  
- Color and temperature justification for each recommendation  

---

## Example

Input:
- Temperature: 65°F  
- Clothing images: shirt, pants, jacket  

Output:
```
Top Outfit:
- Blue shirt
- Beige pants
- Light jacket

Score: 0.87
Reason: Complementary color palette + appropriate for mild weather
```

---

## Project Structure
```
├── data/                # Input clothing images
├── src/                 # Source code
│   ├── color_extraction.py
│   ├── climate_filter.py
│   ├── scoring.py
│   └── main.py
├── tests/               # Test cases
├── requirements.txt     # Dependencies
└── README.md
```

---

## Technical Details
- **Color Extraction:** Uses RGB quantization to determine dominant colors  
- **Climate Filtering:** Rule-based thresholds for temperature ranges  
- **Scoring System:** Combines color harmony and contextual constraints  

---

## Error Handling
The system includes:
- Validation for missing or invalid image inputs  
- Graceful handling of empty datasets  
- Input checks for temperature values  

---

## Development Practices
- Modular code structure for maintainability  
- Meaningful commit messages  
- Version control using Git  
- Separation of concerns across subsystems  

---

## Testing
Run tests using:
```bash
pytest
```

Tests include:
- Color extraction accuracy  
- Boundary condition testing for temperature  
- Scoring consistency  

---

## Limitations
- Limited dataset size  
- Rule-based approach may not generalize to all fashion contexts  
- No machine learning integration (future work)  

---

## Future Work
- Integrate machine learning for improved recommendations  
- Expand dataset for broader testing  
- Add user interface for easier interaction  

---

## Contribution
This is an academic research prototype. Contributions are not required but feedback is welcome.

---

## Author
Veronica McNeece  
Computer Science, Junior Seminar  

---

## License
This project is for academic use only.
