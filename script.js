/* script.js — interaction for LUMEN catalog (no backend) */

/* Basic selectors */
const bookingModal = document.getElementById('booking-modal');
const openBooking = document.getElementById('open-booking');
const closeBook = document.getElementById('close-book');
const bookingForm = document.getElementById('booking-form');
const bookingSuccess = document.getElementById('booking-success');
const serviceInput = document.getElementById('service-input');
const bookButtons = document.querySelectorAll('.book-now');
const scrollServices = document.getElementById('scroll-services');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

/* Helper: open modal with pre-filled service */
function openModal(serviceName='General Consultation'){
  bookingModal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-title').textContent = 'Book: ' + serviceName;
  serviceInput.value = serviceName;
  bookingSuccess.textContent = '';
}

/* close */
function closeModal(){
  bookingModal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  bookingForm.reset();
}

/* Attach events */
openBooking?.addEventListener('click', ()=> openModal('General Appointment'));
closeBook?.addEventListener('click', closeModal);

bookButtons.forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const title = e.currentTarget.getAttribute('data-title') || 'Service';
    openModal(title);
    // focus name input
    setTimeout(()=> bookingForm.name?.focus(), 220);
  });
});

scrollServices?.addEventListener('click', ()=>{
  document.querySelector('#services')?.scrollIntoView({behavior:'smooth', block:'start'});
});

/* Form submit: store booking in localStorage and show success */
bookingForm?.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  const f = new FormData(bookingForm);
  const booking = {
    id: 'bk_' + Date.now(),
    name: f.get('name'),
    phone: f.get('phone'),
    service: f.get('service'),
    datetime: f.get('datetime'),
    message: f.get('message'),
    created: new Date().toISOString()
  };
  // save
  const all = JSON.parse(localStorage.getItem('lumen_bookings') || '[]');
  all.push(booking);
  localStorage.setItem('lumen_bookings', JSON.stringify(all));
  bookingSuccess.textContent = 'Thanks! Your booking is saved. We will contact you on WhatsApp soon.';
  bookingForm.reset();
  // optionally open WhatsApp with pre-filled message
  setTimeout(()=> {
    closeModal();
    const text = encodeURIComponent(`Hello LUMEN, I booked: ${booking.service}. Name: ${booking.name}. Phone: ${booking.phone}. Preferred: ${booking.datetime || 'N/A'}`);
    window.open(`https://wa.me/918929196989?text=${text}`, '_blank');
  }, 900);
});

/* Book via WhatsApp button */
document.getElementById('book-via-whatsapp')?.addEventListener('click', ()=>{
  const name = bookingForm.name?.value || 'Friend';
  const phone = bookingForm.phone?.value || '';
  const service = bookingForm.service?.value || 'General';
  const dt = bookingForm.datetime?.value || '';
  const text = encodeURIComponent(`Hi LUMEN Team, I'd like to book: ${service}. Name: ${name}. Phone: ${phone}. Preferred: ${dt}`);
  window.open(`https://wa.me/918929196989?text=${text}`, '_blank');
});

/* close when click outside panel */
bookingModal.addEventListener('click', (e)=>{
  if(e.target === bookingModal) closeModal();
});

/* Optionally: show existing booking count */
(function showBookingCount(){
  const arr = JSON.parse(localStorage.getItem('lumen_bookings') || '[]');
  if(arr.length>0){
    console.info('You have', arr.length, 'local bookings stored (localStorage).');
  }
})();

/* small accessibility: close on Escape */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && bookingModal.getAttribute('aria-hidden') === 'false') closeModal();
});
