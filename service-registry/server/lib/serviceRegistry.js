const semver = require('semver');

class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 30;
  }

  // Querying the registry
  // get service given name and version
  get(name, version) {
    const candidates = Object.values(this.services)
      .filter(service => service.name === name && semver.satisfies(service.version, version));

    return candidates[Math.floor(Math.random() * candidates.length)];
  }


  // Uniique Key stores reference of a service in the registry structure
  // service can be uniquely identified by its name, version, ip and port

  register(name, version, ip, port) {
    const key = name + version + ip + port;

    // If a service that is  new and is not part of the services array

    if (!this.services[key]) {
      this.services[key] = {};
      this.services[key].timestamp = Math.floor(new Date() / 1000);
      this.services[key].ip = ip;
      this.services[key].name = name;
      this.services[key].port = port;
      this.services[key].version = version;
      this.log.debug(`Added services ${name}, version ${version} at ${ip}:${port}`);
      return key;
    }
    // for service already in the system.
    this.services[key].timestamp = Math.floor(new Date() / 1000);
    this.log.debug(` Updated services ${name}, version ${version} at ${ip}:${port}`);
    return key;
  }

  unregister(name, version, ip, port) {
    const key = name + version + ip + port;
    delete this.services[key];
    return key;
  }
}

module.exports = ServiceRegistry;
