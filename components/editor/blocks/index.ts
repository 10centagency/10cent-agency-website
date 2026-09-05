import { registerBlocks } from '../registry'
import { coreBlocks } from './core'
import { mediaBlocks } from './media'
import { layoutBlocks } from './layout'
import { designBlocks } from './design'
import { marketingBlocks } from './marketing'
import { advancedBlocks } from './advanced'

/**
 * ★★★  নতুন block যোগ করার একমাত্র জায়গা  ★★★
 * 1. blocks/ ফোল্ডারে নতুন ফাইল বানান (যেমন blocks/embeds.tsx)
 * 2. নিচের array তে সেটা যোগ করুন
 * → Inserter, slash menu, inspector, extension list, static render — সব auto-update
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
