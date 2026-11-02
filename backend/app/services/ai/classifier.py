from typing import Dict, Any
from app.services.ai.gemini_client import gemini_client
from app.models.schemas import VisualEngineType, VideoStyle

class TopicClassifier:
    DOMAIN_PATTERNS = {
        "computer_science": [
            "neural network", "chatgpt", "binary search", "algorithm", "database",
            "internet", "machine learning", "compiler", "encryption", "blockchain",
            "sorting", "hash table", "operating system", "cpu", "graph", "tree", "ai"
        ],
        "biology": [
            "heart", "dna", "cell", "neuron", "brain", "photosynthesis", "blood",
            "immune", "crispr", "protein", "virus", "bacteria", "evolution", "kidney"
        ],
        "physics": [
            "gravity", "quantum", "black hole", "relativity", "light", "wave",
            "thermodynamics", "entropy", "particle", "atom", "laser", "space-time"
        ],
        "mechanics": [
            "motor", "engine", "airplane", "aerodynamics", "gear", "turbine",
            "electric motor", "hydraulic", "rocket", "compressor", "transmission"
        ]
    }

    @classmethod
    async def classify(cls, topic: str) -> Dict[str, Any]:
        """Classifies topic into domain, recommends visual engine and style."""
        # Try Gemini LLM first
        prompt = f"""
        Analyze the educational topic: "{topic}".
        Return JSON with:
        {{
            "category": "computer_science" | "biology" | "physics" | "mechanics" | "chemistry" | "general",
            "primary_engine": "procedural_3d" | "scientific_simulation" | "motion_graphics" | "ai_video",
            "recommended_style": "cyber_scientific" | "minimal_dark" | "blueprint_technical" | "organic_biology",
            "core_concept": "Brief 1-line definition of the core phenomenon",
            "visual_focus": "What 3D objects or visual dynamics should be shown"
        }}
        """
        gemini_result = await gemini_client.generate_json(prompt)
        if gemini_result and "category" in gemini_result:
            return gemini_result

        # Robust heuristic fallback
        lower = topic.lower()
        matched_category = "general"
        for category, keywords in cls.DOMAIN_PATTERNS.items():
            if any(kw in lower for kw in keywords):
                matched_category = category
                break

        engine_map = {
            "computer_science": (VisualEngineType.PROCEDURAL_3D, VideoStyle.CYBER_SCIENTIFIC),
            "biology": (VisualEngineType.SCIENTIFIC_SIMULATION, VideoStyle.ORGANIC_BIOLOGY),
            "physics": (VisualEngineType.SCIENTIFIC_SIMULATION, VideoStyle.CYBER_SCIENTIFIC),
            "mechanics": (VisualEngineType.PROCEDURAL_3D, VideoStyle.BLUEPRINT_TECHNICAL),
            "general": (VisualEngineType.MOTION_GRAPHICS, VideoStyle.MINIMAL_DARK)
        }
        rec_engine, rec_style = engine_map.get(matched_category, (VisualEngineType.PROCEDURAL_3D, VideoStyle.CYBER_SCIENTIFIC))

        return {
            "category": matched_category,
            "primary_engine": rec_engine.value,
            "recommended_style": rec_style.value,
            "core_concept": f"The core scientific and practical principles behind {topic}",
            "visual_focus": f"Interactive 3D simulation of {topic} components and dynamics"
        }
