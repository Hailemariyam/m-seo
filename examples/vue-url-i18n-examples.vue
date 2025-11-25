<!--
Vue examples for URL Manager and Internationalization

These examples demonstrate how to use the new composables in Vue 3 applications
-->

<script setup lang="ts">
import { ref, computed, onMounted, defineProps, defineComponent } from "vue";
import {
  useUrlManager,
  useCanonical,
  useHreflang,
  useI18n,
  useLocaleDetection,
  useLocaleSwitcher,
} from "m-seo/adapters/VueSPAAdapter";

interface Product {
  id: string;
  names: Record<string, string>;
  descriptions: Record<string, string>;
  price: number;
}

// Example 1 Component
const Example1 = defineComponent({
  setup() {
    const productName = ref("Premium Leather Shoes");
    const urlManager = useUrlManager({
      baseUrl: "https://example.com",
      trailingSlash: true,
      forceLowerCase: true,
    });
    const slug = computed(() =>
      urlManager.createSlug(productName.value, { removeDiacritics: true })
    );
    const canonical = computed(() =>
      urlManager.getCanonical(`/products/${slug.value}`)
    );
    return { productName, slug, canonical };
  },
  template: `
    <div class="example-1">
      <h1>{{ productName }}</h1>
      <p>Product URL: {{ canonical }}</p>
      <p>Slug: {{ slug }}</p>
    </div>
  `,
});

// Example 2 Component
const Example2 = defineComponent({
  props: {
    postId: { type: String, required: true },
    postTitle: { type: String, required: true },
  },
  setup(props) {
    const urlManager = useUrlManager({
      baseUrl: "https://blog.example.com",
      trailingSlash: false,
    });
    const slug = computed(() => urlManager.createSlug(props.postTitle));
    const canonical = useCanonical(
      computed(() => `/blog/${slug.value}`),
      { baseUrl: "https://blog.example.com" }
    );
    return { slug, canonical };
  },
  template: `
    <article>
      <h1>{{ postTitle }}</h1>
      <p>Canonical URL: {{ canonical }}</p>
      <div>Blog content...</div>
    </article>
  `,
});

// Example 3 Component
const Example3 = defineComponent({
  props: {
    productId: { type: String, required: true },
  },
  setup(props) {
    const hreflangTags = useHreflang(
      `/products/${props.productId}`,
      "https://example.com",
      {
        locales: ["en", "es", "fr", "de"],
        urlStrategy: "path",
        includeDefault: true,
      }
    );
    return { hreflangTags };
  },
  template: `
    <div>
      <h2>Multi-language Product</h2>
      <p>Available in {{ hreflangTags.length }} languages</p>
      <ul>
        <li v-for="tag in hreflangTags" :key="tag.hreflang">
          {{ tag.hreflang }}: {{ tag.href }}
        </li>
      </ul>
    </div>
  `,
});

// Example 4 Component
const Example4 = defineComponent({
  setup() {
    const { t, locale, setLocale, formatDate, formatCurrency, i18n } = useI18n({
      defaultLocale: "en",
      supportedLocales: ["en", "es", "fr"],
      fallbackLocale: "en",
    });

    onMounted(async () => {
      await i18n.loadTranslations("en", {
        welcome: {
          title: "Welcome to Our Site",
          message: "Hello, {{name}}!",
          description: "This is a multi-language website",
        },
      });
      await i18n.loadTranslations("es", {
        welcome: {
          title: "Bienvenido a Nuestro Sitio",
          message: "¡Hola, {{name}}!",
          description: "Este es un sitio web multilingüe",
        },
      });
      await i18n.loadTranslations("fr", {
        welcome: {
          title: "Bienvenue sur Notre Site",
          message: "Bonjour, {{name}}!",
          description: "Ceci est un site web multilingue",
        },
      });
    });

    return { t, locale, setLocale, formatDate, formatCurrency };
  },
  template: `
    <div>
      <h1>{{ t('welcome.title') }}</h1>
      <p>{{ t('welcome.message', { name: 'John' }) }}</p>
      <p>{{ t('welcome.description') }}</p>
      <div>
        <p>Today: {{ formatDate(new Date()) }}</p>
        <p>Price: {{ formatCurrency(99.99, 'USD') }}</p>
      </div>
      <select v-model="locale" @change="setLocale(locale)">
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>
  `,
});

// Example 5 Component
const Example5 = defineComponent({
  setup() {
    const locale = useLocaleDetection({
      defaultLocale: "en",
      supportedLocales: ["en", "es", "fr", "de", "ja"],
      detectLocale: true,
      urlStrategy: "path",
    });
    return { locale };
  },
  template: `
    <div>
      <h2>Auto-Detected Locale</h2>
      <p>Your locale: {{ locale }}</p>
      <p>We automatically detected your preferred language!</p>
    </div>
  `,
});

