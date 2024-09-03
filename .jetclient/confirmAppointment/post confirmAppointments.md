```toml
name = 'post confirmAppointments'
method = 'POST'
url = 'http://localhost:3001/api/confirm/'
sortWeight = 1000000
id = 'a408b69d-db9e-4ab1-87f3-d3ad41700a0e'

[body]
type = 'JSON'
raw = '''
{
  "appointmentData": {
    "user_id": 4,
    "professional_id": 3,
    "appointment_date": "2024-09-15",
    "total_time": "02:00:00",  // Duration in HH:MM:SS format
    "total_cost": 15000.00       // Total cost as a decimal
  },
  "serviceIds": [1, 2, 3, 5, 7],       // Array of service IDs to associate with the appointment
  "time_numbers": [4, 5, 6]       // Array of time slot IDs to associate with the appointment
}'''
```
