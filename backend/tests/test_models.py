from src.pzsp_backend.models import Channel, Network


def test_slices_occupied_by_channel():
    # the nodes and edges are not used in the calculation,
    # so they're left out for conciseness

    # Channel data straight from grid_allocation_example
    test_channel_1 = Channel(
        id="1", nodes=[], edges=[], width=112.5, frequency=191.49375
    )
    assert Network.get_slices_occupied_by_channel(test_channel_1) == list(range(18, 36))

    test_channel_2 = Channel(id="2", nodes=[], edges=[], width=50, frequency=196.1000)
    assert Network.get_slices_occupied_by_channel(test_channel_2) == list(
        range(760, 768)
    )
