<template>
<div class="library">
  <h1>Manage My Library</h1>
    <div class="heading">
      <h1>-Add Movie-</h1>
    </div>
    <div class="add">
      <div class="form">
        <input v-model="title" placeholder="Title">
        <br />
        <input v-model="genre" placeholder="Genre">
        <br />
        <input v-model="duration" placeholder="Duration (minutes)">
        <br />
        <input v-model="starring" placeholder="Actor Name">
        <br />
        <textarea v-model="description" placeholder="Description" />
        <br />
        <input type="file" name="posterImage" @change="fileChanged">
        <button @click="upload">Upload</button>
      </div>
      <div class="upload" v-if="addMovie">
        <h2>{{addMovie.title}}</h2>
        <h3>{{addMovie.genre}}</h3>
        <h3>{{addMovie.duration}}</h3>
        <h3>{{addMovie.starring}}</h3>
        <h3>{{addMovie.description}}</h3>
        <img :src="addMovie.path" />
      </div>
    </div>
    <div class="heading">
      <h1>-Edit/Delete Movie-</h1>
    </div>
    <div class="edit">
      <div class="form">
        <div class="suggestions" v-if="suggestions.length > 0">
          <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectMovie(s)">{{s.title}}
          </div>
        </div>
      </div>
      <div class="upload" v-if="findMovie">
        <input v-model="findMovie.title" placeholder="Title">
        <br />
        <input v-model="findMovie.genre" placeholder="Genre">
        <br />
        <input v-model="findMovie.duration" placeholder="Duration (minutes)">
        <br />
        <input v-model="findMovie.starring" placeholder="Actor name">
        <br />
        <textarea v-model="findMovie.description" placeholder="Enter a description"/>
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
h1 {
  text-align: center;
}
/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #cce6ff;
}
.image h2 {
  font-style: italic;
  font-size: 1em;
}

.heading {
  display: flex;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
}

.add,
.edit {
  display: flex;
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
      duration: null,
      starring: "",
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
          duration: this.findMovie.duration,
          starring: this.findMovie.starring,
          description: this.findMovie.description,
        });
        this.findMovie = null;
        this.getMovies();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectMovie(movie) {
      this.findTitle = "";
      this.findMovie = movie;
      console.log("selected movie="+JSON.stringify(movie));
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
          duration: this.duration,
          starring: this.starring,
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
