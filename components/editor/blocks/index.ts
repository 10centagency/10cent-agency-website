import { registerBlocks } from '../registry'
import { coreBlocks } from './core'
import { mediaBlocks } from './media'
import { layoutBlocks } from './layout'
import { designBlocks } from './design'
import { marketingBlocks } from './marketing'
import { advancedBlocks } from './advanced'

/**
 * ★★★  The single place to add a new block  ★★★
 * 1. Create a new file in blocks/ (e.g. blocks/embeds.tsx)
 * 2. Add it to the array below
 * → Inserter, slash menu, inspector, extension list, static render — all update automatically
 */
export function registerAllBlocks() {
  registerBlocks([
    ...coreBlocks,
    ...mediaBlocks,
    ...layoutBlocks,
    ...designBlocks,
    ...marketingBlocks,
    ...advancedBlocks,
  ])
}

export { coreBlocks, mediaBlocks, layoutBlocks, designBlocks, marketingBlocks, advancedBlocks }

