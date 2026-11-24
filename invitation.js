// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE ONLY — every text, date and photo on the site
//  comes from here.
// ─────────────────────────────────────────────────────────────

export const invitation = {
  host: "Nirmal Krishnan",
  houseName: "Akshaya",
  eventLabel: "Griha Pravesham",

  // Reads as: "<host> <invite> <houseName>"
  invite: "cordially invites you and your family to the house warming of our new home",
  quote: "Your presence and blessings will make our home complete.",

  // Main event date/time — the countdown counts down to `iso`
  date: {
    iso: "2026-12-20T11:45:00+05:30",
    endIso: "2026-12-20T21:00:00+05:30",
    day: "Sunday",
    fullDate: "20 December 2026",
    malayalamDate: "1202 Dhanu 05", // set to "" to hide
  },

  // Schedule cards. `highlight: true` gives the card a gold border.
  events: [
    { label: "Muhurtham", title: "Griha Pravesham", time: "11:45 AM to 12:20 PM", highlight: true },
    { label: "Evening", title: "Celebration Party", time: "5:00 PM onwards", highlight: true },
  ],

  venue: {
    // Optional written address. Leave "" to show only the map.
    address: "",
    // Exact pin used for the embedded map (latitude,longitude)
    mapsQuery: "9.2395273,76.4854807",
    // Link opened by the map and the "Open in Google Maps" button.
    // Uses Google's universal Maps URL (opens the Maps app on Android/iPhone, the website on laptops).
    // Short maps.app.goo.gl links fail on Android in WhatsApp/in-app browsers, so don't use them here.
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=9.2395273%2C76.4854807",
  },

  // Phone numbers guests can tap to call
  contacts: [{ name: "Contact", phone: "+91 81119 25208" }],

  // Photos go in the /public/photos folder. Missing photos are hidden automatically.
  // Blurred house background (pre-blurred so the real house stays a surprise).
  // The clear original is kept in /private-photos, which is NOT published.
  introImage: "/photos/house-blur.jpg",
  heroImage: "/photos/house-blur.jpg",

  // Artwork shown inside the hero arch (Lord Krishna with flute). Set to "" to show the warm glow instead.
  archImage: "/photos/krishna-arch.jpg",

  // Photo slideshow — empty on purpose so the house stays a surprise (section is hidden when empty).
  // e.g. { src: "/photos/family.jpg", title: "Our Family", caption: "..." }
  gallery: [],

  // Optional background music — put an mp3 at /public/music.mp3 (set to "" to hide the button)
  music: "/music.mp3",
};
