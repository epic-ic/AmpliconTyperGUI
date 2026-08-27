import json
import sys
from amplicontyper.scripts.classify import main

request = json.loads(sys.stdin.readline().strip())
args = request.get('args', [])
kwargs = request.get('kwargs', {})

try:
    result = classify(*args, **kwargs)
    sys.stdout.write(json.dumps({'result': result}) + '\n')
except Exception as e:
    sys.stdout.write(json.dumps({'error': str(e)}) + '\n')