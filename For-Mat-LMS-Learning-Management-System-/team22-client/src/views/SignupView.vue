<script setup lang="ts"></script>

<template>
  <main>
    <div class="container">
      <div class="loginContent">
        <div class="form">
          <h2>Create Account</h2>
          <div class="input">
            <input id="name" type="text" />
            <label for="name">Organisation</label>
          </div>
          <div class="input">
            <input id="email" type="email" />
            <label for="email">Courriel</label>
          </div>
          <div class="input">
            <input id="password" type="password" />
            <label for="password">Password</label>
          </div>
          <div>
            <p></p>
          </div>
          <div>
            <div class="login-btn">join now</div>
            <a>Already have an account ?</a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  background-color: var(--daccent);
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.loginContent {
  border-radius: 7px;
  box-shadow: 0 6px 12px rgba(179, 179, 179, 0.7);
  background-color: white;
  padding: 50px;
}

.form {
  display: flex;
  padding: 0px !important;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  gap: 20px;
}

h2 {
  color: var(--laccent);
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 50px;
}

a {
  text-decoration: none;
  cursor: pointer;
  color: black;
  display: block;
  text-align: center;
}

a:focus,
a:hover {
  color: var(--laccent);
  font-weight: bold;
}

.input {
  position: relative;
}

.input input,
.login-btn {
  width: 360px;
  height: 45px;
  outline: none;
  padding: 0 0.7rem;
  border-radius: 3px;
  transition: 0.2s;
  font-weight: bold;
  z-index: 1;
}

.input input {
  border: none;
  border-bottom: 1px solid #8c8c8c;
}

.login-btn {
  border: 1px solid #8c8c8c;
  background: var(--daccent);
  cursor: pointer;
  font-size: 20px;
  color: #fff;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
}

.login-btn:focus,
.login-btn:hover {
  background: #fff;
  cursor: pointer;
  color: var(--daccent);
  text-transform: uppercase;
  border: 1px solid var(--daccent);
  transition: ease-in-out 0.2s;
}

.input label {
  position: absolute;
  top: 28%;
  left: 10px;
  font-size: 0.9rem;
  transition: 0.2s;
  font-weight: bold;
  padding: 0 0.1rem;
}

.input input:focus {
  border-bottom: 1px solid var(--daccent);
}

.input input:focus ~ label,
.input label {
  transform: translateY(-25px);
  font-size: 15px;
  color: var(--daccent);
  background: #fff;
  margin-top: 5px;
}
</style>
