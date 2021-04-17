const dgram = require("dgram");

const OAM_DELIM = "#";

class OAM {
  constructor(IP, port, appid, oidPrefix) {
    this.oamServerPort = port;
    this.oamServerIp = IP;
    this.appid = appid;
    this.oidPrefix = oidPrefix;
  }

  getMessage(trap) {
    let alert_details =
      this.appid +
      "." +
      this.oidPrefix +
      "." +
      trap.oid +
      OAM_DELIM +
      this.getSeverity(trap.severity) +
      OAM_DELIM +
      trap.msg +
      OAM_DELIM +
      trap.type +
      OAM_DELIM +
      trap.severity +
      OAM_DELIM +
      trap.project;
    if (global.logger && typeof global.logger.warn == "function") {
      global.logger.warn("ALERT:" + alert_details);
    } else {
      console.warn("ALERT:" + alert_details);
    }
    return Buffer.from(alert_details);
  }

  snmpSendTrap(trap, cb) {
    let client = dgram.createSocket("udp4");
    let message = this.getMessage(trap);

    try {
      client.send(message, 0, message.length, this.oamServerPort, this.oamServerIp, (err, bytes) => {
        if (err) {
          if (global.logger && typeof global.logger.error == "function") {
            global.logger.error("FAILED TO RAISE ALERT: ", err);
          }
          cb(err);
        } else {
          cb(null, true);
          if (global.logger && typeof global.logger.warn == "function") {
            global.logger.warn("OAM Alert : " + trap.type + " : " + trap.severity + " : " + trap.msg);
          } else {
            console.warn("OAM Alert : " + trap.type + " : " + trap.severity + " : " + trap.msg);
          }
        }
        client.close();
      });
    } catch (error) {
      cb(error);
    }
  }

  getSeverity(severity) {
    switch (severity) {
      case "OK":
        return 0;
      case "WARNING":
        return 1;
      case "CRITICAL":
        return 2;
      case "UNKNOWN":
        return 3;
      default:
        return 3;
    }
  }

  connected() {
    return new Promise((resolve) => {
      let client = dgram.createSocket("udp4");
      client.bind({ port: this.oamServerPort, address: this.oamServerIp }, (err, bytes) => {
        client.close();
        if (err) resolve(false);
        else resolve(true);
      });
    });
  }
}

module.exports = OAM;
