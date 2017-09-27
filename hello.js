    var http = require('http');
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello World\n');
    }).listen(1337, "127.0.0.1");
	
//tokenizing and parsing:
	
	var cst="(begin(define r 10)(* pi(* r r)))";
	
	function tokenize(inpstring){
	inpstring=inpstring.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').replace(/\s+/g, ' ').trim().split(' ');
	return inpstring;
	}
	
	function atom (token) {
    if (isNaN(token)) {
		return token;
    } else {
		return +token; 
    }
};

  function read_from_tokens (tokens) {
    if (0 === tokens.length) {
		console.log("syntax error");
	}
    var token = tokens.shift();
    if ('(' === token) {
		var L = [];
        while (')' !== tokens[0]) {
            L.push(read_from_tokens(tokens));
        }
        tokens.shift();
        return L;
    } else {
		if (')' === token) {
			console.log("syntax error");
		} else {
			return atom(token);
		}
    }
};

 function parse (program) {
    return read_from(tokenize(program));
};


//Environment :
function create_env(props_obj){
	var env={};
	if (props_obj.par_scope=='undefined'){
		var par_scope={};
	}
	else{
		var par_scope=props_obj.par_scope;
	}
	
    
	function ret_pscope(){
	  return par_scope;
	
	};
	 env.ret_pscope=ret_pscope;
	
	function search_var(variable){
	if(env.hasOwnProperty(variable)){
		return env;
	} 
	else{
	return par_scope.search_var(variable);
	}
	};	

   
	env.search_var=search_var;	
	
    if(props_obj.variables.length!==0){
		for(var i=0;i<props_obj.variables.length;i+=1){
		  env[props_obj.variables[i]]=props_obj.vals[i];
		}
	}
	
	
	
	return env;
	
};

function init_std_env(env){
    env['+'] = function(x,y){return x+y;};
    env['-'] = function(x,y){return x-y;};
    env['*'] = function(x,y){return x*y;};
    env['/'] = function(x,y){return x/y;};
    env['>'] = function(x,y){return x>y;};
    env['<'] = function(x,y){return x<y;};
    env['>='] = function(x,y){return x>=y;};
    env['<='] = function(x,y){return x<=y;};
    env['='] = function(x,y){return x===y;};
	env['remainder'] = function(x,y){return x%y;};
    env['equal?'] = function(x,y){return x===y;};
	env['length'] = function (x) { return x.length; };
	env['cons'] = ?
    env['car'] = ?
    env['cdr'] = ?
	env['append'] = function (x, y) { return x.concat(y); };
    env['list'] = ?
	env['list?'] = ?
	env['null?'] = ?
	env['symbol?'] = function (x) { return typeof x === 'string'; };
    return env;
};