import json
import time
import random
import urllib.request
import urllib.error

# CONFIGURATION
# Replace with your local IP if testing from another device, or keep localhost if on same machine
BASE_URL = "http://localhost:3001/api/telemetry" 
PATIENT_ID = "P-101"

print(f"Starting Simulation for Patient {PATIENT_ID}...")
print(f"Target URL: {BASE_URL}")

volume_infused = 0
total_volume = 1000

while True:
    try:
        # Simulate sensor readings
        flow_rate = random.uniform(140, 160) # ml/hr
        temp = random.uniform(36.5, 37.2) # Celsius
        dist = random.uniform(5, 20) # cm (distance from top of bottle)
        drop_count_rate = int(flow_rate / 3) # Approx drops per minute
        
        # Update volume (simulating 2 seconds passing)
        volume_infused += (flow_rate / 3600) * 2
        
        # Determine status
        status = "Normal"
        if volume_infused >= total_volume * 0.9:
            status = "Warning"
        if volume_infused >= total_volume:
            status = "Completed"
            
        # Random occlusion
        if random.random() > 0.98:
            flow_rate = 0
            drop_count_rate = 0
            status = "Critical"
            print("!!! SIMULATING OCCLUSION !!!")

        payload = {
            "id": PATIENT_ID,
            "temp": round(temp, 1),
            "dist": round(dist, 1),
            "ir": drop_count_rate,
            "flow": int(flow_rate), 
            "volumeInfused": round(volume_infused, 1),
            "status": status,
            "battery": random.randint(80, 100)
        }

        # Send request using urllib (standard library)
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(BASE_URL, data=data, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req) as response:
            print(f"Sent: {payload} | Response: {response.code}")

    except urllib.error.URLError as e:
        print(f"Connection Error: {e}")
    except Exception as e:
        print(f"Error: {e}")
        
    time.sleep(2)
