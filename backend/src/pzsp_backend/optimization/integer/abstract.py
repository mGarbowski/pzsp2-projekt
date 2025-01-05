import pyomo.environ as pyo

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
    default=2,  # TODO: how to initialize this
)  # Required consecutive free slices

# Variables
# Binary decision variables for edge selection
model.x = pyo.Var(model.Edges, domain=pyo.Binary)

# Binary variable to indicate if slice `s` is selected as the starting index
model.y = pyo.Var(model.Slices, domain=pyo.Binary)

# Auxiliary variable for linearization
model.z = pyo.Var(model.Edges, model.Slices, domain=pyo.Binary)


# Objective Function: Minimize the total weight of the path
def obj_rule(model):
    return sum(model.Weights[e] * model.x[e] for e in model.Edges)


model.obj = pyo.Objective(rule=obj_rule, sense=pyo.minimize)


# Flow Conservation Constraints
def flow_balance_rule(model, node):
    inflow = sum(model.x[i, node] for i, j in model.Edges if j == node)
    outflow = sum(model.x[node, j] for i, j in model.Edges if i == node)
    if node == pyo.value(model.Source):
        return outflow - inflow == 1  # Source node: net outflow = 1
    elif node == pyo.value(model.Target):
        return inflow - outflow == 1  # Target node: net inflow = 1
    else:
        return inflow - outflow == 0  # Intermediate nodes: net flow = 0


model.flow_balance = pyo.Constraint(model.Nodes, rule=flow_balance_rule)


# Free Slices for Each Edge
def free_slices_rule(model, src, tgt):
    e = (src, tgt)
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
def consistency_rule(model, src, tgt, slice):
    e = (src, tgt)
    if slice + model.S.value - 1 > max(model.Slices):
        return pyo.Constraint.Skip
    return model.z[e, slice] <= 1 - model.Occupied[e, slice]


model.consistency = pyo.Constraint(model.Edges, model.Slices, rule=consistency_rule)


# Link z to the product of y[slice] and x[e]
def link_z_rule1(model, src, tgt, slice):
    e = (src, tgt)
    return model.z[e, slice] <= model.y[slice]


model.link_z1 = pyo.Constraint(model.Edges, model.Slices, rule=link_z_rule1)


def link_z_rule2(model, src, tgt, slice):
    e = (src, tgt)
    return model.z[e, slice] <= model.x[e]


model.link_z2 = pyo.Constraint(model.Edges, model.Slices, rule=link_z_rule2)


def link_z_rule3(model, src, tgt, slice):
    e = (src, tgt)
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
