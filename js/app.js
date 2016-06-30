function TodoApp(gui) {
  var todos = [];

  this.addTodoItem = function(todo) {
    todos.push(todo);
    gui.show('footer.footer');
    gui.addListElement('ul.todo-list', todo)
    gui.setValue('input.new-todo', '');
    updateView();
  }

  this.bind = function() {
    var self = this;
    gui.onchange('input.new-todo', function(event) { self.addTodoItem(event) });
    gui.hide('footer.footer');
    gui.clear('ul.todo-list');
    updateView();
  }

  this.todoItems = function() {
    return todos;
  }

  function updateView() {
    gui.showTodoCount(todos.length);
  }
}
