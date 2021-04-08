<template>
<div id="app">
  <div class="header">
    <router-link to="/">
      <img class="logo" src="/images/movielogo.png">
    </router-link>
    <div class="title">
      <h1>My Movie Library</h1>
    </div>
    <router-link to="/library">
      <img class="manageLibrary" src="/images/manageLibrary.png">
    </router-link>
    <router-link to="/watch">
      <img class="navigation" src="/images/movieSelector.jpg">
    </router-link>
  </div>
  <div class="content">
    <router-view />
  </div>
  <div class="footer">
    <a href="https://github.com/ashtyntaylor/creative-project-4">Github</a>
  </div>
</div>
</template>

<style>
html {
  box-sizing: border-box;
}

body {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  background: #fff;
  padding: 0px;
  margin: 0px;
}

/* Header */
.header {
  display: flex;
  padding: 10px 100px 0px 100px;
  background-color: #5BDEFF;
  color: #1C454F;
}

.title {
  margin-top: 5px;
}

.title h1 {
  font-size: 30px;
}

.content {
  padding: 20px 100px;
  min-height: 500px;
}

/* Footer */
.footer {
  height: 50px;
  padding: 20px 100px 0px 100px;
  background: #e3e3e3;
  font-size: 12px;
  text-align: center;
}

.footer a {
  color: #000;
}

h1 {
  font-size: 20px;
  padding-top: 7px;
}

h2 {
  font-size: 14px;
}

h3 {
  font-size: 12px;
}

.logo {
  height: 100px;
  padding-right: 30px;
  padding-bottom: 10px;
}

.navigation {
  height: 25px;
  padding-top: 40px;
  position: absolute;
  right: 0%;
}

.manageLibrary {
  height: 25px;
  padding-top: 40px;
  position: absolute;
  right: 13%;
}

/* menu on medium-sized screens */
@media only screen and (max-width: 1045px) and (min-width: 648px) {
  .navigation{
    padding-top: 60px;
  }

  .manageLibrary {
    padding-top: 20px;
    right: 0%;
  }
}

/* menu on small screens */
@media only screen and (max-width: 647px) and (min-width: 500px) {
  .navigation {
    padding-top: 105px;
    height: 24px;
  }

  .manageLibrary {
    padding-top: 105px;
    right: 25%;
    height: 24px;
  }

  .header {
    padding-bottom: 20px;
  }
}

</style>
