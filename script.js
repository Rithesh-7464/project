const API_URL = "https://project-o2h0.onrender.com/";


const eventsContainer = document.getElementById("eventsContainer");
const registrationsContainer = document.getElementById("registrationsContainer");
const eventSelect = document.getElementById("eventSelect");
const registrationCount = document.getElementById("registrationCount");

// const eventForm = document.getElementById("eventForm"); // Removed
const registerForm = document.getElementById("registerForm");

// =========================
// INITIAL LOAD
// =========================
window.addEventListener("DOMContentLoaded", async () => {
  showEventsLoading();
  showRegistrationsLoading();

  await fetchEvents();
  await fetchRegistrations();
});

// =========================
// EVENTS LOADING UI
// =========================
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

// =========================
// FETCH EVENTS
// =========================
async function fetchEvents() {
  try {
    const res = await fetch(`${API_URL}/api/events`);
    const events = await res.json();

    eventsContainer.innerHTML = "";
    eventSelect.innerHTML = `<option value="">Select Event</option>`;

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
    console.error("Error fetching events:", error);
    eventsContainer.innerHTML = `
      <div class="event-card">
        <h3>Unable to Load Events</h3>
        <p>Please check if your backend is running correctly.</p>
      </div>
    `;
  }
}

// =========================
// RENDER EVENT CARD
// =========================
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

// =========================
// ADD EVENT TO DROPDOWN
// =========================
function renderEventOption(event) {
  const option = document.createElement("option");
  option.value = event.id;
  option.textContent = `${event.title} (${formatDate(event.date)})`;
  eventSelect.appendChild(option);
}

// =========================
// FETCH REGISTRATIONS
// =========================
async function fetchRegistrations() {
  try {
    const res = await fetch(`${API_URL}/api/registrations`);
    const registrations = await res.json();

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
    console.error("Error fetching registrations:", error);
    registrationsContainer.innerHTML = `
      <div class="registration-card">
        <h4>Unable to Load Registrations</h4>
        <p>Please check if your backend is running correctly.</p>
      </div>
    `;
  }
}

// =========================
// RENDER REGISTRATION CARD
// =========================
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

// =========================
// REGISTER STUDENT
// =========================
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const registration = {
    studentName: document.getElementById("studentName").value.trim(),
    email: document.getElementById("email").value.trim(),
    eventId: document.getElementById("eventSelect").value
  };

  if (!registration.studentName || !registration.email || !registration.eventId) {
    alert("Please fill in all registration fields.");
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
      alert("Registration successful!");
      registerForm.reset();
      await fetchRegistrations();
    } else {
      alert(data.message || "Failed to register.");
    }
  } catch (error) {
    console.error("Error registering student:", error);
    alert("Server error while registering.");
  }
});

// =========================
// DATE FORMATTER
// =========================
function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}