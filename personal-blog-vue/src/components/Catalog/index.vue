<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, type PropType } from "vue";
import { useScroll, watchThrottled } from "@vueuse/core";

const titleList = ref<any[]>([]);
const currentIndex = ref(0);

// 定义 VMdPreview 组件的类型
interface VMdPreviewInstance {
  $el: HTMLElement;
}

const props = defineProps({
  domRef: {
    type: Object as PropType<VMdPreviewInstance | null>,
    default: null,
  },
});

let observer: MutationObserver | null = null;

// 提取标题
const getTitles = () => {
  if (!props.domRef?.$el) return;

  const anchors = props.domRef.$el.querySelectorAll("h1,h2,h3");
  const titles = Array.from(anchors).filter((t: HTMLElement) => !!t.innerText.trim());

  if (!titles.length) {
    titleList.value = [];
    return;
  }

  const hTags = Array.from(new Set(titles.map((t: HTMLElement) => t.tagName))).sort();

  titleList.value = titles.map((el: HTMLElement, idx: number) => {
    return {
      title: el.innerText,
      lineIndex: el.getAttribute("data-v-md-line"),
      indent: hTags.indexOf(el.tagName),
    };
  });
};

// 点击锚点目录
function handleAnchorClick(anchor: any, idx: number) {
  if (!props.domRef?.$el) return;
  const heading = props.domRef.$el.querySelector(`[data-v-md-line="${anchor.lineIndex}"]`);
  // const heading = preview.querySelector(`#${anchor.title}`)
  if (heading) {
    window.scrollTo({
      top: heading.getBoundingClientRect().top + window.scrollY - 40, // 适配导航栏偏移
      behavior: "smooth",
    });
    setTimeout(() => (currentIndex.value = idx), 600);
  }
}

// * 实现目录高亮当前位置的标题
// 思路: 循环的方式将标题距离顶部距离与滚动条当前位置对比, 来确定高亮的标题
const { y } = useScroll(window);

watchThrottled(
  y,
  () => {
    if (!props.domRef?.$el) return;

    const scrollY = y.value;
    for (let idx = 0; idx < titleList.value.length; idx++) {
      const e = titleList.value[idx];
      const heading = props.domRef.$el.querySelector(
        `[data-v-md-line="${e.lineIndex}"]`
      ) as HTMLElement;
      if (heading && scrollY >= heading.offsetTop - 60) {
        currentIndex.value = idx;
      }
    }
  },
  { throttle: 200, immediate: true }
);

onMounted(() => {
  nextTick(() => {
    // 监听 DOM 变化确保标题提取
    if (props.domRef?.$el) {
      observer = new MutationObserver(() => {
        getTitles();
      });
      observer.observe(props.domRef.$el, {
        childList: true,
        subtree: true,
      });
    }

    // 初次加载
    setTimeout(() => {
      getTitles();
    }, 300);
  });
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>