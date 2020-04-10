<template>
  <base-toggle
    title="Firestore"
    :isOptimistic="true"
    :toggle="toggle"
    :loading="loading"
    v-on:switch-toggle="switchToggle"
  />
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import BaseToggle from './BaseToggle'

const collectionName = 'toggle'

export default {
  name: 'FirestoreToggle',
  components: { BaseToggle },
  data () {
    return {
      toggle: undefined,
      loading: false,
      doc: null
    }
  },
  created () {
    this.conFirestore()
  },
  methods: {
    conFirestore () {
      // observer
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.uid = user.uid
          const db = firebase.firestore()
          const collection = db.collection(collectionName)
          const doc = collection.doc(this.uid)
          this.doc = doc
          doc.onSnapshot((data) => {
            if (data.data()) {
              this.toggle = data.data().toggle
            }
          })
        }
      })
    },
    async switchToggle () {
      if (this.doc !== null) {
        this.loading = true
        this.doc.set({ toggle: !this.toggle })
          .then(() => { this.loading = false })
      } else {
        alert('初期化中です')
      }
    }
  }
}
</script>
