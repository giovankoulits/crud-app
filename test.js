const event = require("events");
class Dog extends event.EventEmitter {}

const dog = new Dog();

dog.on("bark", () => {
  console.log("Woof! Woof!");
});

dog.on("wagTail", () => {
  console.log("Spin! Spin!");
});

dog.emit("bark");
dog.emit("wagTail");
console.log(dog.eventNames());
dog.removeAllListeners();
console.log(dog.eventNames());
