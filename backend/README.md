# Backend API

## Create virtual env

```bash
python3 -m venv .venv
source .venv/bin/activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Run app in development mode

```bash
uvicorn app.main:app --reload
```

**Alternatively**

```bash
fastapi run main.py
```