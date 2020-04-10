<template>
  <div class="flex column">
    <q-btn label="DataLoader デモ (N+1対策)" @click="getToggles" :loading="loading"/>
    <div>
      <div class="text-center text-body1 q-pt-sm" v-show="toggles.length">{{ toggles.length && toggles[0].user.batchSize }}件を1クエリで処理<br/>(Toggle > Userのリレーション)</div>
      <q-item v-for="(toggle, index) in toggles" v-bind:key="toggle.id" class="q-pl-xl">
        <q-item-section>
          <q-item-label>User{{ index + 1 }}のスイッチ状況 </q-item-label>
          <q-item-label caption class="text-grey">ID:{{ toggle.user.uid }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="green-3" :value="toggle.enable" disable/>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script>
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

export default {
  name: 'DataLoader',
  data () {
    return {
      toggles: [],
      loading: false
    }
  },
  methods: {
    async getToggles () {
      this.loading = true
      const response = await apolloClient
        .query({
          fetchPolicy: 'no-cache',
          query: gql`
            {
              toggles {
                id
                enable
                user {
                  uid
                  createdAt
                  batchSize
                }
              }
            }
        `
        })
      this.toggles = response.data.toggles
      this.loading = false
    }
  }
}
</script>
