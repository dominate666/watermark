import { computed } from "vue";

export default function useWatermarkBg(props) {
  return computed(() => {
    let canvas = document.createElement("canvas");
    let devicePixelRadio = window.devicePixelRatio || 1;
    let fontSize = props.fontSize * devicePixelRadio;
    let font = fontSize + "px serif";
    let ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = font;
      let { width } = ctx.measureText(props.text);
      let canvasSize = Math.max(100, width) + props.gap * devicePixelRadio;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((Math.PI / 180) * -45);
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(props.text, 0, 0);
      return {
        base64: canvas.toDataURL(),
        size: canvasSize,
        styleSize: canvasSize / devicePixelRadio,
      };
    }
  });
}
