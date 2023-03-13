import { cacheExchange, Cache } from '@urql/exchange-graphcache'
import { dedupExchange, fetchExchange } from 'urql'
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
} from '../generated/graphql'
import { typeFunctionQuery } from './typeFunctionQuery'

function invalidateQuery(cache: Cache, query: string) {
  const allFields = cache.inspectFields('Query')
  const fieldInfos = allFields.filter((info) => info.fieldName === query)
  fieldInfos.forEach((fi) => {
    cache.invalidate('Query', query, fi.arguments || {})
  })
}

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            typeFunctionQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            )
          },

          login: (_result, args, cache, info) => {
            typeFunctionQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query
                } else {
                  return {
                    me: result.login.user,
                  }
                }
              }
            )
          },

          createOwner: (_result, args, cache, info) => {
            invalidateQuery(cache, 'owners')
          },

          createDevelopment: (_result, args, cache, info) => {
            invalidateQuery(cache, 'developments')
          },

          createProperty: (_result, args, cache, info) => {
            invalidateQuery(cache, 'properties')
          },

          register: (_result: LoginMutation, args, cache, info) => {
            typeFunctionQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query
                } else {
                  return {
                    me: result.register.user,
                  }
                }
              }
            )
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
})
