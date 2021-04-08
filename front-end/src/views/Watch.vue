<template>
<div class="watch">
  <h1>Movie Selector</h1>
  <p>Can't decide what movie to watch tonight?  We'll help you out!  Just click what genre you are feeling, or select random.</p>
  <div class="heading">
    <div class="circle">1</div>
    <h2>Select Random By Genre</h2>
  </div>
  <div class="edit">
    <div class="form">
      <div class="genres" v-if="genres.length > 0">
        <div class="genre" v-for="genre in genres" :key="genre" @click="selectGenre(genre)">{{genre}}
        </div>
      </div>
    </div>
  </div>
  <div class="heading">
    <div class="circle">2</div>
    <h2>Select Random</h2>
  </div>
  <div class="edit">
    <div class="form">
      <button @click="randomMovie(movies)">Pick For Me</button>
    </div>
  </div>
    <div class="recommendation" v-if="recommendation != null">
      <br />
      <br />
      <h1>Tonight you should watch...</h1>
      <h2>{{recommendation.title}}</h2>
      <h3>{{recommendation.description}}</h3>
      <img :src="recommendation.path" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from 'axios';
export default {
  name: 'Watch',
  data() {
    return {
     genres: [],
     movies: [],
     recommendation: null,
     genreFilter: "",
    }
  },
  created() {
    this.getGenres();
  },
  computed: {
    filteredMovies() {
      console.log("filtering for " + this.genreFilter);
      return this.movies.filter(movie => {
        return movie.genre == this.genreFilter;
      });
    }
  },
  methods: {
    async getGenres() {
      try {
        let response = await axios.get("/api/movies");
        this.movies = response.data;
        this.genres = [];
        var lookup = {};
        for (var i = 0; i < this.movies.length; i++) {
          var genre = this.movies[i].genre;

          if(!(genre in lookup)) {
            lookup[genre] = 1;
            this.genres.push(genre);
          }
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectGenre(genre) {
      this.genreFilter = genre;
      console.log("we selected " + genre);
      console.log("filtered list = " + this.filteredMovies);
      this.randomMovie(this.filteredMovies);
    },
    getRandom(min, max) {
      console.log("generating random between " + min + " and " + max);
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
    },
    randomMovie(pickList) {
      console.log("making a recommendation from " + pickList);
      let pick = this.getRandom(0, pickList.length - 1);
      console.log("our pick = " + pick);
      this.recommendation = pickList[pick];
    },
  }
}
</script>

<style scoped>
.image h2 {
  font-style: italic;
}

.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
  margin-left: 10px;
}

.edit {
  display: flex;
}

.circle {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: #333;
  color: #fff;
  text-align: center
}

/* Form */
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

.form {
  margin-right: 50px;
}

.genres {
  width: 200px;
  border: 1px solid #ccc;
}

.genre {
  min-height: 20px;
}

.genre:hover {
  background-color: #5BDEFF;
  color: #fff;
}

.recommendation {
  text-align: center;

}

img {
  height: 400px;
}
</style>
