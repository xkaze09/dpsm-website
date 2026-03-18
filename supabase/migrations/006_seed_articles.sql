-- Migration 006: seed legacy static articles into the CMS
--
-- Migrates all 7 previously hardcoded articles from /articles/*.html
-- into the articles table so they appear on news.html sections.
--
-- Requires: at least one admin user in auth.users / profiles.
-- Run once in Supabase SQL Editor after 005_category_event_date.sql.

DO $$
DECLARE
  _author uuid;
BEGIN
  -- Pick the first admin user as the author for all seeded articles
  SELECT id INTO _author FROM public.profiles WHERE role = 'admin' LIMIT 1;
  IF _author IS NULL THEN
    RAISE EXCEPTION 'No admin user found. Create an admin account first.';
  END IF;

  -- 1. Bulletin Board & Website Launch (announcement)
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, tags, published_at)
  VALUES (
    'Exploring Excellence: DPSM Debuts Dynamic Website!',
    'bulletin-board-website-launch',
    '<p class="lead mb-4 fw-normal text-justify">The Division of Physical Sciences and Mathematics at the University of the Philippines Visayas proudly announces the inauguration of its latest digital endeavor: a website launched on February 24, 2024. Navigating the website is a breeze, with accessible information about division events, faculty profiles, and relevant announcements readily available at your fingertips. Stay up to date with the latest seminars, research breakthroughs, and academic achievements, all conveniently housed on one user-friendly interface.</p><p class="lead mb-4 fw-normal text-justify">The launch of the Division''s website marks a significant milestone in its ongoing quest for digital innovation and academic excellence. As the Division continues to push boundaries and redefine the educational landscape, the website stands as a beacon of progress.</p>',
    'The Division of Physical Sciences and Mathematics at UP Visayas proudly announces the inauguration of its latest digital endeavor: a website launched on February 24, 2024.',
    '/images/article-images/dpsm/dpsm-0.jpg',
    _author, 'published', 'announcement', ARRAY[]::text[],
    '2024-02-26T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 2. DPSM Job Postings (announcement)
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, tags, published_at)
  VALUES (
    'DPSM is Hiring new Faculty Members for A.Y. 2025 - 2026',
    'dpsm-job-postings',
    '<p class="lead mb-4 fw-normal text-justify">The Division of Physical Sciences and Mathematics (DPSM) at UP Visayas is hiring! We''re looking for the following:</p><ul><li><b>THREE (3) Full-Time Computer Science Faculty Members</b></li><li><b>ONE (1) Full-Time Mathematics Faculty Member</b></li><li><b>ONE (1) Full-Time Physics Faculty Member</b></li><li><b>ONE (1) Full-Time Statistics Faculty Member</b></li></ul><p class="lead mb-4 fw-normal text-justify">See the attached hiring notices below for additional details:</p><div class="card-img-container"><div class="card-columns"><div class="card-img"><img class="card-img-top border" src="/images/article-images/dpsm/dpsm-job-postings/comsci-hiring.jpg" alt="Computer Science Hiring"></div><div class="card-img"><img class="card-img-top border" src="/images/article-images/dpsm/dpsm-job-postings/math-hiring.jpg" alt="Mathematics Hiring"></div><div class="card-img"><img class="card-img-top border" src="/images/article-images/dpsm/dpsm-job-postings/physics-hiring.jpg" alt="Physics Hiring"></div><div class="card-img"><img class="card-img-top border" src="/images/article-images/dpsm/dpsm-job-postings/stat-hiring.jpg" alt="Statistics Hiring"></div></div></div><p class="lead mb-4 fw-normal text-justify">To apply, submit your application letter, résumé/CV, and official transcript of records or true copy of grades addressed to Prof. Kent Christian A. Castor at psm.upvisayas@up.edu.ph. Applications close on <b>4 July 2025</b>.</p>',
    'The Division of Physical Sciences and Mathematics (DPSM) at UP Visayas is hiring! We''re looking for Computer Science, Mathematics, Physics, and Statistics faculty members.',
    '/images/article-images/dpsm/dpsm-job-postings/hiring-banner.jpg',
    _author, 'published', 'announcement', ARRAY[]::text[],
    '2025-06-17T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 3. Asst. Prof. Cadondon ASTHRDP 2024 (announcement)
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, tags, published_at)
  VALUES (
    'Assistant Professor Jumar G. Cadondon Secures First Place in Oral Presentation at ASTHRDP Graduate Scholars'' Conference 2024',
    'asst-prof-cadondon-1st-place-asthrdp-2024',
    '<p class="lead mb-4 fw-normal text-justify">The Division of Physical Sciences and Mathematics extends its heartfelt congratulations to Assistant Professor Jumar G. Cadondon for achieving first place in the Oral Presentation (PhD level) within the Physical, Chemical, and Earth Sciences category at the 12th Accelerated Science and Technology Human Resource Development Program (ASTHRDP) Graduate Scholars'' Conference held at Dusit Thani Hotel, Lapu-Lapu City, Cebu from September 12 to 13, 2024.</p><p class="lead mb-4 fw-normal text-justify">Under the theme: "Artificial Intelligence: Embracing Change and Ethical Use in Research", Asst. Professor Cadondon presented his study titled "180° Sensing Profiles of Chlorophyll-a in Surface Waters Using Portable LD-based Fluorescence Lidar" which explains a novel detection technique of chlorophyll and plastic litter in surface waters.</p><p class="lead mb-4 fw-normal text-justify">We commend him for this significant accomplishment and look forward to his continued contributions to the field. Well done, and may your journey of discovery and innovation continue to inspire! Padayon!</p><p class="lead mb-4 fw-normal text-justify">#DPSMAccomplishments</p><div class="d-grid gap-2 mb-5 mt-5"><p><a target="_blank" class="text-link" href="https://www.facebook.com/dpsmcas/posts/pfbid02EzRapEmqNkHZkmsr63fWFFUPPK4za6SSf5cUDoWinri4J3XWkcmv6KHVLAipudgml">Visit the main post here &gt;</a></p></div>',
    'The Division extends congratulations to Asst. Prof. Jumar G. Cadondon for achieving first place in Oral Presentation at the 12th ASTHRDP Graduate Scholars'' Conference 2024.',
    '/images/article-images/dpsm/asthrdp/asthrdp.jpg',
    _author, 'published', 'announcement', ARRAY[]::text[],
    '2024-09-17T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 4. CAS Open House (event — past)
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, event_date, tags, published_at)
  VALUES (
    'DPSM Serves Science with a Side of Silicon in CAS Open House',
    'cas-open-house',
    '<p class="lead mb-4 fw-normal text-justify">In a delectable fusion of technology and gastronomy, the Division of Physical Sciences and Mathematics at the University of the Philippines Visayas joins the festivities of the CAS Open House during the College of Arts and Sciences week. Drawing inspiration from the IT sector, the Division serves up a feast that celebrates the inner workings of technology and its pivotal role in shaping our world. From "Memory Chips" to "Soup-ercomputer," the Division hopes to present the IT sector in a way that is both yummy and funny.</p><p class="lead mb-4 fw-normal text-justify">As students, staff, and faculty indulge in the Division''s Open House, they are reminded of the ever-present relevance of technology and the boundless opportunities it presents for growth and innovation. The Division hopes to highlight the indispensable role of the IT sector in fostering unity and Panghimanwa within the university.</p><div class="card-img-container"><div class="card-columns"><div class="card-img"><img class="card-img-top border" src="/images/article-images/dpsm/cas-open-house/cas-open-house-2.jpg" alt="CAS Open House"></div><div class="card-img"><img class="card-img-top border" src="/images/article-images/dpsm/cas-open-house/cas-open-house-0.jpg" alt="CAS Open House"></div><div class="card-img"><img class="card-img-top border" src="/images/article-images/dpsm/cas-open-house/cas-open-house-1.jpg" alt="CAS Open House"></div><div class="card-img"><img class="card-img-top border" src="/images/article-images/dpsm/cas-open-house/cas-open-house-3.jpg" alt="CAS Open House"></div><div class="card-img"><img class="card-img-top border" src="/images/article-images/dpsm/cas-open-house/cas-open-house-4.jpg" alt="CAS Open House"></div><div class="card-img"><img class="card-img-top border" src="/images/article-images/dpsm/cas-open-house/cas-open-house-5.jpg" alt="CAS Open House"></div></div></div>',
    'In a delectable fusion of technology and gastronomy, DPSM joins the festivities of the CAS Open House during the College of Arts and Sciences week.',
    '/images/article-images/dpsm/cas-open-house/cas-open-house-2.jpg',
    _author, 'published', 'event', '2024-02-26', ARRAY[]::text[],
    '2024-02-26T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 5. Math-O Interschool Quiz Bee (event — past)
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, event_date, tags, published_at)
  VALUES (
    'Numerical Navigators Converge in Math-O Interschool Quiz Bee!',
    'numerical-navigators-converge-in-math-o-interschool-quiz-bee',
    '<p class="lead mb-4 fw-normal text-justify">The Mathematics Circle, an organization under the Division of Physical Sciences and Mathematics (DPSM) at the University of the Philippines Visayas, recently orchestrated its yearly major event - the Interschool Mathematics Quiz Bee. Drawing participation from approximately 40 schools spanning elementary to high school levels across the region, the Quiz Bee showcased the elegance and versatility of mathematics.</p><p class="lead mb-4 fw-normal text-justify">The event was not just a competition but a celebration of mathematical prowess, made possible by the generous support of major sponsors such as Dr. Arnel Tampos, Ms. Dina Barrios, Asst. Prof. Edelia Tentativa Braga, and many others who are alumni of the UPV Mathematics Circle.</p><p class="lead mb-4 fw-normal text-justify">Capturing the moment of triumph, photos and highlights from the event were shared, celebrating the successes of participants, coaches, and judges. The UPV Mathematics Circle expressed its gratitude to everyone who played a part in making the event a success, emphasizing that such achievements are calculated one problem at a time.</p><div class="video-responsive"><iframe width="560" height="315" src="https://www.youtube.com/embed/ISMyeLREAxM?si=GGVDq2n6cpFDF8US" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><p class="lead mb-4 fw-normal text-justify pt-md-5">Since its inception in 1988, the UPV Mathematics Circle has been at the forefront of promoting mathematics in the Philippines. The Interschool Math Quiz Bee 2024 is a reflection of this enduring mission, inspiring a new generation of students to explore the limitless possibilities of mathematics.</p>',
    'The Mathematics Circle at DPSM orchestrated its yearly Interschool Mathematics Quiz Bee, drawing participation from approximately 40 schools across the region.',
    '/images/article-images/app-math/quizbee/quizbee-1.jpg',
    _author, 'published', 'event', '2024-02-18', ARRAY['applied-mathematics']::text[],
    '2024-02-18T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 6. AIA HackVenture (student award)
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, tags, published_at)
  VALUES (
    'UP Students emerge as winners of AIA LifeHackers 2022: HackVenture competition',
    'up-students-emerge-as-winners-of-aia-lifehackers-2022-hackventure-competition',
    '<p class="lead mb-4 fw-normal text-justify">A team of UPV and UPD students emerged as champions during the final round of AIA LifeHackers 2022: HackVenture competition (for the Products/Services category), held last February 25, 2023, at Marquis Events Place, Bonifacio Global City, Taguig.</p><p class="lead mb-4 fw-normal text-justify">Team Pending is composed of UPV Computer Science students John Markton Olarte, Erru Torculas, and Mariefher Grace Villanueva, and UPD Tourism and Industrial Engineering students KC Anne Isturis and Misael Angelo Zausa. The team beat over a 100 starting teams and initial Top 20 qualifiers for the Products/Services category and took home the P100k top prize.</p><p class="lead mb-4 fw-normal text-justify">Team Pending, with their solution AIA Adapt, involved generating life insurance policies that are customizable, flexible, and cover a wide range of insurance components.</p><p class="lead mb-4 fw-normal text-justify">Another team from UPV, Team AIAgoy Mapriso Ka, is included in the Top 3 out of the 20 qualifiers for the Marketing category.</p><div class="d-grid gap-2 mb-5 mt-5"><p><a target="_blank" class="text-link" href="https://www.upv.edu.ph/index.php/news/up-students-emerge-as-winners-of-aia-lifehackers-2022-hackventure-competition">Visit the main post here &gt;</a></p></div>',
    'UPV Computer Science students emerged as champions in the AIA LifeHackers 2022: HackVenture competition, taking home the P100k top prize.',
    '/images/article-images/computer-science/AIA-hackathon/cs-article-1.jpg',
    _author, 'published', 'student_award', ARRAY['computer-science']::text[],
    '2023-03-06T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 7. PSAI Best Student Paper (student award)
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, tags, published_at)
  VALUES (
    'Panginbulahan! UPV Stat Students Shine in PSAI''s 2024 Best Student Paper Competition',
    'upv-stat-students-win-psai-2024-best-student-paper-competition',
    '<p class="lead mb-4 fw-normal text-justify">Out of thirty-four (34) nationwide submissions, B.S. Statistics students Glenn Ivan D. Macitas, Jace Grant D. Cayot, Arpachshad Panoy, and Francis Yestin V. Javiero proudly claimed victory at the Philippine Statistical Association Inc.''s (PSAI) Best Student Paper Competition.</p><p class="lead mb-4 fw-normal text-justify">The team''s research paper entitled, "Mapping COVID-19 Research Publications: A Bibliometric and Topic Modeling Approach," gathered an audience of statistics enthusiasts and renowned figures from across the nation at the 2024 PSAI Annual Conference.</p><p class="lead mb-4 fw-normal text-justify">The paper utilizes text mining techniques to analyze Scopus metadata on COVID-19 and develop a detailed bibliometric analysis. The authors use Latent Dirichlet Allocation, a Bayesian network, on the abstracts to uncover latent themes in the COVID-19 literature in the Philippines.</p><p class="lead mb-4 fw-normal text-justify">Congratulations to the entire team! Your success is one we all celebrate. Love, StatSoc</p><div class="d-grid gap-2 mb-5 mt-5"><p><a target="_blank" class="text-link" href="https://www.facebook.com/UPVStatSoc/posts/pfbid02jpDLDutvhVJDJCHwpSVqbcWQNY4E7hmPVvUcksBHEXqxkop3KR3vUpk2g2dtRXbkl">Visit the main post here &gt;</a></p></div>',
    'UPV Statistics students claimed victory at PSAI''s Best Student Paper Competition with their research on COVID-19 publications using bibliometric and topic modeling approaches.',
    '/images/article-images/dpsm/psai/psai1.jpg',
    _author, 'published', 'student_award', ARRAY['statistics']::text[],
    '2024-09-13T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

END $$;
