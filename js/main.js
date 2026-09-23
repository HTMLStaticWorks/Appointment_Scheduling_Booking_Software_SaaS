/**
 * SYNCRA / KRONO - Main Application & Interactive Components Script
 * Includes: Theme Manager (Dark/Light), RTL Direction Switcher, Mobile Drawer,
 * Interactive Calendar Simulator, Pipeline Stepper, Industry Switcher, ROI Calculator.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initRTLToggle();
  initNavbarScroll();
  initMobileDrawer();
  initHeroInteractiveCalendar();
  initPipelineStepper();
  initIndustrySwitcher();
  initPricingToggle();
  initRoiCalculator();
  initBookingModal();
  initLucideIcons();
});

// 1. Theme Manager (Dark / Light mode with localStorage persistence)
function initThemeToggle() {
  const savedTheme = localStorage.getItem('krono_theme') || 'light';
  applyTheme(savedTheme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('krono_theme', newTheme);
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
    document.querySelectorAll('.theme-toggle-btn i').forEach(icon => {
      icon.className = 'bi bi-sun-fill text-warning';
    });
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
    document.querySelectorAll('.theme-toggle-btn i').forEach(icon => {
      icon.className = 'bi bi-moon-stars';
    });
  }
}

// 2. RTL Direction Switcher (LTR / RTL toggle with localStorage persistence)
function initRTLToggle() {
  const savedDir = localStorage.getItem('krono_dir') || 'ltr';
  applyRTL(savedDir);

  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyRTL(newDir);
      localStorage.setItem('krono_dir', newDir);
    });
  });
}

function applyRTL(dir) {
  if (dir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.setAttribute('dir', 'rtl');
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.classList.add('active-rtl');
      btn.style.borderColor = '#FF6B5F';
    });
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.body.setAttribute('dir', 'ltr');
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.classList.remove('active-rtl');
      btn.style.borderColor = '';
    });
  }
}

// 3. Initialize Lucide icons if loaded
function initLucideIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

// 4. Sticky Navbar Dynamic Scrolled State
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 5. Responsive Mobile / Tablet / 1024px Drawer
function initMobileDrawer() {
  const openBtn = document.getElementById('openMobileNav');
  const closeBtn = document.getElementById('closeMobileNav');
  const drawer = document.getElementById('mobileNavDrawer');
  const overlay = document.getElementById('mobileNavOverlay');

  if (!drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// 6. Signature Homepage Interactive Hero Calendar
function initHeroInteractiveCalendar() {
  const slotAvailable = document.getElementById('heroSlotAvailable');
  const heroLiveTime = document.getElementById('heroLiveTime');
  const heroNotifyPill = document.getElementById('heroNotifyPill');

  if (heroLiveTime) {
    const updateTime = () => {
      const now = new Date();
      heroLiveTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  if (!slotAvailable) return;

  let bookedCount = 0;
  const sampleClients = [
    { name: "Sophia Martinez", service: "Strategy Audit", tag: "VIP Client", color: "#1E6B52", bg: "#EAF8F3" },
    { name: "Liam Vance", service: "Product Onboarding", tag: "New Lead", color: "#4C1D95", bg: "#EDE9FE" },
    { name: "Elena Rostova", service: "Executive Coaching", tag: "Retainer", color: "#B45309", bg: "#FEF3C7" }
  ];

  setInterval(() => {
    if (!slotAvailable) return;
    const client = sampleClients[bookedCount % sampleClients.length];
    bookedCount++;

    slotAvailable.style.transition = 'all 0.4s ease';
    slotAvailable.style.backgroundColor = client.bg;
    slotAvailable.style.borderColor = client.color;
    slotAvailable.innerHTML = `
      <div class="slot-client-info">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: ${client.color}; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;">
          ${client.name.split(' ').map(n=>n[0]).join('')}
        </div>
        <div>
          <div style="font-weight: 700; font-size: 0.9rem;">${client.service}</div>
          <div style="font-size: 0.775rem; color: var(--color-slate); opacity: 0.9;">with ${client.name}</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="slot-badge" style="background: ${client.color}; color: white;">${client.tag}</span>
        <span style="font-size: 0.75rem; color: #1E6B52; font-weight: 700;">✓ Synced</span>
      </div>
    `;

    if (heroNotifyPill) {
      heroNotifyPill.innerHTML = `<i class="bi bi-bell-fill" style="color: #FF6B5F;"></i> Slot filled: <strong>${client.name}</strong> (${client.service})`;
      heroNotifyPill.style.transform = 'translateY(-4px)';
      setTimeout(() => {
        heroNotifyPill.style.transform = 'translateY(0)';
      }, 400);
    }

    setTimeout(() => {
      if (!slotAvailable) return;
      slotAvailable.style.backgroundColor = '';
      slotAvailable.style.borderColor = '#FF6B5F';
      slotAvailable.innerHTML = `
        <div class="slot-client-info">
          <div style="width: 32px; height: 32px; border-radius: 50%; border: 2px dashed #FF6B5F; display: flex; align-items: center; justify-content: center; color: #FF6B5F; font-size: 0.9rem;">
            +
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.9rem; color: #FF6B5F;">Available for Auto-Booking</div>
            <div style="font-size: 0.775rem; color: var(--color-slate); opacity: 0.9;">AI Smart Match Active</div>
          </div>
        </div>
        <button class="btn btn-sm" style="background: #FF6B5F; color: white; border-radius: 20px; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem;" onclick="openQuickBookModal('12:00 PM')">
          Instant Book
        </button>
      `;
    }, 4500);

  }, 8000);
}

// 7. Smart Scheduling Engine Pipeline Visualizer
function initPipelineStepper() {
  const steps = document.querySelectorAll('.pipeline-step-card');
  if (!steps.length) return;

  let currentIdx = 0;
  setInterval(() => {
    steps.forEach((s, idx) => {
      if (idx === currentIdx) {
        s.classList.add('active-step');
      } else {
        s.classList.remove('active-step');
      }
    });
    currentIdx = (currentIdx + 1) % steps.length;
  }, 3000);
}

// 8. Dynamic Industry Switcher
const industryData = {
  healthcare: {
    title: "Healthcare & Specialized Clinics",
    badge: "HIPAA Compliant & Intake Automation",
    description: "Automate patient triage, pre-consultation questionnaires, medical staff room assignments, and zero-show SMS appointment confirmations.",
    metrics: ["99.4% Attendance Rate", "8.2 hrs Saved/Dr/Week", "2-Way EHR Calendar Sync"],
    services: [
      { name: "General Consultation", duration: "30 min", price: "$120", staff: "Dr. Evelyn Reed", icon: "bi-heart-pulse-fill" },
      { name: "Diagnostic Follow-up", duration: "15 min", price: "$75", staff: "Dr. Marcus Chen", icon: "bi-clipboard2-pulse-fill" },
      { name: "Telehealth Video Session", duration: "45 min", price: "$150", staff: "Dr. Evelyn Reed", icon: "bi-camera-video-fill" }
    ],
    features: ["Pre-visit medical intake forms", "Automated HIPAA compliant SMS reminders", "Buffer time between patient sanitizations", "Multi-location clinic scheduling"]
  },
  beauty: {
    title: "Salons, Spas & Aesthetic Studios",
    badge: "Stylist Selection & Add-on Upsells",
    description: "Enable clients to pick their favorite stylist, add spa treatments during checkout, require non-refundable deposits, and eliminate double bookings.",
    metrics: ["+42% Average Ticket Size", "Zero Double-Bookings", "Auto Re-booking Reminders"],
    services: [
      { name: "Balayage & Precision Cut", duration: "120 min", price: "$195", staff: "Chloe Laurent (Master Stylist)", icon: "bi-scissors" },
      { name: "Hydrating Facial Treatment", duration: "60 min", price: "$110", staff: "Jessica Day (Esthetician)", icon: "bi-stars" },
      { name: "Signature Gel Manicure", duration: "45 min", price: "$65", staff: "Sora Kim", icon: "bi-gem" }
    ],
    features: ["Stylist chair & equipment allocation", "Custom deposit & prepayment rules", "Add-on treatment upselling at checkout", "Instagram & Google Booking button integration"]
  },
  fitness: {
    title: "Fitness Studios, Gyms & Personal Trainers",
    badge: "Class Capacities & Recurring Passes",
    description: "Manage group class rosters, spot reservations, 1-on-1 PT coaching packs, waitlist auto-promotion, and recurring membership sync seamlessly.",
    metrics: ["100% Class Occupancy", "Waitlist Auto-Fill in < 2 mins", "Stripe Auto-Billing"],
    services: [
      { name: "HIIT Performance Bootcamp", duration: "50 min", price: "$30 / spot", staff: "Coach Dave Miller", icon: "bi-lightning-charge-fill" },
      { name: "1-on-1 Strength Coaching", duration: "60 min", price: "$90", staff: "Sarah Jenkins, CPT", icon: "bi-fire" },
      { name: "Reformer Pilates Class", duration: "55 min", price: "$35 / spot", staff: "Mia Lindqvist", icon: "bi-activity" }
    ],
    features: ["Class capacity caps & real-time spots left", "Automated waitlist notifications via SMS", "Class pack and monthly pass redemption", "Trainer room & equipment assignments"]
  },
  consulting: {
    title: "Consulting, Legal & Financial Advisors",
    badge: "Retainers, Video Links & Timezone Sync",
    description: "Generate unique Zoom/Teams links automatically, charge for advisory consultations upfront, and sync across global client time zones effortlessly.",
    metrics: ["Instant Zoom / Google Meet Provisioning", "100% Global Timezone Accuracy", "Integrated Retainers"],
    services: [
      { name: "Strategy & M&A Consultation", duration: "60 min", price: "$450", staff: "Alexander Vance (Partner)", icon: "bi-briefcase-fill" },
      { name: "Tax & Wealth Planning Review", duration: "45 min", price: "$300", staff: "Rebecca Cole, CPA", icon: "bi-graph-up-arrow" },
      { name: "Initial Discovery Call", duration: "20 min", price: "Free", staff: "Team Lead Round-Robin", icon: "bi-telephone-fill" }
    ],
    features: ["Automated Zoom / Microsoft Teams link generation", "Smart round-robin team assignment", "Multi-currency Stripe/PayPal billing", "Custom NDA & intake agreement attachments"]
  },
  education: {
    title: "Education, Universities & Private Tutoring",
    badge: "Multi-Student Slots & Office Hours",
    description: "Empower professors, universities, language academies, and private tutors to manage office hours, 1-on-1 student reviews, and lesson materials.",
    metrics: ["98% Student Attendance", "Zero Timezone Confusion", "One-Click Rescheduling"],
    services: [
      { name: "Advanced Math Office Hours", duration: "30 min", price: "Free for Students", staff: "Prof. Daniel Green", icon: "bi-mortarboard-fill" },
      { name: "Private 1-on-1 SAT Prep", duration: "60 min", price: "$85", staff: "Emily Watson, M.Ed", icon: "bi-book-half" },
      { name: "Language Fluency Coaching", duration: "45 min", price: "$50", staff: "Jean-Luc Dupont", icon: "bi-translate" }
    ],
    features: ["Student portal with lesson history", "Google Classroom & Canvas integration", "Recurring semester schedule templates", "Automated homework submission reminders"]
  }
};

function initIndustrySwitcher() {
  const tabs = document.querySelectorAll('.industry-tab-btn');
  const previewContainer = document.getElementById('industryPreviewContainer');

  if (!tabs.length || !previewContainer) return;

  function renderIndustry(key) {
    const item = industryData[key];
    if (!item) return;

    previewContainer.innerHTML = `
      <div class="row align-items-center g-4">
        <div class="col-lg-5">
          <div class="badge-tag coral mb-3">${item.badge}</div>
          <h3 class="h2 mb-3" style="font-weight: 800;">${item.title}</h3>
          <p class="lead-lg mb-4" style="font-size: 1.05rem;">${item.description}</p>
          
          <div class="d-flex flex-wrap gap-2 mb-4">
            ${item.metrics.map(m => `
              <span class="badge-tag dark" style="font-size: 0.8rem;"><i class="bi bi-check2-circle text-coral"></i> ${m}</span>
            `).join('')}
          </div>

          <div class="d-flex flex-column gap-2 mb-4">
            ${item.features.map(f => `
              <div class="d-flex align-items-center gap-2" style="font-size: 0.9rem; font-weight: 600;">
                <i class="bi bi-shield-check" style="color: #FF6B5F; font-size: 1.1rem;"></i>
                <span>${f}</span>
              </div>
            `).join('')}
          </div>

          <a href="industries.html" class="btn-krono-primary">
            Explore ${item.title.split(' ')[0]} Workflows <i class="bi bi-arrow-right"></i>
          </a>
        </div>

        <div class="col-lg-7">
          <div class="industry-preview-window">
            <div class="preview-window-topbar">
              <div class="window-dots">
                <span class="window-dot red"></span>
                <span class="window-dot yellow"></span>
                <span class="window-dot green"></span>
              </div>
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-slate);">
                syncra.app/book/${key}-portal
              </div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #1E6B52;">
                ● Live Booking Widget
              </div>
            </div>

            <div class="p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 class="mb-0" style="font-weight: 700;">Select a Service</h5>
                  <small class="text-muted">Instant confirmation & calendar invite</small>
                </div>
                <span class="badge-tag mint" style="font-size: 0.75rem;">Timezone: Auto (EST)</span>
              </div>

              <div class="d-flex flex-column gap-3 mb-4">
                ${item.services.map((srv, idx) => `
                  <div class="p-3 border rounded-3 d-flex align-items-center justify-content-between industry-service-row" 
                       style="cursor: pointer; transition: all 0.2s;"
                       onclick="selectServicePreview(this, '${srv.name}', '${srv.price}')">
                    <div class="d-flex align-items-center gap-3">
                      <div style="width: 40px; height: 40px; border-radius: 10px; background: #FF6B5F; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                        <i class="bi ${srv.icon}"></i>
                      </div>
                      <div>
                        <div style="font-weight: 700; font-size: 0.95rem;">${srv.name}</div>
                        <div style="font-size: 0.8rem; color: var(--color-slate);"><i class="bi bi-clock"></i> ${srv.duration} • <i class="bi bi-person"></i> ${srv.staff}</div>
                      </div>
                    </div>
                    <div class="text-end">
                      <div style="font-weight: 800; font-size: 1.05rem;">${srv.price}</div>
                      <button class="btn btn-sm btn-outline-dark mt-1" style="font-size: 0.75rem; font-weight: 700; border-radius: 20px; padding: 0.2rem 0.75rem;">
                        Select Slot
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="p-3 rounded-3" style="background: rgba(185, 222, 209, 0.15); border: 1px solid rgba(185, 222, 209, 0.4); display: flex; align-items: center; justify-content: space-between;">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-lightning-charge-fill" style="color: #FF6B5F;"></i>
                  <span style="font-size: 0.85rem; font-weight: 700;">Next Available Slot: Today at 2:30 PM</span>
                </div>
                <button class="btn btn-sm" style="background: #FF6B5F; color: white; font-size: 0.8rem; font-weight: 700; border-radius: 20px;" onclick="openQuickBookModal('${item.services[0].name}')">
                  Quick Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const industryKey = tab.getAttribute('data-industry');
      renderIndustry(industryKey);
    });
  });

  renderIndustry('healthcare');
}

window.selectServicePreview = function(elem, name, price) {
  document.querySelectorAll('.industry-service-row').forEach(r => {
    r.style.borderColor = '';
    r.style.backgroundColor = '';
  });
  elem.style.borderColor = '#FF6B5F';
  elem.style.backgroundColor = 'rgba(255, 107, 95, 0.08)';
};

// 9. Pricing Toggle
function initPricingToggle() {
  const monthlyBtn = document.getElementById('pricingMonthlyBtn');
  const annualBtn = document.getElementById('pricingAnnualBtn');
  const starterPrice = document.getElementById('starterPrice');
  const proPrice = document.getElementById('proPrice');
  const busPrice = document.getElementById('busPrice');
  const periodTags = document.querySelectorAll('.pricing-period-text');

  if (!monthlyBtn || !annualBtn) return;

  function setPricing(isAnnual) {
    if (isAnnual) {
      annualBtn.classList.add('active');
      monthlyBtn.classList.remove('active');
      if (starterPrice) starterPrice.textContent = '$15';
      if (proPrice) proPrice.textContent = '$39';
      if (busPrice) busPrice.textContent = '$79';
      periodTags.forEach(p => p.textContent = '/month, billed annually');
    } else {
      monthlyBtn.classList.add('active');
      annualBtn.classList.remove('active');
      if (starterPrice) starterPrice.textContent = '$19';
      if (proPrice) proPrice.textContent = '$49';
      if (busPrice) busPrice.textContent = '$99';
      periodTags.forEach(p => p.textContent = '/month, billed monthly');
    }
  }

  monthlyBtn.addEventListener('click', () => setPricing(false));
  annualBtn.addEventListener('click', () => setPricing(true));
}

// 10. Interactive ROI Calculator
function initRoiCalculator() {
  const staffInput = document.getElementById('roiStaffCount');
  const apptInput = document.getElementById('roiApptsPerWeek');
  const hourlyRateInput = document.getElementById('roiHourlyRate');

  const staffVal = document.getElementById('roiStaffVal');
  const apptVal = document.getElementById('roiApptVal');
  const rateVal = document.getElementById('roiRateVal');

  const hoursSavedElem = document.getElementById('roiHoursSaved');
  const moneySavedElem = document.getElementById('roiMoneySaved');
  const noShowReductionElem = document.getElementById('roiNoShowVal');

  if (!staffInput || !apptInput || !hourlyRateInput) return;

  function calculateROI() {
    const staff = parseInt(staffInput.value) || 1;
    const appts = parseInt(apptInput.value) || 20;
    const rate = parseInt(hourlyRateInput.value) || 60;

    if (staffVal) staffVal.textContent = staff;
    if (apptVal) apptVal.textContent = appts;
    if (rateVal) rateVal.textContent = `$${rate}/hr`;

    const weeklyHoursSaved = Math.round(appts * 0.2 * staff);
    const monthlyHoursSaved = weeklyHoursSaved * 4;
    const monthlySavings = monthlyHoursSaved * rate;
    const noShowRecovered = Math.round(appts * 0.15 * 80 * staff);

    if (hoursSavedElem) hoursSavedElem.textContent = `${monthlyHoursSaved} hrs/mo`;
    if (moneySavedElem) moneySavedElem.textContent = `$${monthlySavings.toLocaleString()}/mo`;
    if (noShowReductionElem) noShowReductionElem.textContent = `$${noShowRecovered.toLocaleString()}/mo`;
  }

  staffInput.addEventListener('input', calculateROI);
  apptInput.addEventListener('input', calculateROI);
  hourlyRateInput.addEventListener('input', calculateROI);

  calculateROI();
}

// 11. Booking Modal Simulator
function initBookingModal() {
  const modal = document.getElementById('kronoBookingModal');
  const closeBtns = document.querySelectorAll('.close-booking-modal');

  if (!modal) return;

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  const submitBtn = document.getElementById('submitBookingDemoBtn');
  const formArea = document.getElementById('modalBookingForm');
  const successArea = document.getElementById('modalBookingSuccess');

  if (submitBtn && formArea && successArea) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Confirming with AI Engine...`;

      setTimeout(() => {
        formArea.style.display = 'none';
        successArea.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Book Another`;
      }, 1200);
    });
  }
}

window.openQuickBookModal = function(serviceOrTime) {
  const modal = document.getElementById('kronoBookingModal');
  const inputService = document.getElementById('modalServiceName');
  const formArea = document.getElementById('modalBookingForm');
  const successArea = document.getElementById('modalBookingSuccess');

  if (inputService && serviceOrTime) {
    inputService.value = serviceOrTime;
  }
  if (formArea) formArea.style.display = 'block';
  if (successArea) successArea.style.display = 'none';

  if (modal) {
    modal.classList.add('active');
  }
};
