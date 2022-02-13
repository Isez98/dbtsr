import { cacheExchange } from '@urql/exchange-graphcache'
import { createClient, dedupExchange, fetchExchange } from 'urql'
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
} from '../generated/graphql'
import { typeFunctionQuery } from './typeFunctionQuery'

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
