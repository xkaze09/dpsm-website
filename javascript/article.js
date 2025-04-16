// javascript/article.js
import { supabase } from './supabaseClient.js'

const slug = new URLSearchParams(window.location.search).get('slug')
const heroBanner = document.querySelector('.news-hero')
const titleEl = document.querySelector('.section-title')
const subtitleEl = document.querySelector('.section-subtitle')
const contentEl = document.querySelector('.news-content')

async function loadArticle() {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    document.body.innerHTML = '<h2 class="text-center mt-5">🚫 Article not found.</h2>'
    return
  }

  titleEl.textContent = data.title
  subtitleEl.textContent = `${data.author || 'DPSM'} | ${new Date(data.created_at).toDateString()}`
  contentEl.innerHTML = data.content
  heroBanner.style.backgroundImage = `url(${data.image_url})`
}

loadArticle()