// Example 6 Component
const Example6 = defineComponent({
  setup() {
    const { locales, currentLocale, switchLocale } = useLocaleSwitcher({
      defaultLocale: "en",
      supportedLocales: ["en", "es", "fr", "de"],
      baseUrl: "https://example.com",
      urlStrategy: "path",
    });
    return { locales, currentLocale, switchLocale };
  },
  template: `
    <div class="language-switcher">
      <h3>Choose Language</h3>
      <select :value="currentLocale" @change="switchLocale($event.target.value)">
        <option v-for="loc in locales" :key="loc.code" :value="loc.code">
          {{ loc.nativeName }} {{ loc.active ? '✓' : '' }}
        </option>
      </select>
      <div class="language-links">
        <a v-for="loc in locales" :key="loc.code" :href="loc.url" :class="{ active: loc.active }" @click.prevent="switchLocale(loc.code)">
          {{ loc.nativeName }}
        </a>
      </div>
    </div>
  `,
});

// Example 7 Component
const Example7 = defineComponent({
  props: {
    product: { type: Object as () => Product, required: true },
  },
  setup(props) {
    const { t, locale, formatCurrency, i18n } = useI18n({
      defaultLocale: "en",
      supportedLocales: ["en", "es", "fr"],
      urlStrategy: "path",
    });
    const urlManager = useUrlManager({
      baseUrl: "https://shop.example.com",
      trailingSlash: true,
      localePrefix: "path",
      defaultLocale: "en",
    });
    onMounted(async () => {
      await i18n.loadTranslations("en", {
        product: {
          addToCart: "Add to Cart",
          inStock: "In Stock",
          outOfStock: "Out of Stock",
          shipping: "Free Shipping",
        },
      });
      await i18n.loadTranslations("es", {
        product: {
          addToCart: "Agregar al Carrito",
          inStock: "En Stock",
          outOfStock: "Agotado",
          shipping: "Envío Gratis",
        },
      });
    });
    const productName = computed(
      () => props.product.names[locale.value] || props.product.names["en"]
    );
    const productSlug = computed(() =>
      urlManager.createSlug(productName.value, { removeDiacritics: true })
    );
    const canonical = useCanonical(
      computed(() => `/products/${productSlug.value}`),
      { baseUrl: "https://shop.example.com", locale: locale.value }
    );
    const hreflangTags = useHreflang(
      computed(() => `/products/${productSlug.value}`),
      "https://shop.example.com",
      { locales: ["en", "es", "fr"], urlStrategy: "path", includeDefault: true }
    );
    const currency = computed(() => (locale.value === "en" ? "USD" : "EUR"));
    return {
      t,
      locale,
      formatCurrency,
      productName,
      canonical,
      hreflangTags,
      currency,
    };
  },
  template: `
    <div class="product">
      <h1>{{ productName }}</h1>
      <p>{{ product.descriptions[locale] }}</p>
      <p class="price">{{ formatCurrency(product.price, currency) }}</p>
      <p class="shipping">{{ t('product.shipping') }}</p>
      <button>{{ t('product.addToCart') }}</button>
      <div class="seo-info">
        <small>Canonical: {{ canonical }}</small>
        <small>Languages: {{ hreflangTags.length }}</small>
      </div>
    </div>
  `,
});

// Example 8 Component
const Example8 = defineComponent({
  setup() {
    const { t, locale, setLocale, formatCurrency, i18n } = useI18n({
      defaultLocale: "en",
      supportedLocales: ["en", "es", "fr", "de"],
      fallbackLocale: "en",
      urlStrategy: "path",
    });
    const urlManager = useUrlManager({
      baseUrl: "https://shop.example.com",
      trailingSlash: true,
      forceLowerCase: true,
    });
    const products = ref([
      {
        id: "prod-1",
        names: {
          en: "Premium Leather Shoes",
          es: "Zapatos de Cuero Premium",
          fr: "Chaussures en Cuir Premium",
          de: "Premium Lederschuhe",
        },
        price: 159.99,
      },
      {
        id: "prod-2",
        names: {
          en: "Classic Oxford",
          es: "Oxford Clásico",
          fr: "Oxford Classique",
          de: "Klassischer Oxford",
        },
        price: 129.99,
      },
    ]);
    onMounted(async () => {
      await i18n.loadTranslations("en", {
        shop: {
          title: "Our Products",
          viewProduct: "View Product",
          cart: "Shopping Cart",
        },
      });
      await i18n.loadTranslations("es", {
        shop: {
          title: "Nuestros Productos",
          viewProduct: "Ver Producto",
          cart: "Carrito de Compras",
        },
      });
    });
    const productCards = computed(() =>
      products.value.map((product) => {
        const name =
          product.names[locale.value as keyof typeof product.names] ||
          product.names.en;
        const slug = urlManager.createSlug(name);
        const url = urlManager.getCanonical(`/products/${slug}`, {
          locale: locale.value,
        });
        return { ...product, name, slug, url };
      })
    );
    return { t, locale, formatCurrency, productCards };
  },
  template: `
    <div>
      <header>
        <h1>{{ t('shop.title') }}</h1>
        <!-- Include LanguageSwitcher component here -->
      </header>
      <div class="products-grid">
        <div v-for="product in productCards" :key="product.id" class="product-card">
          <h3>{{ product.name }}</h3>
          <p>{{ formatCurrency(product.price, locale === 'en' ? 'USD' : 'EUR') }}</p>
          <a :href="product.url">{{ t('shop.viewProduct') }}</a>
        </div>
      </div>
    </div>
  `,
});

