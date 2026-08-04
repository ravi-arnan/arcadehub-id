// Katalog skill badge + alias namanya, DIPINDAH dari src/catalog.js ke lib/ karena
// lib/parseProfile.js (jalan di serverless api/) sekarang memakainya untuk memutuskan
// badge mana yang menambah poin. Serverless tidak boleh mengimpor dari src/, jadi ini
// mengikuti preseden yang sama seperti lib/gameCatalog.js dan lib/pastGames.js.
// src/catalog.js me-re-export semuanya, jadi impor dari sisi frontend tidak berubah.

// Katalog skill badge fasilitator 2026 (nama resmi EN + course id).
// Sumber: halaman Silabus rsvp.withgoogle.com/events/arcade-fasilitator-id (disalin manual 31 Jul
// 2026, arsipnya di reference/silabus-2026-07-31/) + judul live skills.google.
// 51 badge pertama = daftar resmi silabus lengkap dengan `level`; sisanya badge tambahan.
// 646/647/688 dikeluarkan 31 Jul 2026: halaman course-nya balas 403 di kedua domain Google,
// jadi tidak bisa dikerjakan lagi dan tak boleh ikut masuk saran "kerjakan selanjutnya".
// 1412 dikeluarkan 4 Agu 2026 dengan alasan yang sama: Google menamainya ulang jadi
// "[DEPRECATED] Designing Network Security in Google Cloud" dan mencabut status skill badge-nya.
// Poin peserta yang terlanjur mengambilnya TIDAK hilang (parseProfile menghitung dari judul badge
// di profil, bukan dari katalog ini); yang hilang cuma sarannya untuk mengerjakan badge mati.
export const SKILL_CATALOG = [
  // Beginner (17)
  { id: 1586, name: 'Create Your First Gemini Enterprise Application', level: 'beginner' },
  { id: 1426, name: 'Develop AI-Powered Prototypes in Google AI Studio', level: 'beginner' },
  { id: 754, name: 'The Basics of Google Cloud Compute', level: 'beginner' },
  { id: 728, name: 'Implement Event-Driven Messaging and Automation Workflows', level: 'beginner' },
  { id: 725, name: 'Implement Cloud Storage and Data Protection Solutions', level: 'beginner' },
  { id: 705, name: 'Create a Streaming Data Lake on Cloud Storage', level: 'beginner' },
  { id: 671, name: 'Deploy and Manage Applications on Google App Engine', level: 'beginner' },
  { id: 700, name: 'Implement Speech and Language Solutions with Pre-trained APIs', level: 'beginner' },
  { id: 756, name: 'Using the Google Cloud Speech API', level: 'beginner' },
  { id: 634, name: 'Analyze Speech and Language with Google APIs', level: 'beginner' },
  { id: 658, name: 'Store, Process, and Manage Data on Google Cloud - Console', level: 'beginner' },
  { id: 659, name: 'Store, Process, and Manage Data on Google Cloud - Command Line', level: 'beginner' },
  { id: 629, name: 'Migrate MySQL Data to Cloud SQL Using Database Migration Service', level: 'beginner' },
  { id: 750, name: 'Implement Sensitive Data Protection on Google Cloud', level: 'beginner' },
  { id: 633, name: 'Analyze Images with the Cloud Vision API', level: 'beginner' },
  { id: 727, name: 'Build Event-Driven Applications with Eventarc', level: 'beginner' },
  { id: 702, name: 'Configure Service Accounts and IAM Roles for Google Cloud', level: 'beginner' },
  // Intermediate (17)
  { id: 1596, name: 'Engineer AI Agents with Agent Development Kit (ADK)', level: 'intermediate' },
  { id: 1076, name: 'Build Real World AI Applications with Gemini and Imagen', level: 'intermediate' },
  { id: 1459, name: 'Build a Smart Cloud Application with Vibe Coding and MCP', level: 'intermediate' },
  { id: 676, name: 'Implement Cloud Collaboration and Productivity Workflows', level: 'intermediate' },
  { id: 632, name: 'Analyze BigQuery Data in Connected Sheets', level: 'intermediate' },
  { id: 752, name: 'Streaming Analytics into BigQuery', level: 'intermediate' },
  { id: 704, name: 'Create a Secure Data Lake on Cloud Storage', level: 'intermediate' },
  { id: 751, name: 'Secure Lakehouse Data', level: 'intermediate' },
  { id: 753, name: 'Enrich Metadata and Discovery of Lakehouse Data', level: 'intermediate' },
  { id: 653, name: 'Monitor and Manage Google Cloud Resources', level: 'intermediate' },
  { id: 749, name: 'Monitor and Log with Google Cloud Observability', level: 'intermediate' },
  { id: 641, name: 'Set Up a Google Cloud Network', level: 'intermediate' },
  { id: 737, name: 'Integrate BigQuery Data and Google Workspace using Apps Script', level: 'intermediate' },
  { id: 627, name: 'Engineer Data for Predictive Modeling with BigQuery ML', level: 'intermediate' },
  { id: 716, name: 'Implement DevOps Workflows in Google Cloud', level: 'intermediate' },
  { id: 626, name: 'Create ML Models with BigQuery ML', level: 'intermediate' },
  { id: 638, name: 'Build a Website on Google Cloud', level: 'intermediate' },
  // Advanced (17)
  { id: 959, name: 'Explore Generative AI in Agent Platform', level: 'advanced' },
  { id: 648, name: 'Implementing Cloud Load Balancing for Compute Engine', level: 'advanced' },
  { id: 976, name: 'Prompt Design in Agent Platform', level: 'advanced' },
  { id: 981, name: 'Inspect Rich Documents with Gemini Multimodality and Multimodal RAG', level: 'advanced' },
  { id: 978, name: 'Develop Gen AI Apps with Gemini and Streamlit', level: 'advanced' },
  { id: 637, name: 'Set Up an App Dev Environment on Google Cloud', level: 'advanced' },
  { id: 625, name: 'Develop Your Google Cloud Network', level: 'advanced' },
  { id: 654, name: 'Build a Secure Google Cloud Network', level: 'advanced' },
  { id: 663, name: 'Deploy Kubernetes Applications on Google Cloud', level: 'advanced' },
  { id: 623, name: 'Derive Insights from BigQuery Data', level: 'advanced' },
  { id: 639, name: 'Build LookML Objects in Looker', level: 'advanced' },
  { id: 651, name: 'Manage Data Models in Looker', level: 'advanced' },
  { id: 628, name: 'Prepare Data for Looker Dashboards and Reports', level: 'advanced' },
  { id: 649, name: 'Develop Serverless Apps with Firebase', level: 'advanced' },
  { id: 640, name: 'Cloud Architecture: Design, Implement, and Manage', level: 'advanced' },
  { id: 1558, name: 'Build Global and Regional Load Balancing Solutions', level: 'advanced' },
  { id: 1453, name: 'Google DeepMind: Train A Small Language Model', level: 'advanced' },
  // Di luar silabus: tambahan dari katalog Google (silabus sendiri menyuruh cari 15 badge
  // ekstra untuk milestone tertinggi), termasuk badge unggulan bulanan dan GEAR.
  { id: 726, name: 'Organize and Govern Data with Knowledge Catalog' },
  { id: 761, name: 'Monitor Environments with Google Cloud Managed Service for Prometheus' },
  { id: 661, name: 'Deploy and Manage Apigee X' },
  { id: 776, name: 'Use Functions, Formulas, and Charts in Google Sheets' },
  { id: 687, name: 'Build Google Cloud Infrastructure for AWS Professionals' },
  { id: 784, name: 'Protect Cloud Traffic with Chrome Enterprise Premium Security' },
  { id: 667, name: 'Analyze Sentiment with Natural Language API' },
  { id: 636, name: 'Build Infrastructure with Terraform on Google Cloud' },
  { id: 691, name: 'Implement CI/CD Pipelines on Google Cloud' },
  { id: 635, name: 'App Building with AppSheet' },
  { id: 696, name: 'Build Serverless Applications with Cloud Run Functions' },
  { id: 643, name: 'Create and Manage Cloud Spanner Instances' },
  { id: 783, name: 'Manage Kubernetes in Google Cloud' },
  { id: 624, name: 'Build a Data Warehouse with BigQuery' },
  { id: 1177, name: 'Discover and Protect Sensitive Data Across Your Ecosystem' },
  { id: 642, name: 'Create and Manage AlloyDB Instances' },
  { id: 715, name: 'Develop with Apps Script and AppSheet' },
  { id: 655, name: 'Optimize Costs for Google Kubernetes Engine' },
  { id: 1337, name: 'Privileged Access with IAM' },
  { id: 1364, name: 'Connecting Cloud Networks with NCC' },
  { id: 681, name: 'Build a Data Mesh with Knowledge Catalog' },
  { id: 657, name: 'Share Data using Google Data Cloud' },
  { id: 650, name: 'Create and Manage Bigtable Instances' },
  { id: 652, name: 'Create and Manage Cloud SQL for PostgreSQL Instances' },
  { id: 714, name: 'Develop and Secure APIs with Apigee X' },
  { id: 662, name: 'Deploy and Secure Serverless APIs with API Gateway' },
  { id: 1164, name: 'Secure Software Delivery' },
  { id: 1240, name: 'Analyze and Reason on Multimodal Data with Gemini' },
  { id: 755, name: 'Use APIs to Work with Cloud Storage' },
  { id: 759, name: 'Mitigate Threats and Vulnerabilities with Security Command Center' },
  { id: 1445, name: 'Deploy Multi-Agent Architectures' },
  { id: 1682, name: 'Orchestrate Multi-agent Workflows with Gemini Enterprise' },
  // Ditambahkan 4 Agu 2026 setelah membandingkan katalog ini dengan seluruh skill badge live di
  // skills.google (filter Credential = Skill Badge, 93 hasil). Sembilan ini sudah lama ada di
  // Google tapi tidak pernah masuk sini, jadi sebelumnya TIDAK muncul di mana pun di aplikasi:
  // tanpa kartu di katalog, tanpa deteksi "Selesai", dan tanpa link di Badge Saya. Sengaja tanpa
  // `since`: tanda "BARU" untuk badge unggulan rilisan Google, bukan untuk kelalaian kita.
  // Sesudah ini katalog = 93 badge, pas dengan daftar live Google.
  { id: 630, name: 'Use Machine Learning APIs on Google Cloud' },
  { id: 631, name: 'Prepare Data for ML APIs on Google Cloud' },
  { id: 645, name: 'Implement Cloud Security Fundamentals on Google Cloud' },
  { id: 656, name: 'Perform Predictive Data Analysis in BigQuery' },
  { id: 674, name: 'Automate Data Capture at Scale with Document AI' },
  { id: 741, name: 'Develop Serverless Applications on Cloud Run' },
  { id: 1232, name: 'Implement Multimodal Vector Search with BigQuery' },
  { id: 1241, name: 'Enhance Gemini Model Capabilities' },
  { id: 1399, name: 'Kickstarting Application Development with Gemini Code Assist' },
  // `since` = batch bulanan saat badge ini masuk katalog (YYYY-MM). Isi HANYA untuk badge yang
  // baru ditambahkan; entri lama dibiarkan tanpa `since`. Katalog menandai "BARU" pada batch
  // terbaru saja, jadi tanda itu hilang sendiri begitu batch bulan berikutnya ditambahkan.
  { id: 747, name: 'Monitoring in Google Cloud', since: '2026-08' },
]

