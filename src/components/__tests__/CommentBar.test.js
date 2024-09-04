import { mount } from "@vue/test-utils";
import CommentBar from "@/components/CommentBar.vue";
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

  test("renders its image with its expected 'src' and 'alt' attributes values well setted", () => {
    const imageElement = wrapper.find("[data-testid='commentBar__image']");

    // Assert the image is rendered
    expect(imageElement.exists()).toBe(true);

    // Assert the "src" attribute is well setted
    expect(imageElement.attributes("src")).toBe(comment.image.url);

    // Assert the "alt" attribute is well setted
    expect(imageElement.attributes("alt")).toBe(comment.image.alt);
  });
});
