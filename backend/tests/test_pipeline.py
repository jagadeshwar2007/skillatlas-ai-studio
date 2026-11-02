import pytest
import os
import asyncio
from app.services.ai.classifier import TopicClassifier
from app.services.ai.researcher import EducationalResearcher
from app.services.ai.metaphor import MetaphorEngine
from app.services.ai.storyboard import StoryboardGenerator
from app.models.schemas import TargetAudience, VideoStyle, AspectRatio, VisualEngineType
from app.database import save_project, get_project, list_projects, Project

@pytest.mark.asyncio
async def test_topic_classification():
    topics = [
        ("How does an AI neural network work?", "computer_science"),
        ("How does the human heart work?", "biology"),
        ("How does binary search work?", "computer_science"),
        ("How does an electric motor work?", "mechanics"),
        ("How does gravity work?", "physics")
    ]
    for topic, expected_cat in topics:
        res = await TopicClassifier.classify(topic)
        assert "category" in res
        assert res["category"] == expected_cat

@pytest.mark.asyncio
async def test_metaphor_selection():
    topics = [
        ("How does an AI neural network work?", "computer_science"),
        ("How does the human heart work?", "biology"),
        ("How does binary search work?", "computer_science"),
        ("How does an electric motor work?", "mechanics"),
        ("How does gravity work?", "physics")
    ]
    for topic, cat in topics:
        meta = await MetaphorEngine.select_metaphor(topic, cat)
        assert "metaphor" in meta
        assert "explanation" in meta
        assert len(meta["metaphor"]) > 0

@pytest.mark.asyncio
async def test_storyboard_generation():
    analysis = await EducationalResearcher.research_topic(
        "How does an AI neural network work?",
        TargetAudience.GENERAL_CURIOUS
    )
    assert len(analysis.key_facts) >= 3

    storyboard = await StoryboardGenerator.create_storyboard(
        analysis=analysis,
        style=VideoStyle.CYBER_SCIENTIFIC,
        aspect_ratio=AspectRatio.PORTRAIT_9_16
    )
    assert len(storyboard.scenes) == 5
    assert storyboard.total_duration >= 30.0
    for scene in storyboard.scenes:
        assert scene.duration > 0
        assert len(scene.narration_text) > 0
        assert scene.camera is not None

def test_database_persistence():
    proj = Project(
        title="Test Gravity Project",
        topic="How does gravity work?",
        status="draft"
    )
    saved = save_project(proj)
    retrieved = get_project(saved.id)
    assert retrieved is not None
    assert retrieved.title == "Test Gravity Project"
