import tempfile
import unittest
from pathlib import Path

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


if __name__ == "__main__":
    unittest.main()
