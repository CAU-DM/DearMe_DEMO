#!/bin/bash

echo "start_server.sh is running!"
cd frontend && npm run build && cd ..
cd backend && source myenv/bin/activate && python3 server.py && cd ..
