def canonical_edge(i: str, j: str) -> tuple[str, str]:
    """Edge representation for the integer model solver. Treating the
    edges as min(i, j) instead of both (i, j) and (j, i) reduces the amount
    of calculations needed to find the result."""
    return (min(i, j), max(i, j))
