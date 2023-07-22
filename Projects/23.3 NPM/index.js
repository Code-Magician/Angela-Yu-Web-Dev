import sn from "sillyname";
import superheroes from "superheroes";

var sillyName = sn.randomAdjective() + " " + sn.randomNoun();

console.log(`Silly Name Generated is : ${sillyName}`);

var superheroName = superheroes.random();
console.log(`I am ${superheroName}`);
