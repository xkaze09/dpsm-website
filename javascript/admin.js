import { supabase } from './supabaseClient.js'

const form = document.getElementById('add-article-form')
const list = document.getElementById('articles-list')

// 🧾 Load Articles
async function loadArticles() {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return console.error(error)

  list.innerHTML = ''
  data.forEach(article => {
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${article.title}</td>
      <td>${article.slug}</td>
      <td>${new Date(article.created_at).toLocaleString()}</td>
      <td>
        <button onclick="deleteArticle('${article.id}')">🗑️ Delete</button>
      </td>
    `
    list.appendChild(row)
  })
}

window.deleteArticle = async function (id) {
  if (!confirm("Delete this article?")) return

  const { error } = await supabase
    .from('news_articles')
    .delete()
    .eq('id', id)

  if (error) return console.error(error)
  loadArticles()
}

// ➕ Add New Article
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const { title, slug, author, image_url, content } = form.elements

  const { error } = await supabase
    .from('news_articles')
    .insert({
      title: title.value,
      slug: slug.value,
      author: author.value,
      image_url: image_url.value,
      content: content.value
    })

  if (error) return alert('Error: ' + error.message)

  form.reset()
  loadArticles()
})

loadArticles()
