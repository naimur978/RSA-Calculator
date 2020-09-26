let p = 0;
let q = 0;
let n = 0;
let phi = 0;
let E = 0;
let d = 0;
let eArray = [];

function isPrime(x) {
  if (x <= 1) return false;
  for (var i = 2; i < x; ++i) {
    if (x % i == 0) return false;
  }
  return true;
}

function gcd(a, b) {
  if (b == 0) return a;
  return gcd(b, a % b);
}

function populateEArray() {
  eArray = [];
  for (var i = 2; i < phi; ++i) {
    if (gcd(i, phi) == 1) eArray.push(i);
  }
}

function savePQ(event) {
  event.preventDefault();
  p = event.target[1].value;
  q = event.target[2].value;
  if (!isPrime(p)) {
    $("#p-not-prime-text").show();
    return;
  }
  if (!isPrime(q)) {
    $("#q-not-prime-text").show();
    return;
  }
  resetPQError();
  n = p * q;
  phi = (p - 1) * (q - 1);
  populateEArray();
  $("#n-value").text(n);
  $("#phi-value").text(phi);
  $("#e-array-value").text(eArray);
}

function modInverse(a, m) {
  [a, m] = [Number(a), Number(m)];
  if (Number.isNaN(a) || Number.isNaN(m)) {
    return NaN;
  }
  a = ((a % m) + m) % m;
  if (!a || m < 2) {
    return NaN;
  }

  const s = [];
  let b = m;
  while (b) {
    [a, b] = [b, a % b];
    s.push({ a, b });
  }
  if (a !== 1) {
    return NaN;
  }
  let x = 1;
  let y = 0;
  for (let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y, x - y * Math.floor(s[i].a / s[i].b)];
  }
  return ((y % m) + m) % m;
}

function modPow(a, b, m) {
  [a, b, m] = [Number(a), Number(b), Number(m)];
  if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(m)) {
    return NaN;
  }
  var res = 1;
  a %= m;
  if (a == 0) return 0;
  while (b > 0) {
    if (b & 1) res = (res * a) % m;
    b >>= 1;
    a = (a * a) % m;
  }
  return res;
}

function saveE(event) {
  event.preventDefault();
  if (!eArray.includes(parseInt(event.target[1].value))) {
    $("#e-not-in-array-text").show();
    return;
  }
  resetEError();
  E = event.target[1].value;
  d = modInverse(E, phi);
  $("#d-value").text(d);
  $("#public-key-value").text("(" + E + ", " + n + ")");
  $("#private-key-value").text("(" + d + ", " + n + ")");
  $("#message").attr("max", n);
  $("#cypher").attr("max", n);
}

function generateCipherFromMessage(event) {
  event.preventDefault();
  const msg = event.target[1].value;
  const cypher = modPow(msg, E, n);
  $("#converted-cypher").val(cypher);
}

function generateMessageFromCypher(event) {
  event.preventDefault();
  const cypher = event.target[1].value;
  const msg = modPow(cypher, d, n);
  $("#converted-message").val(msg);
}

function resetPQError() {
  $("#p-not-prime-text").hide();
  $("#q-not-prime-text").hide();
}

function resetEError() {
  $("#e-not-in-array-text").hide();
}

$(document).ready(function () {
  resetPQError();
  resetEError();
  $("#message").attr("max", 0);
  $("#cypher").attr("max", 0);
});
