import Pbf from "pbf";
import { Buffer } from "node:buffer";

// One actual vector-tile point, deliberately missing the numeric rank attribute.
export function seaLabelTile() {
  const pbf = new Pbf();
  pbf.writeMessage(3, (_unused, layer) => {
    layer.writeStringField(1, "water_label");
    layer.writeMessage(2, (_unused, feature) => {
      feature.writeVarintField(1, 1);
      feature.writePackedVarint(2, [0, 0]);
      feature.writeVarintField(3, 1);
      feature.writePackedVarint(4, [9, 4096, 4096]);
    });
    layer.writeStringField(3, "name");
    layer.writeMessage(4, (_unused, value) => value.writeStringField(1, "海"));
    layer.writeVarintField(5, 4096);
    layer.writeVarintField(15, 2);
  });
  return Buffer.from(pbf.finish());
}
