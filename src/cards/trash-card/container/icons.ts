import { LitElement, css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { customElement, property, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';

import '../items/icon';

import type { BaseContainerElement } from './BaseContainerElement';
import type { TrashCardConfig } from '../trash-card-config';
import type { HassEntity } from 'home-assistant-js-websocket';
import type { CalendarItem } from '../../../utils/calendarItem';
import type { HomeAssistant } from '../../../utils/ha';

@customElement(`${TRASH_CARD_NAME}-icons-container`)
class Icons extends LitElement implements BaseContainerElement {
  @state() private items?: CalendarItem[];

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: TrashCardConfig;

  public setConfig (config?: TrashCardConfig) {
    this.config = config;
  }

  public setItems (items?: CalendarItem[]) {
    this.items = items;
  }

  public setHass (hass?: HomeAssistant) {
    this.hass = hass;
  }

  public render () {
    if (!this.config || !this.hass || !this.config.entity) {
      return nothing;
    }

    const entityId = this.config.entity;
    const stateObj = this.hass.states[entityId] as HassEntity | undefined;

    if (!stateObj || !this.items || this.items.length === 0) {
      return nothing;
    }

    const itemsPerRow = this.items.length;

    const cssStyleMap = styleMap({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'grid-template-columns': `repeat(${itemsPerRow}, calc(calc(100% - calc(${(itemsPerRow - 1) * 5} * var(--grid-card-gap, 2px))) / ${itemsPerRow}))`
    });

    return html`
        <div style=${cssStyleMap} class="icons-container">
          ${this.items.map((item, idx) => html`
              <trash-card-icon-card
                .item=${{ ...item, nextEvent: idx === 0 }}
                .config=${this.config}
                .hass=${this.hass}
              >
              </trash-card-icon-card>
            `)}
        </div>
      `;
  }

  public static get styles () {
    return [
      css`
        .icons-container {
          display: grid;
          grid-auto-rows: 1fr;
          grid-gap: var(--grid-card-gap, 2px);
        }
        trash-card-icon-card {
          grid-row: auto / span 1;
        }
      `
    ];
  }
}

export {
  Icons
};
