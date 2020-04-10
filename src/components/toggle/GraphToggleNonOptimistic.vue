<template>
  <base-toggle
    title="GraphQL"
    :isOptimistic="false"
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
  name: 'GraphToggleNonOptimistic',
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
            fetchPolicy: 'no-cache',
            context: {
              headers: { JWT: token }
            },
            mutation: gql`
              mutation switchToggle {
                switchToggle(input: { enable: ${!this.toggle} }) {
                  id
                  enable
                }
              }
              `
          })
        this.toggle = response.data.switchToggle.enable
        this.loading = false
      }
    }
  }
}
</script>
