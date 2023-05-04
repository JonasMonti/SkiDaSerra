<script lang="ts">
  import { onMount } from "svelte";

  let images = ["carousel/1.jpg", "carousel/2.jpg", "carousel/3.jpg"];

  let currentImage = 0;

  let isTransitioning = false;

  let interval: number | undefined;

  onMount(() => {
    interval = setInterval(() => {
      isTransitioning = true;

      setTimeout(() => {
        currentImage = (currentImage + 1) % images.length;
      }, 300);

      setTimeout(() => {
        isTransitioning = false;
      }, 600);
    }, 5000);
  });

  const changeImage = (index: number) => {
    currentImage = index;
    clearInterval(interval);
  };
</script>

<div
  class="relative w-full flex flex-col items-center overflow-clip bg-neutral-800 rounded-xl select-none"
>
  <img
    class={isTransitioning
      ? "animate-move-in-right w-full h-[calc(100vh-12em)] object-cover pointer-events-none"
      : "w-full h-[calc(100vh-12em)] object-cover pointer-events-none"}
    src={images[currentImage]}
    alt=""
  />

  <button
    on:click={() =>
      changeImage((currentImage - 1 + images.length) % images.length)}
    class="absolute top-1/2 left-8 p-2 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white border border-neutral-300 disabled:opacity-50"
    disabled={currentImage === 0}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="w-5 h-5"
    >
      <path
        fill-rule="evenodd"
        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
        clip-rule="evenodd"
      />
    </svg>
  </button>

  <button
    on:click={() => changeImage((currentImage + 1) % images.length)}
    class="
      absolute top-1/2 right-0
      p-2
      bg-white rounded-full
      transform -translate-y-1/2 -translate-x-1/2
      focus:outline-none
      focus-visible:ring-2 focus-visible:ring-white
      border border-neutral-300
      disabled:opacity-50"
    disabled={currentImage === images.length - 1}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="w-5 h-5"
    >
      <path
        fill-rule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clip-rule="evenodd"
      />
    </svg>
  </button>

  <div class="flex gap-2 my-3">
    {#each images as _, i}
      <button
        on:click={() => changeImage(i)}
        on:keydown={() => changeImage(i)}
        class={currentImage === i
          ? "w-3 h-3 rounded-full border border-white bg-white"
          : "w-3 h-3 rounded-full border border-white"}
      />
    {/each}
  </div>
</div>
