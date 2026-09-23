/**
 * SYNCRA / KRONO - Business Dashboard SaaS Workspace Script
 * FullCalendar.js + Chart.js + Dynamic Tabs + Data Tables
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardSidebar();
  initDashboardTabs();
  initOverviewCharts();
  initFullCalendar();
  initAppointmentsTable();
  initRemindersEditor();
  initBillingSliders();
});

// 1. Dashboard Mobile Sidebar & Drawer Toggle (<= 1024px)
function initDashboardSidebar() {
  const sidebar = document.getElementById('dashSidebar');
  const overlay = document.getElementById('dashSidebarOverlay');
  const toggleBtn = document.getElementById('dashMobileToggle');
  const closeBtn = document.getElementById('closeDashSidebar');

  if (!sidebar) return;

  function openSidebar() {
    sidebar.classList.add('mobile-open');
    if (overlay) overlay.classList.add('active');
  }

  function closeSidebar() {
    sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);
}

// 2. Tab Navigation inside Dashboard Workspace
function initDashboardTabs() {
  const navItems = document.querySelectorAll('.dash-nav-item[data-tab]');
  const views = document.querySelectorAll('.dash-tab-pane');
  const pageTitle = document.getElementById('dashCurrentViewTitle');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      views.forEach(view => {
        if (view.id === `tab-${targetTab}`) {
          view.classList.remove('d-none');
        } else {
          view.classList.add('d-none');
        }
      });

      if (pageTitle) {
        pageTitle.textContent = item.querySelector('.dash-nav-label')?.textContent || 'Dashboard';
      }

      // If opening Calendar, trigger resize so FullCalendar renders correctly
      if (targetTab === 'calendar' && window.calendarInstance) {
        setTimeout(() => {
          window.calendarInstance.render();
        }, 100);
      }

      // Close mobile drawer if open
      const sidebar = document.getElementById('dashSidebar');
      const overlay = document.getElementById('dashSidebarOverlay');
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('active');
      }
    });
  });
}

// 3. Overview Charts (Chart.js)
function initOverviewCharts() {
  const ctxWeekly = document.getElementById('weeklyBookingsChart');
  if (ctxWeekly && window.Chart) {
    new Chart(ctxWeekly, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Confirmed Appointments',
            data: [28, 35, 42, 38, 45, 52, 30],
            backgroundColor: '#FF6B5F',
            borderRadius: 6,
            barThickness: 22,
          },
          {
            label: 'Automated Reminders Sent',
            data: [32, 40, 48, 44, 50, 58, 34],
            backgroundColor: '#B9DED1',
            borderRadius: 6,
            barThickness: 22,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600' },
              color: '#17191C'
            }
          },
          tooltip: {
            backgroundColor: '#17191C',
            titleFont: { family: "'Space Grotesk', sans-serif" },
            bodyFont: { family: "'Plus Jakarta Sans', sans-serif" },
            cornerRadius: 8,
            padding: 12
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(228, 225, 215, 0.6)' },
            ticks: { color: '#68717C', font: { family: "'Plus Jakarta Sans', sans-serif" } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#68717C', font: { family: "'Plus Jakarta Sans', sans-serif" } }
          }
        }
      }
    });
  }

  // Analytics tab charts
  const ctxRevenue = document.getElementById('revenueTrendChart');
  if (ctxRevenue && window.Chart) {
    new Chart(ctxRevenue, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
          label: 'Revenue ($)',
          data: [8200, 10400, 12300, 14100, 13800, 16200, 17500, 18420, 21500],
          borderColor: '#17191C',
          backgroundColor: 'rgba(255, 107, 95, 0.1)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointBackgroundColor: '#FF6B5F',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            grid: { color: 'rgba(228, 225, 215, 0.6)' },
            ticks: { color: '#68717C', callback: (val) => `$${val/1000}k` }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#68717C' }
          }
        }
      }
    });
  }

  // Peak Booking Hours Chart
  const ctxPeak = document.getElementById('peakHoursChart');
  if (ctxPeak && window.Chart) {
    new Chart(ctxPeak, {
      type: 'doughnut',
      data: {
        labels: ['Morning (8AM-12PM)', 'Afternoon (12PM-4PM)', 'Evening (4PM-8PM)'],
        datasets: [{
          data: [45, 35, 20],
          backgroundColor: ['#17191C', '#FF6B5F', '#B9DED1'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        cutout: '72%'
      }
    });
  }
}

// 4. FullCalendar.js Integration
function initFullCalendar() {
  const calendarEl = document.getElementById('kronoFullCalendar');
  if (!calendarEl || !window.FullCalendar) return;

  const todayStr = new Date().toISOString().replace(/T.*$/, '');

  window.calendarInstance = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: false,
    nowIndicator: true,
    navLinks: true,
    selectable: true,
    selectMirror: true,
    editable: true,
    dayMaxEvents: true,
    events: [
      {
        id: '1',
        title: 'Executive Strategy Audit - Sophia M.',
        start: todayStr + 'T09:00:00',
        end: todayStr + 'T10:00:00',
        className: 'fc-event-coral',
        extendedProps: { client: 'Sophia Martinez', staff: 'Dr. Evelyn Reed', status: 'Confirmed', price: '$180' }
      },
      {
        id: '2',
        title: 'Quarterly Team Sync - All Staff',
        start: todayStr + 'T10:30:00',
        end: todayStr + 'T11:30:00',
        className: 'fc-event-dark',
        extendedProps: { client: 'Internal Team', staff: 'All Staff', status: 'Internal', price: '-' }
      },
      {
        id: '3',
        title: 'Client Intake - Liam Vance',
        start: todayStr + 'T14:00:00',
        end: todayStr + 'T15:00:00',
        className: 'fc-event-mint',
        extendedProps: { client: 'Liam Vance', staff: 'Marcus Chen', status: 'Confirmed', price: '$120' }
      },
      {
        id: '4',
        title: 'Product Demonstration - David Kim',
        start: todayStr + 'T16:00:00',
        end: todayStr + 'T16:45:00',
        className: 'fc-event-purple',
        extendedProps: { client: 'David Kim', staff: 'Chloe Laurent', status: 'In Progress', price: '$95' }
      }
    ],
    select: function(arg) {
      const title = prompt('Enter Appointment Title:');
      if (title) {
        window.calendarInstance.addEvent({
          title: title,
          start: arg.start,
          end: arg.end,
          allDay: arg.allDay,
          className: 'fc-event-coral'
        });
      }
      window.calendarInstance.unselect();
    },
    eventClick: function(info) {
      alert(`Appointment: ${info.event.title}\nClient: ${info.event.extendedProps.client || 'N/A'}\nStaff: ${info.event.extendedProps.staff || 'N/A'}\nStatus: ${info.event.extendedProps.status || 'Confirmed'}`);
    }
  });

  window.calendarInstance.render();
}

// 5. Appointments Management Filter & Search
function initAppointmentsTable() {
  const searchInput = document.getElementById('appointmentSearchInput');
  const filterPills = document.querySelectorAll('.appt-filter-pill');
  const rows = document.querySelectorAll('.appointment-data-row');

  if (!rows.length) return;

  function filterTable() {
    const query = (searchInput?.value || '').toLowerCase();
    const activeFilter = document.querySelector('.appt-filter-pill.active')?.getAttribute('data-status') || 'all';

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const status = row.getAttribute('data-status') || '';

      const matchesSearch = text.includes(query);
      const matchesFilter = activeFilter === 'all' || status === activeFilter;

      if (matchesSearch && matchesFilter) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterTable);
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterTable();
    });
  });
}

// 6. Reminders Template Live Editor
function initRemindersEditor() {
  const smsTemplateSelect = document.getElementById('reminderTemplateSelect');
  const smsTextArea = document.getElementById('reminderCustomMessage');
  const previewBox = document.getElementById('reminderLiveSmsPreview');

  const templates = {
    standard: "Hi {client_name}, your appointment with {staff_name} is confirmed for {appointment_time}. Reply 1 to Confirm or 2 to Reschedule.",
    urgent: "Reminder: You have an appointment tomorrow at {appointment_time} at Syncra Clinic. Please arrive 10 min early with ID.",
    followup: "Thank you for visiting us today, {client_name}! How was your experience? Rate us: {feedback_link}"
  };

  if (smsTemplateSelect && smsTextArea && previewBox) {
    smsTemplateSelect.addEventListener('change', () => {
      const selected = smsTemplateSelect.value;
      if (templates[selected]) {
        smsTextArea.value = templates[selected];
        updatePreview();
      }
    });

    smsTextArea.addEventListener('input', updatePreview);

    function updatePreview() {
      let text = smsTextArea.value;
      text = text.replace('{client_name}', 'Sophia Martinez')
                 .replace('{staff_name}', 'Dr. Evelyn Reed')
                 .replace('{appointment_time}', 'Today at 2:30 PM')
                 .replace('{feedback_link}', 'syncra.app/r/8492');
      previewBox.textContent = text;
    }
  }
}

// 7. Billing Usage & Plan Upgrades Simulator
function initBillingSliders() {
  const upgradeBtns = document.querySelectorAll('.btn-upgrade-plan');
  upgradeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan') || 'Enterprise';
      alert(`Thank you! Your workspace has been upgraded to the ${planName} Plan with unlimited staff members & priority SMS delivery.`);
    });
  });
}
