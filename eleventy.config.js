export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  eleventyConfig.addCollection("articles", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob(["src/perso/**/*.md", "src/pro/**/*.md"])
      .reverse();
  });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString());

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
}
