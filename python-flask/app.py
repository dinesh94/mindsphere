from flask import Flask, request, jsonify
import requests
import os
from datetime import datetime

# Read MDSP environment from environment variables
ENV = os.getenv("MDSP-ENV", 'eu1')
ASSET_PATH = 'https://gateway.{0}.mindsphere.io/api/assetmanagement/v3/assets'.format(ENV)

app = Flask(__name__)

# Get port from environment variable or use default
port = int(os.getenv("PORT", 80))

@app.route('/')
def hello_world():
    auth_header = request.headers.get('Authorization', None)

    if auth_header is not None:
        # Add headers for authorization (use token from requesting user) and the accept type
        headers = {'Authorization': auth_header, 'Accept': 'application/hal+json'}
        try:
            r = requests.get(ASSET_PATH, headers=headers)
            resp = r.json() # response as json
        except Exception as err:
            resp = str(err)

        try:
            return jsonify(resp) # return json response from MindSphere API
        except Exception as err:
            print('Failed to jsonify', err)
    else:
        return 'Retrieved no authorization header'

@app.route('/health')
def health_check():
    # do some checks and then return the result
    health = {
        'healthStatus': 'green',
        'time': datetime.utcnow().replace(tzinfo=datetime.timezone.utc).isoformat()
    }

    return jsonify(health)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)