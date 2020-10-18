Module.register('MMM-MagicHexClock', {
  defaults: {
    fontSize: '65px',
    showHex: true,
    showTime: true,
    timeFormat: config.timeFormat,
  },

  start: function () {
    Log.info('Starting module: ' + this.name);
    this.getTime();
    this.config.timeFormat = parseInt(this.config.timeFormat, 10);

    let self = this;
    setInterval(function () {
      self.getTime();
    }, 1000);
  },

  getStyles: function () {
    return ['MMM-MagicHexClock.css'];
  },

  addZero: function (n) {
    return n < 10 ? '0' + n : '' + n;
  },

  calcLum: function (c) {
    return (x = Math.sqrt(
      0.299 * Math.pow(parseInt(c.substr(1, 2), 16), 2) +
        0.587 * Math.pow(parseInt(c.substr(3, 2), 16), 2) +
        0.114 * Math.pow(parseInt(c.substr(5, 2), 16), 2)
    ));
  },

  timeToHex: function (n, fact) {
    n *= fact;
    if (n < 0) {
      n = 0xffffffff + n + 1;
    }
    return Math.floor(n).toString(16).toUpperCase();
  },

  getTime: function () {
    const t = new Date();
    let ampm = '',
      h = '',
      m = '',
      s = '',
      hh = '',
      hm = '',
      hs = '';

    const timClock = document.querySelector('.magic-tim-clock'),
      hexClock = document.querySelector('.magic-hex-clock');

    h = this.addZero(t.getHours().toString());
    m = this.addZero(t.getMinutes().toString());
    s = this.addZero(t.getSeconds().toString());

    if (this.config.timeFormat !== 24) {
      ampm = h >= 12 ? 'pm' : 'am';
      h = h % 12 || 12;
      h = this.addZero(h.toString());
    }

    hh = this.addZero(this.timeToHex(h, 255 / this.config.timeFormat));
    hm = this.addZero(this.timeToHex(m, 255 / 60));
    hs = this.addZero(this.timeToHex(s, 255 / 60));
    lum = this.calcLum('#' + hh + hm + hs);

    if (timClock && this.config.showTime) {
      timClock.innerHTML = h + ':' + m + ':' + s + ampm;
      timClock.style.color = '#' + hh + hm + hs;
      timClock.style.textShadow = lum > 128 ? '0 0 4px #000' : '0 0 4px #fff';
    }

    if (hexClock && this.config.showHex) {
      hexClock.innerHTML = '#' + hh + hm + hs;
      hexClock.style.color = '#' + hh + hm + hs;
      hexClock.style.textShadow = lum > 128 ? '0 0 4px #000' : '0 0 4px #fff';
    }
  },

  getDom: function () {
    let wrapper = document.createElement('div');
    let timClock = document.createElement('div');
    let hexClock = document.createElement('div');

    if (this.config.showTime) {
      timClock.classList.add('magic-tim-clock');
      timClock.style.fontSize = this.config.fontSize;
      wrapper.appendChild(timClock);
    }

    if (this.config.showHex) {
      hexClock.classList.add('magic-hex-clock');
      hexClock.style.fontSize = this.config.fontSize;
      wrapper.appendChild(hexClock);
    }

    wrapper.classList.add('light');

    return wrapper;
  },
});
