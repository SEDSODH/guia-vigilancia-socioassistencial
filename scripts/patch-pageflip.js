import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const uiPath = resolve(__dirname, '../node_modules/page-flip/src/UI/UI.ts')

const ALREADY_PATCHED = `if (this.app.getState() !== FlippingState.READ) {
                e.preventDefault();
            }`

const BEFORE = `private onMouseDown = (e: MouseEvent): void => {
        if (this.checkTarget(e.target)) {
            const pos = this.getMousePos(e.clientX, e.clientY);
            this.app.startUserTouch(pos);
            e.preventDefault();
        }
    };`

const AFTER = `private onMouseDown = (e: MouseEvent): void => {
        if (this.checkTarget(e.target)) {
            const pos = this.getMousePos(e.clientX, e.clientY);
            this.app.startUserTouch(pos);
            if (this.app.getState() !== FlippingState.READ) {
                e.preventDefault();
            }
        }
    };`

if (!existsSync(uiPath)) {
  console.warn('[patch-pageflip] UI.ts not found, skipping.')
  process.exit(0)
}

const content = readFileSync(uiPath, 'utf8')

if (content.includes(ALREADY_PATCHED)) {
  console.log('[patch-pageflip] Already patched.')
} else if (content.includes(BEFORE)) {
  writeFileSync(uiPath, content.replace(BEFORE, AFTER))
  console.log('[patch-pageflip] Patched page-flip UI.ts — text selection restored in book mode.')
} else {
  console.warn('[patch-pageflip] Pattern not found — library may have changed.')
}