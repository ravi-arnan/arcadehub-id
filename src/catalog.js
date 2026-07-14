// Katalog skill badge rekomendasi fasilitator 2026 (nama resmi EN + course id).
// Sumber: silabus rsvp.withgoogle.com/events/arcade-fasilitator-id + skills.google course titles.
export const SKILL_CATALOG = [
  { id: 1586, name: 'Create Your First Gemini Enterprise Application' },
  { id: 728, name: 'Get Started with Pub/Sub' },
  { id: 725, name: 'Get Started with Cloud Storage' },
  { id: 705, name: 'Create a Streaming Data Lake on Cloud Storage' },
  { id: 671, name: 'App Engine: 3 Ways' },
  { id: 700, name: 'Cloud Speech API: 3 Ways' },
  { id: 756, name: 'Using the Google Cloud Speech API' },
  { id: 634, name: 'Analyze Speech and Language with Google APIs' },
  { id: 658, name: 'Store, Process, and Manage Data on Google Cloud - Console' },
  { id: 659, name: 'Store, Process, and Manage Data on Google Cloud - Command Line' },
  { id: 750, name: 'Get Started with Sensitive Data Protection' },
  { id: 633, name: 'Analyze Images with the Cloud Vision API' },
  { id: 727, name: 'Get Started with Eventarc' },
  { id: 676, name: 'Get Started with Google Workspace Tools' },
  { id: 632, name: 'Analyze BigQuery Data in Connected Sheets' },
  { id: 752, name: 'Streaming Analytics into BigQuery' },
  { id: 704, name: 'Create a Secure Data Lake on Cloud Storage' },
  { id: 753, name: 'Tag and Discover BigLake Data' },
  { id: 653, name: 'Monitor and Manage Google Cloud Resources' },
  { id: 641, name: 'Set Up a Google Cloud Network' },
  { id: 737, name: 'Integrate BigQuery Data and Google Workspace using Apps Script' },
  { id: 716, name: 'Implement DevOps Workflows in Google Cloud' },
  { id: 638, name: 'Build a Website on Google Cloud' },
  { id: 959, name: 'Explore Generative AI with the Vertex AI Gemini API' },
  { id: 648, name: 'Implement Load Balancing on Compute Engine' },
  { id: 976, name: 'Prompt Design in Vertex AI' },
  { id: 637, name: 'Set Up an App Dev Environment on Google Cloud' },
  { id: 625, name: 'Develop Your Google Cloud Network' },
  { id: 654, name: 'Build a Secure Google Cloud Network' },
  { id: 663, name: 'Deploy Kubernetes Applications on Google Cloud' },
  { id: 623, name: 'Derive Insights from BigQuery Data' },
  { id: 639, name: 'Build LookML Objects in Looker' },
  { id: 651, name: 'Manage Data Models in Looker' },
  { id: 649, name: 'Develop Serverless Apps with Firebase' },
  { id: 640, name: 'Cloud Architecture: Design, Implement, and Manage' },
  { id: 1453, name: 'Train a Small Language Model' },
  { id: 726, name: 'Get Started with Dataplex' },
  { id: 761, name: 'Monitor Environments with Google Cloud Managed Service for Prometheus' },
  { id: 661, name: 'Deploy and Manage Apigee X' },
  { id: 776, name: 'Use Functions, Formulas and Charts in Google Sheets' },
  { id: 687, name: 'Build Google Cloud Infrastructure for AWS Professionals' },
  { id: 784, name: 'Protect Cloud Traffic with Chrome Enterprise Premium Security' },
  { id: 667, name: 'Analyze Sentiment with Natural Language API' },
  { id: 636, name: 'Build Infrastructure with Terraform on Google Cloud' },
  { id: 688, name: 'Build Google Cloud Infrastructure for Azure Professionals' },
  { id: 691, name: 'Implement CI/CD Pipelines on Google Cloud' },
  { id: 1412, name: 'Designing Network Security in Google Cloud' },
  { id: 635, name: 'App Building with AppSheet' },
  { id: 646, name: 'Classify Images with TensorFlow on Google Cloud' },
  { id: 696, name: 'Cloud Functions: 3 Ways' },
  { id: 643, name: 'Create and Manage Cloud Spanner Instances' },
  { id: 783, name: 'Manage Kubernetes in Google Cloud' },
  { id: 624, name: 'Build a Data Warehouse with BigQuery' },
  { id: 1177, name: 'Discover and Protect Sensitive Data Across Your Ecosystem' },
  { id: 642, name: 'Create and Manage AlloyDB Instances' },
  { id: 715, name: 'Develop with Apps Script and AppSheet' },
  { id: 655, name: 'Optimize Costs for Google Kubernetes Engine' },
  { id: 1337, name: 'Privileged Access with IAM' },
  { id: 1364, name: 'Connecting Cloud Networks with NCC' },
  { id: 681, name: 'Build a Data Mesh with Dataplex' },
  { id: 657, name: 'Share Data using Google Data Cloud' },
  { id: 650, name: 'Create and Manage Bigtable Instances' },
  { id: 652, name: 'Create and Manage Cloud SQL for PostgreSQL Instances' },
  { id: 714, name: 'Develop and Secure APIs with Apigee X' },
  { id: 662, name: 'Get Started with API Gateway' },
  { id: 1164, name: 'Secure Software Delivery' },
  { id: 1240, name: 'Analyze and Reason on Multimodal Data with Gemini' },
  { id: 647, name: 'Get Started with Looker' },
]

