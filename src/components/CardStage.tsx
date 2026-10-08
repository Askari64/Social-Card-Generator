"use client";
// The card canvas. Inner node is always exactly 560x320 (the design canvas);
// the outer wrapper applies a CSS scale so it fits its container. Export
// captures the inner node at pixelRatio 2, so what you see is what downloads.
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { TEMPLATES, CARD_W, CARD_H, type CardRenderProps } from "@/lib/templates";

interface Props extends CardRenderProps {
  templateId: number;
  scale?: number;
}

const CardStage = forwardRef<HTMLDivElement, Props>(function CardStage({ p, qr, templateId, scale = 1 }, ref) {
  const t = TEMPLATES[templateId] ?? TEMPLATES[0];
  const Card = t.Card;
  return (
    <div style={{ width: CARD_W * scale, height: CARD_H * scale }} className="shrink-0">
      <div
        ref={ref}
        style={{ width: CARD_W, height: CARD_H, transform: `scale(${scale})`, transformOrigin: "top left" }}
        className="overflow-hidden shadow-2xl"
      >
        <Card p={p} qr={qr} />
      </div>
    </div>
  );
});

export default CardStage;
export { CARD_W, CARD_H };

// Layout effect on the client only: SSR/print keep the max-scale render and
// the fit correction lands before the browser paints, so phones never see a
// clipped full-size card.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// FitStage renders the same card but picks the largest scale (up to maxScale)
// that fits its parent's width, so the card never overflows or clips on
// narrow screens. Re-measures on resize / orientation change.
export function FitStage({ maxScale = 1, ref, ...props }: Props & { maxScale?: number; ref?: React.Ref<HTMLDivElement> }) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(maxScale);
  useIsoLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(maxScale, el.clientWidth / CARD_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxScale]);
  return (
    <div ref={boxRef} className="w-full">
      <div className="mx-auto w-fit">
        <CardStage {...props} ref={ref} scale={scale} />
      </div>
    </div>
  );
}

// useElementWidth reports an element's content width, live. Used by the
// landing hero fan to scale its three cards to the available column.
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}
