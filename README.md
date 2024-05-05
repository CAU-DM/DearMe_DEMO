# DearMe_BE
---

## Prerequisites
- Node.js
- npm
- Python 3.8 or higher
- pip3

## Installation and Execution

### 0. clone
```bash
git clone https://github.com/CAU-DM/DearMe_BE.git
```

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run build
cd ..
```

### 2. Backend Setup & Execution

```bash
cd backend
python3 -m venv myenv
source myenv/bin/activate
pip3 install -r requirements.txt
```
```
echo "API_KEY={YOUR_CHAT_GPT_API_KEY}" > .env
python3 -u server.py
```