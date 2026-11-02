from typing import List, Dict, Any, Optional
from app.models.schemas import (
    Storyboard, SceneSpec, VisualEngineType, VideoStyle, AspectRatio,
    TopicAnalysis, CameraSpec, VisualElement3D
)
from app.services.ai.script_writer import ScriptWriter

class StoryboardGenerator:
    @classmethod
    async def create_storyboard(
        cls,
        analysis: TopicAnalysis,
        style: VideoStyle = VideoStyle.CYBER_SCIENTIFIC,
        aspect_ratio: AspectRatio = AspectRatio.PORTRAIT_9_16,
        engine_preference: Optional[VisualEngineType] = None,
        voice_id: str = "en-US-ChristopherNeural"
    ) -> Storyboard:
        """Assembles complete storyboard with 3D scene specifications."""
        script_beats = await ScriptWriter.write_script(analysis)
        scenes: List[SceneSpec] = []
        total_duration = 0.0

        topic_lower = analysis.topic.lower()
        is_neural = "neural" in topic_lower or "ai" in topic_lower or "chatgpt" in topic_lower
        is_heart = "heart" in topic_lower or "cardiac" in topic_lower or "biology" in topic_lower
        is_search = "binary search" in topic_lower or "search" in topic_lower or "algorithm" in topic_lower
        is_motor = "motor" in topic_lower or "electric" in topic_lower or "engine" in topic_lower
        is_gravity = "gravity" in topic_lower or "spacetime" in topic_lower or "orbit" in topic_lower

        for idx, beat in enumerate(script_beats):
            num = beat["scene_number"]
            dur = float(beat["duration"])
            total_duration += dur

            # Select engine for scene (hybrid engine orchestration)
            if engine_preference:
                engine = engine_preference
            elif num == 1:
                # Scene 1: Cinematic establishing shot
                engine = VisualEngineType.PROCEDURAL_3D
            elif num in (2, 3):
                # Core demonstration: Procedural 3D or Scientific simulation
                engine = VisualEngineType.SCIENTIFIC_SIMULATION if (is_heart or is_gravity) else VisualEngineType.PROCEDURAL_3D
            elif num == 4:
                # Breakthrough: Generated 3D assets or Motion Graphics
                engine = VisualEngineType.PROCEDURAL_3D
            else:
                # Outro
                engine = VisualEngineType.MOTION_GRAPHICS

            # Configure Camera Trajectory
            trajectories = ["orbit_slow", "dolly_in", "pan_horizontal", "orbit_fast", "fly_through"]
            traj = trajectories[idx % len(trajectories)]

            camera = CameraSpec(
                initial_position=[0.0, 1.2, 4.5] if aspect_ratio == AspectRatio.PORTRAIT_9_16 else [0.0, 1.0, 3.5],
                target=[0.0, 0.0, 0.0],
                fov=50.0 if aspect_ratio == AspectRatio.PORTRAIT_9_16 else 40.0,
                trajectory=traj
            )

            # Procedural 3D elements based on topic
            elements: List[VisualElement3D] = []
            meta: Dict[str, Any] = {}

            if is_neural:
                meta = {
                    "scene_class": "NeuralNetworkScene",
                    "layers": [4, 6, 6, 2],
                    "active_pulse_speed": 1.5,
                    "signal_propagation": num >= 2,
                    "backprop_mode": num == 4,
                    "weights_visible": True
                }
                elements.append(VisualElement3D(
                    type="network_graph",
                    geometry="neural_layers",
                    color="#00f2fe",
                    position=[0.0, 0.0, 0.0],
                    animation={"pulse": True, "speed": 1.2}
                ))
            elif is_heart:
                meta = {
                    "scene_class": "HeartAnatomyScene",
                    "bpm": 75 if num != 4 else 110,
                    "chamber_cutaway": num in (2, 3),
                    "blood_flow_particles": True,
                    "show_electrical_conduction": num == 4
                }
                elements.append(VisualElement3D(
                    type="mesh",
                    geometry="heart_4_chamber",
                    color="#ef4444",
                    position=[0.0, 0.0, 0.0],
                    animation={"beat_frequency": 1.25, "scale_pulse": 0.08}
                ))
            elif is_search:
                meta = {
                    "scene_class": "BinarySearchScene",
                    "array_size": 16,
                    "target_index": 11,
                    "current_step": min(num, 4),
                    "eliminated_halves": num >= 3
                }
                elements.append(VisualElement3D(
                    type="grid_field",
                    geometry="array_blocks",
                    color="#38bdf8",
                    position=[0.0, -0.5, 0.0],
                    animation={"step_index": num}
                ))
            elif is_motor:
                meta = {
                    "scene_class": "ElectricMotorScene",
                    "rotor_rpm": 60 * num,
                    "magnetic_lines_visible": True,
                    "current_arrow_visible": num in (2, 3),
                    "commutator_sparks": num == 4
                }
                elements.append(VisualElement3D(
                    type="mesh",
                    geometry="motor_armature",
                    color="#f59e0b",
                    position=[0.0, 0.0, 0.0],
                    animation={"spin_rpm": 60 * num}
                ))
            elif is_gravity:
                meta = {
                    "scene_class": "GravitySpacetimeScene",
                    "mass_weight": 2.5,
                    "grid_warping": True,
                    "satellite_orbits": 2,
                    "time_dilation_clocks": num == 4
                }
                elements.append(VisualElement3D(
                    type="particle_cloud",
                    geometry="warped_grid",
                    color="#818cf8",
                    position=[0.0, -1.0, 0.0],
                    animation={"curvature": 1.8}
                ))
            else:
                meta = {
                    "scene_class": "UniversalScientificCore",
                    "particle_count": 500,
                    "flow_speed": 1.0 + (num * 0.2)
                }
                elements.append(VisualElement3D(
                    type="particle_cloud",
                    geometry="torus",
                    color="#06b6d4",
                    position=[0.0, 0.0, 0.0],
                    animation={"spin": [0.2, 0.5, 0.0]}
                ))

            # Lighting preset
            lighting = "cyberpunk" if style == VideoStyle.NEON_GLOW else "studio_dark"

            scene = SceneSpec(
                scene_number=num,
                title=beat["title"],
                scene_type=engine,
                duration=dur,
                narration_text=beat["narration"],
                visual_description=beat["visual_cue"],
                camera=camera,
                elements_3d=elements,
                text_callouts=[beat["title"], f"Beat {num}: {beat['title'].split()[0]}"],
                lighting_preset=lighting,
                bg_color="#040711",
                meta=meta
            )
            scenes.append(scene)

        return Storyboard(
            title=f"{analysis.topic} — Explained in 45 Seconds",
            topic=analysis.topic,
            aspect_ratio=aspect_ratio,
            style=style,
            total_duration=round(total_duration, 1),
            scenes=scenes,
            background_music_track="ambient_tech_pulse",
            voice_id=voice_id
        )
