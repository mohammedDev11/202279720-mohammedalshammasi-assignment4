# Technical Documentation

## Project Structure

project/
├── index.html
├── css/
│ └── styles.css
├── js/
│ └── script.js
├── assets/
│ ├── images/
│ └── videos/
├── docs/
└── presentation/

---

## Main Features

### 1. Theme System

- Dark and light mode toggle
- Uses localStorage to save user preference
- Updates UI dynamically

---

### 2. Visitor Personalization

- User enters their name
- Stored in localStorage
- Displayed when user revisits

---

### 3. Project System

- Projects displayed in a grid layout
- Features include:
  - Filtering by category (UI, Web, Mobile)
  - Sorting (A-Z, Z-A)
  - Level filtering (Beginner / Advanced)

---

### 4. Video Modal

- Clicking a project opens a modal
- Plays project demo video
- Supports:
  - Close button
  - Overlay click
  - ESC key

---

### 5. GitHub API Integration

- Fetches repositories dynamically
- Displays:
  - Name
  - Description
  - Language
  - Stars and forks
- Sensitive repositories are filtered out

---

### 6. Contact Form Validation

- Validates:
  - Name length
  - Email format
  - Message length and word count
  - Checkbox confirmation
- Displays error and success messages

---

### 7. Time on Site Counter

- Tracks how long the user stays on the site
- Updates every second

---

### 8. Scroll Reveal Animation

- Uses IntersectionObserver
- Elements appear when scrolling into view

---

## Responsiveness

- Built using Flexbox and CSS Grid
- Works on:
  - Desktop
  - Tablet
  - Mobile

---

## Summary

This project demonstrates:

- Frontend development
- JavaScript interactivity
- API integration
- Responsive design
- Clean project structure
