import Swal from "sweetalert2";

import api from "./services/api";

class App {
  constructor() {
    this.renderPage();
  }

  renderPage() {
    this.servicesBoxes = document.getElementById('box-container')
    this.testimonialsSection = document.getElementById('testimonials-section');

    this.enableNavBarAnimation();

    this.createTestimonialForm();
    this.createContactForm();

    this.getServicesList();

    this.checkLocalStorage();

    this.registerEvents();
  }

  enableNavBarAnimation() {
    const nav = document.querySelector('.nav')
    window.addEventListener('scroll', fixNav)

    function fixNav() {
        if(window.scrollY > nav.offsetHeight + 150) {
            nav.classList.add('active')
        } else {
            nav.classList.remove('active')
        }
    }
  }

  async getServicesList() {
    try {
      const servicesFromBackend = await api.get('/services');
      
      this.populateServicesSection(servicesFromBackend.data);
    } catch (error) {
      
    }
  }

  populateServicesSection(services) {
    this.servicesBoxes.innerHTML = '';
    
    services.forEach(item => {
      
      const serviceElement = document.createElement('div');
      serviceElement.classList.add('box');

      serviceElement.innerHTML = `
        <h3 class="box-title"> 
          ${item.name}
        </h3>
        <p class="box-text">
          ${item.description}
        </p>
        <button class="box-toggle">
          <i class="fas fa-chevron-down"></i>
          <i class="fas fa-times"></i>
        </button>
      `;

        this.servicesBoxes.appendChild(serviceElement);
      });
      this.enableServicesBoxesAnimation();
  }

  enableServicesBoxesAnimation() {
    const toggles = document.querySelectorAll('.box-toggle')

    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.parentNode.classList.toggle('active')
    })
})
  }

  createTestimonialForm() {
    this.nameTestimonial = document.getElementById('name-testimonial');
    this.messageTestimonial = document.getElementById('message-testimonial');
    this.btnPublish = document.getElementById('publish-button');
  }

  createContactForm() {
    this.nameContact = document.getElementById('name-contact');
    this.emailContact = document.getElementById('email-contact');
    this.messageContact = document.getElementById('message-contact');
    this.btnSend = document.getElementById('contact-button');
    
  }

  checkLocalStorage() {
    const testimonials = JSON.parse(localStorage.getItem('testimonials'));

    if(testimonials) {
      testimonials.forEach(testimonial => this.createTestimonialData(testimonial));
    }
  }

  updateLocalStorage() {
    const testimonialsElements = document.querySelectorAll('.user-div');
  
    const testimonials = [];

    testimonialsElements.forEach(element => {
      testimonials.push({ name: element.childNodes[1].innerHTML, message: element.childNodes[3].innerHTML});
    })
    
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
  }

  registerEvents() {
    this.btnSend.onclick = () => this.sendContactFormData();
    this.btnPublish.onclick = () => this.createTestimonialData();
  }

  createTestimonialData(testimonial) {
    let name = this.nameTestimonial.value;
    let message = this.messageTestimonial.value;

    if(testimonial) {
      name = testimonial.name;
      message = testimonial.message;
    }

    if(!name || !message) {
      Swal.fire({
        icon: 'error',
        title: 'Opa..',
        text: 'Ocorreu um erro no preenchimento',
      })

      return;
    }

    if(name && message) {
      const testimonialElement = document.createElement('div');
      testimonialElement.classList.add('card');

      testimonialElement.innerHTML = `
        <div class="user-info user-div">
          <h2>${name}</h2>
          <p>${message}</p>
        </div>
      `;
      
      testimonialElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        testimonialElement.remove();
        this.updateLocalStorage();
      })

      this.testimonialsSection.appendChild(testimonialElement);

      this.nameTestimonial.value = '';
      this.messageTestimonial.value = '';

      this.updateLocalStorage();
    }
  }

  sendContactFormData() {
    try {
      const messageBody = {
        name: this.nameContact.value,
        email: this.emailContact.value,
        message: this.messageContact.value,
      }

      if(!messageBody.name || !messageBody.email || !messageBody.message) {
        Swal.fire({
          icon: 'error',
          title: 'Opa..',
          text: 'Ocorreu um erro no preenchimento',
        })

        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Dados preenchidos com sucesso!',
        text: 'Fique tranquilo, não estamos coletando seus dados. Isso é apenas uma simulação.',
      });

      this.nameContact.value = '';
      this.emailContact.value = '';
      this.messageContact.value = '';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Opa..',
        text: 'Ocorreu um erro no cadastro',
      });

      return error;
    }
  }

}

new App();