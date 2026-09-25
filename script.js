// Fade-in animation on scroll
    document.addEventListener('DOMContentLoaded', () => {
      const fadeElements = document.querySelectorAll('.fade-in');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      
      fadeElements.forEach(el => observer.observe(el));

      // Smooth scroll for navigation
      document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
      
      // Initialize countdown and guest count
      updateCountdown();
      setInterval(updateCountdown, 1000);
      updateGuestCount();
    });

    // Countdown Timer Logic (Target: Nov 5, 2026, 10:00 AM IST)
    function updateCountdown() {
      const weddingDate = new Date('2026-11-05T10:00:00+05:30').getTime();
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<div class="countdown-item"><span class="countdown-number">Today</span></div>';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = String(days).padStart(2, '0');
      document.getElementById('hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // Password Modal Functions
    function openPasswordModal() {
      document.getElementById('passwordModal').classList.add('show');
      document.getElementById('passwordInput').value = '';
      document.getElementById('passwordError').classList.remove('show');
      setTimeout(() => document.getElementById('passwordInput').focus(), 100);
    }

    function checkPassword() {
      const password = document.getElementById('passwordInput').value;
      if (password === 'VG2026') {
        document.getElementById('passwordModal').classList.remove('show');
        document.getElementById('secretCompartment').classList.add('show');
        updateGuestCount();
      } else {
        document.getElementById('passwordError').classList.add('show');
        document.getElementById('passwordInput').value = '';
      }
    }

    function closeSecretCompartment() {
      document.getElementById('secretCompartment').classList.remove('show');
    }

    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') checkPassword();
    });

    // AUTO-SET GUESTS TO 0 AND DISABLE IF "REGRETFULLY CANNOT ATTEND" IS SELECTED
    document.getElementById('joining').addEventListener('change', function() {
      const guestsSelect = document.getElementById('guests');
      const eventSelect = document.getElementById('event');
      
      if (this.value === 'Regretfully cannot attend') {
        // Set values
        guestsSelect.value = '0';
        eventSelect.value = 'Not Attending';
        
        // Disable fields (triggers CSS visual cue)
        guestsSelect.disabled = true;
        eventSelect.disabled = true;
        
        // Remove required attribute so form can submit without browser validation blocking it
        guestsSelect.removeAttribute('required');
        eventSelect.removeAttribute('required');
      } else {
        // Reset values to placeholder
        guestsSelect.value = '';
        eventSelect.value = '';
        
        // Re-enable fields
        guestsSelect.disabled = false;
        eventSelect.disabled = false;
        
        // Restore required attribute
        guestsSelect.setAttribute('required', 'required');
        eventSelect.setAttribute('required', 'required');
      }
    });

    // 1. LIVE COUNT FUNCTION (Fetches from Google Sheets)
    function updateGuestCount() {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxsKqD4T1bndscj0wRIKqJ6Xhp26cuei6h1lhW8J_f_sY6zJDoDjzvYD4mFEh6n1xQJiQ/exec';
      const countElement = document.getElementById('guestCount');
      
      countElement.textContent = '...'; 
      
      fetch(scriptURL + '?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
          countElement.textContent = data.totalGuests;
        })
        .catch(error => {
          console.error('Error fetching count:', error);
          countElement.textContent = '0'; 
        });
    }

    // 2. RSVP Form Handler (SILENT SUBMISSION via Apps Script)
    document.getElementById('rsvpForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const joining = document.getElementById('joining').value;
      const guests = parseInt(document.getElementById('guests').value);
      const event = document.getElementById('event').value; 
      
      const submitBtn = document.querySelector('.btn-submit');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      const scriptURL = 'https://script.google.com/macros/s/AKfycbxsKqD4T1bndscj0wRIKqJ6Xhp26cuei6h1lhW8J_f_sY6zJDoDjzvYD4mFEh6n1xQJiQ/exec';

      fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          name: name,
          joining: joining,
          guests: guests,
          event: event 
        })
      }).then(response => response.json())
        .then(data => {
          if (data.result === "success") {
            // Show success message
            document.getElementById('rsvpForm').style.display = 'none';
            document.getElementById('rsvpSuccess').classList.add('show');
            
            // Refresh the live count after 2 seconds
            setTimeout(updateGuestCount, 2000);
          } else {
            console.error("Script error:", data.message);
            alert("There was an error saving your response. Please try again.");
            submitBtn.textContent = 'Share Your Presence';
            submitBtn.disabled = false;
          }
        })
        .catch((error) => {
          console.error('Submission error:', error);
          alert("Network error. Please check your connection and try again.");
          submitBtn.textContent = 'Share Your Presence';
          submitBtn.disabled = false;
        });
    });