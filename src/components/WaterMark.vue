<template>
  <div class="watermark-container" ref="parentRef">
    <slot></slot>
    <!-- 添加一个div，填充满整个区域，设置水印 -->
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watchEffect } from "vue";
import useWatermarkBg from "./useWatermarkBg";
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
let props = defineProps({
  text: {
    type: String,
    required: true,
    default: "watermark",
  },
  fontSize: {
    type: Number,
    default: 40,
  },
  gap: {
    type: Number,
    default: 20,
  },
});

let bg = useWatermarkBg(props);
let parentRef = ref(null);
let ob = null;
let div = null;
let flag = ref(0);
// 1.生成水印
// 2.防篡改(删除加修改)
watchEffect(() => {
  flag.value;
  if (!parentRef.value) {
    return;
  }
  if (div) {
    div.remove();
  }

  // console.log(bg.value);

  if (bg.value) {
    let { base64, styleSize } = bg.value;
    div = document.createElement("div");
    div.style.backgroundImage = `url(${base64})`;
    div.style.backgroundSize = `${styleSize}px ${styleSize}px`;
    div.style.backgroundRepeat = "repeat";
    div.style.width = "100%";
    div.style.height = "100%";
    // @ts-ignore
    div.style.zIndex = 9999;
    div.style.position = "absolute";
    // @ts-ignore
    div.style.inset = 0;
    // @ts-ignore
    parentRef.value.appendChild(div);
  }
});
onMounted(() => {
  ob = new MutationObserver((records) => {
    console.log("records", records);
    for (let record of records) {
      // 监控删除
      for (let dom of record.removedNodes) {
        if (dom === div) {
          console.log("删除了水印");
          flag.value++;
        }
      }
      // 监控修改样式
      if (record.target === div) {
        flag.value++;
        return;
      }
    }
  });
  // @ts-ignore
  ob.observe(parentRef.value, {
    childList: true,
    attributes: true,
    subtree: true,
  });
});
onUnmounted(() => {
  ob.unobserve(parentRef.value);
  div = null;
});
// @ts-ignore
</script>
<style scoped>
.watermark-container {
  position: relative;
}
</style>
