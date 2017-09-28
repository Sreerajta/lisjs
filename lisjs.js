    var http = require('http');
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Lis JS\n');
    }).listen(1337, "127.0.0.1");
	
//tokenizing and parsing:
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
    return read_from_tokens(tokenize(program));
};


//Environment :
function create_env(props_obj){
	var env={};
	env.par_scope = props_obj.par_scope || {};
	
	function ret_pscope(){
	  return par_scope;
	};
	 
	function search_var(variable){
	 if(env.hasOwnProperty(variable)){
		return env;
	}
	else{
	return env.par_scope.search_var(variable);
	}
	};	

  
	
    if(props_obj.variables.length!==0){
		for(var i=0;i<props_obj.variables.length;i+=1){
		  env[props_obj.variables[i]]=props_obj.vals[i];
		}
	}
	
	env.ret_pscope=ret_pscope;
	env.search_var=search_var;	
	
	return env;
	
};

function init_std_env(env){
    
	
	env['sin']=Math['sin'];
	env['cos']=Math['cos'];
	env['tan']=Math['tan'];
	env['max']=Math['max'];
	env['min']=Math['min'];
	env['pow']=Math['pow'];
	env['sqrt']=Math['sqrt'];
	env['log']=Math['log'];
	env['exp']=Math['exp'];
	
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
	env['cons'] =  function (x, y) { var tmp_arr = [x]; return tmp_arr.concat(y); };
    env['car'] = function (x) { return (x.length !== 0) ? x[0] : null; };
    env['cdr'] = function (x) { return (x.length > 1) ? x.slice(1) : null; }; 
	env['append'] = function (x, y) { return x.concat(y); };
    env['list'] = function () { return Array.prototype.slice.call(arguments); };
	env['list?'] =  function (x) { return x && typeof x === 'object' && x.constructor === Array ; };
	env['null?'] = function (x) { return (!x || x.length === 0); };
	env['symbol?'] = function (x) { return typeof x === 'string'; };
	
    return env;
};

var global_env=init_std_env(create_env ({variables: ['b'], vals: [3], par_scope: undefined}));
//var ev2=init_std_env(create_env ({variables: ['a'], vals: [1], par_scope:global_env}));
//var evf=init_std_env(create_env ({variables: ['x'], vals: [1], par_scope:ev2}));
//ev3=evf.search_var('x');
//console.log(ev3);







//eval:
function eval (x, env) {
    
	env = env || global_env;

    if (typeof x === 'string') {	
        return env.search_var(x.valueOf())[x.valueOf()];
    } else if (typeof x === 'number') {	
        return x;
    } else if (x[0] === 'quote') {	
        return x[1];
    } else if (x[0] === 'if') {	
        var test = x[1];
        var conseq = x[2];
        var alt = x[3];
        if (eval(test, env)) {
            return eval(conseq, env);
        } else {
            return eval(alt, env);
        }
    } else if (x[0] === 'set!') {		
        env.find(x[1])[x[1]] = eval(x[2], env);
    } else if (x[0] === 'define') {	
        env[x[1]] = eval(x[2], env);
    } else if (x[0] === 'lambda') {	
        var vars = x[1];
        var exp = x[2];
        return function () {
	        return eval(exp, create_env({variables: vars, vals: arguments, par_scope: env }));
        };
    } else if (x[0] === 'begin') {	
        var val;
        for (var i = 1; i < x.length; i += 1) {
            val = eval(x[i], env);
        }
        return val;
    } else {			
        var exps = [];
        for (var i = 0; i < x.length; i += 1) {
            exps[i] = eval(x[i], env);
        }
        var proc = exps.shift();
        return proc.apply(env, exps);
    }
};

eval(parse("(define r 10)"));
eval(parse("(define pi 3.14)"));
var xx=eval(parse("(* pi (* r r))"));
console.log(xx);
process.exit()