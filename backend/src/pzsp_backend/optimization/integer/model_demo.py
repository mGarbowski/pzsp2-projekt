import pyomo.environ as pyo
from pydantic import BaseModel

# A simple model minimizing the expression ax + by, where x and y >= 0 and 3x+2y >= 1
model = pyo.AbstractModel()

# Parameters for coefficients a and b
model.a = pyo.Param(within=pyo.Integers, mutable=True)
model.b = pyo.Param(within=pyo.Integers, mutable=True)

# Decision variables
model.x = pyo.Var(within=pyo.NonNegativeReals)
model.y = pyo.Var(within=pyo.NonNegativeReals)


# Objective function: Minimize ax + by
def obj_expression(model):
    return model.a * model.x + model.b * model.y


model.obj = pyo.Objective(rule=obj_expression, sense=pyo.minimize)


# Constraint: 3x + 2y >= 1
def constraint_rule(model):
    return 3 * model.x + 2 * model.y >= 1


model.constraint = pyo.Constraint(rule=constraint_rule)


def pyo_mapping(v):
    """Transform a value into a mapping with a single None key, as this is the way
    to initialize params in pyomo"""
    return {None: v}


class ModelParams(BaseModel):
    a: int
    b: int


def solve_instance(p: ModelParams) -> tuple[int, int]:
    # Create an instance of the model
    data = pyo_mapping({"a": pyo_mapping(p.a), "b": pyo_mapping(p.b)})

    instance = model.create_instance(data)

    # Solve the model
    solver = pyo.SolverFactory("cbc")
    solver.solve(instance)

    # Return the optimal value of x
    return (instance.x.value, instance.y.value)  # type: ignore
