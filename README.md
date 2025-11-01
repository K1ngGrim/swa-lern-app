# Laborprojekt Software-Architekturen

## How to Run

### Frontend-Application

### Backend-Application

## Documentation
Documents can be found in /doc

Currently including:

## Docker / API port

The backend API is published from the compose file at the host port defined by `API_PORT` (default 5001).

- Default: set in `docker/.env` as `API_PORT=5001`.
- To override for a single run: `API_PORT=5010 docker compose -f docker/docker-compose-no-idea.yml up -d --build api`
- If you prefer the API to be reachable only on localhost, edit the `ports` mapping in `docker/docker-compose-no-idea.yml` to `127.0.0.1:${API_PORT:-5001}:8080`.

Example (curl):
```
curl http://localhost:5001/health
```
# Recommeneded VS Code Plugins
- 
## Repository Strategie
![Löwe](loewe.png)

