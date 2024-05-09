# DearMe_BE
---

## Prerequisites
- Node.js
- npm
- Python 3.8 or higher
- pip3

## DearMe Demo Project Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/CAU-DM/DearMe_DEMO && cd DearMe_DEMO
```

### 2. Configure Environment Variables

Before running the application, you need to configure environment variables. Open the `initialize.sh` script and fill in all the placeholders (`{FILL}`) with your actual configuration keys:

```bash
# Set environment variables
GPT_API_KEY="{FILL}"
SERVER_INTERNAL_IP="{FILL}"
SERVER_PORT_NUMBER="{FILL}"
REACT_APP_APIKEY="{FILL}"
REACT_APP_AUTHDOMAIN="{FILL}"
REACT_APP_PROJECTID="{FILL}"
REACT_APP_STORAGEBUCKET="{FILL}"
REACT_APP_MESSAGINGSENDERID="{FILL}"
REACT_APP_APPID="{FILL}"
REACT_APP_MEASUREMENTID="{FILL}"
```
and then
```bash
chmod +x initialize.sh && bash initialize.sh
``` 

### 3. Start the Server

```bash
chmod +x start_server.sh && bash start_server.sh
```
