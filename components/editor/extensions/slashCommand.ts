import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import SlashList, { type SlashListHandle } from '../surfaces/SlashList'
import { insertBlock, searchBlocks } from '../registry'
import type { InserterItem } from '../types'

/**
 * Slash command ("/") — registry থেকে সরাসরি items আসে,
 * তাই নতুন block যোগ করলে স্ল্যাশ মেনুতেও সাথে সাথে চলে আসে।
 */
export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    return [
      Suggestion<InserterItem>({
        editor: this.editor,
        char: '/',
        allowSpaces: false,
        startOfLine: false,

        items: ({ query }) => searchBlocks(query).slice(0, 10),

        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).run()
          insertBlock(editor, props.blockName, props.attrs)
        },

        render: () => {
          let renderer: ReactRenderer<SlashListHandle, SlashListProps> | null = null
          let el: HTMLDivElement | null = null

          const position = (clientRect?: (() => DOMRect | null) | null) => {
            const rect = clientRect?.()
            if (!rect || !el) return
            const h = el.offsetHeight || 300
            const spaceBelow = window.innerHeight - rect.bottom
            el.style.position = 'fixed'
            el.style.zIndex = '9999'
            el.style.top = `${spaceBelow < h + 24 ? Math.max(8, rect.top - h - 8) : rect.bottom + 8}px`
            el.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 320))}px`
          }

          const cleanup = () => {
            renderer?.destroy()
            el?.remove()
            renderer = null
            el = null
          }

          return {
            onStart: (props) => {
              renderer = new ReactRenderer(SlashList, {
                props: { items: props.items, command: (item: InserterItem) => props.command(item) },
                editor: props.editor,
              })
              el = document.createElement('div')
              el.appendChild(renderer.element)
              document.body.appendChild(el)
              requestAnimationFrame(() => position(props.clientRect))
            },
            onUpdate: (props) => {
              renderer?.updateProps({ items: props.items, command: (item: InserterItem) => props.command(item) })
              requestAnimationFrame(() => position(props.clientRect))
            },
            onKeyDown: (props) => {
              if (props.event.key === 'Escape') {
                cleanup()
                return true
              }
              return renderer?.ref?.onKeyDown({ event: props.event }) ?? false
            },
            onExit: cleanup,
          }
        },
      }),
    ]
  },
})

type SlashListProps = { items: InserterItem[]; command: (item: InserterItem) => void }
