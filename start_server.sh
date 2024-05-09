#!/bin/bash

echo "start_server.sh is running!"
cd frontend && npm run build && cd ..
cd backend && source myenv/bin/activate
nohup sqlite_web -H 0.0.0.0 -p 8080 ./backend/instance/site.db --password &
nohup python3 backend/server.py &