function nand(a, b) {
  return ~(a & b);
}

function nandNot(a,a) {
  return nand(a,a);
}

function nandAnd(a,b) {
  return nand(
      nand(a,b),
      nand(a,b)
  );
}

function nandOr(a,b) {
  return nand(
    nand(a,a),
    nand(b,b)
  );
}

function nandNor(a,b) {
  return nand(
    nand(
      nand(a,a),
      nand(b,b)
    ),
    nand(
      nand(a,a),
      nand(b,b)
    )
  );
}

function nandXor(a,b) {
  return nand(
    nand(
      a, nand(a,b)
    ),
    nand(
      b, nand(a,b)
    )
  );
}

function nandXnor(a,b){
  return nand(
    nand(
      nand(a,a),
      nand(b,b)
    ),
    nand(a,b)
  );
}

/* Note - the operands of all bitwise operators are converted to signed 32-bit 
 * integers in two's complement format. Two's complement format means that
 * a number's negative counterpart is all the number's bits inverted (bitwise
 * NOT of the number, a.k.a ones' complement of the number) plus one. 
 */
let a = 0b00000000000000000000000000000011;
let b = 0b00000000000000000000000000000101;

// not    11111111111111111111111111111100
console.log("not:  ", (nandNot(a, a) >>> 0).toString(2));

// and    11111111111111111111111111110001
console.log("and:  ", (nandAnd(a,b) >>> 0).toString(2));

// or     11111111111111111111111111110111
console.log("or:   ", (nandOr(a,b) >>> 0).toString(2));

// nor    11111111111111111111111111111000
console.log("nor:  ", (nandNor(a,b) >>> 0).toString(2));

// xor    11111111111111111111111111110110
console.log("xor:  ", (nandXor(a,b) >>> 0).toString(2));

// xnor   11111111111111111111111111111001
console.log("xnor: ", (nandXnor(a,b) >>> 0).toString(2));