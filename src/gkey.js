function genkey(l) {
var key = "";
var ma = MD5(l)
for (i = 0; i < 100000; i++) {
  ma = MD5(ma);
}
key = ma
return key;
}