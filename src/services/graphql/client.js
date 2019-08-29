
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import onError from './errorHandler'

//CONFIG
import {
  BASE_URL,
} from '../../config'

//STORE
import { token } from '../stores'

let httpLink = new HttpLink({ 
  uri: BASE_URL
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const bearerAccessToken = token.bearerAccessToken
  // return the headers to the context so httpLink can read them
  let anotherHeaders = {}

  if (bearerAccessToken) anotherHeaders.Authorization = bearerAccessToken

  return {
    headers: {
      ...headers,
      ...anotherHeaders,
    }
  }
})

export default new ApolloClient({
  link: authLink.concat(onError).concat(httpLink),
  cache: new InMemoryCache()
})