'use strict';

describe('the todolist model', function() {
  var todoList;

  beforeEach(function() {
    todoList = new TodoList();
  });

  it('is initially empty', function() {
    expect(todoList.length).equal(0);
  });

  it('can contain one element', function() {
    todoList.push('pippo');

    expect(todoList.length).equal(1);
    expect(todoList.at(0).text).equal('pippo');
  });

  it('can contain more than one element', function() {
    todoList.push(aTodoItem(), aTodoItem());

    expect(todoList.length).equal(2);
  });

  it('declares items completed', function() {
    todoList.push(aTodoItem(), aTodoItem());

    todoList.complete(1);

    expect(!!todoList.at(0).complete).equal(false);
    expect(todoList.at(1).complete).equal(true);
  });

  it('counts items left', function() {
    todoList.push(aTodoItem(), aTodoItem());
    expect(todoList.itemsLeft()).equal(2);

    todoList.complete(1);

    expect(todoList.itemsLeft()).equal(1);
  });


  describe('observer notification', function() {
    var subjectOfNotification;
    var notificationCalls;

    beforeEach(function() {
      notificationCalls = 0;

      todoList.subscribe({
        notify: function(subject) {
          subjectOfNotification = subject;
          notificationCalls++;
        }
      });
    });

    it('notifies when adding an item', function() {
      todoList.push(aTodoItem());

      expect(subjectOfNotification).equal(todoList);
      expect(notificationCalls).equal(1);
    });

    it('notifies when checked', function() {
      todoList.push(aTodoItem());

      todoList.complete(0);

      expect(subjectOfNotification).equal(todoList);
      expect(notificationCalls).equal(2);
    });
  });
});


describe('the todolist view', function() {
  var $, $all, todoList, view;

  beforeEach(function() {
    var fixture = document.createElement('div');
    fixture.innerHTML = '<ul class="todo-list"></ul>';
    $ = function(selector) { return fixture.querySelector(selector); }
    $all = function(selector) { return fixture.querySelectorAll(selector); }
    todoList = new TodoList();
    view = new TodoListView(todoList, fixture);
  })

  it('renders an empty todo list', function() {
    view.render();
    expect($('ul.todo-list').children.length).to.equal(0);
  });

  it('renders a list of one element', function() {
    todoList.push(aTodoItem('Pippo'));
    view.render();
    expect($('li label').textContent).equal('Pippo');
    expect($('input.edit').value).equal('Pippo');
  });

  it('renders a completed todoItem', function() {
    todoList.push('Something');
    todoList.at(0).completed = true;

    view.render();

    expect($('li.completed')).not.equal(null, 'added class');
    expect($('li.completed input.toggle').checked).equal(true, 'checked box');
  });

  it('renders a list of two elements', function() {
    todoList.push(aTodoItem('Foo'), aTodoItem('Bar'));

    view.render();

    var actualLabels = $all('li label');
    expect(actualLabels[0].textContent).equal('Foo');
    expect(actualLabels[1].textContent).equal('Bar');
  });

  it('responds when user completes an item', function() {
    todoList.push(aTodoItem(), aTodoItem(), aTodoItem());
    view.render();

    // user clicks on second item
    var secondItem = $('li:nth-child(2) input.toggle');
    secondItem.onchange({target: secondItem});

    expect(todoList.at(1).completed).equal(true, 'model is changed');
    expect($('li:nth-child(2)').attributes['class'].value).equal('completed', 'html is updated');
    expect($('li:nth-child(1)').attributes['class']).to.be.undefined;
    expect($('li:nth-child(3)').attributes['class']).to.be.undefined;
  });
});


describe('the footer view', function() {
  var $, $all, todoList, view;

  beforeEach(function() {
    var fixture = document.createElement('div');
    fixture.innerHTML = '<footer class="footer"></footer>';
    $ = function(selector) { return fixture.querySelector(selector); }
    $all = function(selector) { return fixture.querySelectorAll(selector); }
    todoList = new TodoList();
    view = new FooterView(todoList, fixture);
  })

  it('is hidden when the list is empty', function() {
    view.render();
    expect($('footer.footer').style.display).equal('none');
  });

  it('is shown when the list is not empty', function() {
    todoList.push(aTodoItem())
    view.render();
    expect($('footer.footer').style.display).equal('block');
  });

  it('reports no outstanding items', function() {
    view.render();
    expect($('.todo-count').textContent).equal('0 items left');
  });

  xit('reports 1 outstanding item, singular', function() {
    todoList.push(aTodoItem());
    view.render();
    expect($('.todo-count').textContent).equal('1 item left');
  });

  it('reports 2 outstanding items', function() {
    todoList.push(aTodoItem(), aTodoItem());
    view.render();
    expect($('.todo-count').textContent).equal('2 items left');
  });

  it('updates html when the list changes', function() {
    todoList.push(aTodoItem(), aTodoItem());
    view.render();
    expect($('.todo-count').textContent).equal('2 items left');

    todoList.push(aTodoItem());

    expect($('.todo-count').textContent).equal('3 items left');
  });
});

function aTodoItem(text) {
  return text || 'Anything';
}
