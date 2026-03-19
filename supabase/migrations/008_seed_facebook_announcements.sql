-- Migration 008: seed Facebook-post-style announcements from the old news page
--
-- These were cards that linked to Facebook posts rather than full article pages.
-- Also deletes the QA Test Article.

DO $$
DECLARE
  _author uuid;
BEGIN
  SELECT id INTO _author FROM public.profiles WHERE role = 'admin' LIMIT 1;
  IF _author IS NULL THEN
    RAISE EXCEPTION 'No admin user found.';
  END IF;

  -- Delete QA Test Article
  DELETE FROM public.articles WHERE slug = 'qa-test-article';

  -- 1. Congratulations, Sir Elfred!
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, tags, published_at)
  VALUES (
    'Congratulations, Sir Elfred! DPSM is proud of you!',
    'congratulations-sir-elfred',
    '<p class="lead mb-4 fw-normal text-justify">Congratulations, Sir Elfred! DPSM is proud of you 👏👏👏</p><div class="d-grid gap-2 mb-5 mt-5"><p><a target="_blank" class="text-link" href="https://www.facebook.com/dpsmcas/posts/pfbid025LiJvqBnyB1MnD98BNHyKRVckuh6DKvX489KFjxctQGetddvNfBZJtPjcmuS5pJyl">View the original post here &rarr;</a></p></div>',
    'DPSM congratulates Sir Elfred on this achievement. DPSM is proud of you!',
    '/images/article-images/dpsm/dpsm-2.jpg',
    _author, 'published', 'announcement', ARRAY[]::text[],
    '2025-06-28T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 2. Stephen Carlo Areño — Salutatorian
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, tags, published_at)
  VALUES (
    'Congratulations to STEPHEN CARLO AREÑO — UPV Class of 2023 Salutatorian!',
    'stephen-carlo-areno-salutatorian-2023',
    '<p class="lead mb-4 fw-normal text-justify">DPSM proudly congratulates:</p><p class="lead mb-4 fw-bold text-center">STEPHEN CARLO AREÑO<br>BS in Applied Mathematics<br>Summa Cum Laude<br>UPV Class of 2023 Salutatorian</p><div class="d-grid gap-2 mb-5 mt-5"><p><a target="_blank" class="text-link" href="https://www.facebook.com/dpsmcas/posts/pfbid02tbfiZPXPC5QiGrxVYJnRHdwQ3JUXWM6tLkhhLWVD3euUScRXeHtBChYaX4mzCbZzl">View the original post here &rarr;</a></p></div>',
    'DPSM congratulates Stephen Carlo Areño, BS in Applied Mathematics, Summa Cum Laude, UPV Class of 2023 Salutatorian.',
    '/images/article-images/dpsm/dpsm-3.jpg',
    _author, 'published', 'announcement', ARRAY['applied-mathematics']::text[],
    '2023-07-01T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 3. Benreo Rex Rembulat — Valedictorian
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, tags, published_at)
  VALUES (
    'Congratulations to BENREO REX REMBULAT — UPV Class of 2023 Valedictorian!',
    'benreo-rex-rembulat-valedictorian-2023',
    '<p class="lead mb-4 fw-normal text-justify">DPSM proudly congratulates:</p><p class="lead mb-4 fw-bold text-center">BENREO REX REMBULAT<br>BS in Applied Mathematics<br>Summa Cum Laude<br>UPV Class of 2023 Valedictorian</p><div class="d-grid gap-2 mb-5 mt-5"><p><a target="_blank" class="text-link" href="https://www.facebook.com/dpsmcas/posts/pfbid0h8ucLCzVUbLnj84A6dm8iGxjJkUzV3AkPAkTuxRBr24HWpnfs58e3bHbqVrK7AqPl">View the original post here &rarr;</a></p></div>',
    'DPSM congratulates Benreo Rex Rembulat, BS in Applied Mathematics, Summa Cum Laude, UPV Class of 2023 Valedictorian.',
    '/images/article-images/dpsm/dpsm-4.jpg',
    _author, 'published', 'announcement', ARRAY['applied-mathematics']::text[],
    '2023-07-02T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 4. Asst. Prof. Ara Abigail Ambita — IEEE ACCESS publication
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, tags, published_at)
  VALUES (
    'Congratulations Asst. Prof. Ara Abigail Ambita for the Latest Publication in IEEE ACCESS',
    'asst-prof-ambita-ieee-access-publication',
    '<p class="lead mb-4 fw-normal text-justify">DPSM extends heartfelt congratulations to Asst. Prof. Ara Abigail Ambita for her latest publication in <b>IEEE ACCESS</b>, one of the most prestigious multidisciplinary open-access journals in the IEEE publication portfolio.</p><p class="lead mb-4 fw-normal text-justify">This achievement reflects the Division''s commitment to advancing research and academic excellence. Well done, Asst. Prof. Ambita!</p><div class="d-grid gap-2 mb-5 mt-5"><p><a target="_blank" class="text-link" href="https://www.facebook.com/dpsmcas/posts/pfbid0YxmZreuXh4Sq6cEwqtEVfi1vRtafumdAnuLxh7W2TDLGrxFPCBm2HFJdvshMVAQrl">View the original post here &rarr;</a></p></div>',
    'DPSM congratulates Asst. Prof. Ara Abigail Ambita for her latest publication in IEEE ACCESS, one of the most prestigious multidisciplinary open-access journals.',
    '/images/news/ambita_publication.jpg',
    _author, 'published', 'announcement', ARRAY['computer-science']::text[],
    '2025-06-29T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 5. DPSM Represented at MSP 2025 Annual Convention
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, tags, published_at)
  VALUES (
    'DPSM Represented at the MSP 2025 Annual Convention in Zamboanga City',
    'dpsm-msp-2025-annual-convention',
    '<p class="lead mb-4 fw-normal text-justify">The Division of Physical Sciences and Mathematics proudly represented UP Visayas at the <b>Mathematical Society of the Philippines (MSP) 2025 Annual Convention</b> held in Zamboanga City.</p><p class="lead mb-4 fw-normal text-justify">The convention brings together mathematics educators, researchers, and practitioners from across the country to share the latest developments in the field and foster collaboration within the Philippine mathematics community.</p><div class="d-grid gap-2 mb-5 mt-5"><p><a target="_blank" class="text-link" href="https://www.facebook.com/dpsmcas/posts/pfbid0gsT8Cd9s11hvBHNkQvRdHf47qY65oLo7QMM8Znbyq71RgcXyN1zPFf2snrR5cHaVl">View the original post here &rarr;</a></p></div>',
    'DPSM proudly represented UP Visayas at the Mathematical Society of the Philippines (MSP) 2025 Annual Convention in Zamboanga City.',
    '/images/news/math_soc.jpg',
    _author, 'published', 'announcement', ARRAY['applied-mathematics']::text[],
    '2025-09-03T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 6. Data Privacy Orientation
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, tags, published_at)
  VALUES (
    'Data Privacy Orientation for Practicum Students — Midyear A.Y. 2024-2025',
    'data-privacy-orientation-practicum-2024-2025',
    '<p class="lead mb-4 fw-normal text-justify">The Division of Physical Sciences and Mathematics conducted a <b>Data Privacy Orientation</b> for students who will undergo practicum for <b>Midyear A.Y. 2024-2025</b>.</p><p class="lead mb-4 fw-normal text-justify">The orientation ensures that students are equipped with the necessary knowledge about data privacy regulations and best practices before entering their practicum placements.</p><div class="d-grid gap-2 mb-5 mt-5"><p><a target="_blank" class="text-link" href="https://www.facebook.com/dpsmcas/posts/pfbid0Fp5mqX98G7STFUYPMJZZzaJTu1kzB5qYoH6sgR76h7Tn4UdFVh4QvgfqVWkyG4fbl">View the original post here &rarr;</a></p></div>',
    'DPSM conducted a Data Privacy Orientation for students undergoing practicum for Midyear A.Y. 2024-2025.',
    '/images/news/data_privacy.jpg',
    _author, 'published', 'announcement', ARRAY['computer-science']::text[],
    '2025-06-29T06:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

END $$;
