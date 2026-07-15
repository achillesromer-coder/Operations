#!/usr/bin/env python3
"""Validate and build a review-only LS Web Operations release bundle."""

from __future__ import annotations

import argparse
import hashlib
import json
import zipfile
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / "registry" / "operations_registry.json"
ARTIFACT_PREFIXES = ("W", "Calc;", "Sim;", "Home;")
REQUIRED_POLICY = {
    "delivery": "static_readonly",
    "publish_gate": "manual_publish_gate",
    "data_access": "protected_read",
    "direct_desktop_mutation": False,
}
REQUIRED_SURFACE_FIELDS = ("surface_id", "kind", "title", "route", "release_state", "claim_boundary")
ALLOWED_RELEASE_STATES = {
    "review_candidate",
    "gated_live_route",
    "protected_route",
    "blocked_missing_route",
    "published_reference",
}


def load_registry(path: Path = REGISTRY_PATH) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        raise ValueError("Operations registry root must be an object")
    return data


def repository_artifacts(root: Path) -> set[str]:
    return {
        path.name
        for path in root.iterdir()
        if path.is_file() and path.name.startswith(ARTIFACT_PREFIXES)
    }


def validate_registry(root: Path, registry: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if registry.get("schema_version") != "1.0":
        errors.append("Registry schema_version must be 1.0")

    policy = registry.get("release_policy")
    if not isinstance(policy, dict):
        errors.append("Registry release_policy must be an object")
    else:
        for key, expected in REQUIRED_POLICY.items():
            if policy.get(key) != expected:
                errors.append(f"Release policy {key} must be {expected!r}")

    surfaces = registry.get("surfaces")
    if not isinstance(surfaces, list) or not surfaces:
        return errors + ["Registry surfaces must be a non-empty array"]

    seen_ids: set[str] = set()
    seen_routes: set[str] = set()
    registered_artifacts: set[str] = set()
    for index, surface in enumerate(surfaces):
        label = f"surface[{index}]"
        if not isinstance(surface, dict):
            errors.append(f"{label} must be an object")
            continue

        for field in REQUIRED_SURFACE_FIELDS:
            if not isinstance(surface.get(field), str) or not surface[field]:
                errors.append(f"{label} missing {field}")

        surface_id = surface.get("surface_id")
        route = surface.get("route")
        artifact = surface.get("artifact")
        release_state = surface.get("release_state")
        if not isinstance(surface_id, str) or not surface_id:
            errors.append(f"{label} missing surface_id")
        elif surface_id in seen_ids:
            errors.append(f"Duplicate surface_id: {surface_id}")
        else:
            seen_ids.add(surface_id)

        if not isinstance(route, str) or not route.startswith("/"):
            errors.append(f"{surface_id or label} route must be root-relative")
        elif route in seen_routes:
            errors.append(f"Duplicate route: {route}")
        else:
            seen_routes.add(route)

        if release_state not in ALLOWED_RELEASE_STATES:
            errors.append(f"Invalid release_state for {surface_id or label}: {release_state}")
        if release_state == "blocked_missing_route" and artifact:
            errors.append(f"Blocked missing route cannot carry an artifact: {surface_id}")

        data_route = surface.get("data_route")
        if data_route is not None and (not isinstance(data_route, str) or not data_route.startswith("/")):
            errors.append(f"{surface_id or label} data_route must be root-relative")

        if artifact is None:
            continue
        if not isinstance(artifact, str) or not artifact:
            errors.append(f"{surface_id or label} artifact must be a non-empty string")
            continue
        if artifact in registered_artifacts:
            errors.append(f"Duplicate artifact registration: {artifact}")
            continue
        registered_artifacts.add(artifact)
        if release_state != "review_candidate":
            errors.append(f"Bundled artifact must remain review_candidate: {surface_id}")
        if surface.get("kind") == "workspace" and not data_route:
            errors.append(f"Workspace artifact missing protected data_route: {surface_id}")

        artifact_path = root / artifact
        if not artifact_path.is_file():
            errors.append(f"Missing registered artifact: {artifact}")
            continue
        try:
            text = artifact_path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError) as exc:
            errors.append(f"Unreadable registered artifact {artifact}: {exc}")
            continue
        for marker_name in ("route", "data_route"):
            marker = surface.get(marker_name)
            if marker and marker not in text:
                errors.append(f"Artifact {artifact} missing {marker_name} marker: {marker}")

    unregistered = repository_artifacts(root) - registered_artifacts
    if unregistered:
        errors.append(f"Unregistered Operations artifacts: {', '.join(sorted(unregistered))}")
    unknown = registered_artifacts - repository_artifacts(root)
    if unknown:
        errors.append(f"Registry references unknown artifacts: {', '.join(sorted(unknown))}")

    home = next((surface for surface in surfaces if surface.get("surface_id") == "LS-OPS-HOME"), None)
    if isinstance(home, dict) and isinstance(home.get("artifact"), str):
        home_path = root / home["artifact"]
        if home_path.is_file():
            home_text = home_path.read_text(encoding="utf-8")
            missing_ids = sorted(
                surface["surface_id"]
                for surface in surfaces
                if isinstance(surface, dict)
                and isinstance(surface.get("surface_id"), str)
                and surface["surface_id"] not in home_text
            )
            if missing_ids:
                errors.append(f"Operations home missing registry surfaces: {', '.join(missing_ids)}")
    return errors


