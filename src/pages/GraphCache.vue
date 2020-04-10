<template>
  <q-page class="flex flex-center">
    <div class="flex column q-gutter-y-md" style="width: 300px">
      <div class="text-center text-h5">楽観的UIのテスト</div>
      <q-item v-for="item in memo" v-bind:key="item.id" class="text-h5 q-px-none">
        <q-item-section>
          <q-item-label>{{ item.text }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="delete" flat @click="deleteMemo(item)"/>
        </q-item-section>
      </q-item>
      <q-input v-model="input" placeholder="テキスト入力 + Enter" @keyup.enter="addMemo"/>

      <div class="q-mt-lg">
        <div v-show="hasRecived === false" class="text-center"><q-spinner/>更新中</div>
      </div>

      <div class="q-mt-lg text-grey text-weight-medium">
        <div>Your ID@GCP-USA</div>
        <div>{{ uid }}</div>
      </div>
    </div>

  </q-page>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

import config from '../config/config'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: config.GetGraphApiUrl()
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache
})

export default {
  name: 'GraphCache',
  // props: ['login'],
  data () {
    return {
      input: null,
      uid: null,
      memo: [],
      hasRecived: undefined,
      localUpdate: null,
      remoteUpdate: null
    }
  },
  // watch: {
  //   // ページ読み込み時に、ユーザ名が判明し次第、直ちに取得
  //   login: {
  //     handler (login) {
  //       if (login) {
  //         this.getMemo()
  //       }
  //     },
  //     immediate: true
  //   }
  // },
  created () {
    // observer
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid
        this.getMemo()
      }
    })
  },
  methods: {
    async getMemo () {
      this.hasRecived = false
      const user = firebase.auth().currentUser
      if (user) {
        const token = await firebase.auth().currentUser.getIdToken(false)
        const response = await apolloClient
          .query({
            fetchPolicy: 'network-only',
            context: {
              headers: { JWT: token }
            },
            query: gql`
            {
              todos
              {
                id
                text
                user {
                  uid
                }
              }
            }
          `
          })
        this.memo = response.data.todos
        console.log(response)
        this.hasRecived = true
      }
    },
    async addMemo () {
      this.hasRecived = false
      const user = firebase.auth().currentUser
      if (user) {
        const token = await firebase.auth().currentUser.getIdToken(false)
        await apolloClient
          .mutate({
            context: {
              headers: { JWT: token }
            },
            // optimisticResponse: {
            //   __typename: 'Mutation',
            //   createTodo: {
            //     __typename: 'Todo',
            //     text: this.input,
            //     id: 1,
            //     user: {
            //       uid: 2,
            //       __typename: 'User'
            //     }
            //   }
            // },
            mutation: gql`
              mutation createTodo {
                createTodo(input:{text: "${this.input}" }) {
                  text
                  id
                  user {
                    uid
                  }
                }
              }
            `,
            update: (cache, result) => {
              const newMemo = {
                text: this.input
              }
              this.memo = this.memo.concat(newMemo)
            }
          })
        this.input = ''
        this.getMemo()
      }
    },
    async deleteMemo (item) {
      this.hasRecived = false
      const user = firebase.auth().currentUser
      if (user) {
        const token = await firebase.auth().currentUser.getIdToken(false)

        await apolloClient
          .mutate({
            variables: { id: item.id },
            optimisticResponse: {
              __typename: 'Mutation',
              deleteTodo: {
                id: item.id,
                __typename: 'Todo'
              }
            },
            context: {
              headers: { JWT: token }
            },
            mutation: gql`
              mutation deleteTodo {
                deleteTodo(input: { id: ${item.id} }) {
                  id
                }
              }
            `,
            update: (cache, result) => {
              console.log(cache)
              console.log(result)
              this.memo = this.memo.filter(x => {
                return x.id !== item.id
              })
            }
          })
        this.getMemo()
      }
    }
  }
}
</script>
