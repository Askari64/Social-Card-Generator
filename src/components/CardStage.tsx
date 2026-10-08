"use client";
// The card canvas. Inner node is always exactly 560x320 (the design canvas);
// the outer wrapper applies a CSS scale so it fits its container. Export
// captures the inner node at pixelRatio 2, so what you see is what downloads.
import { forwardRef } from "react";
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
