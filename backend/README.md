# Backend API

## Installation

### Install pdm

```bash
curl -sSL https://pdm-project.org/install-pdm.py | python3 -
```

Other installation methods are listed [here](https://pdm-project.org/latest/#installation)

### Setup venv

```bash
pdm venv create     # create venv
pdm venv activate   # activate it
```

### Install dependencies

```bash
pdm install         # install developer dependencies
pdm install --prod  # install production dependencies
```

## Run

```bash
pdm start       # start the server
```

## Test

```bash
pdm test
```

## Other utilities

```bash
pdm lint    # runs flake8, black and isort with --check flags
pdm format  # formats in place using black and isort
pdm cov     # generates coverage report
```
