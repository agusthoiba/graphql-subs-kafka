# graphql-subs-kafka
Graphql subscription Kafka

Graphql subscription with kafka example

## System Requirement
nodejs 14
mongodb 4.2
kafka 7.0.1-ce
 
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

### create user
```graphql
mutation createUser($mobileNumber: String!, $name: String!, $address:String) {
    createUser(input:{mobile_number: $mobileNumber, name: $name, address: $address}) {
        id
    }
}
```
```json
{
    "mobileNumber": "+628978799004",
    "name": "Jhon Anji"
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


## Compatibility


## License

See [LICENSE](https://github.com/agusthoiba/graphql-subs-kafka/blob/main/LICENSE).
