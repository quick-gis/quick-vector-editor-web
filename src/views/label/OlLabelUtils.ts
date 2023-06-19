import { Fill, Stroke, Style } from 'ol/style'
import CircleStyle from 'ol/style/Circle'

export function createText(
  {
    TextAglin,
    TextBaseline,
    TextFont,
    FillColor,
    TextColor,
    TextOutlineColor,
    TextOffsetX,
    TextOffsetY,
    TextRotation,
    TextWeight,
    TextSize
  },
  feature
) {
  // @ts-ignore
  return new Text({
    textAlign: TextAglin,
    textBaseline: TextBaseline,
    font: `${TextWeight} ${TextSize}px ${TextFont}`,
    text: feature.values_.name,
    fill: new Fill({ color: FillColor }),
    stroke: new Stroke({ color: TextColor, width: TextOutlineColor }),
    offsetX: TextOffsetX,
    offsetY: TextOffsetY,
    rotation: (TextRotation / 180) * Math.PI
  })
}

export function createPointStyleFn(Point: any) {
  let { Size, FillColor, StrokeColor, StrokeWidth } = Point
  return new Style({
    image: new CircleStyle({
      radius: Size,
      fill: new Fill({ color: FillColor }),
      stroke: new Stroke({ color: StrokeColor, width: StrokeWidth })
    }),
    text: createText(Point, null)
  })
}

export function createLineStyleFn(feature: any, Line: any) {
  let { StrokeColor, StrokeWidth } = Line
  return new Style({
    stroke: new Stroke({ color: StrokeColor, width: StrokeWidth }),
    text: createText(Line, feature)
  })
}

export function createPolygonStyleFn(feature: any, Polygon: any) {
  let { FillColor, StrokeColor, StrokeWidth } = Polygon
  return new Style({
    fill: new Fill({ color: FillColor }),
    stroke: new Stroke({ color: StrokeColor, width: StrokeWidth }),
    text: createText(Polygon, feature)
  })
}
