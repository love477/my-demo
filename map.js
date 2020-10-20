const arr1 = new Array(2);
console.log('arr1: ', arr1);
arr1[0] = 1;
arr1[1] = undefined;
const result = arr1.map(v => 1);
console.log('result: ', result);