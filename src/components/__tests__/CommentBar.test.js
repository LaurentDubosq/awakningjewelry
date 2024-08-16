import { mount } from "@vue/test-utils";
import CommentBar from "@/components/CommentBar.vue";
import { beforeEach } from "vitest";
import frontDataBase from "../../../db.json";

const comment = frontDataBase.commentBarMissionData;

describe("CommentBar component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CommentBar, {
      props: { data: comment },
    });
  });

  test("renders its title", () => {
    const titleElement = wrapper.find("[data-testid='commentBar__title']");
    expect(titleElement.text()).toContain(comment.title);
  });

  test("renders its text", () => {
    const textElement = wrapper.find("[data-testid='commentBar__text']");
    expect(textElement.text()).toContain(comment.text);
  });

  it("has its 'src' and 'alt' attributes's value well setted", () => {
    const imageElement = wrapper.find("[data-testid='commentBar__image']");
    expect(imageElement.attributes("src")).toBe(comment.image.url);
    expect(imageElement.attributes("alt")).toBe(comment.image.alt);
  });
});
