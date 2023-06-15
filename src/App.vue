<template>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 10px;
  background-color: #17B9B1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

router-link{
  flex-basis: 20%;
  flex-grow: 0;
  flex-shrink: 0;
}

.router{
  background-color: #C2D5D4;
  padding: 15px;
  width: fit-content;
  border-radius: 10px;
  border-style:ridge;
}

</style>
