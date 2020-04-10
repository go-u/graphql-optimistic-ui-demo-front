const variables = {
  domainsPrd: ['aws-graphql.a-log.me']
}

export function GetGraphApiUrl () {
  const isPrd = variables.domainsPrd.includes(document.domain)
  if (isPrd) {
    return 'https://aws-graphql.a-log.me/api/query'
  } else { // default local
    return 'http://localhost:8080/api/query'
  }
}

export default {
  variables,
  GetGraphApiUrl
}
