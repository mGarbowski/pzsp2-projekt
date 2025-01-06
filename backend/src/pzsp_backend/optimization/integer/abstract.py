import pyomo.environ as pyo

from src.pzsp_backend.optimization.integer.util import canonical_edge

# Define the abstract model
model = pyo.AbstractModel()

# Sets
model.Nodes = pyo.Set()  # Set of nodes
model.Edges = pyo.Set(dimen=2)  # Set of edges, as pairs (i, j)
model.Slices = pyo.RangeSet(0, 767)  # 768 slices indexed from 0 to 767

# Parameters
model.Weights = pyo.Param(model.Edges)  # Weight of each edge
model.Source = pyo.Param()  # Source node
model.Target = pyo.Param()  # Target node
model.Occupied = pyo.Param(
    model.Edges, model.Slices, domain=pyo.Binary
)  # Slice occupancy for each edge
model.S = pyo.Param(
    domain=pyo.NonNegativeIntegers,
    mutable=True,
    default=2,
)  # Required consecutive free slices

# Variables
model.x = pyo.Var(model.Edges, domain=pyo.Binary)  # Edge selection
model.y = pyo.Var(model.Slices, domain=pyo.Binary)  # Slice selection
model.z = pyo.Var(model.Edges, model.Slices, domain=pyo.Binary)  # Auxiliary variable


# Objective Function
def obj_rule(model):
    return sum(model.Weights[e] * model.x[e] for e in model.Edges)


model.obj = pyo.Objective(rule=obj_rule, sense=pyo.minimize)


def flow_balance_rule(model, node):
    # All edges that connect to 'node' in an undirected sense:
    edges_touching_node = [e for e in model.Edges if node in e]
    # Because x[e] is a *binary* indicator for whether edge e is used,
    # in an undirected path setting, "inflow" = "outflow" basically
    # becomes "the number of edges used that touch node."
    # For interior nodes, we want 2 edges used; for Source/Target, we want 1 edge used.

    # But if you specifically want a flow interpretation:
    #   inflow = outflow for an interior node
    #   (outflow - inflow) = ±1 for source/target
    # then we need to define outflow-inflow carefully.
    # For an undirected edge, there's no inherent direction, so you can do e.g.:

    inflow = sum(model.x[e] for e in edges_touching_node)  # treat them all as "inflow"

    if node not in [pyo.value(model.Source), pyo.value(model.Target)]:
        # interior node: number of used edges = 2
        return inflow == 2
    else:
        # source or target: number of used edges = 1
        return inflow == 1


model.flow_balance = pyo.Constraint(model.Nodes, rule=flow_balance_rule)


# Free Slices for Each Edge
def free_slices_rule(model, i, j):
    e = canonical_edge(i, j)
    return (
        sum(
            model.y[s]
            * pyo.prod(
                (1 - model.Occupied[e, s_prime])
                for s_prime in range(s, s + model.S.value)
                if s_prime in model.Slices
            )
            for s in model.Slices
            if s + model.S.value - 1 <= max(model.Slices)
        )
        >= model.x[e]
    )


model.free_slices = pyo.Constraint(model.Edges, rule=free_slices_rule)


# Consistency of Selected Slices Across Edges
def consistency_rule(model, i, j, slice):
    e = canonical_edge(i, j)
    if slice + model.S.value - 1 > max(model.Slices):
        return pyo.Constraint.Skip
    return model.z[e, slice] <= 1 - model.Occupied[e, slice]


model.consistency = pyo.Constraint(model.Edges, model.Slices, rule=consistency_rule)


# Linking z to y and x
def link_z_rule1(model, i, j, slice):
    e = canonical_edge(i, j)
    return model.z[e, slice] <= model.y[slice]


model.link_z1 = pyo.Constraint(model.Edges, model.Slices, rule=link_z_rule1)


def link_z_rule2(model, i, j, slice):
    e = canonical_edge(i, j)
    return model.z[e, slice] <= model.x[e]


model.link_z2 = pyo.Constraint(model.Edges, model.Slices, rule=link_z_rule2)


def link_z_rule3(model, i, j, slice):
    e = canonical_edge(i, j)
    return model.z[e, slice] >= model.y[slice] + model.x[e] - 1


model.link_z3 = pyo.Constraint(model.Edges, model.Slices, rule=link_z_rule3)


# Mutual Exclusivity of Selected Slices
def mutual_exclusivity_rule(model):
    return (
        sum(
            model.y[s]
            for s in model.Slices
            if s + model.S.value - 1 <= max(model.Slices)
        )
        == 1
    )


model.mutual_exclusivity = pyo.Constraint(rule=mutual_exclusivity_rule)
