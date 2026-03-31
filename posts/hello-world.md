# Hello World

Welcome to the NOCTIS blog. This is a sample post to demonstrate the markdown rendering engine.

## What to expect

Posts here will cover topics like:

- **Vulnerability research** and responsible disclosure
- **Penetration testing** techniques and methodologies
- **CTF writeups** and challenge walkthroughs
- **Software development** projects and tools

## Code example

```python
import socket

def port_scan(target, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)
    result = s.connect_ex((target, port))
    s.close()
    return result == 0
```

## Stay tuned

More posts coming soon.

---

*S. Markakis — NOCTIS*