// Google sering ganti nama badge (course id sama). Deteksi "Selesai" cocokkan nama SEKARANG + nama lama/alias,
// karena profil peserta menyimpan judul badge saat di-earn (bisa nama lama). Key = course id.
const SKILL_ALIASES = {
  696: ['Cloud Functions: 3 Ways', 'Cloud Run Functions: 3 Ways'],
  700: ['Cloud Speech API: 3 Ways'],
  725: ['Get Started with Cloud Storage'],
  727: ['Get Started with Eventarc'],
  728: ['Get Started with Pub/Sub'],
  648: ['Implement Load Balancing on Compute Engine'],
  671: ['App Engine: 3 Ways'],
  676: ['Get Started with Google Workspace Tools'],
  753: ['Tag and Discover BigLake Data', 'Enrich Metadata and Discovery of BigLake Data'],
  959: ['Explore Generative AI with the Vertex AI Gemini API', 'Explore Generative AI with the Gemini API in Vertex AI'],
  976: ['Prompt Design in Vertex AI'],
  1453: ['Train a Small Language Model'],
  // Ganti nama terdeteksi `npm run check:arcade` 4 Agu 2026 (course id tetap).
  750: ['Get Started with Sensitive Data Protection'],
  // Rebrand Dataplex -> Knowledge Catalog (cek 31 Jul 2026, course id tetap).
  681: ['Build a Data Mesh with Dataplex'],
  726: ['Get Started with Dataplex'],
  662: ['Get Started with API Gateway'],
  // Nama pendek yang dipakai postingan Bonus Milestone di forum, judul resminya lebih panjang.
  1596: ['Engineer AI Agents with ADK'],
  1682: ['Orchestrate Multi-agent Workflows'],
}

