    var http = require('http');
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello World\n');
    }).listen(1337, "127.0.0.1");
	
	
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