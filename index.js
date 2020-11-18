const { join } = require('path');

const { array: { getRandomArrayItem }, file: { getObjectURL } } = require('@vizality/util');
const { Plugin } = require('@vizality/entities');

module.exports = class HeyZere extends Plugin {
  constructor () {
    super();
    this.URLs = [];
    this.observer = null;
  }

  onStart () {
    vizality.api.commands.registerCommand({
      command: 'heyzere',
      description: 'Replaces every image with a random image of Zerebos.',
      usage: '{c}',
      executor: this._convertToBlobURL.bind(this)
    });
  }

  async onStop () {
    clearInterval(this.interval);
    vizality.api.commands.unregisterCommand('heyzere');
    await this.URLs.forEach(url => URL.revokeObjectURL(url))
      .then(() => this.URLs = []);
  }

  async _convertToBlobURL () {
    this.URLs = await getObjectURL(join(__dirname, 'assets', 'zerebos'));
    this.heyZere();
  }

  heyZere () {
    this.interval = setInterval(() => {
      document.querySelectorAll('[style*="background-image"]')
        .forEach(({ style }) => {
          if (!this.URLs.filter(url => style.backgroundImage.includes(url)).length) {
            style.backgroundImage = `url("${getRandomArrayItem(this.URLs)}")`;
          }
        });

      document.querySelectorAll('img')
        .forEach(image => {
          if (!this.URLs.includes(image.src)) {
            image.src = getRandomArrayItem(this.URLs);
          }
        });
    }, 50);
  }
};
