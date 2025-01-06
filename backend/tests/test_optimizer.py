from src.pzsp_backend.optimization.base import Optimizer


def test_slices_from_freq_and_width():
    test_cases = (
        (112.5, 191.49375, list(range(18, 36))),
        (50, 196.1000, list(range(760, 768))),
    )
    for width, freq, slices in test_cases:
        assert Optimizer.get_slice_indices_from_freq_and_width(width, freq) == slices


def test_frequency_and_width_from_slice_list():
    test_cases = (
        (list(range(18, 36)), 112.5, 191.49375),
        (list(range(760, 768)), 50, 196.1000),
    )
    for slices, width, freq in test_cases:
        assert Optimizer.get_frequency_and_width_from_slice_list(slices) == (
            freq,
            width,
        )
