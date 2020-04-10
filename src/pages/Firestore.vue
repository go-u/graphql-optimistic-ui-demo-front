<template>
  <q-page class="flex flex-center">
    <div class="flex column q-gutter-y-md" style="width: 300px">
      <div class="text-center text-h5">楽観的UIのテスト</div>
      <q-item v-for="(item, index) in memo" v-bind:key="index" class="text-h5 q-px-none">
        <q-item-section>
          <q-item-label>{{ item.text }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="delete" flat @click="deleteMemo(index)"/>
        </q-item-section>
      </q-item>
      <q-input v-model="input" placeholder="テキスト入力 + Enter" @keyup.enter="addMemo"/>

      <div class="q-mt-lg">
        <div v-show="hasRecived === false" class="text-center"><q-spinner/>更新中</div>
        <div>楽観的更新: {{ hasRecived !== undefined ? localUpdate : '' }}</div>
        <div>実際の更新: {{ hasRecived ? remoteUpdate : '' }}</div>
        <div class="text-red">楽観的UIの効果: {{ hasRecived ? remoteUpdate - localUpdate + 'msの高速化' : '' }}</div>
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
import 'firebase/firestore'

const collectionName = 'memo'

export default {
  name: 'Firestore',
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
          doc.onSnapshot((data) => {
            if (data.data()) {
              this.memo = data.data().memo
              this.localUpdate = Date.now()
            }
          })
        } else {
          this.uid = 'Not Login'
        }
      })
    },
    async addMemo () {
      const user = firebase.auth().currentUser
      if (user) {
        // get doc
        const uid = user.uid
        const db = firebase.firestore()
        const collection = db.collection(collectionName)
        const doc = collection.doc(uid)
        let memo = await doc.get().then((docSnapshot) => {
          if (docSnapshot.data()) {
            return docSnapshot.data().memo
          }
          return []
        })
        // update local data
        const item = {
          text: this.input
        }
        if (memo && memo.length > 0) {
          memo.push(item)
        } else {
          memo = [item]
        }
        // send update
        this.hasRecived = false
        doc.set({ memo: memo })
          .then(() => {
            this.remoteUpdate = Date.now()
            this.hasRecived = true
          })
        this.input = ''
      }
    },
    async deleteMemo (index) {
      const user = firebase.auth().currentUser
      if (user) {
        // get doc
        const uid = user.uid
        const db = firebase.firestore()
        const collection = db.collection(collectionName)
        const doc = collection.doc(uid)
        const memo = this.memo
        // update local data
        memo.splice(index, 1)
        // send update
        this.hasRecived = false
        doc.set({ memo: memo })
          .then(() => {
            this.remoteUpdate = Date.now()
            this.hasRecived = true
          })
      }
    }
  }
}
</script>
