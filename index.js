const { readdirSync, readFileSync } = require('fs');
const { join, extname } = require('path');

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
      executor: this.convertImagesToObjectURLs.bind(this)
    });
  }

  onStop () {
    clearInterval(this.interval);
    vizality.api.commands.unregisterCommand('heyzere');
    this.URLs.forEach(url => URL.revokeObjectURL(url));
  }

  convertImagesToObjectURLs () {
    const validExtensions = [ '.png', '.jpg', '.jpeg', '.webp', '.gif' ];
    readdirSync(join(__dirname, 'assets', 'zerebos'))
      .filter(file => validExtensions.indexOf(extname(file) !== -1))
      .map(file => {
        const image = join(__dirname, 'assets', 'zerebos', file);
        const buffer = readFileSync(image);
        const ext = extname(file).slice(1);
        const blob = new Blob([ buffer ], { type: `image/${ext}` });
        return this.URLs.push(URL.createObjectURL(blob));
      });

    this.heyZere();
  }

  getRandomURL () {
    return this.URLs[Math.floor(Math.random() * this.URLs.length)];
  }

  heyZere () {
    this.interval = setInterval(() => {
      document.querySelectorAll('[style*="background-image"]')
        .forEach(({ style }) => {
          if (!this.URLs.filter(url => style.backgroundImage.includes(url)).length) {
            console.log('test');
            style.backgroundImage = `url("${this.getRandomURL()}")`;
          }
        });

      document.querySelectorAll('img')
        .forEach(image => {
          if (!this.URLs.includes(image.src)) {
            image.src = this.getRandomURL();
          }
        });
    }, 50);
  }
};
