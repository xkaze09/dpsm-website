-- Migration 007: seed remaining articles from the old news-master-page.html
--
-- Adds 3 items that were hardcoded in the old news page but not yet in the CMS:
--   1. AIR2026 Winter Conference          (upcoming event)
--   2. Remote Sensing Symposium 2025     (previous event)
--   3. packetHACKS Techtonics 2024       (student award)

DO $$
DECLARE
  _author uuid;
BEGIN
  SELECT id INTO _author FROM public.profiles WHERE role = 'admin' LIMIT 1;
  IF _author IS NULL THEN
    RAISE EXCEPTION 'No admin user found. Create an admin account first.';
  END IF;

  -- 1. AIR2026 Winter Conference (upcoming event — Feb 26-28, 2026)
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, event_date, tags, published_at)
  VALUES (
    '4th International Conference on ICT Application Research (AIR2026 Winter)',
    'air2026-winter-conference',
    '<p class="lead mb-4 fw-normal text-justify">The Division of Physical Sciences and Mathematics (UP Visayas), International ICT Application Research Society (IIARS), UP Diliman, and partner international institutions invite researchers, faculty members, and students to participate in the <b>4th International Conference on ICT Application Research (AIR2026 Winter)</b>, to be held at <b>UP Visayas, Iloilo City</b> on <b>February 25-28, 2026</b>.</p><p class="lead mb-4 fw-normal text-justify">Join researchers, educators, and industry practitioners in sharing their innovations and collaborations on ICT-driven solutions across science, engineering, and the social sciences.</p><p class="lead mb-4 fw-normal text-justify">Deadline for <a href="https://conferenceservice.jp/registration/iar2026_winter/" class="text-decoration-underline text-info" target="_blank">Registration</a> and <a href="https://conferenceservice.jp/papersubmission/iar2026_winter/" class="text-decoration-underline text-info" target="_blank">Paper/Poster Submission</a> is on <b>January 28, 2026</b>.</p><div class="d-grid gap-2 mb-5 mt-5"><p><a target="_blank" class="text-link" href="https://iiiar.org/iiars/iar/2026_winter/">Learn More and Join Here &rarr;</a></p></div>',
    'DPSM, IIARS, UP Diliman, and partner institutions invite researchers to the 4th International Conference on ICT Application Research (AIR2026 Winter) at UP Visayas, Iloilo City on February 25-28, 2026.',
    '/images/iars2026.jpg',
    _author, 'published', 'event', '2026-02-26', ARRAY[]::text[],
    '2026-01-22T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 2. Remote Sensing and Data Analytics Symposium 2025 (previous event — Sept 25-26, 2025)
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, event_date, tags, published_at)
  VALUES (
    '2nd Remote Sensing and Data Analytics Research Symposium 2025',
    'remote-sensing-data-analytics-symposium-2025',
    '<p class="lead mb-4 fw-normal text-justify">Join us for the 2nd Remote Sensing and Data Analytics Research Symposium 2025, where experts and researchers share their insights and advancements in the field. We welcome all researchers, faculty, and students to submit and present their research in this exciting event.</p><p class="lead mb-4 fw-normal text-justify">The symposium was held on <b>September 25-26, 2025</b> at the <b>UPV CAS MILC, Miagao, Iloilo</b>.</p>',
    'Experts and researchers gathered at UPV CAS MILC, Miagao to share insights and advancements in remote sensing and data analytics at this two-day research symposium.',
    '/images/remote-sensing-prev.jpg',
    _author, 'published', 'event', '2025-09-25', ARRAY[]::text[],
    '2025-09-25T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

  -- 3. packetHACKS Techtonics 2024 (student award — CS)
  INSERT INTO public.articles
    (title, slug, content, excerpt, image_url, author_id, status, category, tags, published_at)
  VALUES (
    'Techtonics Team Secures 7th Place out of 50+ Teams in packetHACKS 2024 National Hackathon',
    'packethacks-hackathon',
    '<p class="lead mb-4 fw-normal text-justify">The Techtonics Team from UP Visayas Computer Science secured <b>7th place out of 50+ teams</b> in the <b>packetHACKS 2024 National Hackathon</b>, paving the way for a smarter Philippines!</p><p class="lead mb-4 fw-normal text-justify">packetHACKS is a national-level hackathon that challenges teams to develop innovative solutions to real-world technology problems. The Techtonics Team''s strong finish among over 50 competing teams reflects the quality and ingenuity of UPV''s Computer Science program.</p><p class="lead mb-4 fw-normal text-justify">Congratulations to the Techtonics Team for this remarkable achievement! #DPSMAccomplishments</p>',
    'The Techtonics Team from UP Visayas Computer Science secured 7th place out of 50+ teams in the packetHACKS 2024 National Hackathon, paving the way for a smarter Philippines.',
    '/images/article-images/computer-science/packethacks/techtonics.jpg',
    _author, 'published', 'student_award', ARRAY['computer-science']::text[],
    '2024-01-01T00:00:00Z'
  ) ON CONFLICT (slug) DO NOTHING;

END $$;
