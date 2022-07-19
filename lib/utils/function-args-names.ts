
function getFunctionSignature(func: Function): string {
	// String representaation of the function code 
	const functionAsString = func.toString(); 

	// Remove comments of the form /* ... */ 
	// Removing comments of the form // 
	// Remove body of the function { ... } 
	// removing '=>' if func is arrow function 
    const functionSignature = functionAsString
            .replace(/\/\*[\s\S]*?\*\//g, '') 
            .replace(/\/\/(.)*/g, '')		 
			.replace(/{[\s\S]*}/, '') 
			.replace(/=>/g, '') 
            .trim(); 
    return functionSignature;
}

function getArgumentsSectionFromFunctionSignature(functionSignature: string) {
	// Start parameter names after first '(' 
	const argsStart = functionSignature.indexOf("(") + 1; 
	// End parameter names is just before last ')' 
	const argsEnd = functionSignature.length - 1; 
	const argumentSection = functionSignature.substring(argsStart, argsEnd).split(", "); 
	return argumentSection;
}

export function getFunctionArgumentNames(func: Function): Array<string> { 

    const functionSignature = getFunctionSignature(func)
	const argsSections = getArgumentsSectionFromFunctionSignature(functionSignature);

	const params = argsSections.map(element => { 
		// Removing any default value 
		element = element.replace(/=[\s\S]*/g, '').trim(); 
		element = element.replace(/:*/g, '').trim(); 
		if(element.length > 0) {
			return element; 
		} 
	})
	.filter(el => el != undefined); 
	
	return params; 
} 


