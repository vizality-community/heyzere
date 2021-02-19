import { readdirSync } from 'fs';
import { join } from 'path';

import { getRandomItem } from '@vizality/util/array';
import { Plugin } from '@vizality/entities';

export default class HeyZere extends Plugin {
  async start () {
    vizality.api.commands.registerCommand({
      command: 'heyzere',
      description: 'Replaces every image with a random image of Zerebos.',
      executor: this.heyZere.bind(this)
    });

    this.zeres = readdirSync(join(__dirname, 'assets', 'zerebos'), { withFileTypes: true })
      .filter(item => !item.isDirectory())
      .map(item => item.name);

    this.zeres = this.zeres.map(z => `vz-plugin://${this.addonId}/assets/zerebos/${z}`);
  }

  async stop () {
    clearInterval(this.interval);
    vizality.api.commands.unregisterCommand('heyzere');
  }

  heyZere () {
    this.interval = setInterval(() => {
      document.querySelectorAll('[style*="background-image"]')
        .forEach(({ style }) => {
          if (!this.zeres.filter(url => style.backgroundImage.includes(url)).length) {
            style.backgroundImage = `url(${getRandomItem(this.zeres)})`;
          }
        });

      document.querySelectorAll('img')
        .forEach(image => {
          if (!this.zeres.includes(image.src)) {
            image.src = getRandomItem(this.zeres);
          }
        });
    }, 50);

    return {
      send: false,
      result: `Your Discord has been Zere-fied. To undo this change, you'll have to reload!`
    };
  }
}
