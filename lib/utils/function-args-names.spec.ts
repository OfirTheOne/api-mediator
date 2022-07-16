import { getFunctionArgumentNames } from "./function-args-names";

// Test sample functions 
const fun1 = function(a){ }; 

function fun2(a = 5*6/3, // Comment 
b){ }; 

const fun3 = (a, /* 
*/
b, //some comment 
c) => /** */{ }; 

function fun4(a: number = 5*6/3, // Comment 
b){ 

}; 

describe('getFunctionArgumentNames', () => {

	it('should return argument names as expected', () => {
		expect(getFunctionArgumentNames(fun1)).toEqual(['a']); 
		expect(getFunctionArgumentNames(fun2)).toEqual(['a', 'b']); 
		expect(getFunctionArgumentNames(fun3)).toEqual(['a', 'b', 'c']); 
		expect(getFunctionArgumentNames(fun4)).toEqual(['a', 'b']); 

    })
})