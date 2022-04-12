<template>
  <div class="container mt-5" style="max-width: 600px">
    <div class="bg-white my-3 p-3 rounded shadow-lg">
      <h5 class="border-bottom border-gray pb-2 mb-3">Todo App</h5>
      <div class="form-label-group border-bottom border-gray pb-3 mb-1">
        <input
          type="email"
          id="inputEmail"
          class="form-control"
          placeholder="add todo ..."
          required=""
          autofocus=""
          v-model="newTodo"
          @keyup.enter="addTodo"
        />
      </div>

      <div
        class="media text-muted pt-3"
        v-for="(todo, index) in infoTodo"
        :key="index"
      >
        <div class="checkbox mr-2 pt-1">
          <label>
            <input
              type="checkbox"
              v-model="todo.completed"
              value="remember-me"
            />
          </label>
        </div>
        <div
          class="
            media-body
            pb-3
            ml-2
            mb-0
            small
            lh-125
            border-bottom border-gray
          "
        >
          <div class="d-flex justify-content-between align-items-center w-100">
            <h6
              @dblclick="editTodo(todo)"
              :class="{
                'text-danger pt-1': todo.completed,
                'text-success pt-1': !todo.completed,
                none: editedTodo == todo,
              }"
            >
              {{ todo.title }}
            </h6>

            <input
              class="form-control mr-2"
              v-if="editedTodo == todo"
              type="text"
              v-model="todo.title"
              @blur="doneEdit(todo)"
              @keyup.enter="doneEdit(todo)"
              @keyup.esc="cancelEdit(todo)"
            />
            <span class="d-flex justify-content-between">
              <span class="mr-2 btn btn-primary btn-sm" @click="editTodo(todo)"
                >Edit</span
              >
              <span class="btn btn-danger btn-sm" @click="removeTodo(todo)"
                >Delete</span
              >
            </span>
          </div>
        </div>
      </div>

      <small class="d-block text-right mt-3">
        <span class="ml-2 mt-1 btn btn-success btn-sm" @click="infoTodo = this.todos"
          >All</span
        >
        <span
          class="ml-2 mt-1 btn btn-success btn-sm"
          @click="infoTodo = this.active"
          >Active</span
        >
        <span
          class="ml-2 mt-1 btn btn-success btn-sm"
          @click="infoTodo = this.completed"
          >Completed</span
        >
        <span class="ml-2 mt-1 btn btn-success btn-sm" @click="clearCompleted"
          >Clear Completed</span
        >
      </small>
    </div>
  </div>
</template>

<script>
var STORAGE_KEY = "todos";
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    todos.forEach(function (todo, index) {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },
};

export default {
  name: "App",
  data: () => ({
    todos: todoStorage.fetch(),
    editedTodo: "",
    newTodo: "",
    visibility: "",
    infoTodo: todoStorage.fetch(),
    activeClass: "text-primary",
  }),
  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos);
      },
      deep: true,
    },
  },
  computed: {
    all() {
      return this.todos;
    },
    active() {
      return this.todos.filter((todo) => !todo.completed);
    },
    completed() {
      return this.todos.filter((todo) => todo.completed);
    },
  },
  methods: {
    addTodo() {
      var value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.todos.push({
        id: todoStorage.uid++,
        title: value,
        completed: false,
      });
      this.infoTodo = this.all;
      this.newTodo = "";
    },
    removeTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    },
    clearCompleted() {
      this.todos = this.active;
      this.infoTodo = this.all;
    },

    editTodo(todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },

    doneEdit(todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        this.removeTodo(todo);
      }
    },

    cancelEdit(todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },
  },
};
</script>

<style>
body {
  background-color: rgb(221, 221, 221);
}

.none {
  display: none;
}
</style>
