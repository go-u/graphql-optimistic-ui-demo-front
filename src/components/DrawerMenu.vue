<template>
  <q-list>
    <q-item
      v-for="item in menu"
      :key="item"
      clickable
      :to="{ name: item }"
      active-class="text-light-blue"
      exact
    >
      <q-item-section>
        <q-item-label class="text-capitalize text-h5">{{ item }}</q-item-label>
      </q-item-section>
    </q-item>

  </q-list>
</template>

<script>
const menu = [
  'home',
  'firestore',
  'firestore-graphql',
  'appsync',
  'amplify'
]

export default {
  name: 'DrawerMenu',
  computed: {
    menu () {
      return menu
    }
  }
}
</script>
