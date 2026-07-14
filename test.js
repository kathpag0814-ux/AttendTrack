const dns = require("dns");

dns.resolveSrv("_mongodb._tcp.attendtrack.dt2vekz.mongodb.net", (err, addresses) => {
  if (err) {
    console.error(err);
  } else {
    console.log(addresses);
  }
});