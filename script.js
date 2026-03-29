// ENVIRONMENT & API CONFIGURATION

// Determine API URL based on hostname
let API_URL = "https://project-o2h0.onrender.com"; // Production Render backend
let ENV = "production";

// Local development detection
if (window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname === '::1') {
  API_URL = "http://localhost:5000";
  ENV = "development";
}

// GitHub Pages detection - use production backend
if (window.location.hostname.includes('github.io')) {
  API_URL = "https://project-o2h0.onrender.com";
  ENV = "production (GitHub Pages)";
}

// Additional debug info
console.log("═══════════════════════════════════");
console.log("🚀 Environment:", ENV);
console.log("🌐 Hostname:", window.location.hostname);
console.log("🔗 API URL:", API_URL);
console.log("📍 Page URL:", window.location.href);
console.log("═══════════════════════════════════");


const eventsContainer = document.getElementById("eventsContainer");
const registrationsContainer = document.getElementById("registrationsContainer");
const eventSelect = document.getElementById("eventSelect");
const registrationCount = document.getElementById("registrationCount");
const eventCount = document.getElementById("eventCount");

// const eventForm = document.getElementById("eventForm"); // Removed
const registerForm = document.getElementById("registerForm");


// NOTIFICATION TOAST SYSTEM

function showNotification(message, type = 'success') {
  const container = document.getElementById('notificationContainer');
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  container.appendChild(notification);

  // Close button handler
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.remove();
  });

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}


// INITIAL LOAD
window.addEventListener("DOMContentLoaded", async () => {
  showEventsLoading();
  showRegistrationsLoading();

  await fetchEvents();
  await fetchRegistrations();
});


// EVENTS LOADING UI

function showEventsLoading() {
  eventsContainer.innerHTML = `
    <div class="event-card"><p>Loading events...</p></div>
    <div class="event-card"><p>Loading events...</p></div>
    <div class="event-card"><p>Loading events...</p></div>
  `;
}

function showRegistrationsLoading() {
  registrationsContainer.innerHTML = `
    <div class="registration-card"><p>Loading registrations...</p></div>
  `;
}


// FETCH EVENTS

async function fetchEvents() {
  try {
    console.log("📡 Fetching events from:", `${API_URL}/api/events`);
    const res = await fetch(`${API_URL}/api/events`);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const events = await res.json();
    console.log("✓ Events loaded:", events.length, "events");

    eventsContainer.innerHTML = "";
    eventSelect.innerHTML = `<option value="">Select Event</option>`;
    
    // Update event count
    eventCount.textContent = events.length;

    if (!events.length) {
      eventsContainer.innerHTML = `
        <div class="event-card">
          <h3>No Events Available</h3>
          <p>No events have been added yet. Please contact your college organizer.</p>
        </div>
      `;
      return;
    }

    events.forEach((event) => {
      renderEventCard(event);
      renderEventOption(event);
    });
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    eventsContainer.innerHTML = `
      <div class="event-card">
        <h3>Unable to Load Events</h3>
        <p>Error: ${error.message}</p>
        <p>Backend URL: ${API_URL}</p>
        <p>Please check your network or contact support.</p>
      </div>
    `;
  }
}


// RENDER EVENT CARD

function renderEventCard(event) {
  const card = document.createElement("div");
  card.className = "event-card";

  card.innerHTML = `
    <span class="badge">${event.category}</span>
    <h3>${event.title}</h3>
    <p><strong>Date:</strong> ${formatDate(event.date)}</p>
    <p><strong>Venue:</strong> ${event.venue}</p>
    <p>${event.description}</p>
  `;

  eventsContainer.appendChild(card);
}


// ADD EVENT TO DROPDOWN

function renderEventOption(event) {
  const option = document.createElement("option");
  option.value = event.id;
  option.textContent = `${event.title} (${formatDate(event.date)})`;
  eventSelect.appendChild(option);
}


// FETCH REGISTRATIONS

async function fetchRegistrations() {
  try {
    console.log("📡 Fetching registrations from:", `${API_URL}/api/registrations`);
    const res = await fetch(`${API_URL}/api/registrations`);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const registrations = await res.json();
    console.log("✓ Registrations loaded:", registrations.length);

    registrationsContainer.innerHTML = "";
    registrationCount.textContent = registrations.length;

    if (!registrations.length) {
      registrationsContainer.innerHTML = `
        <div class="registration-card">
          <h4>No Registrations Yet</h4>
          <p>Students who register for events will appear here.</p>
        </div>
      `;
      return;
    }

    registrations.forEach((registration) => {
      renderRegistrationCard(registration);
    });
  } catch (error) {
    console.error("❌ Error fetching registrations:", error);
    registrationsContainer.innerHTML = `
      <div class="registration-card">
        <h4>Unable to Load Registrations</h4>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}


// RENDER REGISTRATION CARD

function renderRegistrationCard(registration) {
  const card = document.createElement("div");
  card.className = "registration-card";

  card.innerHTML = `
    <h4>${registration.studentName}</h4>
    <p><strong>Email:</strong> ${registration.email}</p>
    <p><strong>Registered For:</strong> ${registration.eventTitle}</p>
  `;

  registrationsContainer.appendChild(card);
}


// REGISTER STUDENT

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const registration = {
    studentName: document.getElementById("studentName").value.trim(),
    email: document.getElementById("email").value.trim(),
    eventId: document.getElementById("eventSelect").value
  };

  if (!registration.studentName || !registration.email || !registration.eventId) {
    showNotification("Please fill in all registration fields.", 'error');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registration)
    });

    const data = await res.json();

    if (res.ok) {
      showNotification("✓ Registration successful! Thank you for registering.", 'success');
      registerForm.reset();
      await fetchRegistrations();
    } else {
      showNotification(data.message || "Failed to register.", 'error');
    }
  } catch (error) {
    console.error("Error registering student:", error);
    showNotification("Server error while registering.", 'error');
  }
});


// DATE FORMATTER

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}