// community.js — Community page interactions

// Subscribe button
const subBtn = document.getElementById('comm-subscribe');
const subInput = document.getElementById('comm-email');
if (subBtn && subInput) {
  subBtn.addEventListener('click', () => {
    const email = subInput.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      window.showToast?.('❗ Enter a valid email to subscribe');
      subInput.style.borderColor = 'rgba(236,72,153,.6)';
      return;
    }
    subInput.style.borderColor = '';
    subBtn.disabled = true;
    subBtn.textContent = 'Subscribing…';

    fetch('/api/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_name: 'Community Subscriber',
        from_email: email,
        timestamp: new Date().toISOString(),
        source: 'Community Page Subscribe (/community)',
      }),
    })
      .then(res => res.json().catch(() => ({})))
      .then(data => console.log('✅ Community signup delivered:', data))
      .catch(err => console.warn('⚠️ Community signup warning:', err))
      .finally(() => {
        subBtn.textContent = '✓ You\'re In!';
        subBtn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
        subInput.disabled = true;
        window.showToast?.('🎉 Welcome to the community! Check your inbox.');
      });
  });
}
