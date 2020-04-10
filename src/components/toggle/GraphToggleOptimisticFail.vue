<template>
  <base-toggle
    title="GraphQL(Twitter風エラーハンドリング)"
    :isOptimistic="true"
    :toggle="toggle"
    :loading="loading"
    v-on:switch-toggle="switchToggle"
  />
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

import config from '../../config/config'

const httpLink = createHttpLink({ uri: config.GetGraphApiUrl() })
const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
  link: httpLink,
  cache
})

import BaseToggle from './BaseToggle'

export default {
  name: 'GraphToggleOptimisticFail',
  components: { BaseToggle },
  data () {
    return {
      toggle: undefined,
      loading: false
    }
  },
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getToggle()
      }
    })
  },
  methods: {
    async getToggle () {
      const user = firebase.auth().currentUser
      if (user) {
        const token = await firebase.auth().currentUser.getIdToken(false)
        const response = await apolloClient
          .query({
            fetchPolicy: 'no-cache',
            context: {
              headers: { JWT: token }
            },
            query: gql`
              {
                toggle {
                  id
                  enable
                  user {
                    uid
                  }
                }
              }
          `
          })
        this.toggle = response.data.toggle.enable
      }
    },
    // switch
    async switchToggle () {
      const user = firebase.auth().currentUser
      if (user) {
        const token = await firebase.auth().currentUser.getIdToken(false)
        this.loading = true
        const response = await apolloClient
          .mutate({
            context: {
              headers: { JWT: token }
            },
            optimisticResponse: {
              __typename: 'Mutation',
              switchToggle: {
                id: user.uid,
                enable: !this.enable,
                __typename: 'Toggle'
              }
            },
            mutation: gql`
              mutation switchToggleFail {
                switchToggleFail(input: { enable: ${!this.toggle} }) {
                  id
                  enable
                }
              }
              `,
            update: (proxy, { data: { submitComment } }) => {
              this.toggle = !this.toggle
            }
          })
        this.toggle = response.data.switchToggleFail.enable
        this.loading = false
      }
    }
  }
}
</script>
