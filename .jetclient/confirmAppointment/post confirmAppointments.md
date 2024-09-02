```toml
name = 'post confirmAppointments'
method = 'POST'
url = 'http://localhost:3000/api/confirm/'
sortWeight = 1000000
id = 'a408b69d-db9e-4ab1-87f3-d3ad41700a0e'

[body]
type = 'JSON'
raw = '''
{
  "appointmentData": {
    "user_id": 10,
    "professional_id": 2,
    "appointment_date": "2024-09-15",
    "total_time": "02:00:00",  // Format: HH:MM:SS
    "total_cost": 150.00
  },
  "serviceIds": [1, 3],  // Array of service IDs to be associated with the appointment
  "timeSlotIds": [5, 7]  // Array of time slot IDs to be associated with the appointment
}
'''
```
