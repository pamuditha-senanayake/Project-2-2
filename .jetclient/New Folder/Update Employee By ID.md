```toml
name = 'Update Employee By ID'
method = 'PUT'
url = 'http://localhost:3000/api/employees/4'
sortWeight = 1312500
id = '364aacb4-7191-4c09-871e-0342115d2ba7'

[[headers]]
key = 'Content-Type'
value = 'application/json'

[body]
type = 'JSON'
raw = '''
{
           "name": "Devid",
           "employee_code": "EMP127",
           "salary": 25000
         }'''
```
