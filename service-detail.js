/* =========================================================
   UrbanHaven | Service Detail page behaviour (standalone)

   ONE template page, SIX services.
   Each service card on service.html links here with
   ?service=<slug>. This script reads the slug and renders
   that service's own hero, context, why-choose, pricing,
   FAQs and CTA. Slugs:
     design-consultation | custom-furniture | space-planning |
     delivery-assembly   | home-styling      | warranty-care
   ========================================================= */
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try {
    var t = localStorage.getItem('uh-theme');
    var r = localStorage.getItem('uh-dir');
    if (t) d.setAttribute('data-theme', t);
    if (r) d.setAttribute('dir', r);
  } catch (e) {}
})();

(function () {
  'use strict';

  /* =======================================================
     SERVICE DATA (edit copy, prices and images here)
     ======================================================= */
  var SERVICES = [
    {
      slug: 'design-consultation',
      title: 'Design Consultation',
      icon: 'compass',
      tag: 'Most Popular',
      img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=80',
      img2: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1100&q=80',
      tagline: 'One-to-one sessions with our interior designers to shape a layout and palette you love.',
      facts: [
        { icon: 'clock', label: 'Duration', value: '45 to 90 minutes' },
        { icon: 'map-pin', label: 'Where', value: 'Showroom or online' },
        { icon: 'file-check', label: 'You receive', value: 'Moodboard & costed plan' }
      ],
      overviewTitle: 'A designer by your side, from the very first idea',
      overview: [
        'Not sure where to start? Our design consultation turns a vague idea into a clear, confident plan. You sit down with an experienced interior designer who listens first, then shapes a layout, palette and furniture list around the way you actually live.',
        'Whether you are furnishing one room or an entire home, you leave with a moodboard, a shortlist you can act on right away and a realistic budget, with no obligation to buy.'
      ],
      included: [
        'Discovery chat about your lifestyle, budget and taste',
        'Colour palette and material moodboard',
        'Furniture and layout recommendations',
        'Costed shortlist you can act on right away',
        'Two weeks of follow-up support'
      ],
      highlight: { big: 'Free', label: 'first consultation' },
      steps: [
        { t: 'Book a slot', d: 'Pick a time that suits you, in the showroom or online.' },
        { t: 'Share your space', d: 'Send photos, measurements and any inspiration you love.' },
        { t: 'Meet your designer', d: 'Talk through style, budget and how you use each room.' },
        { t: 'Receive your plan', d: 'Get a moodboard, layout ideas and a clear costed shortlist.' }
      ],
      why: [
        { icon: 'users', t: 'Experienced designers', d: 'Work with people who have styled thousands of real homes, not just showrooms.' },
        { icon: 'palette', t: 'A look that is yours', d: 'We shape your taste into a cohesive palette instead of pushing a fixed style.' },
        { icon: 'wallet', t: 'Budget-first advice', d: 'Honest recommendations that respect what you want to spend.' },
        { icon: 'zap', t: 'Quick turnaround', d: 'Most plans are ready within a few working days of your session.' }
      ],
      plans: [
        { name: 'Intro Session', desc: 'A relaxed first chat', price: 'Free', note: '45 minutes', popular: false, cta: 'Book Free Session',
          features: ['Style and needs discovery', 'Room-by-room priorities', 'Product recommendations'] },
        { name: 'Room Design', desc: 'One room, fully planned', price: '₹4,999', note: 'per room', popular: true, cta: 'Book Room Design',
          features: ['Moodboard & colour palette', 'Layout and furniture plan', 'Costed shortlist', 'Two weeks of support'] },
        { name: 'Full Home Design', desc: 'A cohesive plan for your home', price: '₹19,999', note: 'up to 5 rooms', popular: false, cta: 'Book Full Design',
          features: ['Everything in Room Design', 'Whole-home flow and palette', 'Priority designer access', 'One styling visit'] }
      ],
      faqs: [
        { q: 'Is the first consultation really free?', a: 'Yes. Your first 45-minute intro session is complimentary, with no obligation to buy anything.' },
        { q: 'Can I have the consultation online?', a: 'Absolutely. Sessions run by video call as well as in the showroom, and the deliverables are identical.' },
        { q: 'What should I bring or send?', a: 'Photos and rough measurements of your space help most, plus any inspiration images you love. Do not worry if you have none.' },
        { q: 'Do I have to buy furniture from UrbanHaven?', a: 'No. The plan is yours to keep. Many customers choose to shop with us, but there is never any pressure.' },
        { q: 'How soon will I get my plan?', a: 'Moodboards and shortlists are usually delivered within three to five working days of your session.' }
      ],
      cta: { title: 'Let us design your space together', text: 'Book your free first consultation and leave with ideas, a palette and a plan you can trust.' }
    },

    {
      slug: 'custom-furniture',
      title: 'Custom Furniture',
      icon: 'ruler',
      tag: 'Made to Measure',
      img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=80',
      img2: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1100&q=80',
      tagline: 'Made-to-measure sofas, wardrobes and tables in your choice of finish and fabric.',
      facts: [
        { icon: 'clock', label: 'Lead time', value: '4 to 6 weeks' },
        { icon: 'ruler', label: 'Sizing', value: 'Any dimension' },
        { icon: 'shield-check', label: 'Warranty', value: 'Up to 10 years' }
      ],
      overviewTitle: 'Furniture that fits your home, not the other way round',
      overview: [
        'Awkward alcove, tall ceilings or a family that needs a bigger table? Our artisans build sofas, beds, wardrobes and tables to your exact dimensions, in the wood, finish and fabric you choose.',
        'You approve every detail before we cut a single board, and each piece is built by hand in our own workshop, then delivered and assembled by our crew.'
      ],
      included: [
        'Free measurement visit within our service area',
        'Choice of solid wood, finish and fabric',
        '3D preview before we build',
        'Hand-built by our own artisans',
        'Delivery, assembly and up to 10-year warranty'
      ],
      highlight: { big: '100%', label: 'made to your measurements' },
      steps: [
        { t: 'Share your brief', d: 'Tell us what you need, where it goes and how you will use it.' },
        { t: 'Design & quote', d: 'We measure, sketch a 3D preview and send a clear quote.' },
        { t: 'Handcrafted', d: 'Artisans build your piece, with quality checks at every stage.' },
        { t: 'Delivered & fitted', d: 'We deliver, assemble and place it exactly where you want it.' }
      ],
      why: [
        { icon: 'gem', t: 'Artisan craftsmanship', d: 'Traditional joinery and hand finishing by people who love the work.' },
        { icon: 'ruler', t: 'A perfect fit', d: 'Every centimetre matches your space, from alcoves to open-plan rooms.' },
        { icon: 'leaf', t: 'Responsible materials', d: 'Sustainably sourced solid wood and natural fabrics, chosen with care.' },
        { icon: 'shield-check', t: 'Built to last', d: 'Backed by up to 10 years of warranty and ongoing care support.' }
      ],
      plans: [
        { name: 'Single Piece', desc: 'One made-to-measure item', price: '₹14,999', note: 'starting price', popular: false, cta: 'Request a Quote',
          features: ['Choice of wood and finish', 'Fabric or leather options', '3D preview', 'Delivery & assembly'] },
        { name: 'Room Set', desc: 'A matching collection', price: '₹59,999', note: 'up to 4 pieces', popular: true, cta: 'Request a Quote',
          features: ['Coordinated finishes', 'Free measurement visit', 'Priority workshop slot', '10-year warranty'] },
        { name: 'Whole Home', desc: 'Tailored for every room', price: 'Custom', note: 'bespoke quote', popular: false, cta: 'Talk to Us',
          features: ['Dedicated project designer', 'Phased delivery plan', 'Full styling visit', '10-year warranty'] }
      ],
      faqs: [
        { q: 'How long does a custom order take?', a: 'Most pieces are ready in four to six weeks, depending on size and finish. We confirm your exact timeline before work begins.' },
        { q: 'Can I change the design after approving it?', a: 'Small changes are possible before production starts. Once we begin cutting, changes may affect cost and timeline, and we will always tell you first.' },
        { q: 'Which woods and fabrics can I choose from?', a: 'We offer oak, walnut and ash, plus a wide range of linens, wools and leathers. Visit the showroom to touch and compare samples.' },
        { q: 'Do you charge for the measurement visit?', a: 'No. Measurement visits are free within our service area when you proceed with a quote.' },
        { q: 'Is a deposit required?', a: 'Yes, a deposit confirms your slot in the workshop. The balance is due before delivery, and everything is itemised in your quote.' }
      ],
      cta: { title: 'Tell us what you would love to build', text: 'Share your idea and measurements and we will send a clear quote with a 3D preview.' }
    },

    {
      slug: 'space-planning',
      title: 'Space Planning',
      icon: 'layout-dashboard',
      tag: 'Smart Layouts',
      img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=80',
      img2: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1100&q=80',
      tagline: 'Smart floor plans that balance flow, storage and comfort in homes of any size.',
      facts: [
        { icon: 'clock', label: 'Turnaround', value: '3 to 5 working days' },
        { icon: 'layout-dashboard', label: 'You receive', value: 'To-scale floor plan' },
        { icon: 'house', label: 'Best for', value: 'Homes of any size' }
      ],
      overviewTitle: 'Make every square foot work harder for you',
      overview: [
        'A well-planned room feels bigger, calmer and easier to live in. Our space planners study how you move, store and relax at home, then lay out furniture so that everything has its place and walkways stay clear.',
        'You receive a to-scale floor plan with sized furniture, so you can buy with confidence and avoid the classic mistake of a sofa that does not fit.'
      ],
      included: [
        'Measured 2D floor plans, drawn to scale',
        'Traffic flow and clearance checks',
        'Storage and zoning suggestions',
        'Furniture shortlist sized for your room',
        'Optional video walkthrough call'
      ],
      highlight: { big: '3 to 5', label: 'days to your plan' },
      steps: [
        { t: 'Send your details', d: 'Share room dimensions, photos and what you want the space to do.' },
        { t: 'We analyse flow', d: 'Planners test layouts for movement, light and storage.' },
        { t: 'Review options', d: 'See two layout options and pick the one that feels right.' },
        { t: 'Get your plan', d: 'Receive a final to-scale plan and a sized furniture list.' }
      ],
      why: [
        { icon: 'scan-line', t: 'Measured precisely', d: 'Plans drawn to scale so every piece you buy actually fits.' },
        { icon: 'move', t: 'Better flow', d: 'Clear walkways and comfortable zones for how your family lives.' },
        { icon: 'archive', t: 'Smarter storage', d: 'We find hidden space for storage without crowding the room.' },
        { icon: 'badge-check', t: 'Buy with confidence', d: 'No guesswork, no returns, no sofa stuck in the hallway.' }
      ],
      plans: [
        { name: 'Single Room', desc: 'One room, planned properly', price: '₹2,999', note: 'per room', popular: false, cta: 'Plan My Room',
          features: ['To-scale 2D plan', 'Two layout options', 'Sized furniture list'] },
        { name: '3-Room Plan', desc: 'Our most popular package', price: '₹7,499', note: 'three rooms', popular: true, cta: 'Plan 3 Rooms',
          features: ['Everything in Single Room', 'Connected flow between rooms', 'Storage recommendations', 'Video walkthrough call'] },
        { name: 'Whole Home', desc: 'Every room, one coherent plan', price: '₹14,999', note: 'up to 8 rooms', popular: false, cta: 'Plan My Home',
          features: ['Complete home layout', 'Priority planner access', 'Furniture and storage list', 'One revision round'] }
      ],
      faqs: [
        { q: 'Do I need professional drawings of my home?', a: 'No. Simple measurements and photos are enough. If you have a builder floor plan, that helps and speeds things up.' },
        { q: 'Will you plan around furniture I already own?', a: 'Yes. Tell us what you want to keep and we will work it into the layout.' },
        { q: 'Can you plan small apartments?', a: 'Small homes benefit most. We design clever zoning and multi-purpose pieces that make compact rooms feel open.' },
        { q: 'How many layout options will I get?', a: 'Every plan includes two layout options so you can compare and choose, plus one round of tweaks.' },
        { q: 'Is the plan useful if I buy elsewhere?', a: 'Yes. The plan and sizes are yours to keep and use with any furniture, though we are happy to help you source pieces.' }
      ],
      cta: { title: 'Get a layout that just works', text: 'Send us your room dimensions and receive a to-scale plan in just a few working days.' }
    },

    {
      slug: 'delivery-assembly',
      title: 'Delivery & Assembly',
      icon: 'truck',
      tag: 'Always Included',
      img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=80',
      img2: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1100&q=80',
      tagline: 'Careful white-glove delivery with expert assembly and packaging taken away.',
      facts: [
        { icon: 'clock', label: 'Delivery slots', value: '9 AM to 6 PM' },
        { icon: 'truck', label: 'Standard delivery', value: 'Free in service area' },
        { icon: 'hammer', label: 'Assembly', value: 'By our own crew' }
      ],
      overviewTitle: 'From our workshop to the exact spot you pictured',
      overview: [
        'Great furniture deserves careful handling. Our own trained crew delivers in a scheduled window, protects your floors and walls, carries every piece to the right room and assembles it on the spot.',
        'When we leave, the packaging goes with us, and your furniture is ready to use. No boxes, no tools, no stress.'
      ],
      included: [
        'Scheduled delivery window with live updates',
        'Floor and wall protection throughout',
        'Placement in the room you choose',
        'Full assembly by trained technicians',
        'All packaging and debris taken away'
      ],
      highlight: { big: 'Free', label: 'standard delivery' },
      steps: [
        { t: 'Choose your slot', d: 'Pick a convenient window that suits your day.' },
        { t: 'Live updates', d: 'Get a call and tracking message before the crew arrives.' },
        { t: 'Careful delivery', d: 'Pieces are carried in, protected and placed where you want.' },
        { t: 'Assembly & clean-up', d: 'We assemble everything and take the packaging away.' }
      ],
      why: [
        { icon: 'shield-check', t: 'Handled with care', d: 'Padded carry, floor protection and zero-damage handling standards.' },
        { icon: 'wrench', t: 'Expert assembly', d: 'Trained technicians who build every piece correctly the first time.' },
        { icon: 'calendar-check', t: 'On your schedule', d: 'Flexible slots and clear, honest communication.' },
        { icon: 'recycle', t: 'No mess left behind', d: 'We take all packaging away for responsible recycling.' }
      ],
      plans: [
        { name: 'Standard', desc: 'Included with your order', price: 'Free', note: 'service area', popular: false, cta: 'Schedule Delivery',
          features: ['Scheduled delivery window', 'Placement in your room', 'Basic assembly', 'Packaging removal'] },
        { name: 'White-Glove', desc: 'The complete experience', price: '₹1,499', note: 'per order', popular: true, cta: 'Add White-Glove',
          features: ['Everything in Standard', 'Full floor and wall protection', 'Old furniture removal', 'Post-delivery check call'] },
        { name: 'Express', desc: 'Fast, priority delivery', price: '₹2,999', note: 'per order', popular: false, cta: 'Add Express',
          features: ['Delivery within 48 hours', 'Priority crew allocation', 'White-Glove service included', 'Live tracking'] }
      ],
      faqs: [
        { q: 'Is delivery really free?', a: 'Standard delivery and assembly are free within our service area. Ask us about other cities and we will confirm the cost upfront.' },
        { q: 'Can I choose the delivery time?', a: 'Yes. You select a window between 9 AM and 6 PM, and we call you before the crew arrives.' },
        { q: 'What if I am not home?', a: 'Please make sure someone can receive the order. If plans change, reschedule free of charge up to 24 hours before.' },
        { q: 'Will you remove my old furniture?', a: 'Old furniture removal is included with the White-Glove and Express services.' },
        { q: 'What if something arrives damaged?', a: 'We inspect with you at delivery. If anything is damaged, we repair or replace it quickly at no cost.' }
      ],
      cta: { title: 'Sit back while we handle the heavy lifting', text: 'Order with confidence. Our crew delivers, assembles and tidies up so you can simply enjoy your new home.' }
    },

    {
      slug: 'home-styling',
      title: 'Home Styling',
      icon: 'sofa',
      tag: 'Finishing Touch',
      img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=2000&q=80',
      img2: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1100&q=80',
      tagline: 'Finishing touches, from rugs and lighting to art, styled to complete each room.',
      facts: [
        { icon: 'clock', label: 'On-site visit', value: '2 to 3 hours' },
        { icon: 'map-pin', label: 'Where', value: 'At your home' },
        { icon: 'sparkles', label: 'Includes', value: 'Sourcing & styling' }
      ],
      overviewTitle: 'The difference between furnished and finished',
      overview: [
        'Beautiful furniture is only the start. Our stylists add the layers that make a room feel complete: rugs underfoot, warm lighting, art on the walls, cushions, plants and objects that tell your story.',
        'We source the pieces, bring them to your home and style every surface with you, so the result looks collected, personal and effortless.'
      ],
      included: [
        'Walkthrough of your rooms and style goals',
        'Curated rugs, lighting, art and accessories',
        'Styling and placement on site',
        'Cushion, throw and plant suggestions',
        'Seasonal refresh options'
      ],
      highlight: { big: '2 to 3', label: 'hours of on-site styling' },
      steps: [
        { t: 'Style chat', d: 'Share your taste, colours and the mood you want in each room.' },
        { t: 'Curated selection', d: 'We source rugs, lighting, art and accessories to suit.' },
        { t: 'Styling visit', d: 'Our stylist arranges everything in your home with you.' },
        { t: 'Keep what you love', d: 'Pay only for the pieces you decide to keep.' }
      ],
      why: [
        { icon: 'sparkles', t: 'A designer eye', d: 'Stylists who know how texture, scale and colour work together.' },
        { icon: 'lamp', t: 'Layered lighting', d: 'Warm, flexible lighting that changes the feel of a room at night.' },
        { icon: 'package-open', t: 'Try at home', d: 'See pieces in your own light before you commit.' },
        { icon: 'refresh-cw', t: 'Seasonal refresh', d: 'Update your look through the year without starting over.' }
      ],
      plans: [
        { name: 'Room Refresh', desc: 'One room, finished beautifully', price: '₹3,999', note: 'per room', popular: false, cta: 'Book a Refresh',
          features: ['Styling consultation', 'On-site styling visit', 'Curated accessory selection'] },
        { name: 'Full Styling', desc: 'A complete finishing package', price: '₹12,999', note: 'up to 4 rooms', popular: true, cta: 'Book Full Styling',
          features: ['Everything in Room Refresh', 'Rugs, lighting and art plan', 'Try-at-home selection', 'Follow-up adjustment visit'] },
        { name: 'Seasonal Refresh', desc: 'Keep your home feeling fresh', price: '₹2,499', note: 'per season', popular: false, cta: 'Book a Refresh',
          features: ['Seasonal colour update', 'New cushions and throws', 'Quick on-site restyle'] }
      ],
      faqs: [
        { q: 'Do I need new furniture to use this service?', a: 'Not at all. Styling works beautifully with the furniture you already own, and we build around it.' },
        { q: 'Do I have to buy the items you bring?', a: 'No. You only pay for the pieces you decide to keep. The styling fee covers our time and expertise.' },
        { q: 'How long does a styling visit take?', a: 'Most rooms take two to three hours, including arranging pieces and fine-tuning with you.' },
        { q: 'Can you style rented homes?', a: 'Yes. We focus on removable pieces such as rugs, lamps, art and textiles that move with you.' },
        { q: 'How often should I refresh my styling?', a: 'Many customers update once a season, with new cushions, throws and a few accents. It keeps the home feeling fresh.' }
      ],
      cta: { title: 'Add the finishing touches your home deserves', text: 'Book a styling visit and let our team complete every room with rugs, lighting, art and warmth.' }
    },

    {
      slug: 'warranty-care',
      title: 'Warranty & Care',
      icon: 'shield-check',
      tag: '10-Year Cover',
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2000&q=80',
      img2: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1100&q=80',
      tagline: 'Up to 10 years of coverage plus repair, restoration and cleaning support.',
      facts: [
        { icon: 'shield-check', label: 'Coverage', value: 'Up to 10 years' },
        { icon: 'wrench', label: 'Support', value: 'Repair & restoration' },
        { icon: 'droplets', label: 'Care', value: 'Professional cleaning' }
      ],
      overviewTitle: 'We stand behind every piece, for years to come',
      overview: [
        'We build furniture to last, and we promise to look after it. Every UrbanHaven purchase includes warranty coverage against manufacturing defects, with the option to extend protection up to ten years.',
        'Beyond repairs, our care team restores worn finishes and deep-cleans upholstery, so your favourite pieces keep looking and feeling like new.'
      ],
      included: [
        'Coverage against manufacturing defects',
        'Free repair or replacement of covered parts',
        'Wood restoration and finish touch-ups',
        'Professional upholstery deep-cleaning',
        'Priority support line for plan members'
      ],
      highlight: { big: '10', label: 'years of cover available' },
      steps: [
        { t: 'Register your piece', d: 'Your warranty starts automatically from the delivery date.' },
        { t: 'Report an issue', d: 'Call, message or email us with a few photos.' },
        { t: 'We assess quickly', d: 'Our care team confirms cover and books a visit or pickup.' },
        { t: 'Repaired like new', d: 'We repair, restore or replace and check back with you.' }
      ],
      why: [
        { icon: 'shield-check', t: 'Long-term protection', d: 'Frame and construction cover that lasts well beyond the first year.' },
        { icon: 'wrench', t: 'In-house repairs', d: 'Our own craftspeople fix and restore, with no outsourcing delays.' },
        { icon: 'sparkles', t: 'Looks like new', d: 'Cleaning and finishing services keep pieces beautiful for years.' },
        { icon: 'headset', t: 'Real people to call', d: 'A dedicated care team that knows your furniture by name.' }
      ],
      plans: [
        { name: 'Essential Care', desc: 'Included with every purchase', price: 'Included', note: 'with your order', popular: false, cta: 'Learn More',
          features: ['Manufacturing defect cover', 'Frame cover for 5 years', 'Care guide and support line'] },
        { name: 'Extended Care', desc: 'Our longest protection', price: '₹2,999', note: 'per piece', popular: true, cta: 'Add Extended Care',
          features: ['Everything in Essential', 'Frame cover up to 10 years', 'Free repairs and parts', 'One restoration visit'] },
        { name: 'Annual Care Plan', desc: 'Keep furniture fresh every year', price: '₹4,999', note: 'per year', popular: false, cta: 'Join the Plan',
          features: ['Yearly deep-clean visit', 'Wood and leather conditioning', 'Priority support line'] }
      ],
      faqs: [
        { q: 'What does the warranty cover?', a: 'It covers manufacturing defects in frames, joinery and construction. Normal wear, accidental damage and misuse are not included.' },
        { q: 'How do I make a claim?', a: 'Contact our care team by phone, message or email with your order number and a few photos. We handle the rest.' },
        { q: 'Is the 10-year cover automatic?', a: 'Essential cover is included with every purchase. Extended Care adds frame protection for up to 10 years and can be added at checkout.' },
        { q: 'Do you repair furniture bought elsewhere?', a: 'Our restoration and cleaning services are available for non-UrbanHaven pieces too, subject to inspection and a quote.' },
        { q: 'How should I care for my furniture?', a: 'Every order includes a simple care guide. Our Annual Care Plan adds professional cleaning and conditioning each year.' }
      ],
      cta: { title: 'Furniture you can rely on for years', text: 'Talk to our care team about coverage, repairs and keeping your favourite pieces looking beautiful.' }
    }
  ];

  /* =======================================================
     Helpers
     ======================================================= */
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;

  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  /* ---------- Pick the service from ?service=slug ---------- */
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('service');
  var service = SERVICES.filter(function (s) { return s.slug === slug; })[0];
  if (!service) {
    service = SERVICES[0];
    try { window.history.replaceState(null, '', 'service-detail.html?service=' + service.slug); } catch (e) {}
  }

  /* =======================================================
     Render sections
     ======================================================= */
  function contactLink(extra) {
    return 'contact.html?service=' + encodeURIComponent(service.slug) + (extra || '') + '#form';
  }

  function renderHero(s) {
    var facts = s.facts.map(function (f) {
      return '<div class="sd-fact"><i data-lucide="' + f.icon + '" class="icon"></i>' +
        '<div><small>' + f.label + '</small><strong>' + f.value + '</strong></div></div>';
    }).join('');

    $('#sdHero').innerHTML =
      '<div class="sd-hero-bg" aria-hidden="true"><img src="' + s.img + '" alt="" /></div>' +
      '<div class="sd-hero-shade" aria-hidden="true"></div>' +
      '<span class="sd-hero-mark" aria-hidden="true"><i data-lucide="' + s.icon + '" class="icon"></i></span>' +
      '<div class="container">' +
        '<nav class="sd-crumbs sd-in" style="--i:0" aria-label="Breadcrumb">' +
          '<a href="index.html">Home</a><i data-lucide="chevron-right" class="icon-sm flip" aria-hidden="true"></i>' +
          '<a href="service.html">Services</a><i data-lucide="chevron-right" class="icon-sm flip" aria-hidden="true"></i>' +
          '<span aria-current="page">' + s.title + '</span>' +
        '</nav>' +
        '<div class="sd-hero-badges sd-in" style="--i:1">' +
          '<span class="sd-hero-icon"><i data-lucide="' + s.icon + '" class="icon"></i></span>' +
          '<span class="tag">' + s.tag + '</span>' +
        '</div>' +
        '<h1 class="sd-in" style="--i:2">' + s.title + '</h1>' +
        '<p class="sd-lead sd-in" style="--i:3">' + s.tagline + '</p>' +
        '<div class="btn-row sd-in" style="--i:4">' +
          '<a href="#pricing" class="btn btn-primary">View Pricing <i data-lucide="arrow-down" class="icon-sm"></i></a>' +
          '<a href="' + contactLink() + '" class="btn btn-light">Book This Service</a>' +
        '</div>' +
        '<div class="sd-facts sd-in" style="--i:5">' + facts + '</div>' +
      '</div>';
  }

  function renderOverview(s) {
    var paras = s.overview.map(function (p) { return '<p class="reveal">' + p + '</p>'; }).join('');
    var included = s.included.map(function (item, i) {
      return '<li class="reveal" style="--d:' + (i * 0.06).toFixed(2) + 's"><i data-lucide="check" class="icon-sm"></i><span>' + item + '</span></li>';
    }).join('');
    var steps = s.steps.map(function (st, i) {
      return '<li class="sd-step reveal" style="--d:' + (i * 0.1).toFixed(2) + 's"><span class="sd-step-dot" aria-hidden="true"></span>' +
        '<h4>' + st.t + '</h4><p>' + st.d + '</p></li>';
    }).join('');

    $('#overview').innerHTML =
      '<div class="container sd-overview">' +
        '<div class="sd-ov-media reveal">' +
          '<div class="sd-ov-img"><img src="' + s.img2 + '" alt="' + s.title + ' in action" loading="lazy" /></div>' +
          '<div class="sd-ov-badge"><strong>' + s.highlight.big + '</strong><span>' + s.highlight.label + '</span></div>' +
        '</div>' +
        '<div class="sd-ov-copy">' +
          '<span class="eyebrow reveal">About this service</span>' +
          '<h2 class="reveal" style="--d:.08s">' + s.overviewTitle + '</h2>' +
          paras +
          '<h3 class="sd-sub reveal">What is included</h3>' +
          '<ul class="sd-included">' + included + '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="container sd-process">' +
        '<div class="sd-process-head reveal">' +
          '<span class="eyebrow">How it works</span>' +
          '<h3>Four simple steps from start to finish</h3>' +
        '</div>' +
        '<ol class="sd-steps">' + steps + '</ol>' +
      '</div>';
  }

  function renderWhy(s) {
    var cards = s.why.map(function (w, i) {
      return '<article class="sd-why tap-card reveal" style="--d:' + (i * 0.1 + 0.05).toFixed(2) + 's">' +
        '<span class="sd-why-no">0' + (i + 1) + '</span>' +
        '<span class="sd-why-icon"><i data-lucide="' + w.icon + '" class="icon"></i></span>' +
        '<h3>' + w.t + '</h3><p>' + w.d + '</p></article>';
    }).join('');

    $('#why').innerHTML =
      '<div class="container">' +
        '<div class="section-head reveal">' +
          '<span class="eyebrow">Why choose this service</span>' +
          '<h2>Why customers choose our ' + s.title.toLowerCase() + '</h2>' +
          '<p>Four reasons families come back to us again and again.</p>' +
        '</div>' +
        '<div class="sd-bento">' +
          '<article class="sd-hl reveal">' +
            '<span class="sd-hl-circle sd-hl-circle-1" aria-hidden="true"></span>' +
            '<span class="sd-hl-circle sd-hl-circle-2" aria-hidden="true"></span>' +
            '<i data-lucide="' + s.icon + '" class="icon"></i>' +
            '<div class="sd-hl-big">' + s.highlight.big + '</div>' +
            '<div class="sd-hl-label">' + s.highlight.label + '</div>' +
            '<p>' + s.tagline + '</p>' +
            '<a href="' + contactLink() + '" class="btn btn-primary">Get Started <i data-lucide="arrow-right" class="icon-sm flip"></i></a>' +
          '</article>' +
          cards +
        '</div>' +
      '</div>';
  }

  function renderPricing(s) {
    var plans = s.plans.map(function (p, i) {
      var features = p.features.map(function (f) {
        return '<li><i data-lucide="check" class="icon-sm"></i><span>' + f + '</span></li>';
      }).join('');
      return '<article class="sd-plan tap-card reveal' + (p.popular ? ' is-popular' : '') + '" style="--d:' + (i * 0.1 + 0.05).toFixed(2) + 's">' +
        (p.popular ? '<span class="tag sd-plan-flag">Most Popular</span>' : '') +
        '<h3 class="sd-plan-name">' + p.name + '</h3>' +
        '<p class="sd-plan-desc">' + p.desc + '</p>' +
        '<div class="sd-plan-price"><strong>' + p.price + '</strong><span>' + p.note + '</span></div>' +
        '<ul class="sd-plan-list">' + features + '</ul>' +
        '<a href="' + contactLink('&plan=' + encodeURIComponent(p.name)) + '" class="btn ' + (p.popular ? 'btn-primary' : 'btn-secondary') + ' btn-block">' + p.cta + '</a>' +
      '</article>';
    }).join('');

    $('#pricing').innerHTML =
      '<div class="container">' +
        '<div class="section-head reveal">' +
          '<span class="eyebrow">Pricing</span>' +
          '<h2>Simple, transparent pricing</h2>' +
          '<p>Clear prices for ' + s.title.toLowerCase() + ', with no hidden extras.</p>' +
        '</div>' +
        '<div class="sd-plans">' + plans + '</div>' +
        '<p class="sd-pricing-note reveal">Prices are starting points and may vary with your space and requirements. ' +
          '<a href="' + contactLink() + '">Ask us for an exact quote</a>.</p>' +
      '</div>';
  }

  function renderFaq(s) {
    var items = s.faqs.map(function (f, i) {
      var open = i === 0;
      return '<div class="sd-faq-item' + (open ? ' is-open' : '') + '">' +
        '<h3><button class="sd-faq-q" type="button" id="sdq' + i + '" aria-expanded="' + open + '" aria-controls="sda' + i + '">' +
          '<span>' + f.q + '</span><i data-lucide="plus" class="icon-sm"></i></button></h3>' +
        '<div class="sd-faq-a" id="sda' + i + '" role="region" aria-labelledby="sdq' + i + '"><div><p>' + f.a + '</p></div></div>' +
      '</div>';
    }).join('');

    $('#faq').innerHTML =
      '<div class="container sd-faq">' +
        '<div class="sd-faq-side">' +
          '<span class="eyebrow reveal">FAQs</span>' +
          '<h2 class="reveal" style="--d:.1s">Questions about ' + s.title.toLowerCase() + '</h2>' +
          '<p class="reveal" style="--d:.2s">Everything you might want to know before you book. Cannot find your answer? Send us a message.</p>' +
          '<a href="' + contactLink() + '" class="btn btn-secondary reveal" style="--d:.3s">Ask a Question</a>' +
        '</div>' +
        '<div class="sd-faq-list reveal" style="--d:.12s">' + items + '</div>' +
      '</div>';
  }

  function renderCta(s) {
    var others = SERVICES.filter(function (o) { return o.slug !== s.slug; }).map(function (o) {
      return '<li><a class="sd-other" href="service-detail.html?service=' + o.slug + '">' +
        '<span class="sd-other-icon"><i data-lucide="' + o.icon + '" class="icon-sm"></i></span>' +
        '<span>' + o.title + '</span><i data-lucide="arrow-right" class="icon-sm"></i></a></li>';
    }).join('');

    $('#cta').innerHTML =
      '<div class="container">' +
        '<div class="sd-cta reveal">' +
          '<span class="sd-cta-glow" aria-hidden="true"></span>' +
          '<span class="sd-cta-ring" aria-hidden="true"></span>' +
          '<div class="sd-cta-copy">' +
            '<span class="sd-cta-eyebrow"><i data-lucide="' + s.icon + '" class="icon-sm"></i> ' + s.title + '</span>' +
            '<h2>' + s.cta.title + '</h2>' +
            '<p>' + s.cta.text + '</p>' +
            '<div class="btn-row">' +
              '<a href="' + contactLink() + '" class="btn btn-primary">Book This Service</a>' +
              '<a href="tel:+919876543210" class="btn btn-light"><i data-lucide="phone" class="icon-sm"></i> +91 98765 43210</a>' +
            '</div>' +
          '</div>' +
          '<div class="sd-others">' +
            '<h3>Explore other services</h3>' +
            '<ul>' + others + '</ul>' +
            '<a href="service.html" class="sd-all"><i data-lucide="arrow-left" class="icon-sm flip"></i> Back to all services</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ---------- Update page title + description ---------- */
  document.title = service.title + ' | UrbanHaven Services';
  var metaDesc = $('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', service.title + ' at UrbanHaven: ' + service.tagline);

  renderHero(service);
  renderOverview(service);
  renderWhy(service);
  renderPricing(service);
  renderFaq(service);
  renderCta(service);
  renderIcons();
  window.addEventListener('load', renderIcons);

  /* =======================================================
     Header / theme / menu behaviour (shared look with site)
     ======================================================= */

  /* ---------- Active navigation link (Services stays active) ---------- */
  var currentPath = window.location.pathname.replace(/\/+$/, '') || '/index.html';
  if (currentPath === '/') currentPath = '/index.html';
  if (/service-detail\.html$/.test(currentPath)) currentPath = currentPath.replace('service-detail.html', 'service.html');
  var navLinks = $$('.main-nav a[href]').filter(function (link) {
    return !link.closest('.mobile-cta');
  });
  navLinks.forEach(function (link) {
    var linkPath = new URL(link.getAttribute('href'), window.location.href).pathname.replace(/\/+$/, '') || '/index.html';
    if (linkPath === '/') linkPath = '/index.html';
    var active = linkPath === currentPath;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  var homeDropdown = $('.nav-dropdown details');
  if (homeDropdown) {
    homeDropdown.querySelector('.nav-dropdown-toggle').classList.toggle(
      'active',
      !!homeDropdown.querySelector('.nav-dropdown-menu a.active')
    );
  }

  /* ---------- Dark / light mode ---------- */
  var themeBtn = $('#themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('uh-theme', next);
    });
  }

  /* ---------- RTL toggle ---------- */
  var rtlBtn = $('#rtlToggle');
  if (rtlBtn) {
    rtlBtn.addEventListener('click', function () {
      var next = root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      root.setAttribute('dir', next);
      store('uh-dir', next);
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('#menuToggle');
  var nav = $('#mainNav');
  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100) setMenu(false); });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = $('#siteHeader');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 10); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Scroll reveal (runs on the freshly rendered content) ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- FAQ accordion (one open at a time) ---------- */
  var faqList = $('.sd-faq-list');
  if (faqList) {
    faqList.addEventListener('click', function (e) {
      var btn = e.target.closest('.sd-faq-q');
      if (!btn) return;
      var item = btn.closest('.sd-faq-item');
      var willOpen = !item.classList.contains('is-open');
      $$('.sd-faq-item', faqList).forEach(function (other) {
        var open = other === item ? willOpen : false;
        other.classList.toggle('is-open', open);
        $('.sd-faq-q', other).setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ---------- Image fallback if a photo fails to load ---------- */
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    var box = img.closest('.sd-ov-img, .sd-hero-bg');
    if (box) box.classList.add('img-failed');
  }, true);

  /* ---------- Touch devices: tap state instead of hover ---------- */
  if (!canHover) {
    var cards = $$('.tap-card');
    cards.forEach(function (c) {
      c.addEventListener('touchstart', function () {
        cards.forEach(function (o) { if (o !== c) o.classList.remove('is-active'); });
        c.classList.add('is-active');
      }, { passive: true });
    });
    document.addEventListener('touchstart', function (e) {
      if (!e.target.closest('.tap-card')) cards.forEach(function (o) { o.classList.remove('is-active'); });
    }, { passive: true });
  }

  /* ---------- Footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();