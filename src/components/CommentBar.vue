<script setup lang="ts">
import { getCommentBar } from "@/composables/fetch";
import { type CommentBar } from "@/data/components";
import { onMounted, ref, type Ref } from "vue";

const comment: Ref<CommentBar | undefined> = ref(undefined);

onMounted(async () => {
  comment.value = await getCommentBar();
});
</script>

<template>
  <section class="commentBar">
    <h2 class="commentBar__title" data-testid="commentBar__title">
      {{ comment?.title }}
    </h2>
    <p class="commentBar__text" data-testid="commentBar__text">
      {{ comment?.text }}
    </p>
    <img
      :src="comment?.image.url"
      :alt="comment?.image.alt"
      class="commentBar__image"
      data-testid="commentBar__image"
    />
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/_constants.scss" as *;

.commentBar {
  background-color: $AwakningColorBlack;
  padding: 30px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $AwakningColorWhite;
  font-family: $AwakningFontArapey;

  &__title {
    font-family: $AwakningFontArapey;
    font-style: italic;
  }

  &__text {
    max-width: 400px;
    text-align: center;
    text-transform: uppercase;
    font-size: 1.125rem;
  }

  &__image {
    margin-top: 10px;
    width: 32px;
  }
}
</style>
