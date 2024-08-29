```toml
name = 'Update Employee By ID'
method = 'PUT'
url = 'http://localhost:3000/api/employees/3'
sortWeight = 1312500
id = '364aacb4-7191-4c09-871e-0342115d2ba7'

[[headers]]
key = 'Content-Type'
value = 'application/json'

[body]
type = 'JSON'
raw = '''
{
           "name": "John",
           "employee_code": "EMP125",
           "salary": 85000
         }'''
```
