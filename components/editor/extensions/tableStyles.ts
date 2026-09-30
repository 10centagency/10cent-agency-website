import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * TableStyles — TableKit itself provides no style options,
 * so we add attributes that can be controlled from the inspector.
 *
 * ⚠️ Two special things:
 * 1. A resizable table uses Tiptap TableView, which does not apply the node
 *    renderHTML attributes to the DOM. So the plugin below
 *    copies the attributes onto <table> on every document change.
 * 2. It must be present in BOTH editorExtensions() and renderExtensions(),
 *    otherwise the attributes are dropped in the server render.
 */
export const TableStyles = Extension.create({
  name: 'tableStyles',

  addGlobalAttributes() {
    return [
      {
        types: ['table'],
        attributes: {
          tableBorders: {
            default: 'all',
            parseHTML: (el) => el.getAttribute('data-table-borders') || 'all',
            renderHTML: (attrs) => ({ 'data-table-borders': attrs.tableBorders || 'all' }),
          },
          tableStriped: {
            default: false,
            parseHTML: (el) => el.getAttribute('data-table-striped') === 'true',
            renderHTML: (attrs) => (attrs.tableStriped ? { 'data-table-striped': 'true' } : {}),
          },
          tableCompact: {
            default: false,
            parseHTML: (el) => el.getAttribute('data-table-compact') === 'true',
            renderHTML: (attrs) => (attrs.tableCompact ? { 'data-table-compact': 'true' } : {}),
          },
          tableHover: {
            default: false,
            parseHTML: (el) => el.getAttribute('data-table-hover') === 'true',
            renderHTML: (attrs) => (attrs.tableHover ? { 'data-table-hover': 'true' } : {}),
          },
          // Set as a CSS custom property — so it also works on the public page
          // (background-colour cannot be set with attr(), but var() works)
          tableHeaderBg: {
            default: '',
            parseHTML: (el) => el.getAttribute('data-table-header-bg') || el.style.getPropertyValue('--table-header-bg') || '',
            renderHTML: (attrs) =>
              attrs.tableHeaderBg
                ? { 'data-table-header-bg': String(attrs.tableHeaderBg), style: `--table-header-bg:${attrs.tableHeaderBg}` }
                : {},
          },
          tableSticky: {
            default: false,
            parseHTML: (el) => el.getAttribute('data-table-sticky') === 'true',
            renderHTML: (attrs) => (attrs.tableSticky ? { 'data-table-sticky': 'true' } : {}),
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    const apply = (el: HTMLElement, name: string, value: unknown) => {
      if (value === null || value === undefined || value === false || value === '') {
        el.removeAttribute(name)
      } else {
        el.setAttribute(name, String(value))
      }
    }

    return [
      new Plugin({
        key: new PluginKey('tableStylesSync'),
        view(pmView) {
          const sync = () => {
            const { state } = pmView
            state.doc.descendants((node, pos) => {
              if (node.type.name !== 'table') return
              const dom = pmView.nodeDOM(pos)
              if (!dom || !(dom instanceof HTMLElement)) return
              const table: HTMLElement | null =
                dom.tagName === 'TABLE' ? dom : dom.querySelector('table')
              if (!table) return
              apply(table, 'data-table-borders', node.attrs.tableBorders || 'all')
              apply(table, 'data-table-striped', node.attrs.tableStriped ? 'true' : null)
              apply(table, 'data-table-compact', node.attrs.tableCompact ? 'true' : null)
              apply(table, 'data-table-hover', node.attrs.tableHover ? 'true' : null)
              apply(table, 'data-table-sticky', node.attrs.tableSticky ? 'true' : null)
              if (node.attrs.tableHeaderBg) {
                apply(table, 'data-table-header-bg', node.attrs.tableHeaderBg)
                table.style.setProperty('--table-header-bg', String(node.attrs.tableHeaderBg))
              } else {
                apply(table, 'data-table-header-bg', null)
                table.style.removeProperty('--table-header-bg')
              }
            })
          }

          // Must run after TableView is created on the first render
          requestAnimationFrame(sync)
          return { update: sync }
        },
      }),
    ]
  },
})

