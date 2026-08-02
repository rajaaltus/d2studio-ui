// One hover state per card, shared by everything that reacts to it: the dashed
// frame, the icon bloom, the code scramble and the marquee speed.
//
// Pointer screens hover. Below lg there is nothing to hover with, so the card
// rests in its normal state and a *tap* plays the hovered one for HOLD before it
// falls back on its own — a tap is a moment, not a pointer that stays put, so
// the state can't wait for a "leave" that never comes. Tapping again re-arms it.
// Every caller resolves to the same `.b4-card` element and writes the same
// `b4-on` class, which is what the CSS half of the state
// (`[.b4-card.b4-on_&]:` utilities, globals.css) keys off.

export const TOUCH = "(max-width: 1023px)"
const HOLD = 4000

export function onCardHover(target: Element, enter: () => void, leave: () => void) {
    const el = target.closest(".b4-card") ?? target
    const mq = window.matchMedia(TOUCH)
    let on = false

    const set = (next: boolean) => {
        if (next === on) return
        on = next
        el.classList.toggle("b4-on", on)
        ;(on ? enter : leave)()
    }
    const show = () => set(true)
    const hide = () => set(false)

    let timer = 0
    const tap = () => {
        clearTimeout(timer)
        show()
        timer = window.setTimeout(hide, HOLD)
    }

    const unbind = () => {
        clearTimeout(timer)
        el.removeEventListener("pointerenter", show)
        el.removeEventListener("pointerleave", hide)
        el.removeEventListener("click", tap)
    }

    // Re-bound on breakpoint change so resizing across it works without a reload.
    const sync = () => {
        unbind()
        hide()
        if (mq.matches) {
            el.addEventListener("click", tap)
        } else {
            el.addEventListener("pointerenter", show)
            el.addEventListener("pointerleave", hide)
        }
    }
    sync()
    mq.addEventListener("change", sync)

    return () => {
        mq.removeEventListener("change", sync)
        unbind()
    }
}
