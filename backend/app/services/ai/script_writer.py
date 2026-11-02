from typing import List, Dict, Any
from app.services.ai.gemini_client import gemini_client
from app.models.schemas import TopicAnalysis, TargetAudience

class ScriptWriter:
    @classmethod
    async def write_script(cls, analysis: TopicAnalysis, duration_target: int = 45) -> List[Dict[str, Any]]:
        """
        Generates a 5-beat high-retention educational video script.
        Each beat includes:
        - scene_number (1 to 5)
        - title
        - narration
        - duration (seconds)
        - visual_cue
        """
        prompt = f"""
        Write a high-retention 45-second educational video script for: "{analysis.topic}".
        Audience: {analysis.target_difficulty}
        Metaphor: {analysis.suggested_visual_metaphor}
        Key facts to include: {', '.join(analysis.key_facts[:3])}
        
        The video must have 5 concise scenes:
        Scene 1 (Hook, 7s): A thrilling question or counter-intuitive hook.
        Scene 2 (The Setup, 9s): The fundamental problem or components.
        Scene 3 (The Core Mechanism, 11s): The active step-by-step mechanism using the visual metaphor.
        Scene 4 (The Breakthrough, 10s): The key revelation or why this changes everything.
        Scene 5 (SkillAtlas Takeaway, 8s): Practical summary ending with 'Learn. Experiment. Build. With SkillAtlas.'
        
        Return JSON list:
        [
            {{
                "scene_number": 1,
                "title": "The Hook",
                "duration": 7.0,
                "narration": "Narration text here (approx 15-20 words)...",
                "visual_cue": "Visual animation description"
            }},
            ...
        ]
        """
        gemini_result = await gemini_client.generate_json(prompt)
        if gemini_result and isinstance(gemini_result, list) and len(gemini_result) >= 4:
            return gemini_result

        # Benchmark script templates for high quality deterministic execution
        t = analysis.topic.lower()
        if "neural network" in t or "ai" in t or "chatgpt" in t:
            return [
                {
                    "scene_number": 1,
                    "title": "The Digital Brain Illusion",
                    "duration": 7.0,
                    "narration": "What if artificial intelligence isn't thinking at all, but calculating billions of tiny mathematical vibrations?",
                    "visual_cue": "Floating 3D multi-layered neural network with glowing interconnected synapses."
                },
                {
                    "scene_number": 2,
                    "title": "Layers and Synapses",
                    "duration": 9.0,
                    "narration": "Every neural network starts with layers of artificial neurons. Information enters through input nodes and cascades through hidden interconnected layers.",
                    "visual_cue": "Data pulses stream through the first layer, illuminating downstream nodes in sequence."
                },
                {
                    "scene_number": 3,
                    "title": "Weights and Activation",
                    "duration": 11.0,
                    "narration": "Each connection has a mathematical weight. Like turning volume knobs, the network amplifies important signals while muting noise using activation functions.",
                    "visual_cue": "Camera zooms inside a single neuron as incoming values sum up and trigger a luminous energy burst."
                },
                {
                    "scene_number": 4,
                    "title": "Backpropagation & Learning",
                    "duration": 10.0,
                    "narration": "When the network makes an error, backpropagation calculates the mistake and subtly tunes every single weight in reverse. Do this millions of times, and intelligence emerges.",
                    "visual_cue": "Color wave reflects backwards across the graph, auto-tuning connections into glowing harmony."
                },
                {
                    "scene_number": 5,
                    "title": "The SkillAtlas Takeaway",
                    "duration": 8.0,
                    "narration": "From simple numbers to human-like text, modern AI is pure calculus in motion. Learn. Experiment. Build. With SkillAtlas.",
                    "visual_cue": "Panoramic camera orbit around the fully luminous 3D AI neural core."
                }
            ]
        elif "heart" in t:
            return [
                {
                    "scene_number": 1,
                    "title": "The Relentless Muscle",
                    "duration": 7.0,
                    "narration": "Right now, your heart is beating with enough hydraulic pressure to squirt blood thirty feet across a room.",
                    "visual_cue": "A realistic 3D human heart pulsating rhythmically in dark cinematic space."
                },
                {
                    "scene_number": 2,
                    "title": "The Dual Pump Architecture",
                    "duration": 9.0,
                    "narration": "It isn't just one pump; it's two coordinated pumps working side by side across four specialized chambers.",
                    "visual_cue": "Translucent cutaway revealing left and right atria and ventricles with internal valves."
                },
                {
                    "scene_number": 3,
                    "title": "Oxygen Exchange in Motion",
                    "duration": 11.0,
                    "narration": "The right side receives oxygen-depleted blue blood and drives it into your lungs. Fresh oxygenated red blood surges into the left ventricle.",
                    "visual_cue": "Particle streams of blue blood entering from vena cava and exiting bright crimson through the aorta."
                },
                {
                    "scene_number": 4,
                    "title": "The Electrical Spark",
                    "duration": 10.0,
                    "narration": "A natural pacemaker called the SA node fires an electrical wavefront that sweeps across the muscle, snapping valves shut and squeezing blood forward.",
                    "visual_cue": "Electric lightning pulse travels down the cardiac septum, triggering a synchronized contraction."
                },
                {
                    "scene_number": 5,
                    "title": "The SkillAtlas Takeaway",
                    "duration": 8.0,
                    "narration": "Over three billion beats in a lifetime, powered by perfect biological physics. Learn. Experiment. Build. With SkillAtlas.",
                    "visual_cue": "Heart glowing with vital vascular branches branching outwards into an aesthetic anatomical grid."
                }
            ]
        elif "binary search" in t:
            return [
                {
                    "scene_number": 1,
                    "title": "The Logarithmic Superpower",
                    "duration": 7.0,
                    "narration": "How can a computer find one single name out of four billion records in just thirty-two steps?",
                    "visual_cue": "A gigantic array of digital cards stretching infinitely into 3D holographic space."
                },
                {
                    "scene_number": 2,
                    "title": "The Precondition: Sorted Order",
                    "duration": 9.0,
                    "narration": "Linear scanning checks every item one by one. But if the data is sorted, we unlock an exponential shortcut called Binary Search.",
                    "visual_cue": "Blocks sort themselves by height into ascending order with illuminated index numbers."
                },
                {
                    "scene_number": 3,
                    "title": "Divide and Conquer",
                    "duration": 11.0,
                    "narration": "Instead of checking the first card, we jump directly to the exact middle. If our target is larger, we instantly discard the entire lower half.",
                    "visual_cue": "A holographic laser slices the array down the middle; half the blocks turn grey and dissolve away."
                },
                {
                    "scene_number": 4,
                    "title": "Logarithmic Compression",
                    "duration": 10.0,
                    "narration": "By cutting the search space in half at every step, even a dataset the size of the entire internet shrinks down to an exact match in seconds.",
                    "visual_cue": "Array rapidly halves from 1000 to 500 to 250, zeroing in on the target card glowing gold."
                },
                {
                    "scene_number": 5,
                    "title": "The SkillAtlas Takeaway",
                    "duration": 8.0,
                    "narration": "That is the unmatched elegance of O of log N efficiency. Learn. Experiment. Build. With SkillAtlas.",
                    "visual_cue": "Target block ascends into spotlight with algorithmic metrics hovering in 3D typography."
                }
            ]
        elif "electric motor" in t or "motor" in t:
            return [
                {
                    "scene_number": 1,
                    "title": "Turning Currents into Rotation",
                    "duration": 7.0,
                    "narration": "How does invisible electricity passing through a wire produce pure physical rotation strong enough to propel a locomotive?",
                    "visual_cue": "3D cutaway of an electric motor with copper windings and stator electromagnets."
                },
                {
                    "scene_number": 2,
                    "title": "The Lorentz Force",
                    "duration": 9.0,
                    "narration": "When electrical current flows through a wire inside a magnetic field, the electrons experience a sideways push called the Lorentz force.",
                    "visual_cue": "Magnetic flux lines shown as curved neon force vectors exerting upward and downward thrust on wire loop."
                },
                {
                    "scene_number": 3,
                    "title": "The Perpetual Magnetic Chase",
                    "duration": 11.0,
                    "narration": "By looping the wire around a rotor, one side pushes up while the opposite side pushes down, creating continuous rotational torque.",
                    "visual_cue": "Armature begins spinning smoothly inside the magnetic field envelope."
                },
                {
                    "scene_number": 4,
                    "title": "The Commutator Trick",
                    "duration": 10.0,
                    "narration": "To stop the rotor from jamming when poles align, a split-ring commutator reverses the current direction twice every turn, keeping the spin alive.",
                    "visual_cue": "Spark points on the commutator ring flip polarity instantly, preserving rotational momentum."
                },
                {
                    "scene_number": 5,
                    "title": "The SkillAtlas Takeaway",
                    "duration": 8.0,
                    "narration": "From electric vehicles to drone propellers, magnetic induction drives our world. Learn. Experiment. Build. With SkillAtlas.",
                    "visual_cue": "Motor housing reassembles into high-speed rotational assembly with energy streams."
                }
            ]
        elif "gravity" in t:
            return [
                {
                    "scene_number": 1,
                    "title": "The Curvature of Spacetime",
                    "duration": 7.0,
                    "narration": "What if gravity isn't a force pulling you down, but the universe itself bending around you?",
                    "visual_cue": "A flat 3D cosmic coordinate grid that begins sagging and stretching under a celestial body."
                },
                {
                    "scene_number": 2,
                    "title": "Newton vs Einstein",
                    "duration": 9.0,
                    "narration": "Isaac Newton showed that masses attract each other. But Albert Einstein uncovered the true geometry behind the curtain.",
                    "visual_cue": "Side-by-side transition from classic apple trajectory to curved 4D spacetime fabric."
                },
                {
                    "scene_number": 3,
                    "title": "Warping the Grid",
                    "duration": 11.0,
                    "narration": "Matter tells space-time how to curve, and curved space-time tells matter how to move. Planets simply follow the straightest path on a bent surface.",
                    "visual_cue": "Orbiting moon tracing a green geodesic trail inside the gravitational funnel of Earth."
                },
                {
                    "scene_number": 4,
                    "title": "Gravitational Time Dilation",
                    "duration": 10.0,
                    "narration": "The deeper you descend into a gravitational well, the slower your clock ticks relative to empty space. Time itself bends with mass.",
                    "visual_cue": "Holographic clocks at different orbit altitudes ticking at noticeably distinct rates."
                },
                {
                    "scene_number": 5,
                    "title": "The SkillAtlas Takeaway",
                    "duration": 8.0,
                    "narration": "Gravity is the magnificent geometry of the cosmos in action. Learn. Experiment. Build. With SkillAtlas.",
                    "visual_cue": "Dramatic camera crane-out revealing planetary system in harmonized gravitational balance."
                }
            ]
        else:
            return [
                {
                    "scene_number": 1,
                    "title": "The Core Mystery",
                    "duration": 7.0,
                    "narration": f"Have you ever wondered how {analysis.topic} truly functions beneath the surface?",
                    "visual_cue": f"Futuristic 3D visualization showcasing the primary dynamics of {analysis.topic}."
                },
                {
                    "scene_number": 2,
                    "title": "The Foundation",
                    "duration": 9.0,
                    "narration": f"{analysis.key_facts[0]}",
                    "visual_cue": "Deconstruction of primary structural components with interactive callout labels."
                },
                {
                    "scene_number": 3,
                    "title": "The Working Mechanism",
                    "duration": 11.0,
                    "narration": f"{analysis.suggested_visual_metaphor}: {analysis.metaphor_explanation}",
                    "visual_cue": "Dynamic particle flow demonstrating step-by-step transformation in 3D."
                },
                {
                    "scene_number": 4,
                    "title": "The Critical Insight",
                    "duration": 10.0,
                    "narration": f"{analysis.key_facts[1]}",
                    "visual_cue": "High-speed camera orbit emphasizing system synchronization and output."
                },
                {
                    "scene_number": 5,
                    "title": "The SkillAtlas Takeaway",
                    "duration": 8.0,
                    "narration": f"Mastering {analysis.topic} unlocks a deeper understanding of the world. Learn. Experiment. Build. With SkillAtlas.",
                    "visual_cue": "System achieves equilibrium with SkillAtlas educational title overlay."
                }
            ]
