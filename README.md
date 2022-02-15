# graphql-subs-kafka
Graphql subscription Kafka

Graphql subscription with kafka example

## System Requirement
- nodejs 14
- mongodb 4.2
- kafka 7.0.1-ce
 
## Installation
```bash
git clone https://github.com/agusthoiba/graphql-subs-kafka.git
npm i
cp .env.example .env
npx tsc

```

## Usage
```bash
node src/index.js
```

Browser client http://localhost:4100/graphql

### create user
```graphql
mutation createUser($mobile_number: String!, $name: String!, $address:String) {
    createUser(input:{mobile_number: $mobile_number, name: $name, address: $address}) {
        id
    }
}
```
```json
{
    "mobile_number": "+628978799004",
    "name": "Jhon Doe"
}
```

### Subcription 
```graphql
subscription onUserCreated {
  onUserCreated {
    id
    name
    mobile_number
    status
  }
}
```

```graphql
subscription onUserUpdateStatus {
  onUserUpdateStatus {
    id
    status
  }
}
```




## Compatibility


## License

See [LICENSE](https://github.com/agusthoiba/graphql-subs-kafka/blob/main/LICENSE).
