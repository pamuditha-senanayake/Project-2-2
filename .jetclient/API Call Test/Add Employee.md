```toml
name = 'Add Employee'
method = 'POST'
url = 'http://localhost:3000/api/employees/'
sortWeight = 1250000
id = '34d6c866-188b-4af8-bdc5-465d6d0be687'

[[headers]]
key = 'Content-Type'
value = 'application/json'

[body]
type = 'JSON'
raw = '''
{
           "name": "John Doe",
           "employee_code": "EMP123",
           "salary": 75000
         }'''
```
