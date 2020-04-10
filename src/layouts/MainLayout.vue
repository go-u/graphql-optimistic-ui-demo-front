<template>
  <q-layout view="lHh Lpr lFf">
<!--    <q-header elevated>-->
<!--      <q-toolbar class="justify-center bg-white">-->
<!--        <q-tabs-->
<!--          inline-label-->
<!--          active-bg-color="white"-->
<!--        >-->
<!--          <q-route-tab icon="whatshot" label="Firestore" class="text-red" :to="{ name: 'firestore' }"/>-->
<!--&lt;!&ndash;          <q-route-tab icon="sync" label="GraphQL(楽観的UI)@AWS" class="text-orange" :to="{ name: 'appsync' }"/>&ndash;&gt;-->
<!--          <q-route-tab icon="bolt" label="GraphQL(楽観的)" class="text-blue" :to="{ name: 'graphql-optimistic' }"/>-->
<!--          <q-route-tab icon="sync" label="GraphQL(通常)" class="text-green" :to="{ name: 'graphql-normal' }"/>-->
<!--        </q-tabs>-->
<!--      </q-toolbar>-->
<!--    </q-header>-->

    <q-page-container>
<!--      <router-view :login="login"/>-->
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout'
}
</script>
