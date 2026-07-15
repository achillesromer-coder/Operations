import copy
import tempfile
import unittest
import zipfile
from pathlib import Path

from scripts.operations_release import (
    ROOT,
    build_release,
    canonical_text_bytes,
    load_registry,
    validate_registry,
)
from scripts.validate_operations_control import (
    validate_operation_surfaces,
    windows_path_issue,
)


class WindowsPathIssueTests(unittest.TestCase):
    def test_accepts_current_operations_names(self) -> None:
        self.assertIsNone(windows_path_issue("W6; PAL"))
        self.assertIsNone(windows_path_issue("CORE/Drive_GitHub_Bridge.md"))

    def test_rejects_invalid_and_reserved_names(self) -> None:
        self.assertIsNotNone(windows_path_issue("W6: PAL"))
        self.assertIsNotNone(windows_path_issue("reports/CON.txt"))
        self.assertIsNotNone(windows_path_issue("reports/proof. "))


class OperationSurfaceTests(unittest.TestCase):
    def test_accepts_complete_route_markers(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            surface = Path("W1; IDA")
            (root / surface).write_text(
                '<a href="/operations/w1">W1</a><a href="/w1/data">Data</a>',
                encoding="utf-8",
            )
            self.assertEqual(
                validate_operation_surfaces(
                    root,
                    {surface: ("/operations/w1", "/w1/data")},
                ),
                [],
            )

    def test_reports_missing_surface_and_route_marker(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            incomplete = Path("W2; GOS")
            missing = Path("W3; RMS")
            (root / incomplete).write_text("/operations/w2", encoding="utf-8")

            errors = validate_operation_surfaces(
                root,
                {
                    incomplete: ("/operations/w2", "/w2/data"),
                    missing: ("/operations/w3",),
                },
            )

            self.assertIn(
                "Operations surface W2; GOS missing route marker: /w2/data",
                errors,
            )
            self.assertIn("Missing Operations surface: W3; RMS", errors)


class OperationsReleaseTests(unittest.TestCase):
    def test_canonicalizes_checkout_line_endings(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "surface"
            path.write_bytes(b"alpha\r\nbeta\rgamma\n")
            self.assertEqual(canonical_text_bytes(path), b"alpha\nbeta\ngamma\n")

    def test_current_registry_covers_every_repository_artifact(self) -> None:
        self.assertEqual(validate_registry(ROOT, load_registry()), [])

    def test_rejects_mutable_web_delivery(self) -> None:
        registry = copy.deepcopy(load_registry())
        registry["release_policy"]["delivery"] = "readwrite"
        self.assertIn(
            "Release policy delivery must be 'static_readonly'",
            validate_registry(ROOT, registry),
        )

    def test_rejects_unregistered_repository_artifact(self) -> None:
        registry = copy.deepcopy(load_registry())
        registry["surfaces"] = [
            surface for surface in registry["surfaces"] if surface.get("artifact") != "W6; PAL"
        ]
        errors = validate_registry(ROOT, registry)
        self.assertTrue(any("Unregistered Operations artifacts: W6; PAL" in error for error in errors))

    def test_rejects_incomplete_surface_contract(self) -> None:
        registry = copy.deepcopy(load_registry())
        del registry["surfaces"][0]["claim_boundary"]
        self.assertIn("surface[0] missing claim_boundary", validate_registry(ROOT, registry))

    def test_builds_review_bundle_with_manifest_and_all_artifacts(self) -> None:
        registry = load_registry()
        with tempfile.TemporaryDirectory() as directory:
            manifest_path, bundle_path = build_release(ROOT, registry, Path(directory))
            self.assertTrue(manifest_path.is_file())
            with zipfile.ZipFile(bundle_path) as archive:
                names = set(archive.namelist())
            self.assertIn("operations-release-manifest.json", names)
            self.assertEqual(len([name for name in names if name.startswith("surfaces/")]), 15)
            first_manifest = manifest_path.read_bytes()
            first_bundle = bundle_path.read_bytes()
            build_release(ROOT, registry, Path(directory))
            self.assertEqual(manifest_path.read_bytes(), first_manifest)
            self.assertEqual(bundle_path.read_bytes(), first_bundle)


if __name__ == "__main__":
    unittest.main()