def sha256_bytes(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def canonical_text_bytes(path: Path) -> bytes:
    text = path.read_text(encoding="utf-8")
    return text.replace("\r\n", "\n").replace("\r", "\n").encode("utf-8")


def release_manifest(root: Path, registry: dict[str, Any]) -> dict[str, Any]:
    errors = validate_registry(root, registry)
    if errors:
        raise ValueError("; ".join(errors))

    surfaces: list[dict[str, Any]] = []
    for source in registry["surfaces"]:
        item = dict(source)
        artifact = item.get("artifact")
        if artifact:
            content = canonical_text_bytes(root / artifact)
            item["sha256"] = sha256_bytes(content)
            item["size_bytes"] = len(content)
        surfaces.append(item)
    return {
        "schema_version": registry["schema_version"],
        "registry_id": registry["registry_id"],
        "registry_updated": registry["updated"],
        "authority": registry["authority"],
        "release_policy": registry["release_policy"],
        "surface_count": len(surfaces),
        "artifact_count": sum("artifact" in item for item in surfaces),
        "surfaces": surfaces,
    }


def _zip_entry(archive: zipfile.ZipFile, name: str, content: bytes) -> None:
    info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
    info.compress_type = zipfile.ZIP_STORED
    info.external_attr = 0o100644 << 16
    archive.writestr(info, content)


def build_release(root: Path, registry: dict[str, Any], output_dir: Path) -> tuple[Path, Path]:
    manifest = release_manifest(root, registry)
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = output_dir / "operations-release-manifest.json"
    manifest_bytes = (json.dumps(manifest, indent=2, sort_keys=True) + "\n").encode("utf-8")
    manifest_path.write_bytes(manifest_bytes)

    bundle_path = output_dir / "operations-web-review-bundle.zip"
    with zipfile.ZipFile(bundle_path, "w") as archive:
        _zip_entry(archive, "operations-release-manifest.json", manifest_bytes)
        for surface in manifest["surfaces"]:
            artifact = surface.get("artifact")
            if artifact:
                _zip_entry(archive, f"surfaces/{artifact}", canonical_text_bytes(root / artifact))
    return manifest_path, bundle_path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("check", help="validate the Operations release registry")
    build_parser = subparsers.add_parser("build", help="build the review-only release bundle")
    build_parser.add_argument("--output-dir", type=Path, default=ROOT / "dist")
    args = parser.parse_args()

    registry = load_registry()
    errors = validate_registry(ROOT, registry)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    artifact_count = len(repository_artifacts(ROOT))
    print(f"Validated {len(registry['surfaces'])} registry surfaces and {artifact_count} artifacts.")
    if args.command == "build":
        manifest_path, bundle_path = build_release(ROOT, registry, args.output_dir)
        print(f"Built {manifest_path}")
        print(f"Built {bundle_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
