// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Save to localStorage (or log to console)
    const contactData = { name, email, subject, message, time: new Date().toLocaleString() };
    console.log('Form Submitted:', contactData);

    // Optionally store in localStorage
    let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(contactData);
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    // Reset form
    document.getElementById('contactForm').reset();

    // Show success message
    document.getElementById('successMessage').style.display = 'block';

    // Hide after 5 seconds
    setTimeout(() => {
        document.getElementById('successMessage').style.display = 'none';
    }, 5000);
});