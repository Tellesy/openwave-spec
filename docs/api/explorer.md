# Interactive API Explorer

Browse and test the full OpenWave API surface below. Select a spec file to explore.

<script setup>
import { onMounted, ref } from 'vue'

const activeSpec = ref('payments')

const specs = {
  payments: {
    label: 'Payments & Alias',
    url: 'https://raw.githubusercontent.com/openwave-standard/openwave-spec/main/openwave-payments-v1.yaml',
  },
  openbanking: {
    label: 'Open Banking',
    url: 'https://raw.githubusercontent.com/openwave-standard/openwave-spec/main/openwave-open-banking-v1.0.yaml',
  },
  identity: {
    label: 'Identity Registry',
    url: 'https://raw.githubusercontent.com/openwave-standard/openwave-spec/main/openwave-identity-v1.0.yaml',
  },
}

onMounted(() => {
  // Load Swagger UI dynamically
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css'
  document.head.appendChild(link)

  const script = document.createElement('script')
  script.src = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js'
  script.onload = () => renderSwagger(specs[activeSpec.value].url)
  document.head.appendChild(script)
})

function renderSwagger(url) {
  if (typeof SwaggerUIBundle === 'undefined') return
  SwaggerUIBundle({
    url,
    dom_id: '#swagger-ui',
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
    layout: 'BaseLayout',
    deepLinking: true,
    displayRequestDuration: true,
    filter: true,
    syntaxHighlight: { theme: 'obsidian' },
  })
}

function switchSpec(key) {
  activeSpec.value = key
  if (typeof SwaggerUIBundle !== 'undefined') {
    renderSwagger(specs[key].url)
  }
}
</script>

<div style="display:flex;gap:.5rem;margin:1.5rem 0;flex-wrap:wrap">
  <button
    v-for="(spec, key) in specs"
    :key="key"
    @click="switchSpec(key)"
    :style="{
      padding:'.5rem 1.25rem',
      borderRadius:'8px',
      border:'2px solid',
      borderColor: activeSpec === key ? '#7c3aed' : 'var(--vp-c-border)',
      background: activeSpec === key ? '#7c3aed' : 'var(--vp-c-bg-soft)',
      color: activeSpec === key ? '#fff' : 'inherit',
      cursor:'pointer',
      fontWeight: activeSpec === key ? '600' : '400',
      transition:'all .15s',
    }"
  >{{ spec.label }}</button>
</div>

<div id="swagger-ui" style="margin-top:1rem"></div>

::: tip Can't see the explorer?
Load the spec files directly in [Swagger Editor](https://editor.swagger.io) or import them into [Postman](https://postman.com).

**Raw spec URLs:**
- [Payments](https://raw.githubusercontent.com/openwave-standard/openwave-spec/main/openwave-payments-v1.yaml)
- [Open Banking](https://raw.githubusercontent.com/openwave-standard/openwave-spec/main/openwave-open-banking-v1.0.yaml)
- [Identity Registry](https://raw.githubusercontent.com/openwave-standard/openwave-spec/main/openwave-identity-v1.0.yaml)
:::
