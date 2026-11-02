import pytest
import os
from app.services.ai.classifier import TopicClassifier
from app.services.ai.researcher import EducationalResearcher
from app.services.ai.metaphor import MetaphorEngine
from app.services.ai.storyboard import StoryboardGenerator
from app.models.schemas import TargetAudience, VideoStyle, AspectRatio, VisualEngineType

@pytest.mark.asyncio
async def test_five_mandatory_educational_topics():
    test_cases = [
        {
            "topic": "How does an AI neural network work?",
            "expected_category": "computer_science",
            "expected_scene_class": "NeuralNetworkScene"
        },
        {
            "topic": "How does the human heart work?",
            "expected_category": "biology",
            "expected_scene_class": "HeartAnatomyScene"
        },
        {
            "topic": "How does binary search work?",
            "expected_category": "computer_science",
            "expected_scene_class": "BinarySearchScene"
        },
        {
            "topic": "How does an electric motor work?",
            "expected_category": "mechanics",
            "expected_scene_class": "ElectricMotorScene"
        },
        {
            "topic": "How does gravity work?",
            "expected_category": "physics",
            "expected_scene_class": "GravitySpacetimeScene"
        }
    ]

    for tc in test_cases:
        topic = tc["topic"]
        print(f"\n--- Testing Topic: {topic} ---")

        # 1. Classification
        classification = await TopicClassifier.classify(topic)
        assert classification["category"] == tc["expected_category"]
        print(f"-> Category: {classification['category']}")

        # 2. Metaphor
        metaphor = await MetaphorEngine.select_metaphor(topic, classification["category"])
        assert len(metaphor["metaphor"]) > 0
        assert len(metaphor["explanation"]) > 0
        print(f"-> Visual Metaphor: {metaphor['metaphor']}")

        # 3. Research
        analysis = await EducationalResearcher.research_topic(topic, TargetAudience.GENERAL_CURIOUS)
        assert len(analysis.key_facts) >= 3
        print(f"-> Verified Facts: {len(analysis.key_facts)}, Misconceptions: {len(analysis.common_misconceptions)}")

        # 4. Storyboard
        storyboard = await StoryboardGenerator.create_storyboard(
            analysis=analysis,
            style=VideoStyle.CYBER_SCIENTIFIC,
            aspect_ratio=AspectRatio.PORTRAIT_9_16
        )
        assert len(storyboard.scenes) == 5
        assert storyboard.aspect_ratio == AspectRatio.PORTRAIT_9_16
        
        # Verify scene-specific procedural 3D classes
        scene_classes = [s.meta.get("scene_class") for s in storyboard.scenes]
        assert tc["expected_scene_class"] in scene_classes
        print(f"-> Generated {len(storyboard.scenes)} scenes with class: {tc['expected_scene_class']}")
        print(f"-> Total Duration: {storyboard.total_duration}s")
