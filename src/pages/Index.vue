<template>
  <q-page class="flex flex-center column q-gutter-y-md">
    <div class="q-mt-lg text-grey text-weight-medium">
      <div>Your ID@GCP-USA</div>
      <div>{{ uid }}</div>
    </div>
    <q-list>
      <firestore-toggle/>
      <graph-toggle-optimistic/>
      <graph-toggle-optimistic-fail/>
      <graph-toggle-non-optimistic/>
    </q-list>
    <data-loader/>
  </q-page>
</template>

<script>
import FirestoreToggle from '../components/toggle/FirestoreToggle'
import GraphToggleOptimistic from '../components/toggle/GraphToggleOptimistic'
import GraphToggleNonOptimistic from '../components/toggle/GraphToggleNonOptimistic'

import firebase from 'firebase/app'
import 'firebase/auth'
import GraphToggleOptimisticFail from '../components/toggle/GraphToggleOptimisticFail'
import DataLoader from '../components/dataLoader/DataLoader'

const firebaseConfig = {
  apiKey: 'AIzaSyDA6TUGqG_xM1rrZGYZwUbIvzqyhfz8crs',
  authDomain: 'samples-2020-04.firebaseapp.com',
  databaseURL: 'https://samples-2020-04.firebaseio.com',
  projectId: 'samples-2020-04'
}

export default {
  name: 'PageIndex',
  components: { DataLoader, GraphToggleOptimisticFail, GraphToggleNonOptimistic, GraphToggleOptimistic, FirestoreToggle },
  data () {
    return {
      uid: null
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    initialize () {
      // initialize
      firebase.initializeApp(firebaseConfig)
      // sing in
      firebase.auth().signInAnonymously()
        .then((authInfo) => {
          this.uid = authInfo.user.uid
        })
    }
  }

}
</script>
