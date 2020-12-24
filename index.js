import { readdirSync } from 'fs';
import { join } from 'path';

import { getRandomArrayItem } from '@vizality/util/array';
import { Plugin } from '@vizality/core';

export default class HeyZere extends Plugin {
  async onStart () {
    vizality.api.commands.registerCommand({
      command: 'heyzere',
      description: 'Replaces every image with a random image of Zerebos.',
      usage: '{c}',
      executor: this.heyZere.bind(this)
    });

    this.zeres = readdirSync(join(__dirname, 'assets', 'zerebos'), { withFileTypes: true })
      .filter(item => !item.isDirectory())
      .map(item => item.name);

    this.zeres = this.zeres.map(z => `vz-plugin://${this.addonId}/assets/zerebos/${z}`);
  }

  async onStop () {
    clearInterval(this.interval);
    vizality.api.commands.unregisterCommand('heyzere');
  }

  heyZere () {
    this.interval = setInterval(() => {
      document.querySelectorAll('[style*="background-image"]')
        .forEach(({ style }) => {
          if (!this.zeres.filter(url => style.backgroundImage.includes(url)).length) {
            style.backgroundImage = `url(${getRandomArrayItem(this.zeres)})`;
          }
        });

      document.querySelectorAll('img')
        .forEach(image => {
          if (!this.zeres.includes(image.src)) {
            image.src = getRandomArrayItem(this.zeres);
          }
        });
    }, 50);
  }
}
