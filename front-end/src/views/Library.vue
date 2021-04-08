<template>
<div class="library">
  <h1>Manage My Library</h1>
    <div class="heading">
      <div class="circle">1</div>
      <h2>Add Movie</h2>
    </div>
    <div class="add">
      <div class="form">
        <input v-model="title" placeholder="Title">
        <br />
        <input v-model="genre" placeholder="Genre">
        <br />
        <textarea v-model="description" placeholder="Description" />
        <br />
        <input type="file" name="posterImage" @change="fileChanged">
        <button @click="upload">Upload</button>
      </div>
      <div class="upload" v-if="addMovie">
        <h2>{{addMovie.title}}</h2>
        <h3>{{addMovie.genre}}</h3>
        <h3>{{addMovie.description}}</h3>
        <img :src="addMovie.path" />
      </div>
    </div>
    <div class="heading">
      <div class="circle">2</div>
      <h2>Edit/Delete Movie</h2>
    </div>
    <div class="edit">
      <div class="form">
        <input v-model="findTitle" placeholder="Search">
        <div class="suggestions" v-if="suggestions.length > 0">
          <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectMovie(s)">{{s.title}}
          </div>
        </div>
      </div>
      <div class="upload" v-if="findMovie">
        <input v-model="findMovie.title">
        <br />
        <input v-model="findMovie.genre">
        <br />
        <textarea v-model="findMovie.description" />
        <p></p>
        <img :src="findMovie.path" />
      </div>
      <div class="actions" v-if="findMovie">
        <button @click="deleteMovie(findMovie)">Delete</button>
        <br />
        <br />
        <button @click="editMovie(findMovie)">Edit</button>
      </div>
    </div>
</div>
</template>

<style scoped>
/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #5BDEFF;
  color: #fff;
}
.image h2 {
  font-style: italic;
  font-size: 1em;
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

.add,
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
input,
textarea,
select,
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

.form {
  margin-right: 50px;
}

input {
  margin-bottom: 20px;
}


/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
}
</style>

<script>
import axios from 'axios';
export default {
  name: 'Library',
  data() {
    return {
      title: "",
      description: "",
      genre: "",
      lastRecommended: null,
      file: null,
      addMovie: null,
      movies: [],
      findTitle: "",
      findMovie: null,
    }
  },
  created() {
    this.getMovies();
  },
  computed: {
    suggestions() {
      let movies = this.movies.filter(movie => movie.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      return movies.sort((a, b) => a.title > b.title);
    }
  },
  methods: {
    async editMovie(movie) {
      try {
        await axios.put("/api/movies/" + movie._id, {
          title: this.findMovie.title,
          genre: this.findMovie.genre,
          description: this.findMovie.description,
        });
        this.findMovie = null;
        this.getMovie();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectMovie(movie) {
      this.findTitle = "";
      this.findMovie = movie;
    },
    async deleteMovie(movie) {
      try {
        await axios.delete("/api/movies/" + movie._id);
        this.findMovie = null;
        this.getMovies();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getMovies() {
      try {
        let response = await axios.get("/api/movies");
        this.movies = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('posterImage', this.file, this.file.name)
        let r1 = await axios.post('/api/posterImages', formData);
        let r2 = await axios.post('/api/movies', {
          title: this.title,
          genre: this.genre,
          description: this.description,
          path: r1.data.path
        });
        this.addMovie = r2.data;
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>