// Nama dinormalkan agresif (huruf kecil, semua non-alfanumerik dibuang) karena judul badge
// di profil peserta sering beda tanda baca dan spasi dari judul resminya.
export const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '')

// true jika peserta sudah earn badge ini (cocok nama sekarang atau alias lama).
// earnedSet = Set of norm(judul).
export const skillEarned = (id, name, earnedSet) =>
  earnedSet.has(norm(name)) || (SKILL_ALIASES[id] || []).some((a) => earnedSet.has(norm(a)))

// Semua nama yang sah untuk skill badge resmi: judul sekarang + seluruh alias lamanya.
// Dibangun sekali karena dipakai untuk tiap badge di tiap profil yang di-parse.
const SKILL_NAMES = new Set()
for (const s of SKILL_CATALOG) {
  SKILL_NAMES.add(norm(s.name))
  for (const a of SKILL_ALIASES[s.id] || []) SKILL_NAMES.add(norm(a))
}

// Apakah judul badge ini skill badge resmi menurut silabus.
// INI penentu poin sejak aturan diperketat: lihat lib/scoring.js.
export const isSkillBadge = (title) => SKILL_NAMES.has(norm(title))

// Cari course id dari judul yang di-earn (cocok nama sekarang atau alias lama).
// null kalau di luar katalog.
export const skillIdByTitle = (title) => {
  const n = norm(title)
  for (const s of SKILL_CATALOG) {
    if (norm(s.name) === n || (SKILL_ALIASES[s.id] || []).some((a) => norm(a) === n)) return s.id
  }
  return null
}
