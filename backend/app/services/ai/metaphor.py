from typing import Dict, Any
from app.services.ai.gemini_client import gemini_client

class MetaphorEngine:
    DOMAIN_METAPHORS = {
        "neural network": {
            "metaphor": "An Interconnected Symphony of Tunable Water Valves and Resonance Knobs",
            "explanation": "Inputs flow like water through interconnected pathways; learning is adjusting valve tensions so only the correct melody resonates at the output.",
            "scene_anchor": "Glowing nodes pulsating and transmitting beams along weighted synaptic conduits"
        },
        "heart": {
            "metaphor": "A Dual-Engine High-Pressure Hydraulic Pump with One-Way Pressure Valves",
            "explanation": "Two synchronized pumping chambers: the right lung pump refreshes oxygen, while the high-pressure left ventricle drives fuel through millions of miles of vascular piping.",
            "scene_anchor": "Cutaway 3D cross-section with rhythmic contractions, blue deoxygenated inlet, red oxygenated pressure surge"
        },
        "binary search": {
            "metaphor": "The Split-and-Discard Phonebook Slicer",
            "explanation": "Instead of flipping one page at a time, you slice the dictionary in half each second, discarding 50% of the entire universe of possibilities in a single stroke.",
            "scene_anchor": "A glowing holographic array where half of the data blocks vaporize each step, zooming directly into the target"
        },
        "electric motor": {
            "metaphor": "A Never-Ending Magnetic Chase: Opposite Poles Slipping Forward",
            "explanation": "Electricity creates an electromagnet that constantly tries to align with fixed outer magnets, but a mechanical switch continuously flips the polarity just before it arrives, locking it in perpetual spin.",
            "scene_anchor": "Rotating armature with magnetic field lines curving through space and brush commutator sparks flipping polarity"
        },
        "gravity": {
            "metaphor": "The Bowling Ball on a Stretched Rubber Trampoline",
            "explanation": "Massive objects warp the fabric of space-time around them. Satellites aren't being pulled by an invisible rope; they are simply travelling along the straightest line on a curved trampoline.",
            "scene_anchor": "Deformed neon grid representing spacetime with a central dense sphere and orbiting tracer particles"
        }
    }

    @classmethod
    async def select_metaphor(cls, topic: str, category: str) -> Dict[str, str]:
        """Chooses an intuitive physical or visual metaphor to explain the abstract concept."""
        prompt = f"""
        For the educational topic: "{topic}" (Category: {category}), create a memorable visual metaphor.
        Format JSON:
        {{
            "metaphor": "Short title of the metaphor",
            "explanation": "Clear 2-sentence explanation of why this physical metaphor works",
            "scene_anchor": "How to represent this visually in 3D animation (objects, lighting, camera)"
        }}
        """
        gemini_result = await gemini_client.generate_json(prompt)
        if gemini_result and "metaphor" in gemini_result:
            return gemini_result

        # Check domain metaphors
        lower = topic.lower()
        for key, met in cls.DOMAIN_METAPHORS.items():
            if key in lower:
                return met

        return {
            "metaphor": f"The Dynamic System of Flow and Transformation in {topic}",
            "explanation": f"{topic} operates like a feedback loop where inputs are processed systematically to yield observable outcomes.",
            "scene_anchor": "A futuristic central core emitting dynamic particles that branch into operational stages"
        }
