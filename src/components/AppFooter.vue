<template>
  <v-footer height="40" app>
    <a
      v-for="item in items"
      :key="item.title"
      :href="item.href"
      :title="item.title"
      class="d-inline-block mx-2 social-link"
      rel="noopener noreferrer"
      target="_blank"
    >
      <v-icon
        :icon="item.icon"
        :size="item.icon === 'mdi-web' ? 24 : 16"
      />
    </a>

    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px;"
    >
      &copy; 2024-{{ (new Date()).getFullYear() }} <span class="d-none d-sm-inline-block">Built by Andrew "Sidorakh" Rutherford</span>
      —
      <a
        class="text-decoration-none on-surface"
        href="https://vuetifyjs.com/about/licensing/"
        rel="noopener noreferrer"
        target="_blank"
      >
        MIT License
      </a>
    </div>
  </v-footer>
</template>

<script setup>
  const items = [
    {
      title: 'Website',
      icon: `mdi-web`,
      href: 'https://sidorakh.net/',
    },
    {
      title: 'Twitter',
      icon: `mdi-twitter`,
      href: 'https://twitter.com/sidorakh',
    },
    {
      title: 'GitHub',
      icon: `mdi-github`,
      href: 'https://github.com/sidorakh/chocolatier-config',
    },
    {
      title: 'Bluesky',
      icon: `mdi-butterfly`,
      href: 'https://bsky.app/profile/sidorakh.net',
    },
  ]
</script>

<style scoped lang="sass">
  .social-link :deep(.v-icon)
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
    text-decoration: none
    transition: .2s ease-in-out

    &:hover
      color: rgba(25, 118, 210, 1)
</style>
