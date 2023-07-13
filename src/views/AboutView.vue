<template>
  <nav>
    <div class="router">
      <router-link to="/home">Home</router-link> 
    </div>
    <div class="router">  
      <router-link to="/about">About</router-link> 
    </div>
    <div class="router">
      <router-link to="/posts">Posts</router-link> 
    </div>
    <div class="router">
      <router-link to="/account">Account</router-link>
    </div>
  </nav>
  <div class="detail-tile">
    <h1 class="detail">About this project.</h1>
    <p class="detail">
      This project is made using JavaScript and Vue3. It also uses the Vuex Store to manage the userbase, the users posts and other data.
      The project uses OOP (Object Oriented Programming), this is used within the different types of account and the posts.
    </p>
    <p class="detail"> The GitHub repository for this project can be found <a href="https://github.com/CavanBeardmore/Vue3-BlogProject"> here. </a></p>
    
  </div>
</template>