// Example 9 Component
const Example9 = defineComponent({
  props: {
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
  },
  setup(props) {
    const { t, i18n } = useI18n({
      defaultLocale: "en",
      supportedLocales: ["en", "es", "fr"],
    });
    const urlManager = useUrlManager({
      baseUrl: "https://example.com",
      trailingSlash: true,
    });
    const pagination = computed(() =>
      urlManager.generatePaginationUrls(
        "/products",
        props.currentPage,
        props.totalPages
      )
    );
    onMounted(async () => {
      await i18n.loadTranslations("en", {
        pagination: {
          previous: "Previous",
          next: "Next",
          page: "Page {{current}} of {{total}}",
        },
      });
      await i18n.loadTranslations("es", {
        pagination: {
          previous: "Anterior",
          next: "Siguiente",
          page: "Página {{current}} de {{total}}",
        },
      });
    });
    return { t, pagination };
  },
  template: `
    <div class="pagination">
      <p>{{ t('pagination.page', { current: currentPage, total: totalPages }) }}</p>
      <a v-if="pagination.prev" :href="pagination.prev">{{ t('pagination.previous') }}</a>
      <a v-if="pagination.next" :href="pagination.next">{{ t('pagination.next') }}</a>
    </div>
  `,
});

// Example 10 Component
const Example10 = defineComponent({
  setup() {
    const trailingSlash = ref(true);
    const forceLowerCase = ref(true);
    const config = computed(() => ({
      baseUrl: "https://example.com",
      trailingSlash: trailingSlash.value,
      forceLowerCase: forceLowerCase.value,
    }));
    const urlManager = useUrlManager(config);
    const testPath = ref("/Products/Shoes");
    const generatedUrl = computed(() =>
      urlManager.getCanonical(testPath.value)
    );
    return { trailingSlash, forceLowerCase, testPath, generatedUrl };
  },
  template: `
    <div>
      <h2>Reactive URL Manager Demo</h2>
      <div>
        <label><input type="checkbox" v-model="trailingSlash" /> Trailing Slash</label>
        <label><input type="checkbox" v-model="forceLowerCase" /> Force Lowercase</label>
      </div>
      <div>
        <input v-model="testPath" placeholder="Enter path" />
        <p>Generated: {{ generatedUrl }}</p>
      </div>
    </div>
  `,
});

const dummyProduct: Product = {
  id: "prod-123",
  names: {
    en: "Awesome Gadget",
    es: "Dispositivo Impresionante",
    fr: "Gadget Génial",
  },
  descriptions: {
    en: "An awesome gadget for your daily needs.",
    es: "Un dispositivo impresionante para sus necesidades diarias.",
    fr: "Un gadget génial pour vos besoins quotidiens.",
  },
  price: 49.99,
};
</script>

<template>
  <div>
    <h1>Vue URL Manager and i18n Examples</h1>

    <section>
      <h2>Example 1: Basic URL Manager Usage</h2>
      <Example1 />
    </section>

    <section>
      <h2>Example 2: Auto Canonical Tag</h2>
      <Example2 post-id="123" post-title="My First Blog Post" />
    </section>

    <section>
      <h2>Example 3: Multi-language Product Page with Hreflang</h2>
      <Example3 product-id="456" />
    </section>

    <section>
      <h2>Example 4: Basic i18n Usage</h2>
      <Example4 />
    </section>

    <section>
      <h2>Example 5: Auto Locale Detection</h2>
      <Example5 />
    </section>

    <section>
      <h2>Example 6: Language Switcher Component</h2>
      <Example6 />
    </section>

    <section>
      <h2>Example 7: E-commerce Product with Full i18n</h2>
      <Example7 :product="dummyProduct" />
    </section>

    <section>
      <h2>Example 8: Complete Multi-language E-commerce Site</h2>
      <Example8 />
    </section>

    <section>
      <h2>Example 9: Pagination with i18n</h2>
      <Example9 :current-page="3" :total-pages="10" />
    </section>

    <section>
      <h2>Example 10: Reactive URL Manager with Dynamic Config</h2>
      <Example10 />
    </section>
  </div>
</template>

<style scoped>
section {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
}
.language-switcher {
  padding: 20px;
}

.language-links {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.language-links a {
  padding: 5px 10px;
  text-decoration: none;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.language-links a.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
</style>