// Access code + game id (skills.google/games/{game}) berubah TIAP BULAN. Sumber: go.cloudskillsboost.google/arcade. Update bulanan.
export const GAME_CATALOG = [
  { name: 'Arcade Base Camp', game: 7313, code: '1q-basecamp-07511', img: '/img/game-basecamp.webp', re: /base ?camp/i },
  { name: 'Arcade Adventure', sub: 'Low-Code Development', game: 7314, code: '1q-lowcode-92316', img: '/img/game-adventure.webp', re: /adventure/i },
  { name: 'Arcade Voyage', sub: 'Cloud Storage and Data Governance', game: 7315, code: '1q-bucket-58231', img: '/img/game-voyage.webp', re: /voyage/i },
  { name: 'Arcade Trail', sub: 'Google Workspace Administration', game: 7316, code: '1q-workspace-31069', img: '/img/game-trail.webp', re: /trail/i },
  { name: 'Arcade Special', sub: 'Safe Spaces', game: 7318, code: '1q-security-19110', img: '/img/game-special.webp', re: /special|safe space/i },
  { name: 'Arcade Simulator', sub: 'Data Mesh Architect', game: 7317, code: '1q-datamesh-16451', img: '/img/game-new.webp', re: /simulator|new game|data mesh/i },
]

// Skill badge yang punya gambar asli di /public/img/skills/{id}.webp (dari screenshot resmi Google Skills).
// Tambah id di sini saat badge baru dikonversi.
const SKILL_IMG_IDS = new Set([
  623, 624, 625, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643,
  646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 657, 658, 659, 661, 662,
  663, 667, 671, 676, 681, 687, 688, 691, 696, 700, 704, 705, 714, 715, 716,
  725, 726, 727, 728, 737, 750, 752, 753, 756, 761, 776, 783, 784, 959, 976,
  1164, 1177, 1240, 1337, 1364, 1412, 1453, 1586,
])
export const skillImg = (id) => (SKILL_IMG_IDS.has(id) ? `/img/skills/${id}.webp?v=1` : null)

// Google sering ganti nama badge (course id sama). Deteksi "Selesai" cocokkan nama SEKARANG + nama lama/alias,
// karena profil peserta menyimpan judul badge saat di-earn (bisa nama lama). Key = course id.
const SKILL_ALIASES = {
  696: ['Cloud Run Functions: 3 Ways', 'Build Serverless Applications with Cloud Run Functions'],
  700: ['Implement Speech and Language Solutions with Pre-trained APIs'],
  725: ['Implement Cloud Storage and Data Protection Solutions'],
  727: ['Build Event-Driven Applications with Eventarc'],
  728: ['Implement Event-Driven Messaging and Automation Workflows'],
  648: ['Implementing Cloud Load Balancing for Compute Engine'],
  671: ['Deploy and Manage Applications on Google App Engine'],
  676: ['Implement Cloud Collaboration and Productivity Workflows'],
  753: ['Enrich Metadata and Discovery of Lakehouse Data', 'Enrich Metadata and Discovery of BigLake Data'],
  959: ['Explore Generative AI in Agent Platform', 'Explore Generative AI with the Gemini API in Vertex AI'],
  976: ['Prompt Design in Agent Platform'],
  1453: ['Google DeepMind: Train A Small Language Model'],
}
// true jika peserta sudah earn badge ini (cocok nama sekarang atau alias lama). earnedSet = Set of norm(judul).
export const skillEarned = (id, name, earnedSet) =>
  earnedSet.has(norm(name)) || (SKILL_ALIASES[id] || []).some((a) => earnedSet.has(norm(a)))

// Cari gambar katalog untuk judul badge yang di-earn (cocok nama/alias). null kalau di luar katalog.
export const earnedSkillImg = (title) => {
  const n = norm(title)
  for (const s of SKILL_CATALOG) {
    if (norm(s.name) === n || (SKILL_ALIASES[s.id] || []).some((a) => norm(a) === n)) return skillImg(s.id)
  }
  return null
}

const UTM = '?utm_source=arcade-hub'
export const courseUrl = (id) => `https://www.skills.google/course_templates/${id}${UTM}`
export const gameUrl = (id) => `https://www.skills.google/games/${id}${UTM}`
export const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
