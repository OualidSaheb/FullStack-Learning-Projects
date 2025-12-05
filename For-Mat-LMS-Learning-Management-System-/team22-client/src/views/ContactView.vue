<script setup lang="ts">
import HeaderComponent from '@/components/MainPageComponents/HeaderComponent.vue'
import FooterComponent from '@/components/MainPageComponents/FooterComponent.vue'
import Button from '@/components/Widgets/ButtonComp.vue'
</script>

<template>
  <HeaderComponent />

  <main>
    <section class="contact-section">
      <div class="container center">
        <div class="contact-left">
          <h1>Nous joindre</h1>
          <p>Si vous avez des questions ou des demandes, n'hésitez pas à nous contacter.</p>
        </div>
        <div class="contact-form">
          <form>
            <div class="form-group">
              <label for="name">Nom complet</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div class="form-group">
              <label for="objet">objet</label>
              <input type="text" id="objet" name="objet" required />
            </div>

            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div class="form-group">
              <label for="message">Message:</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>

            <div class="form-group">
              <Button type="submit" btnText="Envoyer le message" btnColor="white" btnBgColor="var(--laccent)"
                btnHoverColor="white" btnHoverBgColor="var(--daccent)" />

            </div>
          </form>
        </div>
      </div>
    </section>
  </main>
  <FooterComponent />
</template>

<style scoped>
.contact-section {
  padding: 80px 0;
}

.container {
  width: 100%;
}

.center {
  align-items: flex-start;
  gap: 30px;
}

.contact-left {
  width: 50%;
}

h1 {
  font-size: calc(0.5rem + 4vmin);
  line-height: 1.2;
  font-weight: 600;
  margin-bottom: 20px;
}

p {
  font-size: calc(0.8rem + 1vmin);
  font-weight: 400;
  color: var(----daccent);
  margin-bottom: 30px;
}

.contact-form {
  padding: 20px;
  border-radius: 5px;
  text-align: left;
  width: 50%;
}

.form-group {
  margin-bottom: 20px;
  color: var(--daccent);
}

label {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
}

input[type='text'],
input[type='email'],
textarea {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 2px solid var(--daccent);
}

textarea {
  resize: vertical;
}

.btn {
  font-size: calc(0.8rem + 0.8vmin);
  font-weight: 400;
}




@media (max-width: 767px) {

  h1 {
    font-size: calc(0.5rem + 5vmin);
  }

  .center {
    align-items: center;
    flex-direction: column;
  }

  .contact-left,
  .contact-form {
    width: 100%;
    padding: 0;

  }


}
</style>
