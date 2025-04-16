// javascript/news.js
import { supabase } from './supabaseClient.js'

const container = document.getElementById('news-list')

async function loadNews() {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching news:', error)
    container.innerHTML = '<p>Failed to load news.</p>'
    return
  }

  container.innerHTML = '' // Clear existing

  data.forEach(item => {
    container.innerHTML += `
      <div class="col-md-3 mb-4">
        <a href="article.html?slug=${item.slug}" class="card-link">
          <div class="main-news-card text-bg-dark">
            <div class="image-container">
              <img src="${item.image_url || '/images/default.jpg'}" class="card-img" alt="${item.title}">
              <div class="gradient-overlay"></div>
            </div>
            <div class="card-img-overlay card-overlay">
              <p class="main-news-card-text">${item.title}</p>
            </div>
          </div>
        </a>
      </div>
    `
  })
}

loadNews()
