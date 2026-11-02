from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field
import uuid
import time

class VisualEngineType(str, Enum):
    PROCEDURAL_3D = "procedural_3d"
    AI_VIDEO = "ai_video"
    GENERATED_3D_ASSETS = "generated_3d_assets"
    SCIENTIFIC_SIMULATION = "scientific_simulation"
    MOTION_GRAPHICS = "motion_graphics"
    MIXED_MEDIA = "mixed_media"

class VideoStyle(str, Enum):
    CYBER_SCIENTIFIC = "cyber_scientific"
    MINIMAL_DARK = "minimal_dark"
    BLUEPRINT_TECHNICAL = "blueprint_technical"
    NEON_GLOW = "neon_glow"
    ORGANIC_BIOLOGY = "organic_biology"

class TargetAudience(str, Enum):
    GENERAL_CURIOUS = "general_curious"
    STUDENT_BEGINNER = "student_beginner"
    COLLEGE_TECHNICAL = "college_technical"
    EXECUTIVE_SUMMARY = "executive_summary"

class AspectRatio(str, Enum):
    PORTRAIT_9_16 = "9:16" # 1080x1920 Instagram Reels, TikTok, Shorts
    LANDSCAPE_16_9 = "16:9" # 1920x1080 YouTube
    SQUARE_1_1 = "1:1"

class TopicAnalysis(BaseModel):
    topic: str
    category: str # "computer_science", "biology", "physics", "mechanics", "astronomy", "general"
    core_concept: str
    target_difficulty: str
    recommended_duration: int = 45 # seconds
    key_facts: List[str]
    common_misconceptions: List[str]
    suggested_visual_metaphor: str
    metaphor_explanation: str

class VisualElement3D(BaseModel):
    type: str # "mesh", "particle_cloud", "flow_stream", "label_pin", "grid_field", "light_beam"
    geometry: str # "sphere", "cylinder", "torus", "custom_circuit", "network_graph", "heart_model", "wave"
    color: str = "#38bdf8"
    position: List[float] = [0.0, 0.0, 0.0]
    rotation: List[float] = [0.0, 0.0, 0.0]
    scale: List[float] = [1.0, 1.0, 1.0]
    animation: Dict[str, Any] = {} # e.g. {"pulsate": True, "spin": [0, 1, 0], "pulse_frequency": 1.2}

class CameraSpec(BaseModel):
    initial_position: List[float] = [0.0, 0.0, 5.0]
    target: List[float] = [0.0, 0.0, 0.0]
    fov: float = 45.0
    trajectory: str = "orbit_slow" # "orbit_slow", "dolly_in", "pan_horizontal", "fly_through", "static"

class SceneSpec(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    scene_number: int
    title: str
    scene_type: VisualEngineType = VisualEngineType.PROCEDURAL_3D
    duration: float = 8.0 # seconds
    narration_text: str
    visual_description: str
    camera: CameraSpec = Field(default_factory=CameraSpec)
    elements_3d: List[VisualElement3D] = []
    text_callouts: List[str] = []
    lighting_preset: str = "studio_dark" # "studio_dark", "cyberpunk", "bright_lab", "deep_space"
    bg_color: str = "#050811"
    transition_in: str = "fade" # "fade", "zoom", "wipe", "dissolve"
    meta: Dict[str, Any] = {}

class Storyboard(BaseModel):
    title: str
    topic: str
    aspect_ratio: AspectRatio = AspectRatio.PORTRAIT_9_16
    style: VideoStyle = VideoStyle.CYBER_SCIENTIFIC
    total_duration: float = 45.0
    scenes: List[SceneSpec]
    background_music_track: str = "ambient_tech_pulse"
    voice_id: str = "en-US-ChristopherNeural"

class CreateVideoRequest(BaseModel):
    topic: str
    audience: TargetAudience = TargetAudience.GENERAL_CURIOUS
    style: VideoStyle = VideoStyle.CYBER_SCIENTIFIC
    aspect_ratio: AspectRatio = AspectRatio.PORTRAIT_9_16
    duration_seconds: int = 45
    voice_id: Optional[str] = "en-US-ChristopherNeural"
    engine_preference: Optional[VisualEngineType] = None

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    topic: str
    analysis: Optional[TopicAnalysis] = None
    storyboard: Optional[Storyboard] = None
    status: str = "draft" # "draft", "storyboarded", "rendering", "completed", "failed"
    video_url: Optional[str] = None
    audio_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    created_at: float = Field(default_factory=time.time)
    updated_at: float = Field(default_factory=time.time)

class RenderJob(BaseModel):
    job_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    project_id: str
    status: str = "queued" # "queued", "generating_audio", "rendering_frames", "compositing", "completed", "failed"
    progress: int = 0 # 0 to 100
    current_step: str = "Initialized"
    output_video_path: Optional[str] = None
    error_message: Optional[str] = None
    created_at: float = Field(default_factory=time.time)
    completed_at: Optional[float] = None
