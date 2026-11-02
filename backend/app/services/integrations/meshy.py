import json
from pathlib import Path
from typing import Dict, Any, Optional
from app.config import ASSETS_DIR, settings

class Meshy3DAdapter:
    """
    Engine C: AI 3D Asset Generation Adapter
    Integrates with Meshy.ai text-to-3D endpoints.
    Provides procedural Three.js component generation fallback.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.meshy_api_key

    async def generate_3d_asset(
        self,
        prompt: str,
        asset_name: str = "custom_asset"
    ) -> Dict[str, Any]:
        """Requests 3D asset generation or returns structured procedural geometry spec."""
        asset_file = ASSETS_DIR / f"{asset_name}.json"

        # Check if Meshy API key is configured
        if self.api_key:
            try:
                import httpx
                headers = {"Authorization": f"Bearer {self.api_key}"}
                payload = {
                    "mode": "preview",
                    "prompt": prompt,
                    "art_style": "realistic"
                }
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post("https://api.meshy.ai/v2/text-to-3d", headers=headers, json=payload)
                    if resp.status_code in (200, 202):
                        data = resp.json()
                        return {"status": "success", "task_id": data.get("result"), "provider": "meshy"}
            except Exception as e:
                print(f"Meshy generation error: {e}")

        # Procedural 3D specification generator
        procedural_spec = {
            "name": asset_name,
            "provider": "procedural_threejs",
            "prompt": prompt,
            "components": [
                {
                    "geometry": "BufferGeometry",
                    "primitive": "torus_knot",
                    "parameters": {"radius": 1.2, "tube": 0.35, "tubularSegments": 64, "radialSegments": 16},
                    "material": {
                        "type": "MeshPhysicalMaterial",
                        "color": "#38bdf8",
                        "metalness": 0.8,
                        "roughness": 0.15,
                        "clearcoat": 1.0,
                        "wireframe": False
                    }
                }
            ],
            "lighting": {
                "ambient": {"color": "#ffffff", "intensity": 0.4},
                "key_light": {"position": [5, 10, 7], "intensity": 1.5, "color": "#38bdf8"},
                "fill_light": {"position": [-5, -5, -5], "intensity": 0.8, "color": "#ec4899"}
            }
        }

        with open(asset_file, "w") as f:
            json.dump(procedural_spec, f, indent=2)

        return procedural_spec

meshy_adapter = Meshy3DAdapter()
