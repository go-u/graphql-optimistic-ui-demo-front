<template>
  <q-item tag="label" v-ripple @click.prevent="$emit('switch-toggle')">
    <q-item-section avatar>
      <q-spinner v-show="loading" :color="isOptimistic ? 'blue' : 'red'" size="2rem"/>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label v-if="isOptimistic" caption class="text-blue">楽観的UI</q-item-label>
      <q-item-label v-else caption class="text-red">悲観的UI</q-item-label>
    </q-item-section>
    <q-item-section avatar>
      <q-toggle color="blue" :value="toggle" @input="$emit('switch-toggle')"/>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'BaseToggle',
  props: ['toggle', 'title', 'loading', 'isOptimistic']
}
</script>
